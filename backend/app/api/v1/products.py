from fastapi import APIRouter, Request
from app.config.pricing import PRICING_CONFIG
from app.schemas.product_schemas import PricingResponse, PlanInfo, PlanCategory, PlanFeature
from app.core.security import sanitize_product_id
from app.core.exceptions import ValidationError

router = APIRouter()

@router.get("/{product_id}/pricing", response_model=PricingResponse)
async def get_pricing(product_id: str, request: Request):
    backend_product_id = sanitize_product_id(product_id)
    
    if backend_product_id not in PRICING_CONFIG:
        raise ValidationError(f"Unknown product: {product_id}")
        
    plans = PRICING_CONFIG[backend_product_id]
    
    plan_infos = []
    for plan_key, plan_data in plans.items():
        categories = None
        if plan_data.get("categories"):
            categories = [
                PlanCategory(**cat) for cat in plan_data["categories"].values()
            ]
            
        features = None
        if plan_data.get("features"):
            features = [
                PlanFeature(**f) for f in plan_data["features"]
            ]
            
        plan_infos.append(PlanInfo(
            plan_key=plan_key,
            label=plan_data["label"],
            amount_pkr=plan_data["registration_fee_pkr"],
            description=plan_data["description"],
            is_custom_price=plan_data.get("is_custom_price", False),
            categories=categories,
            features=features
        ))
        
    return PricingResponse(
        product=backend_product_id,
        plans=plan_infos
    )
