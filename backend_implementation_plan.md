# Khushi Solutions — FINAL PRE-IMPLEMENTATION REVIEW
# v3.0 — Architecture Freeze Before Coding
# ADDENDUM A & B integrated — ARCHITECTURE NOW FROZEN

---

## ADDENDUM A: MongoDB Transaction Requirement (MANDATORY)

### MongoDB Must Support Transactions

The payment verification flow uses multi-document transactions (`payment → SUCCESS` + `purchase → PAID` + `audit log` in one atomic unit). MongoDB transactions require a **replica set** deployment — standalone single-node MongoDB does NOT support transactions.

**Local development**: MongoDB must be started as a single-node replica set:
```bash
mongod --replSet rs0 --bind_ip localhost
# Then in mongo shell: rs.initiate()
```

The `start.bat` will document this requirement clearly.

**Production**: MongoDB Atlas supports transactions on all tiers (M0 and above). Self-hosted MongoDB must be configured as a replica set.

**No silent fallback**: The backend must NOT silently fall back to non-transactional payment updates. If transactions are unavailable, the backend must refuse to start.

### Startup Transaction Capability Check

After the ping check, before accepting requests:

```python
# Verify transaction support by attempting a test transaction
async with await client.start_session() as session:
    async with session.start_transaction():
        await db.command("ping", session=session)
        # If this succeeds, transactions are supported
```

If this raises `OperationFailure` (not a replica set), log:
```
CRITICAL db.transactions_not_supported | reason=standalone_node fix=start_as_replica_set
```
and call `sys.exit(1)`.

---

## ADDENDUM B: Notifications MUST Run OUTSIDE the MongoDB Transaction

The Web3Forms/email HTTP request must NOT execute while a MongoDB transaction is open.

External HTTP calls inside a transaction cause:
- Transaction held open for the duration of the HTTP request (potentially seconds)
- Risk of transaction timeout if the HTTP call is slow
- Unnecessary coupling between DB atomicity and external service availability

### Required Execution Order

```
AssanPay verify_payment() → "Success"
        ↓
Open MongoDB transaction
        ├── payment.status → SUCCESS
        ├── purchase.status → PAID
        ├── audit_log.insert (PAYMENT_VERIFIED_SUCCESS)
        └── payment.notification_sent → false (flagged for sending)
COMMIT transaction
        ↓  (transaction closed)
notification_service.send_admin_email()  ← OUTSIDE transaction
        ↓
payment.notification_sent → true  ← separate non-transactional update
```

If the notification HTTP call fails after a successful commit: the payment is still correctly `PAID`. The notification failure is logged as an ERROR. A retry mechanism (or manual resend) can be triggered, but it does NOT affect payment correctness.

---

## PART A: CONTRADICTIONS & ISSUES FOUND IN v2.0

### Issue 1 — Order ID Format Had Two Conflicting Specifications [RESOLVED]

**v2.0 stated in Section 1.5:**
> Format: `purch_` + 12 random alphanumeric chars

**v2.0 stated in Section 7 (AssanPay):**
> `KD20251218X7K2M9PQ` (18 chars, no dashes)

**v2.0 stated elsewhere:**
> `KS-KD-20251218-A3F9X2` (WITH dashes — violates AssanPay constraint)

**Resolution:**
Two completely separate ID systems:

- **Internal IDs** (`purchase_id`, `payment_id`): Use prefix + 12 random alphanumeric. Dashes allowed. Never sent to AssanPay.
- **AssanPay order ID**: Separate field `assanpay_order_id`. No dashes, no underscores, no special chars, max 20 chars.

**Final formats (see Part C for canonical definitions).**

---

### Issue 2 — AssanPay Authentication: Shopify Docs Reveal Key New Detail [REQUIRES USER ACTION]

**New fact from AssanPay Shopify documentation:**
The UnumPay Shopify plugin configuration collects:
- **API Key** (UUID v4 format: `59a33b28-7cd6-446c-a777-3bd28e3ee7a2`)
- **API Secret** (UUID v4 format: `e68dc7f0-b61c-40a8-b3e8-ee3f251ba2e2`)
- **Branch Code** (e.g., `APTEST01`)

The branch code was **not** in v2.0. The API key and secret are UUIDs, not simple strings.

**Impact on implementation:**
- The `assanpay_service.py` auth placeholder must include `branch_code` as a required env var
- Updated env var: `ASSANPAY_BRANCH_CODE=APTEST01`
- Still unknown: which HTTP header format carries these credentials in direct API calls (not documented publicly)

---

### Issue 3 — `PENDING_VERIFICATION` State Inconsistency [RESOLVED]

**v2.0 Purchase states listed:** `PENDING`, `PAYMENT_INITIATED`, `PAID`, `FAILED`, `EXPIRED`

