from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import BlogPost, Product

PRODUCTS = [
    {
        "slug": "marcos-membership",
        "type": "membership",
        "name": "MARCOS Membership",
        "original_price": Decimal("200.00"),
        "sale_price": Decimal("100.00"),
        "currency": "USD",
        "discount_percent": 50,
        "billing_label": None,
    },
    {
        "slug": "marcos-one",
        "type": "indicator",
        "name": "MARCOS ONE",
        "original_price": Decimal("100.00"),
        "sale_price": Decimal("50.00"),
        "currency": "USD",
        "discount_percent": 50,
        "billing_label": None,
    },
]


def seed_products(db: Session) -> None:
    for values in PRODUCTS:
        if db.scalar(select(Product).where(Product.slug == values["slug"])) is None:
            db.add(Product(**values))
    db.commit()


def seed_blogs(db: Session) -> None:
    slug = "prop-firm-rules-india-2026"
    if db.scalar(select(BlogPost).where(BlogPost.slug == slug)) is not None:
        return
    article_path = Path(__file__).resolve().parents[2] / "content" / "blogs" / f"{slug}.md"
    if not article_path.exists():
        return
    now = datetime.now(timezone.utc)
    db.add(
        BlogPost(
            slug=slug,
            title="Prop Firm Rules Explained for Indian Traders: Drawdown, Daily Loss and Challenge Rules in 2026",
            excerpt="A practical guide to evaluation mechanics, daily loss, maximum drawdown and the questions Indian traders should ask before paying for a challenge.",
            content_markdown=article_path.read_text(encoding="utf-8"),
            hero_image="/images/marcos/insights/prop-firm-rules-india-2026.webp",
            author_name="Rahul Raja",
            status="published",
            published_at=now,
            seo_title="Prop Firm Rules for Indian Traders: Drawdown & Challenge Guide 2026 | MARCOS",
            seo_description="Understand prop-firm evaluation rules, daily loss limits, maximum drawdown, challenge targets and common mistakes for Indian traders in 2026.",
            featured=True,
            category="PROP TRADING",
            tags_json='["drawdown", "risk rules", "prop-firm evaluation"]',
            last_reviewed_at=now,
            requires_regulatory_review=True,
        )
    )
    db.commit()
