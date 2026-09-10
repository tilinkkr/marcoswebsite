import base64
import hashlib
import hmac
import json
import secrets
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from zipfile import BadZipFile, ZipFile

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, SessionLocal, engine, get_db
from .models import AuditEvent, BlogPost, ContactMessage, Order, Payment, Product, RiskAgreement, TeamApplication, User
from .pdf_service import build_agreement_pdf
from .policy import RISK_POLICY_SNAPSHOT, RISK_POLICY_VERSION
from .schemas import (
    AdminPaymentDecision,
    AgreementCreate,
    AgreementCreated,
    BlogCreate,
    BlogUpdate,
    ContactMessageCreate,
    PaymentStatus,
    PaymentSubmit,
    TeamApplicationCreate,
)
from .seed_data import seed_blogs, seed_products


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_products(db)
        seed_blogs(db)
    yield


app = FastAPI(
    title="MARCOS Checkout API",
    docs_url="/docs" if settings.environment != "production" else None,
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.app_base_url],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "X-Order-Token", "X-Admin-Key"],
)
rate_buckets: dict[str, list[float]] = {}


def rate_limit(request: Request, limit: int = 20, window: int = 60) -> None:
    key = request.client.host if request.client else "unknown"
    now = time.time()
    recent = [stamp for stamp in rate_buckets.get(key, []) if stamp > now - window]
    if len(recent) >= limit:
        raise HTTPException(429, "Too many requests")
    recent.append(now)
    rate_buckets[key] = recent


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def require_order_token(order: Order, supplied: str | None) -> None:
    if not supplied or not hmac.compare_digest(order.access_token_hash, token_hash(supplied)):
        raise HTTPException(404, "Record not found")


def require_admin(supplied: str | None) -> None:
    if not supplied or not hmac.compare_digest(settings.admin_key, supplied):
        raise HTTPException(404, "Record not found")