**v2.0 Payment states listed:** `PAYMENT_INITIATED`, `VERIFIED_SUCCESS`, `VERIFIED_FAILED`, `PENDING_VERIFICATION`

**Problem:** `PENDING_VERIFICATION` appeared in both the purchase state machine diagram AND as a payment state. It belongs only on the **payment** record. The **purchase** remains at `PAYMENT_INITIATED` while the payment is `PENDING_VERIFICATION`.

**Resolution:** See final state machines in Part B.

---

### Issue 4 — Notification Deduplication Not Explicitly Handled [RESOLVED]

**v2.0** said "send notification on PAYMENT_VERIFIED_SUCCESS."

**Problem:** If the status polling endpoint is called 5 times while the payment transitions from `PENDING` to `SUCCESS`, and verification succeeds on call 3, calls 4 and 5 will re-read `PAID` from the DB. A naive implementation would send 3 admin emails.

**Resolution:** Notification is only sent during the state transition write, not on every status read. The payment repository's `set_verified_success()` method is wrapped in a transaction that also sets a `notification_sent: true` flag. The notification service checks this flag before sending.

---

### Issue 5 — `FAILED` State Retry Path Not Defined [RESOLVED]

**v2.0** declared `FAILED` as terminal but left no retry guidance.

**Resolution:**
- `FAILED` is terminal for a **payment** record (never modified again)
- A `FAILED` **purchase** allows one retry: the user can initiate a new payment (creates a new payment document). The purchase transitions back to `PAYMENT_INITIATED` only by creating a new payment attempt.
- Maximum 3 payment attempts per purchase (configurable). After 3 failed attempts, purchase becomes `ABANDONED` (a new terminal state).

Updated purchase states: `PENDING`, `PAYMENT_INITIATED`, `PAID`, `FAILED`, `EXPIRED`, `ABANDONED`.

---

### Issue 6 — ERP Free Plan State Machine Gap [RESOLVED]

**v2.0** said: "For free plans: Backend creates purchase → marks PAID immediately."

**Problem:** If purchase goes from `PENDING` directly to `PAID` (skipping `PAYMENT_INITIATED`), the state machine validator would reject this as an invalid transition.

**Resolution:** For zero-amount purchases:
- The state machine allows `PENDING → PAID` **only** when `amount_pkr == 0`
- This is the single exception to the normal flow, explicitly coded in `purchase_service.py`
- A payment record is still created with `provider: "none"`, `status: "ZERO_AMOUNT_CONFIRMED"` for audit trail completeness

---

### Issue 7 — File Upload: Race Condition on Purchase + Files [RESOLVED]

**v2.0** described files uploaded as part of purchase creation. 

**Problem:** If files upload to GridFS successfully but the purchase document write fails, orphaned GridFS files are created.

**Resolution:** Two-phase approach:
1. Upload files to GridFS → get `file_id`s → store in temporary context (in-memory within the request)
2. Create purchase document including `file_id`s in one write
3. If step 2 fails, delete the uploaded GridFS files in the exception handler
4. Orphan cleanup: a scheduled task (or startup check) removes GridFS files older than 1 hour with no matching `purchase_id` reference

---

### Issue 8 — Frontend Product ID vs Backend Product Enum [RESOLVED]

**Frontend uses** (from `products.ts`): `khushi-delivery`, `khushi-erp` (hyphenated, URL-safe)

**Backend enums use**: `khushi_delivery`, `khushi_erp` (underscored, Python-safe)

**v2.0 mentioned this but did not define conversion.**

**Resolution:**
- Frontend sends `product: "khushi-delivery"` in the request body
- Pydantic validator on the backend converts hyphens to underscores before validation
- The enum accepts both forms: `khushi-delivery` and `khushi_delivery`
- Stored in DB as `khushi_delivery` (underscore canonical form)

---

### Issue 9 — `btn-primary-gradient` CSS Conflict [RESOLVED]

**Existing codebase:** `btn-primary-gradient` in `globals.css` uses **green** (`#10b981` to `#059669`).

This is used for the "Contact Us" button and the existing "Submit Inquiry" button.

**Problem:** The Khushi Delivery product accent is **blue** (`var(--color-primary)` = `#2C64B4`), and Khushi ERP is **green** (`var(--color-secondary)` = `#059669`).

If we use `btn-primary-gradient` for the Purchase CTA on the Khushi Delivery page, it will render green — but the product accent is blue.

**Resolution:**
- Purchase CTA on Khushi Delivery page: Use accent-aware button (blue gradient matching `var(--color-primary)`)
- Purchase CTA on Khushi ERP page: Use existing `btn-primary-gradient` (green, matching `var(--color-secondary)`)
- The `PurchaseSection.tsx` component receives `product.accent` and renders the appropriate button style, consistent with how `ProductDetailHero.tsx` already handles this

