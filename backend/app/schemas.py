from typing import Literal

from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator


class Consent(BaseModel):
    read_risk: bool
    no_guarantee: bool
    agree_terms: bool

    @field_validator("read_risk", "no_guarantee", "agree_terms")
    @classmethod
    def must_be_true(cls, value: bool) -> bool:
        if value is not True:
            raise ValueError("Explicit consent is required")
        return value


class AgreementCreate(BaseModel):
    product_slug: str = Field(min_length=2, max_length=80)
    full_name: str = Field(min_length=2, max_length=180)
    email: EmailStr
    mobile: str = Field(min_length=7, max_length=32)
    whatsapp_number: str | None = Field(default=None, max_length=32)
    country: str = Field(min_length=2, max_length=100)
    typed_name: str = Field(min_length=2, max_length=180)
    consent: Consent

    @field_validator("typed_name")
    @classmethod
    def trim_typed_name(cls, value: str) -> str:
        return value.strip()


class AgreementCreated(BaseModel):
    agreement_id: str
    order_id: str
    payment_id: str
    order_reference: str
    access_token: str
    amount: float
    currency: str


class PaymentSubmit(BaseModel):
    reference_number: str = Field(min_length=4, max_length=120)
    screenshot_base64: str | None = None
    screenshot_content_type: str | None = Field(default=None, pattern=r"^image/(png|jpeg|webp)$")


class PaymentStatus(BaseModel):
    status: str
    order_reference: str


class AdminPaymentDecision(BaseModel):
    verified: bool


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=32)
    topic: Literal["General", "Membership", "Indicators", "Partnership", "Team", "Technical Support", "Other"]
    message: str = Field(min_length=20, max_length=4000)
    website: str | None = Field(default=None, max_length=200)


class TeamApplicationCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=180)
    email: EmailStr
    mobile: str = Field(min_length=7, max_length=32)
    location: str = Field(min_length=2, max_length=120)
    area: Literal["Trading", "Content", "Technology", "Design", "Operations", "Community", "Partnerships", "Other"]
    why_marcos: str = Field(min_length=30, max_length=5000)
    contribution: str = Field(min_length=30, max_length=5000)
    portfolio_url: HttpUrl | None = None


class BlogCreate(BaseModel):
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=180)
    title: str = Field(min_length=10, max_length=240)
    excerpt: str = Field(min_length=20, max_length=500)
    content_markdown: str = Field(min_length=100, max_length=100_000)
    hero_image: str = Field(min_length=1, max_length=500)
    author_name: str = Field(default="Rahul Raja", max_length=180)
    status: Literal["draft", "review", "published", "archived"] = "draft"
    seo_title: str = Field(min_length=10, max_length=240)
    seo_description: str = Field(min_length=20, max_length=500)
    canonical_url: HttpUrl | None = None
    og_image: str | None = Field(default=None, max_length=500)
    featured: bool = False
    category: str = Field(min_length=2, max_length=80)
    tags: list[str] = Field(default_factory=list, max_length=20)
    requires_regulatory_review: bool = False


class BlogUpdate(BaseModel):
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=180)
    title: str | None = Field(default=None, min_length=10, max_length=240)
    excerpt: str | None = Field(default=None, min_length=20, max_length=500)
    content_markdown: str | None = Field(default=None, min_length=100, max_length=100_000)
    hero_image: str | None = Field(default=None, min_length=1, max_length=500)
    status: Literal["draft", "review", "published", "archived"] | None = None
    seo_title: str | None = Field(default=None, min_length=10, max_length=240)
    seo_description: str | None = Field(default=None, min_length=20, max_length=500)
    canonical_url: HttpUrl | None = None
    og_image: str | None = Field(default=None, max_length=500)
    featured: bool | None = None
    category: str | None = Field(default=None, min_length=2, max_length=80)
    tags: list[str] | None = Field(default=None, max_length=20)
    requires_regulatory_review: bool | None = None
