from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.common import ProductEnum

class AffiliateValidateResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    is_valid: bool
    code: Optional[str] = None
    product: Optional[ProductEnum] = None
    discount_percentage: Optional[int] = None
    message: str
