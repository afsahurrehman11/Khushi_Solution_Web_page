from fastapi import APIRouter, HTTPException, Query
from app.db.mongodb import get_db
from app.schemas.affiliate_schemas import AffiliateValidateResponse
from app.schemas.common import ProductEnum

router = APIRouter()

@router.get("/{code}/validate", response_model=AffiliateValidateResponse)
async def validate_affiliate_code(code: str, product: ProductEnum = Query(...)):
    db = get_db()
    
    affiliate = await db["affiliates"].find_one({
        "code": code,
        "product": product.value,
        "is_active": True
    })
    
    if not affiliate:
        return AffiliateValidateResponse(
            is_valid=False,
            message="Invalid or inactive affiliate code."
        )
        
    return AffiliateValidateResponse(
        is_valid=True,
        code=affiliate["code"],
        product=product,
        discount_percentage=affiliate.get("discount_percentage", 15),
        message="Affiliate code is valid."
    )
