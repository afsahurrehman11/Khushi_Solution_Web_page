from fastapi import APIRouter, Request
import logging

logger = logging.getLogger("webhooks")
router = APIRouter()

@router.post("/webhook")
async def assanpay_webhook(request: Request):
    """
    Stub for AssanPay Webhooks.
    Always returns 200 OK so AssanPay doesn't retry indefinitely.
    Payload is logged for future implementation when schema is known.
    """
    try:
        body = await request.json()
        logger.info(f"webhook.received | payload={body}")
    except Exception:
        body = await request.body()
        logger.info(f"webhook.received_raw | payload={body}")
        
    return {"received": True}
