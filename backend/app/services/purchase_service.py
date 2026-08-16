import logging
from typing import Dict, Any
from fastapi import Request

from app.schemas.purchase_schemas import PurchaseCreateRequest, PurchaseCreateResponse
from app.models.purchase_model import PurchaseModel
from app.models.audit_model import AuditLogModel
from app.repositories.purchase_repository import PurchaseRepository
from app.repositories.audit_repository import AuditRepository
from app.core.security import generate_purchase_id
from app.core.exceptions import ValidationError
from app.config.pricing import get_plan_amount, PRICING_CONFIG

logger = logging.getLogger("purchases")

class PurchaseService:
    def __init__(self):
        self.purchase_repo = PurchaseRepository()
        self.audit_repo = AuditRepository()

    async def create_purchase(self, req: PurchaseCreateRequest, request: Request) -> PurchaseCreateResponse:
        # Calculate amount
        amount_pkr = get_plan_amount(req.product.value, req.plan_key)
        
        # Initial status
        status = "PENDING"
        if amount_pkr == 0:
            status = "PAID" # Direct transition for free plans
            
        purchase_id = generate_purchase_id()
        
        # Client IP and UA
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        req_id = getattr(request.state, "request_id", None)
        
        # Create model
        purchase_model = PurchaseModel(
            purchase_id=purchase_id,
            product=req.product.value,
            plan_key=req.plan_key,
            status=status,
            customer=req.customer.model_dump(),
            product_data=req.product_data.model_dump(),
            amount_pkr=amount_pkr,
            ip_address=client_ip,
            user_agent=user_agent
        )
        
        await self.purchase_repo.create(purchase_model)
        logger.info(f"purchases.created | purchase_id={purchase_id} product={req.product.value} plan={req.plan_key} amount={amount_pkr} status={status}")
        
        # Audit log
        audit = AuditLogModel(
            event="PURCHASE_CREATED",
            purchase_id=purchase_id,
            product=req.product.value,
            plan_key=req.plan_key,
            amount_pkr=amount_pkr,
            ip_address=client_ip,
            request_id=req_id,
            metadata={"status": status}
        )
        await self.audit_repo.write(audit)
        
        plan_label = PRICING_CONFIG[req.product.value][req.plan_key]["label"]
        
        return PurchaseCreateResponse(
            purchase_id=purchase_id,
            product=req.product,
            plan_key=req.plan_key,
            plan_label=plan_label,
            amount_pkr=amount_pkr,
            status=status
        )
