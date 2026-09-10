from io import BytesIO

from sqlalchemy import select

from app.database import SessionLocal
from app.models import BlogPost, ContactMessage, TeamApplication


def test_public_blog_is_seeded(clean_database):
    listing = clean_database.get("/api/v1/blogs")
    assert listing.status_code == 200
    assert listing.json()[0]["slug"] == "prop-firm-rules-india-2026"
    article = clean_database.get("/api/v1/blogs/prop-firm-rules-india-2026")
    assert article.status_code == 200
    assert len(article.json()["content_markdown"].split()) >= 1500


def test_contact_and_team_application_are_stored(clean_database):
    contact = clean_database.post(
        "/api/v1/contact-messages",
        json={
            "name": "Asha Kumar",
            "email": "asha@example.com",
            "topic": "General",
            "message": "I would like to understand the MARCOS learning process.",
            "website": "",
        },
    )
    assert contact.status_code == 201
    application = clean_database.post(
        "/api/v1/team-applications",
        data={
            "full_name": "Asha Kumar",
            "email": "asha@example.com",
            "mobile": "+919999999999",
            "location": "Kochi",
            "area": "Technology",
            "why_marcos": "I value the focus on process and want to help build reliable systems.",
            "contribution": "I can contribute accessible frontend engineering and careful technical reviews.",
        },
    )
    assert application.status_code == 201
    with SessionLocal() as db:
        assert db.scalar(select(ContactMessage).where(ContactMessage.email == "asha@example.com"))
        assert db.scalar(select(TeamApplication).where(TeamApplication.email == "asha@example.com"))


def test_resume_magic_bytes_and_blog_admin_are_protected(clean_database):
    bad = clean_database.post(
        "/api/v1/team-applications",
        data={
            "full_name": "Asha Kumar",
            "email": "asha@example.com",
            "mobile": "+919999999999tap",
            "location": "Kochi",
            "area": "Technology",
            "why_marcos": "I value the focus on process and want to help build reliable systems.",
            "contribution": "I can contribute accessible frontend engineering and careful technical reviews.",
        },
        files={"resume": ("resume.pdf", BytesIO(b"not-a-pdf"), "application/pdf")},
    )
    assert bad.status_code == 422
    with SessionLocal() as db:
        post = db.scalar(select(BlogPost).where(BlogPost.slug == "prop-firm-rules-india-2026"))
        post_id = post.id
    assert clean_database.patch(f"/api/v1/admin/blogs/{post_id}", json={"featured": False}).status_code == 404
    updated = clean_database.patch(
        f"/api/v1/admin/blogs/{post_id}", headers={"X-Admin-Key": "test-admin-key"}, json={"featured": False}
    )
    assert updated.status_code == 200
    assert updated.json()["featured"] is False
