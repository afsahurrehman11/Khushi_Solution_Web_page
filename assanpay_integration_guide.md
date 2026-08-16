# AssanPay Integration Guide

This is a concise, highly specific, and technical developer guide for integrating AssanPay into your application. AssanPay provides a seamless way to process payments (e.g., EasyPaisa, JazzCash, Credit/Debit cards).

## 1. Authentication & Credentials

To use AssanPay, you need the following credentials from your merchant dashboard:
*   **Merchant ID (`store_id`)**: Your unique merchant identifier.
*   **API Key (`api_key`)**: Your secret key for authentication.

Store these in your server environment variables. **Never expose the API key in your frontend code.**

## 2. API Endpoints

*   **Sandbox (Testing)**: `https://sandbox.assanpay.com/api` (or follow docs for sandbox URL)
*   **Production (Live)**: `https://api.assanpay.com/api`

## 3. Creating a Checkout Session (Initiate Payment)

To initiate a payment, your backend must create a checkout session and generate a payment URL. You will redirect the user to this URL to complete the payment.

### Request Details
*   **Method**: `POST`
*   **Endpoint**: `/checkout/create`
*   **Headers**: 
    *   `Authorization: Bearer <YOUR_API_KEY>`
    *   `Content-Type: application/json`

### Request Parameters (JSON Payload)
You need to pass the following parameters:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `store_id` | `string` | Yes | Your Merchant ID. |
| `order_id` | `string` | Yes | **CRITICAL**: Must be alphanumeric ONLY (no dashes or special characters) and max 20 characters. E.g., `ORD12345ABC`. |
| `amount` | `number` | Yes | The total amount in PKR. |
| `currency` | `string` | Yes | Usually `"PKR"`. |
| `success_url` | `string` | Yes | The URL the user is redirected to upon successful payment. |
| `cancel_url` | `string` | Yes | The URL the user is redirected to if they cancel the payment. |
| `customer_name` | `string` | Yes | Name of the customer. |
| `customer_email` | `string` | Yes | Email of the customer. |
| `customer_phone` | `string` | Yes | Phone number of the customer. |

### Sample Backend Request (Python/Requests)
```python
import requests
import json

payload = {
    "store_id": "YOUR_STORE_ID",
    "order_id": "ORD001234XYZ",  # Max 20 chars, alphanumeric only!
    "amount": 5000.0,
    "currency": "PKR",
    "success_url": "https://yourwebsite.com/payment/success",
    "cancel_url": "https://yourwebsite.com/payment/cancel",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "03001234567"
}

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post("https://api.assanpay.com/api/checkout/create", json=payload, headers=headers)
data = response.json()

if data.get("status") == "success":
    payment_url = data["payment_url"]
    # Redirect your user to this payment_url
else:
    print("Error:", data.get("message"))
```

## 4. Handling Redirects & Status

After the user attempts payment, AssanPay redirects them back to your `success_url` or `cancel_url`. 

### Success URL Redirect
When the user arrives at your `success_url`, AssanPay usually appends query parameters to verify the transaction.
**Received Parameters via GET:**
*   `order_id`: The alphanumeric order ID you passed.
*   `transaction_id`: AssanPay's unique ID for this transaction.
*   `status`: e.g., `"completed"`, `"failed"`.

*Wait, never trust client-side redirects for fulfilling orders! You must verify via Webhooks or a Status API.*

## 5. Verifying Transaction (Webhook / Server-to-Server)

AssanPay sends a POST request to your pre-configured Webhook URL (configured in merchant dashboard) whenever a payment succeeds or fails.

### Webhook Payload Received
AssanPay will `POST` JSON data to your server. 

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `order_id` | `string` | The ID you originally sent. |
| `transaction_id` | `string` | AssanPay reference ID. |
| `amount` | `number` | The amount paid. |
| `status` | `string` | `"completed"`, `"failed"`, or `"pending"`. |
| `signature` | `string` | Cryptographic hash to verify the request. |

### Security Checklist
1.  **Verify the Signature**: AssanPay includes a hash (often HMAC SHA256) of the payload using your API key. Calculate the hash of the received data and compare it to the `signature` to prevent spoofing.
2.  **Verify Amount**: Ensure the `amount` paid matches the expected amount in your database for that `order_id`.
3.  **Idempotency**: Check if the `order_id` has already been marked as paid in your system to prevent double-crediting.

## 6. Common Pitfalls & Errors
*   **Invalid `order_id` format**: AssanPay strictly rejects order IDs with dashes (`-`) or underscores (`_`). Ensure it is purely alphanumeric (A-Z, 0-9).
*   **CORS Errors**: Never call the AssanPay checkout creation API directly from your React/Angular frontend. Browsers will block it due to CORS, and it exposes your API key. Always route requests through your backend.
