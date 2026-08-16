import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def create_mock_purchase(client: AsyncClient):
    payload = {
        "product": "khushi_delivery",
        "plan_key": "non_commission",
        "customer": {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+923001234567"
        },
        "product_data": {
            "business_name": "Test Business",
            "business_category": "food_restaurant",
            "business_address": "123 Test St",
            "city": "Lahore",
            "area_town": "Gulberg"
        }
    }
    resp = await client.post("/api/v1/purchases", json=payload)
    return resp.json()["purchase_id"]

async def test_initiate_payment(client: AsyncClient):
    purchase_id = await create_mock_purchase(client)
    
    resp = await client.post(f"/api/v1/purchases/{purchase_id}/initiate-payment")
    assert resp.status_code == 200
    data = resp.json()
    assert "payment_id" in data
    assert "complete_link" in data
    
    # Check status changed to PAYMENT_INITIATED
    status_resp = await client.get(f"/api/v1/purchases/{purchase_id}/payment-status")
    # In mock mode, the mock verify returns SUCCESS by default
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["purchase_status"] == "PAID"
    assert status_data["payment_status"] == "SUCCESS"
    
async def test_initiate_payment_idempotent(client: AsyncClient):
    import os
    os.environ["ASSANPAY_MOCK_RESULT"] = "pending" # Keep it pending so we can re-initiate
    
    purchase_id = await create_mock_purchase(client)
    resp1 = await client.post(f"/api/v1/purchases/{purchase_id}/initiate-payment")
    data1 = resp1.json()
    
    resp2 = await client.post(f"/api/v1/purchases/{purchase_id}/initiate-payment")
    data2 = resp2.json()
    
    assert data1["payment_id"] == data2["payment_id"]
    assert data1["complete_link"] == data2["complete_link"]
