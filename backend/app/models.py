import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, ForeignKey, LargeBinary, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def uuid_string() -> str:
    return str(uuid.uuid4())


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class User(TimestampMixin, Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    full_name: Mapped[str] = mapped_column(String(180))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    mobile: Mapped[str] = mapped_column(String(32))
    whatsapp_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    country: Mapped[str] = mapped_column(String(100))


class Product(TimestampMixin, Base):
    __tablename__ = "products"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    type: Mapped[str] = mapped_column(String(24))
    name: Mapped[str] = mapped_column(String(120))
    original_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    sale_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3))
    discount_percent: Mapped[int]
    billing_label: Mapped[str | None] = mapped_column(String(40), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class RiskAgreement(Base):
    __tablename__ = "risk_agreements"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    policy_version: Mapped[str] = mapped_column(String(32))
    policy_snapshot: Mapped[str] = mapped_column(Text)
    typed_name: Mapped[str] = mapped_column(String(180))
    read_risk: Mapped[bool] = mapped_column(Boolean)
    no_guarantee: Mapped[bool] = mapped_column(Boolean)
    agree_terms: Mapped[bool] = mapped_column(Boolean)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3))
    accepted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    canonical_sha256: Mapped[str] = mapped_column(String(64))
    pdf_bytes: Mapped[bytes] = mapped_column(LargeBinary)
    pdf_sha256: Mapped[str] = mapped_column(String(64))
    pdf_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    pdf_content_type: Mapped[str] = mapped_column(String(80), default="application/pdf")
    pdf_filename: Mapped[str] = mapped_column(String(180))


class Order(TimestampMixin, Base):
    __tablename__ = "orders"
    __table_args__ = (UniqueConstraint("reference", name="uq_orders_reference"),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    reference: Mapped[str] = mapped_column(String(20), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"))
    risk_agreement_id: Mapped[str] = mapped_column(ForeignKey("risk_agreements.id"), unique=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3))
    status: Mapped[str] = mapped_column(String(32), default="payment_pending")
    access_token_hash: Mapped[str] = mapped_column(String(64))


class Payment(TimestampMixin, Base):
    __tablename__ = "payments"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id"), unique=True, index=True)
    provider: Mapped[str] = mapped_column(String(40), default="manual")
    method: Mapped[str] = mapped_column(String(40), default="qr")
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3))
    reference_number: Mapped[str | None] = mapped_column(String(120), nullable=True)
    screenshot_blob: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    screenshot_content_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="payment_pending")
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class AuditEvent(Base):
    __tablename__ = "audit_events"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    subject_type: Mapped[str] = mapped_column(String(40))
    subject_id: Mapped[str] = mapped_column(String(36), index=True)
    action: Mapped[str] = mapped_column(String(80))
    metadata_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TeamApplication(TimestampMixin, Base):
    __tablename__ = "team_applications"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    full_name: Mapped[str] = mapped_column(String(180))
    email: Mapped[str] = mapped_column(String(320), index=True)
    mobile: Mapped[str] = mapped_column(String(32))
    location: Mapped[str] = mapped_column(String(120))
    area: Mapped[str] = mapped_column(String(32))
    why_marcos: Mapped[str] = mapped_column(Text)
    contribution: Mapped[str] = mapped_column(Text)
    portfolio_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    resume_filename: Mapped[str | None] = mapped_column(String(180), nullable=True)
    resume_content_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    resume_blob: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    status: Mapped[str] = mapped_column(String(24), default="new")


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    name: Mapped[str] = mapped_column(String(180))
    email: Mapped[str] = mapped_column(String(320), index=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    topic: Mapped[str] = mapped_column(String(40))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(24), default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class BlogPost(TimestampMixin, Base):
    __tablename__ = "blog_posts"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_string)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(240))
    excerpt: Mapped[str] = mapped_column(String(500))
    content_markdown: Mapped[str] = mapped_column(Text)
    hero_image: Mapped[str] = mapped_column(String(500))
    author_name: Mapped[str] = mapped_column(String(180))
    author_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    status: Mapped[str] = mapped_column(String(24), default="draft", index=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    seo_title: Mapped[str] = mapped_column(String(240))
    seo_description: Mapped[str] = mapped_column(String(500))
    canonical_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    og_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    category: Mapped[str] = mapped_column(String(80))
    tags_json: Mapped[str] = mapped_column(Text, default="[]")
    last_reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    requires_regulatory_review: Mapped[bool] = mapped_column(Boolean, default=False)