def blog_dict(post: BlogPost, include_content: bool = False) -> dict:
    result = {
        "id": post.id,
        "slug": post.slug,
        "title": post.title,
        "excerpt": post.excerpt,
        "hero_image": post.hero_image,
        "author_name": post.author_name,
        "status": post.status,
        "published_at": post.published_at,
        "updated_at": post.updated_at,
        "created_at": post.created_at,
        "seo_title": post.seo_title,
        "seo_description": post.seo_description,
        "canonical_url": post.canonical_url,
        "og_image": post.og_image,
        "featured": post.featured,
        "category": post.category,
        "tags": json.loads(post.tags_json),
        "last_reviewed_at": post.last_reviewed_at,
        "requires_regulatory_review": post.requires_regulatory_review,
        "reading_time": max(1, (len(post.content_markdown.split()) + 219) // 220),
    }
    if include_content:
        result["content_markdown"] = post.content_markdown
    return result


def validate_resume(filename: str, content_type: str | None, payload: bytes) -> str:
    if len(payload) > 5_000_000:
        raise HTTPException(413, "Resume exceeds 5 MB")
    suffix = Path(filename).suffix.lower()
    valid = False
    if suffix == ".pdf":
        valid = payload.startswith(b"%PDF-")
    elif suffix == ".doc":
        valid = payload.startswith(bytes.fromhex("D0CF11E0A1B11AE1"))
    elif suffix == ".docx" and payload.startswith(b"PK"):
        try:
            with ZipFile(BytesIO(payload)) as archive:
                names = set(archive.namelist())
                valid = "[Content_Types].xml" in names and any(name.startswith("word/") for name in names)
        except BadZipFile:
            valid = False
    allowed_types = {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    if not valid or content_type not in allowed_types:
        raise HTTPException(422, "Resume must be a valid PDF, DOC or DOCX file")
    return f"{uuid.uuid4().hex}{suffix}"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1/products")
def products(db: Session = Depends(get_db)):
    rows = db.scalars(select(Product).where(Product.is_active.is_(True))).all()
    return [
        {
            "slug": p.slug,
            "type": p.type,
            "name": p.name,
            "original_price": float(p.original_price),
            "sale_price": float(p.sale_price),
            "currency": p.currency,
            "discount_percent": p.discount_percent,
            "billing_label": p.billing_label,
        }
        for p in rows
    ]


@app.post("/api/v1/team-applications", status_code=201)
async def create_team_application(
    request: Request,
    full_name: str = Form(...),
    email: str = Form(...),
    mobile: str = Form(...),
    location: str = Form(...),
    area: str = Form(...),
    why_marcos: str = Form(...),
    contribution: str = Form(...),
    portfolio_url: str | None = Form(default=None),
    resume: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    rate_limit(request, 12, 60)
    try:
        payload = TeamApplicationCreate(
            full_name=full_name,
            email=email,
            mobile=mobile,
            location=location,
            area=area,
            why_marcos=why_marcos,
            contribution=contribution,
            portfolio_url=portfolio_url or None,
        )
    except ValidationError as exc:
        raise HTTPException(422, detail=exc.errors()) from exc
    resume_blob = await resume.read() if resume else None
    safe_name = validate_resume(resume.filename or "resume", resume.content_type, resume_blob) if resume_blob else None
    row = TeamApplication(
        full_name=payload.full_name.strip(),
        email=str(payload.email).lower(),
        mobile=payload.mobile.strip(),
        location=payload.location.strip(),
        area=payload.area,
        why_marcos=payload.why_marcos.strip(),
        contribution=payload.contribution.strip(),
        portfolio_url=str(payload.portfolio_url) if payload.portfolio_url else None,
        resume_filename=safe_name,
        resume_content_type=resume.content_type if resume_blob and resume else None,
        resume_blob=resume_blob,
        status="new",
    )
    db.add(row)
    db.commit()
    return {"id": row.id, "status": row.status}


@app.post("/api/v1/contact-messages", status_code=201)
def create_contact_message(payload: ContactMessageCreate, request: Request, db: Session = Depends(get_db)):
    rate_limit(request, 10, 60)
    if payload.website:
        raise HTTPException(422, "Submission rejected")
    row = ContactMessage(
        name=payload.name.strip(),
        email=str(payload.email).lower(),
        phone=payload.phone.strip() if payload.phone else None,
        topic=payload.topic,
        message=payload.message.strip(),
        status="new",
    )
    db.add(row)
    db.commit()
    return {"id": row.id, "status": row.status}


@app.get("/api/v1/blogs")
def list_blogs(db: Session = Depends(get_db)):
    rows = db.scalars(
        select(BlogPost).where(BlogPost.status == "published").order_by(BlogPost.published_at.desc())
    ).all()
    return [blog_dict(post) for post in rows]


@app.get("/api/v1/blogs/{slug}")
def get_blog(slug: str, db: Session = Depends(get_db)):
    row = db.scalar(select(BlogPost).where(BlogPost.slug == slug, BlogPost.status == "published"))
    if row is None:
        raise HTTPException(404, "Article not found")
    return blog_dict(row, include_content=True)


@app.post("/api/v1/admin/blogs", status_code=201)
def create_blog(payload: BlogCreate, x_admin_key: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_key)
    if db.scalar(select(BlogPost).where(BlogPost.slug == payload.slug)):
        raise HTTPException(409, "Slug already exists")
    values = payload.model_dump(exclude={"tags", "canonical_url"})
    values["canonical_url"] = str(payload.canonical_url) if payload.canonical_url else None
    values["tags_json"] = json.dumps(payload.tags)
    if payload.status == "published":
        values["published_at"] = datetime.now(timezone.utc)
    row = BlogPost(**values)
    db.add(row)
    db.commit()
    return blog_dict(row, include_content=True)


@app.patch("/api/v1/admin/blogs/{post_id}")
def update_blog(
    post_id: str, payload: BlogUpdate, x_admin_key: str | None = Header(default=None), db: Session = Depends(get_db)
):
    require_admin(x_admin_key)
    row = db.get(BlogPost, post_id)
    if row is None:
        raise HTTPException(404, "Article not found")
    changes = payload.model_dump(exclude_unset=True, exclude={"tags", "canonical_url"})
    if "canonical_url" in payload.model_fields_set:
        changes["canonical_url"] = str(payload.canonical_url) if payload.canonical_url else None
    if payload.tags is not None:
        changes["tags_json"] = json.dumps(payload.tags)
    for field, value in changes.items():
        setattr(row, field, value)
    db.commit()
    return blog_dict(row, include_content=True)


@app.post("/api/v1/admin/blogs/{post_id}/publish")
def publish_blog(post_id: str, x_admin_key: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_key)
    row = db.get(BlogPost, post_id)
    if row is None:
        raise HTTPException(404, "Article not found")
    row.status = "published"
    row.published_at = row.published_at or datetime.now(timezone.utc)
    db.commit()
    return blog_dict(row, include_content=True)


@app.delete("/api/v1/admin/blogs/{post_id}")
def archive_blog(post_id: str, x_admin_key: str | None = Header(default=None), db: Session = Depends(get_db)):
    require_admin(x_admin_key)
    row = db.get(BlogPost, post_id)
    if row is None:
        raise HTTPException(404, "Article not found")
    row.status = "archived"
    db.commit()
    return {"id": row.id, "status": row.status}


@app.post("/api/v1/checkout/agreements", response_model=AgreementCreated, status_code=201)
def create_agreement(payload: AgreementCreate, request: Request, db: Session = Depends(get_db)):
    rate_limit(request, 8, 60)
    if payload.typed_name.casefold() != payload.full_name.strip().casefold():
        raise HTTPException(422, "Typed acknowledgement name must match the legal name")
    product = db.scalar(select(Product).where(Product.slug == payload.product_slug, Product.is_active.is_(True)))
    if product is None:
        raise HTTPException(404, "Active product not found")
    email = payload.email.lower().strip()
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(
            full_name=payload.full_name.strip(),
            email=email,
            mobile=payload.mobile.strip(),
            whatsapp_number=payload.whatsapp_number,
            country=payload.country.strip(),
        )
        db.add(user)
        db.flush()
    else:
        user.full_name = payload.full_name.strip()
        user.mobile = payload.mobile.strip()
        user.whatsapp_number = payload.whatsapp_number
        user.country = payload.country.strip()

    accepted_at = datetime.now(timezone.utc)
    canonical = {
        "user_id": user.id,
        "product_id": product.id,
        "product_slug": product.slug,
        "amount": str(product.sale_price),
        "currency": product.currency,
        "policy_version": RISK_POLICY_VERSION,
        "policy_snapshot": RISK_POLICY_SNAPSHOT,
        "typed_name": payload.typed_name,
        "consent": payload.consent.model_dump(),
        "accepted_at": accepted_at.isoformat(),
    }
    canonical_hash = hashlib.sha256(json.dumps(canonical, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    agreement_id = str(uuid.uuid4())
    pdf = build_agreement_pdf(
        agreement_id=agreement_id,
        canonical_hash=canonical_hash,
        details={
            "Agreement ID": agreement_id,
            "Full name": user.full_name,
            "Email": user.email,
            "Mobile": user.mobile,
            "Country": user.country,
            "Product": product.name,
            "Price": str(product.sale_price),
            "Currency": product.currency,
            "Risk policy version": RISK_POLICY_VERSION,
            "Accepted at (UTC)": accepted_at.isoformat(),
            "Typed acknowledgement": payload.typed_name,
        },
        policy_snapshot=RISK_POLICY_SNAPSHOT,
        consents=[
            "Risk Acknowledgement read and understood",
            "No guarantee of profits, funding or evaluation success",
            "Terms of Service and Risk Disclosure accepted",
        ],
    )
    agreement = RiskAgreement(
        id=agreement_id,
        user_id=user.id,
        product_id=product.id,
        policy_version=RISK_POLICY_VERSION,
        policy_snapshot=RISK_POLICY_SNAPSHOT,
        typed_name=payload.typed_name,
        read_risk=True,
        no_guarantee=True,
        agree_terms=True,
        amount=product.sale_price,
        currency=product.currency,
        accepted_at=accepted_at,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent", "")[:500],
        canonical_sha256=canonical_hash,
        pdf_bytes=pdf,
        pdf_sha256=hashlib.sha256(pdf).hexdigest(),
        pdf_filename=f"MARCOS-risk-agreement-{agreement_id}.pdf",
    )
    token = secrets.token_urlsafe(32)
    order = Order(
        id=str(uuid.uuid4()),
        reference=f"MRC-{uuid.uuid4().hex[:8].upper()}",
        user_id=user.id,
        product_id=product.id,
        risk_agreement_id=agreement.id,
        amount=product.sale_price,
        currency=product.currency,
        status="payment_pending",
        access_token_hash=token_hash(token),
    )
    payment = Payment(
        id=str(uuid.uuid4()),
        order_id=order.id,
        amount=product.sale_price,
        currency=product.currency,
        status="payment_pending",
    )
    db.add_all([agreement, order, payment])
    db.flush()
    db.add(
        AuditEvent(
            subject_type="order",
            subject_id=order.id,
            action="agreement_accepted",
            metadata_text=json.dumps({"policy_version": RISK_POLICY_VERSION, "canonical_sha256": canonical_hash}),
        )
    )
    db.commit()
    return AgreementCreated(
        agreement_id=agreement.id,
        order_id=order.id,
        payment_id=payment.id,
        order_reference=order.reference,
        access_token=token,
        amount=float(order.amount),
        currency=order.currency,
    )


@app.get("/api/v1/risk-agreements/{agreement_id}/pdf")
def get_agreement_pdf(
    agreement_id: str, x_order_token: str | None = Header(default=None), db: Session = Depends(get_db)
):
    agreement = db.get(RiskAgreement, agreement_id)
    order = db.scalar(select(Order).where(Order.risk_agreement_id == agreement_id))
    if agreement is None or order is None:
        raise HTTPException(404, "Record not found")
    require_order_token(order, x_order_token)
    return Response(
        agreement.pdf_bytes,
        media_type=agreement.pdf_content_type,
        headers={
            "Content-Disposition": f'attachment; filename="{agreement.pdf_filename}"',
            "X-Content-SHA256": agreement.pdf_sha256,
            "Cache-Control": "private, no-store",
        },
    )


@app.post("/api/v1/payments/{payment_id}/submit", response_model=PaymentStatus)
def submit_payment(
    payment_id: str,
    payload: PaymentSubmit,
    request: Request,
    x_order_token: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    rate_limit(request, 10, 60)
    payment = db.get(Payment, payment_id)
    if payment is None:
        raise HTTPException(404, "Record not found")
    order = db.get(Order, payment.order_id)
    require_order_token(order, x_order_token)
    if payment.status not in {"payment_pending", "payment_submitted"}:
        raise HTTPException(409, "Payment cannot be submitted in its current state")
    screenshot = None
    if payload.screenshot_base64:
        try:
            screenshot = base64.b64decode(payload.screenshot_base64, validate=True)
        except ValueError as exc:
            raise HTTPException(422, "Invalid screenshot encoding") from exc
        if len(screenshot) > 2_000_000:
            raise HTTPException(413, "Screenshot exceeds 2 MB")
    payment.reference_number = payload.reference_number.strip()
    payment.screenshot_blob = screenshot
    payment.screenshot_content_type = payload.screenshot_content_type if screenshot else None
    payment.status = "payment_submitted"
    payment.submitted_at = datetime.now(timezone.utc)
    order.status = "payment_submitted"
    db.add(AuditEvent(subject_type="payment", subject_id=payment.id, action="payment_submitted"))
    db.commit()
    return PaymentStatus(status=payment.status, order_reference=order.reference)


@app.get("/api/v1/orders/{order_id}")
def get_order(order_id: str, x_order_token: str | None = Header(default=None), db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(404, "Record not found")
    require_order_token(order, x_order_token)
    return {
        "id": order.id,
        "reference": order.reference,
        "status": order.status,
        "amount": float(order.amount),
        "currency": order.currency,
    }


@app.post("/api/v1/admin/payments/{payment_id}/decision")
def decide_payment(
    payment_id: str,
    payload: AdminPaymentDecision,
    x_admin_key: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if not x_admin_key or not hmac.compare_digest(settings.admin_key, x_admin_key):
        raise HTTPException(404, "Record not found")
    payment = db.get(Payment, payment_id)
    if payment is None:
        raise HTTPException(404, "Record not found")
    order = db.get(Order, payment.order_id)
    payment.status = "payment_verified" if payload.verified else "payment_rejected"
    order.status = payment.status
    payment.verified_at = datetime.now(timezone.utc) if payload.verified else None
    db.add(AuditEvent(subject_type="payment", subject_id=payment.id, action=payment.status))
    db.commit()
    return {"status": payment.status, "order_reference": order.reference}
