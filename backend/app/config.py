import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./marcos.db")
    app_base_url: str = os.getenv("APP_BASE_URL", "http://localhost:3000")
    admin_key: str = os.getenv("MARCOS_ADMIN_KEY", "development-only-change-me")
    environment: str = os.getenv("ENVIRONMENT", "development")


settings = Settings()
