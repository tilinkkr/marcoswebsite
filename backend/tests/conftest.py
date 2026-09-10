import os
from pathlib import Path

TEST_DB = Path(__file__).parent / "test-marcos.db"
if TEST_DB.exists():
    TEST_DB.unlink()
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"
os.environ["MARCOS_ADMIN_KEY"] = "test-admin-key"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app, rate_buckets


@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    rate_buckets.clear()
    with TestClient(app) as client:
        yield client


@pytest.fixture
def agreement_payload():
    return {
        "product_slug": "marcos-membership",
        "full_name": "Alex Morgan",
        "email": "alex@example.com",
        "mobile": "+15555550123",
        "whatsapp_number": None,
        "country": "United States",
        "typed_name": "Alex Morgan",
        "consent": {"read_risk": True, "no_guarantee": True, "agree_terms": True},
    }


def pytest_sessionfinish(session, exitstatus):
    engine.dispose()
    if TEST_DB.exists():
        TEST_DB.unlink()
