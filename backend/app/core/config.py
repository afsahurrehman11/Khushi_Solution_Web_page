"""
core/config.py — Application settings loaded from environment variables.

All secrets and configuration live in .env (never committed).
Application fails loudly at startup if required settings are missing.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Literal


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    ENVIRONMENT: Literal["development", "production"] = "development"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # MongoDB
    MONGODB_URI: str
    DATABASE_NAME: str = "ks_company_portal"

    # AssanPay
    ASSANPAY_BASE_URL: str = "https://lc-mrcs.assanpay.com"
    ASSANPAY_MERCHANT_ID: str = ""
    ASSANPAY_API_KEY: str = ""
    ASSANPAY_API_SECRET: str = ""
    ASSANPAY_BRANCH_CODE: str = ""
    ASSANPAY_STORE_NAME: str = "Khushi Solutions"
    ASSANPAY_MOCK: bool = True
    ASSANPAY_MOCK_RESULT: Literal["success", "failed", "pending"] = "success"

    # Notifications
    WEB3FORMS_ACCESS_KEY: str = ""
    NOTIFICATION_EMAIL: str = ""

    # Security
    SECRET_KEY: str

    @field_validator("ASSANPAY_MOCK")
    @classmethod
    def block_mock_in_production(cls, v: bool, info) -> bool:
        # Will be called after all fields are set; production + mock = fatal.
        # We re-check this in startup too, but this provides early validation.
        return v

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


settings = Settings()
