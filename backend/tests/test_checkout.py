import hashlib

from pypdf import PdfReader
from sqlalchemy import select

from app.database import SessionLocal
from app.models import Order, Payment, RiskAgreement, User
from app.policy import RISK_POLICY_VERSION


def test_products_are_seeded_with_server_prices(clean_database):
    response = clean_database.get("/api/v1/products")
    assert response.status_code == 200
    products = {product["slug"]: product for product in response.json()}
    assert products["marcos-membership"]["sale_price"] == 100
    assert products["marcos-one"]["sale_price"] == 50


def test_checkout_creates_user_agreement_pdf_hash_order_and_pending_payment(clean_database, agreement_payload):
    payload = {**agreement_payload, "amount": 1, "currency": "XXX", "agreement_version": "fake"}
    response = clean_database.post("/api/v1/checkout/agreements", json=payload)
    assert response.status_code == 201
    result = response.json()
    assert result["amount"] == 100
    assert result["currency"] == "USD"
    assert result["order_reference"].startswith("MRC-")
    with SessionLocal() as db:
        assert db.scalar(select(User).where(User.email == "alex@example.com")) is not None
        agreement = db.get(RiskAgreement, result["agreement_id"])
        order = db.get(Order, result["order_id"])
        payment = db.get(Payment, result["payment_id"])
        assert agreement.policy_version == RISK_POLICY_VERSION
        assert agreement.pdf_sha256 == hashlib.sha256(agreement.pdf_bytes).hexdigest()
        assert agreement.canonical_sha256
        reader = PdfReader(__import__("io").BytesIO(agreement.pdf_bytes))
        assert len(reader.pages) == 1
        assert agreement.canonical_sha256 in reader.pages[0].extract_text()
        assert order.amount == 100
        assert order.status == "payment_pending"
        assert payment.status == "payment_pending"


def test_explicit_agreement_and_matching_name_are_required(clean_database, agreement_payload):
    declined = {**agreement_payload, "consent": {**agreement_payload["consent"], "read_risk": False}}
    assert clean_database.post("/api/v1/checkout/agreements", json=declined).status_code == 422
    mismatch = {**agreement_payload, "typed_name": "Someone Else"}
    assert clean_database.post("/api/v1/checkout/agreements", json=mismatch).status_code == 422


def test_pdf_and_order_require_private_token(clean_database, agreement_payload):
    result = clean_database.post("/api/v1/checkout/agreements", json=agreement_payload).json()
    pdf_url = f"/api/v1/risk-agreements/{result['agreement_id']}/pdf"
    assert clean_database.get(pdf_url).status_code == 404
    pdf = clean_database.get(pdf_url, headers={"X-Order-Token": result["access_token"]})
    assert pdf.status_code == 200
    assert pdf.headers["content-type"] == "application/pdf"
    assert len(pdf.headers["x-content-sha256"]) == 64


def test_payment_submission_never_verifies_access(clean_database, agreement_payload):
    result = clean_database.post("/api/v1/checkout/agreements", json=agreement_payload).json()
    response = clean_database.post(
        f"/api/v1/payments/{result['payment_id']}/submit",
        headers={"X-Order-Token": result["access_token"]},
        json={"reference_number": "UTR-123456"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "payment_submitted"
    order = clean_database.get(
        f"/api/v1/orders/{result['order_id']}", headers={"X-Order-Token": result["access_token"]}
    ).json()
    assert order["status"] == "payment_submitted"
    assert order["status"] != "payment_verified"


def test_only_protected_admin_action_can_verify(clean_database, agreement_payload):
    result = clean_database.post("/api/v1/checkout/agreements", json=agreement_payload).json()
    url = f"/api/v1/admin/payments/{result['payment_id']}/decision"
    assert clean_database.post(url, json={"verified": True}).status_code == 404
    response = clean_database.post(url, headers={"X-Admin-Key": "test-admin-key"}, json={"verified": True})
    assert response.status_code == 200
    assert response.json()["status"] == "payment_verified"
