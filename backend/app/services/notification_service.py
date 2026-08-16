import logging
import httpx
from typing import Optional
from app.core.config import settings

logger = logging.getLogger("notification")

class NotificationService:
    def __init__(self):
        self.access_key = settings.WEB3FORMS_ACCESS_KEY
        self.notification_email = settings.NOTIFICATION_EMAIL
        self.url = "https://api.web3forms.com/submit"

    async def send_admin_email(self, purchase: dict, amount: int) -> bool:
        """
        Sends an email via Web3Forms POST request.
        Must be called OUTSIDE the MongoDB transaction.
        """
        if not self.access_key:
            logger.warning("notification.skipped | no_web3forms_key")
            return False
            
        product_label = "Khushi Delivery" if purchase.get("product") == "khushi_delivery" else "Khushi ERP"
        
        # Build message
        msg = f"""
New Purchase — {product_label} | {purchase.get('purchase_id')}

Product:    {product_label}
Plan:       {purchase.get('plan_key')}
Order ID:   {purchase.get('purchase_id')}
Amount:     PKR {amount}
Status:     PAID

--- CUSTOMER DETAILS ---
Name:       {purchase.get('customer', {}).get('name', '')}
Email:      {purchase.get('customer', {}).get('email', '')}
Phone:      {purchase.get('customer', {}).get('phone', '')}
WhatsApp:   {purchase.get('customer', {}).get('whatsapp', 'N/A')}

--- PRODUCT/BUSINESS DETAILS ---
"""
        
        product_data = purchase.get('product_data', {})
        for key, value in product_data.items():
            if not key.endswith('_file_id') and not key.endswith('_file_ids'):
                msg += f"{key.replace('_', ' ').title()}: {value}\n"


        payload = {
            "access_key": self.access_key,
            "subject": f"New Purchase: {product_label} - {purchase.get('purchase_id')}",
            "email": self.notification_email,
            "message": msg
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self.url, json=payload)
                if response.status_code == 200:
                    logger.info(f"notification.sent | purchase_id={purchase.get('purchase_id')}")
                    return True
                else:
                    logger.error(f"notification.failed | status={response.status_code}")
                    return False
        except Exception as e:
            logger.error(f"notification.error | reason={type(e).__name__}")
            return False