---

### Issue 10 — X-XSS-Protection Header is Obsolete [RESOLVED]

**v2.0 proposed:** `X-XSS-Protection: 1; mode=block`

**Reality:** This header is deprecated and removed from modern browsers. Chrome 78+ ignores it. It can actually create XSS vulnerabilities in some IE configurations.

**Resolution:** Remove `X-XSS-Protection`. Keep the other three headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

### Issue 11 — `payment-status` Page Not in Static Export [RESOLVED]

**v2.0 proposed** a `/payment-status` page in the Next.js app.

**Problem:** `next.config.mjs` uses `output: "export"`. Static export requires all dynamic routes to be in `generateStaticParams`. A `/payment-status?purchase_id=...` page reads `purchase_id` from a URL query parameter — this is perfectly fine for static export because:
- The **page** is statically generated (no server)
- The **query parameter** is read client-side via `useSearchParams()`
- The page makes a client-side API call to the backend

**Resolution:** No structural change needed. The `/payment-status` page works as a static export with client-side data fetching. BUT — it needs `'use client'` directive and must be wrapped in `<Suspense>` (same pattern as `ContactSection.tsx` which already uses `useSearchParams`).

---

### Issue 12 — `.env.local` Not Mentioned in Rename Migration [RESOLVED]

**v2.0** noted `.env.local` must be recreated after rename but did not explain where.

**Resolution:** After rename, the developer must:
1. Create `frontend/.env.local` (copy from `frontend/.env.example`, fill values)
2. Create `backend/.env` (copy from `backend/.env.example`, fill values)
3. The `frontend/.env.local` values are **identical** to the current `khushi-solutions/.env.local` plus the two new variables

---

## PART B: REMAINING ASSUMPTIONS

| # | Assumption | Impact if Wrong | Action Required |
|---|---|---|---|
| 1 | AssanPay auth header format is unknown | Cannot make real API calls | Ask AssanPay support or check plugin source code on GitHub |
| 2 | AssanPay webhook payload schema is unknown | Webhook endpoint is stub only | Request from AssanPay or examine Shopify app network calls |
| 3 | `transactionStaus` typo applies to all status values | Wrong field parsing | Will defensively check both spellings |
| 4 | AssanPay `"Success"` is the exact string (case-sensitive) | Wrong PAID detection | Will test with case-insensitive comparison + log the raw value |
| 5 | AssanPay production URL same as docs URL | Payment calls go nowhere | Confirm on credential receipt |
| 6 | `ASSANPAY_MOCK_RESULT` env var controls mock behavior | Dev testing only | No production impact |
| 7 | Web3Forms key works for backend HTTP POST | Admin emails won't send | Same key already works in frontend — should work from backend |
| 8 | MongoDB auto-creates `ks_company_portal` database on first write | Manual DB creation needed | MongoDB creates DBs automatically on first insert — no manual step needed. Verified at startup with `ping`. |

---

## PART C: FINAL STATE MACHINES

### C.1 Purchase State Machine

```
States: PENDING | PAYMENT_INITIATED | PAID | FAILED | EXPIRED | ABANDONED

PENDING
  ├─► PAYMENT_INITIATED   [trigger: initiate-payment called, AssanPay accepted]
  └─► PAID                [trigger: amount_pkr == 0 ONLY, direct transition for free plans]

PAYMENT_INITIATED
  ├─► PAID                [trigger: AssanPay verified "Success"]
  ├─► FAILED              [trigger: AssanPay verified "Failed" on final attempt]
  ├─► EXPIRED             [trigger: 30-min timer with no successful payment]
  └─► PAYMENT_INITIATED   [stays here while payment is PENDING_VERIFICATION — no transition]

PAID        → terminal. No transitions allowed. Ever.
FAILED      → semi-terminal. A new payment attempt transitions to PAYMENT_INITIATED again.
              After 3 failed payment attempts → ABANDONED.
EXPIRED     → terminal. No transitions allowed.
ABANDONED   → terminal. No transitions allowed.
```

**Valid transition table:**
```python
PURCHASE_TRANSITIONS = {
    "PENDING":            ["PAYMENT_INITIATED", "PAID"],   # PAID only if amount == 0
    "PAYMENT_INITIATED":  ["PAID", "FAILED", "EXPIRED"],
    "PAID":               [],
    "FAILED":             ["PAYMENT_INITIATED"],           # retry flow, max 3 attempts
    "EXPIRED":            [],
    "ABANDONED":          [],
}
```

---

### C.2 Payment State Machine

