"""team contact and blog records

Revision ID: c41a892f3e20
Revises: b067d4a5f12a
"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "c41a892f3e20"
down_revision: Union[str, None] = "b067d4a5f12a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "team_applications",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("full_name", sa.String(180), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("mobile", sa.String(32), nullable=False),
        sa.Column("location", sa.String(120), nullable=False),
        sa.Column("area", sa.String(32), nullable=False),
        sa.Column("why_marcos", sa.Text(), nullable=False),
        sa.Column("contribution", sa.Text(), nullable=False),
        sa.Column("portfolio_url", sa.String(500)),
        sa.Column("resume_filename", sa.String(180)),
        sa.Column("resume_content_type", sa.String(100)),
        sa.Column("resume_blob", sa.LargeBinary()),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_team_applications_email", "team_applications", ["email"])
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("phone", sa.String(32)),
        sa.Column("topic", sa.String(40), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_contact_messages_email", "contact_messages", ["email"])
    op.create_table(
        "blog_posts",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("slug", sa.String(180), nullable=False),
        sa.Column("title", sa.String(240), nullable=False),
        sa.Column("excerpt", sa.String(500), nullable=False),
        sa.Column("content_markdown", sa.Text(), nullable=False),
        sa.Column("hero_image", sa.String(500), nullable=False),
        sa.Column("author_name", sa.String(180), nullable=False),
        sa.Column("author_id", sa.String(36)),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.Column("seo_title", sa.String(240), nullable=False),
        sa.Column("seo_description", sa.String(500), nullable=False),
        sa.Column("canonical_url", sa.String(500)),
        sa.Column("og_image", sa.String(500)),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("tags_json", sa.Text(), nullable=False),
        sa.Column("last_reviewed_at", sa.DateTime(timezone=True)),
        sa.Column("requires_regulatory_review", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_blog_posts_slug", "blog_posts", ["slug"], unique=True)
    op.create_index("ix_blog_posts_status", "blog_posts", ["status"])


def downgrade() -> None:
    op.drop_index("ix_blog_posts_status", table_name="blog_posts")
    op.drop_index("ix_blog_posts_slug", table_name="blog_posts")
    op.drop_table("blog_posts")
    op.drop_index("ix_contact_messages_email", table_name="contact_messages")
    op.drop_table("contact_messages")
    op.drop_index("ix_team_applications_email", table_name="team_applications")
    op.drop_table("team_applications")
