from fastapi import APIRouter, Request, UploadFile, File, Form
from typing import List, Optional
from pydantic import ValidationError as PydanticValidationError

from app.schemas.purchase_schemas import PurchaseCreateRequest, PurchaseCreateResponse
from app.schemas.payment_schemas import PaymentInitiateResponse, PaymentStatusResponse
from app.services.purchase_service import PurchaseService
from app.services.payment_service import PaymentService
from app.services.file_service import FileService
from app.repositories.purchase_repository import PurchaseRepository
from app.core.exceptions import PurchaseNotFoundError, ValidationError
from app.core.config import settings

router = APIRouter()
purchase_service = PurchaseService()
payment_service = PaymentService()
file_service = FileService()
purchase_repo = PurchaseRepository()

@router.post("", response_model=PurchaseCreateResponse, status_code=201)
async def create_purchase(req: PurchaseCreateRequest, request: Request):
    """Create a new purchase attempt."""
    return await purchase_service.create_purchase(req, request)

@router.post("/{purchase_id}/files")
async def upload_files(
    purchase_id: str,
    business_logo: Optional[UploadFile] = File(None),
    business_photos: List[UploadFile] = File(default_factory=list),
    institution_images: List[UploadFile] = File(default_factory=list),
):
    """Upload files associated with a purchase. Stores in GridFS and links to purchase."""
    purchase = await purchase_repo.get_by_id(purchase_id)
    if not purchase:
        raise PurchaseNotFoundError("Purchase not found")
        
    if purchase.status != "PENDING":
        raise ValidationError("Cannot attach files to a non-PENDING purchase")

    uploaded = []
    file_ids = []
    
    try:
        from app.utils.file_validators import MAX_SIZE_LOGO, MAX_SIZE_PHOTO, MAX_SIZE_INSTITUTION
        
        # 1. Upload business logo (Delivery)
        if business_logo:
            fid = await file_service.upload_file(business_logo, "business_logo", MAX_SIZE_LOGO, purchase_id)
            purchase.product_data["logo_file_id"] = fid
            file_ids.append(fid)
            uploaded.append("business_logo")
            
        # 2. Upload business photos (Delivery, max 5)
        if business_photos:
            if len(business_photos) > 5:
                raise ValidationError("Max 5 business photos allowed")
            photo_ids = []
            for i, photo in enumerate(business_photos):
                fid = await file_service.upload_file(photo, f"business_photo_{i}", MAX_SIZE_PHOTO, purchase_id)
                photo_ids.append(fid)
                file_ids.append(fid)
                uploaded.append(f"business_photo_{i}")
            purchase.product_data["photos_file_ids"] = photo_ids
            
        # 3. Upload institution images (ERP, max 2)
        if institution_images:
            if len(institution_images) > 2:
                raise ValidationError("Max 2 institution images allowed")
            img_ids = []
            for i, img in enumerate(institution_images):
                fid = await file_service.upload_file(img, f"institution_image_{i}", MAX_SIZE_INSTITUTION, purchase_id)
                img_ids.append(fid)
                file_ids.append(fid)
                uploaded.append(f"institution_image_{i}")
            purchase.product_data["institution_images_file_ids"] = img_ids

        # Update purchase document with file references
        if uploaded:
            # We use motor directly here just for this sub-document update
            from app.db.mongodb import get_db
            db = get_db()
            await db["purchases"].update_one(
                {"purchase_id": purchase_id},
                {"$set": {"product_data": purchase.product_data}}
            )

        return {"uploaded": uploaded, "file_count": len(uploaded)}
        
    except Exception as e:
        # Cleanup orphaned files in GridFS if something went wrong
        await file_service.cleanup_orphaned_files(file_ids)
        raise

@router.post("/{purchase_id}/initiate-payment", response_model=PaymentInitiateResponse)
async def initiate_payment(purchase_id: str):
    """Initiates an AssanPay payment and returns the redirect link."""
    # Build complete link back to frontend
    site_url = getattr(settings, "NEXT_PUBLIC_SITE_URL", "http://localhost:3000")
    if not site_url.startswith("http"): # fallback
        site_url = "http://localhost:3000"
    return_url = f"{site_url}/payment-status?purchase_id={purchase_id}"
    
    payment = await payment_service.initiate_payment(purchase_id, return_url)
    
    return PaymentInitiateResponse(
        payment_id=payment.payment_id,
        complete_link=payment.complete_link,
        amount_pkr=payment.amount_pkr
    )

@router.get("/{purchase_id}/payment-status", response_model=PaymentStatusResponse)
async def get_payment_status(purchase_id: str):
    """Polls AssanPay and updates local state if payment was completed."""
    purchase_status, payment_status = await payment_service.verify_payment(purchase_id)
    
    # Simple logic for frontend retry polling (e.g. retry every 5s if still pending)
    retry_after = 5 if payment_status == "PENDING_VERIFICATION" else None
    
    return PaymentStatusResponse(
        purchase_id=purchase_id,
        purchase_status=purchase_status,
        payment_status=payment_status,
        retry_after_seconds=retry_after
    )