```
States: INITIATED | PENDING_VERIFICATION | SUCCESS | FAILED | ZERO_AMOUNT

INITIATED
  ├─► PENDING_VERIFICATION   [trigger: AssanPay returned "Pending" on status check]
  ├─► SUCCESS                [trigger: AssanPay returned "Success" on status check]
  └─► FAILED                 [trigger: AssanPay returned "Failed" on status check]

PENDING_VERIFICATION
  ├─► SUCCESS                [trigger: next status check returns "Success"]
  └─► FAILED                 [trigger: next status check returns "Failed"]

SUCCESS         → terminal. Triggers purchase → PAID.
FAILED          → terminal. May trigger purchase → FAILED if max attempts reached.
ZERO_AMOUNT     → terminal. Used for free ERP plan. No AssanPay call made.
```

**Rules:**
- A payment record is created when `initiate-payment` is called
- A payment record is NEVER modified to `SUCCESS` by anything other than an AssanPay `verify_payment()` returning `"Success"`
- `PENDING_VERIFICATION` does NOT trigger any purchase state change
- Duplicate verification calls on an already-`SUCCESS` payment: idempotent, return same result, do NOT re-send notification

---

## PART D: FINAL DATABASE / COLLECTION STRUCTURE

### Database: `ks_company_portal`

**Naming convention confirmed:**
- `ks_` = company identifier (Khushi Solutions)
- `company_portal` = system name (the public-facing company website and its purchase/payment backend)
- Future databases: `ks_khushi_delivery` (delivery product), `ks_khushi_erp` (ERP product), etc.

### Collections

| Collection | Purpose |
|---|---|
| `purchases` | One per purchase attempt. Embeds customer + product_data. |
| `payments` | One per payment attempt. Full financial record. |
| `audit_logs` | Append-only event trail. Never updated. |
| `uploads.files` / `uploads.chunks` | GridFS bucket `uploads` for file storage. |

### `purchases` Document (Final Schema)

