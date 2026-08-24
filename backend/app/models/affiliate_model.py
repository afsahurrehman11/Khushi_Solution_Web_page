from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class AffiliateModel(BaseModel):
    code: str
    product: str # e.g. "khushi_delivery" (matching product enum)
    discount_percentage: int = 15
    usage_count: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
