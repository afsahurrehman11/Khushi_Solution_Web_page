import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_get_pricing_valid(client: AsyncClient):
    resp = await client.get("/api/v1/products/khushi-delivery/pricing")
    assert resp.status_code == 200
    data = resp.json()
    assert data["product"] == "khushi_delivery"
    assert len(data["plans"]) == 2
    
async def test_get_pricing_invalid(client: AsyncClient):
    resp = await client.get("/api/v1/products/unknown-product/pricing")
    assert resp.status_code == 422
    
async def test_create_purchase_valid(client: AsyncClient):
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
    assert resp.status_code == 201
    data = resp.json()
    assert data["amount_pkr"] == 11000
    assert data["status"] == "PENDING"
    assert data["purchase_id"].startswith("purch_")

async def test_create_purchase_free_erp(client: AsyncClient):
    payload = {
        "product": "khushi_erp",
        "plan_key": "base_free",
        "customer": {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+923001234567"
        },
        "product_data": {
            "institution_name": "Test School",
            "institution_type": "school",
            "institution_email": "school@example.com",
            "institution_phone": "+923001234567",
            "complete_address": "123 Test St",
            "city": "Lahore",
            "contact_name": "Test User",
            "contact_designation": "Principal",
            "contact_email": "test@example.com",
            "contact_phone": "+923001234567"
        }
    }
    
    resp = await client.post("/api/v1/purchases", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["amount_pkr"] == 0
    assert data["status"] == "PAID" # Direct transition for free plans