```json
{
  "_id": "ObjectId",
  "purchase_id": "purch_X7k2mN9pQrLw",
  "product": "khushi_delivery",
  "plan_key": "non_commission",
  "status": "PENDING",
  "payment_attempts": 0,
  "notification_sent": false,

  "customer": {
    "name": "Ahmed Khan",
    "email": "ahmed@business.com",
    "phone": "+923001234567",
    "whatsapp": "+923001234567"
  },

  "product_data": {
    "VARIANT_A — khushi_delivery": {
      "business_name": "Ahmed's Restaurant",
      "business_category": "food_restaurant",
      "sub_category": "dine_in",
      "business_address": "123 Main Street",
      "city": "Lahore",
      "area_town": "Gulberg",
      "maps_location": "31.5204,74.3587",
      "logo_file_id": "ObjectId_of_GridFS_file",
      "photos_file_ids": ["ObjectId", "ObjectId"]
    },
    "VARIANT_B — khushi_erp": {
      "institution_name": "...",
      "institution_type": "school",
      "institution_email": "...",
      "institution_phone": "...",
      "secondary_phone": "...",
      "whatsapp": "...",
      "complete_address": "...",
      "city": "...",
      "area_town": "...",
      "latitude": 31.5204,
      "longitude": 74.3587,
      "contact_name": "...",
      "contact_designation": "Principal",
      "contact_email": "...",
      "contact_phone": "...",
      "contact_whatsapp": "...",
      "student_count": 500,
      "teacher_staff_count": 40,
      "campus_count": 1,
      "current_system": "Manual/Excel",
      "institution_images_file_ids": ["ObjectId"]
    }
  },

  "amount_pkr": 11000,
  "currency": "PKR",
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

### `payments` Document (Final Schema)

```json
{
  "_id": "ObjectId",
  "payment_id": "pay_Tz4bVm8hJrKn",
  "purchase_id": "purch_X7k2mN9pQrLw",
  "product": "khushi_delivery",
  "plan_key": "non_commission",
  "amount_pkr": 11000,
  "currency": "PKR",
  "provider": "assanpay",

  "assanpay_order_id": "KD202512X7K2M9PQ",
  "assanpay_transaction_id": "T202512181151100kr4f",
  "assanpay_payment_uuid": "ddc6b617-3126-4866-9782-c68f535034b6",
  "complete_link": "https://merchant.assanpay.com/aik-qr/ddc6b617-...",

  "status": "INITIATED",
  "status_history": [
    { "status": "INITIATED", "timestamp": "ISODate", "note": "AssanPay payment created" }
  ],

  "verification_attempts": 0,
  "last_verified_at": null,
  "assanpay_raw_status": null,
  "failure_reason": null,
  "notification_sent": false,

  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### `audit_logs` Document (Final Schema)

```json
{
  "_id": "ObjectId",
  "event": "PAYMENT_VERIFIED_SUCCESS",
  "purchase_id": "purch_X7k2mN9pQrLw",
  "payment_id": "pay_Tz4bVm8hJrKn",
  "product": "khushi_delivery",
  "plan_key": "non_commission",
  "amount_pkr": 11000,
  "ip_address": "192.168.1.1",
  "request_id": "req_AbC123",
  "timestamp": "ISODate",
  "metadata": {}
}
```

### GridFS: Bucket `uploads`

Files stored with metadata:
```json
{
  "filename": "uuid4.webp",
  "contentType": "image/webp",
  "metadata": {
    "purchase_id": "purch_X7k2mN9pQrLw",
    "field": "business_logo",
    "validated": true,
    "upload_timestamp": "ISODate"
  }
}
```

### Indexes (Complete)

```python
purchases:  purchase_id (unique), status, product, ip_address, customer.email
payments:   payment_id (unique), purchase_id, assanpay_order_id (unique), status
audit_logs: purchase_id, payment_id, event+timestamp
```

---

## PART E: FINAL ID FORMAT SPECIFICATIONS

### Internal Purchase ID
```
Format:  purch_ + 12 chars from [A-Za-z0-9]
Example: purch_X7k2mN9pQrLw
Length:  18 chars total
Source:  secrets.token_urlsafe(9).replace("-","").replace("_","")[:12]
```

### Internal Payment ID
```
Format:  pay_ + 12 chars from [A-Za-z0-9]
Example: pay_Tz4bVm8hJrKn
Length:  15 chars total
```

### Internal Request Correlation ID (for logging)
```
Format:  req_ + 8 chars from [A-Za-z0-9]
Example: req_Ab3Kx9pQ
Added to each request via middleware, passed through all log calls in that request
```

### AssanPay Order ID (sent to AssanPay)
```
Format:  {PP}{YYYYMMDD}{8 random chars from [A-Z0-9]}
PP:      KD (Khushi Delivery) | KE (Khushi ERP)
Example: KD20251218X7K2M9PQ
Length:  18 chars (safely within 20-char limit)
Chars:   Only [A-Z0-9] — no lowercase, no dashes, no underscores
Source:  f"{prefix}{date}{secrets.token_hex(4).upper()}"
```

**Test:** `len("KD20251218X7K2M9PQ") == 18` ✓ `re.match(r'^[A-Z0-9]{18}$', "KD20251218X7K2M9PQ")` ✓

---

## PART F: FINAL API CONTRACT

### POST /api/v1/purchases

**Request body (JSON):**
```json
{
  "product": "khushi-delivery",
  "plan_key": "non_commission",
  "customer": {
    "name": "Ahmed Khan",
    "email": "ahmed@business.com",
    "phone": "+923001234567",
    "whatsapp": "+923001234567"
  },
  "product_data": {
    "business_name": "Ahmed's Restaurant",
    "business_category": "food_restaurant",
    "business_address": "123 Main Street",
    "city": "Lahore",
    "area_town": "Gulberg",
    "sub_category": "dine_in",
    "maps_location": "31.5204,74.3587"
  }
}
```

Note: Files are NOT in this JSON. They are uploaded separately (multipart) in a follow-up call before or after purchase creation. See file upload flow below.

**Success response (201):**
```json
{
  "purchase_id": "purch_X7k2mN9pQrLw",
  "product": "khushi_delivery",
  "plan_key": "non_commission",
  "plan_label": "Non-Commission Model",
  "amount_pkr": 11000,
  "currency": "PKR",
  "status": "PENDING"
}
```

**Error responses:**
- `422` — Pydantic validation failure (invalid field, extra field, bad enum)
- `400` — Business logic rejection (invalid product+plan combination)
- `429` — Rate limit exceeded

---

### POST /api/v1/purchases/{purchase_id}/files

**Request:** `multipart/form-data` with file fields

**Fields:**
- `business_logo` (1 file, for khushi_delivery)
- `business_photos` (up to 5 files, for khushi_delivery)
- `institution_images` (up to 2 files, for khushi_erp)

**Success response (200):**
```json
{
  "uploaded": ["logo", "photo_1", "photo_2"],
  "file_count": 3
}
```

**Error responses:**
- `400` — Purchase not in PENDING status
- `415` — Unsupported file type
- `413` — File too large
- `422` — Too many files
- `404` — Purchase not found

---

### POST /api/v1/purchases/{purchase_id}/initiate-payment

**Request body:** Empty `{}`

**Success response (200):**
```json
{
  "payment_id": "pay_Tz4bVm8hJrKn",
  "complete_link": "https://merchant.assanpay.com/aik-qr/...",
  "amount_pkr": 11000,
  "currency": "PKR"
}
```

**Idempotent:** If payment already `INITIATED`, returns existing `complete_link`.

**Error responses:**
- `404` — Purchase not found
- `409` — Invalid state transition (already PAID/FAILED/EXPIRED)
- `503` — AssanPay unavailable
- `429` — Rate limit exceeded

---

### GET /api/v1/purchases/{purchase_id}/payment-status

**Success response (200):**
```json
{
  "purchase_id": "purch_X7k2mN9pQrLw",
  "purchase_status": "PAID",
  "payment_id": "pay_Tz4bVm8hJrKn",
  "payment_status": "SUCCESS",
  "amount_pkr": 11000,
  "retry_after_seconds": null
}
```

**When pending (200 — not an error):**
```json
{
  "purchase_status": "PAYMENT_INITIATED",
  "payment_status": "PENDING_VERIFICATION",
  "retry_after_seconds": 5
}
```

---

### GET /api/v1/products/{product_id}/pricing

**Success response (200):**
```json
{
  "product": "khushi_delivery",
  "plans": [
    {
      "plan_key": "non_commission",
      "label": "Non-Commission Model",
      "amount_pkr": 11000,
      "currency": "PKR",
      "description": "One-time registration. No ongoing commission.",
      "categories": null
    },
    {
      "plan_key": "commission",
      "label": "Commission Model",
      "amount_pkr": 5000,
      "currency": "PKR",
      "description": "Reduced registration fee with category-based commission.",
      "categories": [
        {
          "key": "food_restaurant",
          "label": "Food & Restaurant",
          "display": "Food & Restaurant — 15% commission",
          "commission_pct": 15
        }
      ]
    }
  ]
}
```

---

### POST /api/v1/payments/webhook

**Request:** AssanPay callback (schema TBD — endpoint receives and logs any payload)

**Response (always 200):**
```json
{ "received": true }
```

Never return a non-200 to AssanPay webhooks (prevents retry storms).

---

## PART G: CODEBASE COMPATIBILITY ANALYSIS

### G.1 Confirmed No Conflicts With Existing Code

| Existing File | Impact | Action |
|---|---|---|
| `products/[slug]/page.tsx` | New `<PurchaseSection>` added above `<ContactSection>` | Add import + JSX only |
| `ContactSection.tsx` | No change | None |
| `ContactForm.tsx` | No change | None |
| `globals.css` | No change to existing classes | New purchase section reuses existing classes |
| `ProductDetailHero.tsx` | No change | None |
| `next.config.mjs` | No change | `output: "export"` remains |
| `Navbar.tsx` | No change | None |
| `company.ts` `navItems` | No change | None |

### G.2 Design System Tokens Available for Use

All new frontend components will use existing design tokens:

| Token | Value | Usage in Purchase Section |
|---|---|---|
| `btn-primary-gradient` | Green gradient | ERP purchase CTA |
| `glass-card` | Glassmorphism background | Plan selector cards |
| `section-padding` | Responsive padding | PurchaseSection wrapper |
| `container-main` | Max-width container | PurchaseSection wrapper |
| `eyebrow-pill` | Label pill style | "PURCHASE / REGISTRATION" eyebrow |
| `text-h2` | Section heading | "Register Your Business" heading |
| `--color-primary` | Blue `#2C64B4` | Delivery CTA / accent |
| `--color-secondary` | Green `#059669` | ERP CTA / accent |
| `--radius-xl` | `20px` | Card border radius |

### G.3 New Dependency Analysis

**Frontend — NO new npm packages needed.** Existing deps cover everything:
- `framer-motion` — form step transitions
- `lucide-react` — icons (ShoppingBag, CheckCircle2, etc.)
- `next` — `useSearchParams`, `useRouter` for payment-status page

The only potential addition: `react-hook-form` — but given the existing pattern in `ContactForm.tsx` uses plain controlled state, we will follow the same pattern for consistency. No new dependency.

**Backend — New packages:**
```
fastapi
uvicorn[standard]
motor
pymongo
pydantic
pydantic-settings
httpx
slowapi
python-multipart  <- for file uploads
python-magic      <- for magic byte validation (OR use manual byte reading to avoid binary dependency)
```

Note: `python-magic` requires `libmagic` native binary on the server. To avoid deployment complexity, we will implement magic byte validation manually (read first 12 bytes, check against known signatures) — no external binary needed.

---

## PART H: PAYMENT DUPLICATION & INCORRECT PAID RISKS

### Risk 1: Double-click on "Initiate Payment" button
- **Protection**: Frontend disables button on first click (loading state)
- **Protection**: Backend: if `purchase.status == PAYMENT_INITIATED`, return existing `complete_link` (idempotent)
- **Protection**: `assanpay_order_id` has unique index — second DB insert fails even if first request somehow completes

### Risk 2: User opens payment URL in two browser tabs
- **Protection**: AssanPay handles this on their side. We do not create a new payment. The `complete_link` is the same URL, and AssanPay processes it once.

### Risk 3: Status polling marks PAID twice (duplicate notification)
- **Protection**: `payments.notification_sent` and `purchases.notification_sent` flags
- **Protection**: `set_verified_success()` uses atomic conditional update: `{ $set: {...} }` with `filter: { status: { $ne: "SUCCESS" } }` — only executes if NOT already SUCCESS
- **Protection**: The notification is sent inside the transaction, only when the `$set` operation actually modifies a document (matched_count > 0)

### Risk 4: Frontend sends `status=PAID` in POST body
- **Protection**: No `status` field exists in any request Pydantic schema (`extra="forbid"` rejects unknown fields)
- **Protection**: Route handlers never accept status from client

### Risk 5: Concurrent initiate-payment requests
- **Protection**: The purchase status update `PENDING → PAYMENT_INITIATED` uses an atomic conditional update with filter `{ status: "PENDING" }`. Only one concurrent request will match and update. The other will get `matched_count == 0` and receive a 409 Conflict.

### Risk 6: AssanPay returns "Order Id already exists" (HTTP 200)
- **Protection**: `assanpay_service.py` detects this by checking `message == "Order Id already exists"` and raises `AssanPayDuplicateOrderError`
- **Protection**: `payment_service.py` catches this, queries existing payment by `assanpay_order_id`, and returns its `complete_link`
- **Protection**: No duplicate payment record is created

### Risk 7: AssanPay verification succeeds but DB write fails
- **Protection**: The `PAID` state is written inside a MongoDB transaction that also updates the payment record and writes the audit log. If the transaction fails, the purchase remains `PAYMENT_INITIATED` and the next poll will call AssanPay again (AssanPay is still returning "Success" for a successful payment).

### Risk 8: Network timeout during verification — marking PAID incorrectly
- **Protection**: Fail-closed rule. On ANY exception during `verify_payment()`, the result is `PENDING_VERIFICATION`. Never PAID. The system defaults to NOT PAID on uncertainty.

---

## PART I: CHANGES TO BE MADE TO v2.0

| # | Change | Section Affected |
|---|---|---|
| 1 | Add `ASSANPAY_BRANCH_CODE` to env vars (from Shopify docs) | Env vars, assanpay_service |
| 2 | Add `ABANDONED` state to purchase state machine | State machine |
| 3 | Clarify `PENDING → PAID` exception for zero-amount ERP plan | State machine |
| 4 | Add `ZERO_AMOUNT` state to payment machine | State machine |
| 5 | Add retry count (`payment_attempts`) to purchase document | DB schema |
| 6 | Add `notification_sent` flag to purchase + payment documents | DB schema |
| 7 | Add `request_id` to logging spec and audit_logs | Logging, DB |
| 8 | Remove `X-XSS-Protection` header (obsolete/harmful) | Security headers |
| 9 | Split file upload into separate endpoint `POST /purchases/{id}/files` | API contract |
| 10 | Add orphan GridFS cleanup specification | File upload |
| 11 | Fix frontend product ID → backend enum conversion (`-` to `_`) | API contract |
| 12 | Clarify Purchase CTA button color uses accent-aware style | Frontend |
| 13 | Replace `python-magic` with manual magic byte check (no binary deps) | Backend packages |
| 14 | Add `payment-status` page `<Suspense>` requirement | Frontend |
| 15 | Add `FAILED → PAYMENT_INITIATED` retry transition (max 3 attempts) | State machine |

---

## PART J: START.BAT SPECIFICATION

The `start.bat` file will be placed at the project root:
`d:\disk D datat\GitHub\Khushi_Solution_Web_page\start.bat`

**Behavior:**
- Opens Windows Terminal (or falls back to `cmd`) with two tabs/windows
- Tab 1 (Backend): navigates to `backend/`, activates Python venv, starts uvicorn
- Tab 2 (Frontend): navigates to `frontend/`, starts Next.js dev server
- Each terminal stays open so logs are visible
- Uses `wt` (Windows Terminal) if available, falls back to `start cmd`

**Content:**
```batch
@echo off
:: Khushi Solutions Development Launcher
:: Starts backend (FastAPI) and frontend (Next.js) in separate terminals

echo Starting Khushi Solutions Development Environment...

:: Check if Windows Terminal (wt) is available
where wt >nul 2>&1
if %errorlevel% == 0 (
    :: Open Windows Terminal with two tabs
    wt --title "KS Backend" cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat (.venv\Scripts\activate.bat) else echo [WARN] No .venv found, using system Python) && echo Starting FastAPI backend... && python run.py" ; new-tab --title "KS Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Next.js frontend... && npm run dev"
) else (
    :: Fallback: open two separate cmd windows
    start "KS Backend" cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat (.venv\Scripts\activate.bat) else echo [WARN] No .venv found, using system Python) && echo Starting FastAPI backend... && python run.py"
    start "KS Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Next.js frontend... && npm run dev"
)

echo Both terminals launched.
```

---

## PART K: DATABASE STARTUP VERIFICATION REQUIREMENT

On backend startup, before accepting any requests:

1. **Attempt MongoDB connection** with `MONGODB_URI`
2. **Ping the server**: `await client.admin.command("ping")`
3. **If ping succeeds**: log `INFO db.connected | database=ks_company_portal host=<host>`
4. **If ping fails**: log `CRITICAL db.connection_failed | database=ks_company_portal reason=<error>` and call `sys.exit(1)` — do not start accepting traffic
5. **Check/create database**: MongoDB creates `ks_company_portal` automatically on first insert. The startup check **does NOT need to pre-create the DB**, but it verifies access by listing collections: `await db.list_collection_names()`
6. **Create indexes**: All indexes defined in Part D are created with `create_index(... background=True)` during startup. If they already exist, MongoDB ignores the call silently.
7. **Log index creation**: `INFO db.indexes_ready | collections=purchases,payments,audit_logs`
8. **Verify pricing config**: Call `get_plan_amount("khushi_delivery", "non_commission")` and `get_plan_amount("khushi_erp", "base_free")` — if either raises, log `CRITICAL config.pricing_invalid` and exit.
9. **Mock mode check**: If `ENVIRONMENT=production` AND `ASSANPAY_MOCK=true`, log `CRITICAL config.mock_in_production` and exit.

**Full startup log sequence (healthy):**
```
INFO  startup.begin              | environment=development version=1.0.0
INFO  db.connecting              | database=ks_company_portal host=localhost:27017
INFO  db.connected               | database=ks_company_portal host=localhost:27017
INFO  db.transactions_verified   | mode=replica_set
INFO  db.indexes_ready           | collections=purchases,payments,audit_logs
INFO  config.pricing_ok          | products=khushi_delivery,khushi_erp
INFO  config.mock_mode           | assanpay_mock=true environment=development
INFO  startup.complete           | host=0.0.0.0 port=8000 docs=/docs
```

**Failure log (DB unreachable):**
```
INFO  startup.begin        | environment=development version=1.0.0
INFO  db.connecting        | database=ks_company_portal host=localhost:27017
CRITICAL db.connection_failed | database=ks_company_portal host=localhost:27017 reason=ServerSelectionTimeoutError
[Process exits with code 1]
```

---

## PART L: OPEN QUESTIONS REQUIRING ANSWER BEFORE CODING

> [!IMPORTANT]
> Only 4 remain. All others are resolved in this document.

1. **AssanPay authentication format**: When credentials arrive, check which header carries the API Key + Branch Code. If the Shopify plugin source is available on GitHub, the HTTP adapter code will show the exact headers.

2. **Return URL page**: After AssanPay payment, customer lands at `{SITE_URL}/payment-status?purchase_id=...`. Confirm this is acceptable. Alternative: return to product page with `?paid=true#purchase` hash.

3. **ERP free plan action**: When Khushi ERP (free) registration is submitted — (a) auto-confirm immediately + send admin notification, OR (b) route to the existing contact inquiry form instead?

4. **Netlify dashboard access**: Confirm access to change base directory from `khushi-solutions` to `frontend` after rename.

> [!NOTE]
> Questions 5-10 from v2.0 are now resolved by architectural decisions in this document and do not require your input.

---

## SUMMARY: THIS REVIEW IS COMPLETE

Awaiting your approval on:
1. The final state machines (Part B, C)
2. The final database schema (Part D)
3. The final API contract (Part F)
4. The start.bat specification (Part J)
5. The startup verification behavior (Part K)
6. Answers to the 4 remaining questions (Part L)

**Upon your approval, implementation begins immediately in this order:**
1. Rename `khushi-solutions/` → `frontend/` (you update Netlify simultaneously)
2. Create `backend/` skeleton
3. Backend foundation (FastAPI, Motor, logging, CORS, startup checks)
4. Pricing config + purchase endpoints
5. AssanPay adapter (mock mode)
6. Payment endpoints + state machine
7. File upload (GridFS)
8. Frontend purchase section (6 components)
9. Payment status page
10. Notifications
11. Tests
12. `start.bat`
