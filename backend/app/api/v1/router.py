from fastapi import APIRouter
from app.api.v1.products import router as products_router
from app.api.v1.purchases import router as purchases_router
from app.api.v1.webhooks import router as webhooks_router
from app.api.v1.affiliates import router as affiliates_router

router = APIRouter()

router.include_router(products_router, prefix="/products", tags=["products"])
router.include_router(purchases_router, prefix="/purchases", tags=["purchases"])
router.include_router(webhooks_router, prefix="/payments", tags=["webhooks"])
router.include_router(affiliates_router, prefix="/affiliates", tags=["affiliates"])
