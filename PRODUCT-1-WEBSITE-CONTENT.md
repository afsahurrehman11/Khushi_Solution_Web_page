# PRODUCT-1: BITES — COMPLETE WEBSITE-READY CONTENT DOCUMENT
## For use by the Khushi Solutions Website-Building Agent
### Compiled from full codebase audit — Do NOT modify without re-auditing the codebase

---

## 0. CRITICAL NOTES FOR THE WEBSITE AGENT

- **DO NOT invent features.** Every claim in this document is verified from actual source code.
- **Payment is CASH ONLY** — no online payment gateway exists yet.
- **No pop-up forms** — design choices reflect inline screen-by-screen editing (no floating modals for data entry).
- All monetary values are in **Pakistani Rupees (Rs. / PKR)**.
- The product name is **"Bites"** — a delivery platform system by **Khushi Solutions**.
- The system serves **multiple store categories** (not just food), making it a general-purpose last-mile delivery OS.
- **App Name** used internally: "Khushi Delivery" (push notification title); branded to customers as "Bites."
- **Screenshots needed:** See Section 9 for full screenshot capture instructions.

---

## 1. PRODUCT OVERVIEW

### Product Name
**Bites** — A Multi-Store Delivery & Business Management Platform

### Tagline Options (verified against app copy)
- *"Order from the best local business with easy, on-demand delivery at your doorstep."* ← **exact splash screen subtitle**
- "Lightning Fast. Smartly Managed."
- "One Platform. Every Local Business."

### What It Is
Bites is a **full-stack, multi-role on-demand delivery and operations management platform** developed by Khushi Solutions. It connects customers with local businesses — from restaurants to grocery stores to stationery shops — and manages the complete lifecycle from browsing to delivery, with a powerful admin control center and a dedicated rider workforce management system.

### Who It's For
| Role | Description |
|------|-------------|
| **Customers** | Browse stores, place orders, track deliveries in real time |
| **Riders / Delivery Agents** | Receive and fulfill delivery assignments via mobile app |
| **Restaurant/Vendor Admins** | Manage their own menu, orders, payments, and store info |
| **Super Admin (Khushi Solutions)** | Full platform control — stores, riders, delivery settings, financials, user management |
| **Sub-Admins** | Staff accounts with granular, module-level permission controls |

### Business Context
Built for local businesses in Pakistan (Lahore and beyond), Bites allows a single operator (Khushi Solutions) to run a multi-merchant last-mile delivery network — analogous to a white-label version of Foodpanda or Careem but tailored for local-scale operations, with full ownership of the software.

---

## 2. PLATFORM & TECHNOLOGY STACK

| Layer | Technology |
|-------|-----------|
| **Backend API** | Python · FastAPI (async, production-grade) |
| **Database** | MongoDB (NoSQL, cloud-hosted via MongoDB Atlas — local DB is blocked by code) |
| **Image Storage** | Binary BLOB storage inside MongoDB (no S3/CDN — images served via API endpoints) |
| **Frontend** | React Native (Expo) — runs as **native mobile app AND web app** from the same codebase |
| **Authentication** | JWT (JSON Web Tokens) · HS256 algorithm · 24-hour session expiry · session versioning for forced logout |
| **Push Notifications** | Expo Push Notification Service (ExponentPushToken) via `exponent-server-sdk` |
| **Geocoding** | OpenStreetMap Nominatim API (backend-proxied, throttled, with in-memory cache) |
| **Road Distance** | OSRM (Open Source Routing Machine) — `router.project-osrm.org` · Haversine fallback |
| **PDF Generation** | Custom Python PDF generator (`global_pdf_generator.py`) |
| **Deployment (Frontend)** | Vercel (CORS explicitly configured for Vercel and localhost) |
| **Background Tasks** | Python `asyncio.create_task` (auto-preparing order queue runs at app startup) |

### Architecture Style
- **Decoupled**: FastAPI backend + React Native frontend, communicating via REST API
- **Role-Based Access Control (RBAC)**: Super Admin → Sub-Admin → Restaurant Admin → Rider → Customer
- **Multi-Store Architecture**: All business logic anchored by `restaurant_id` (used for restaurants, grocery, and stationery equally)

---

## 3. USER ROLES (IN DETAIL)

### 3.1 Customer
- Anonymous browsing (no login required to view stores/menus)
- Optional registration (sign-up via `CustomerAuthScreen` — name, phone, address, city)
- Login persisted via AsyncStorage (JWT token stored on device)
- Saved address profile — auto-filled at checkout
- Order history viewable in `CustomerOrdersScreen`
- Can rate a rider (1–5 stars + optional complaint text) after delivery

### 3.2 Rider
- Logs in via phone + password (separate login, same `LoginScreen` but different role routing)
- App routes them to `RiderDashboardScreen` on login
- Sees their assigned orders only (filtered by their `restaurant_id` — i.e., their home store)
- Can update order status at each delivery milestone:
  - Confirmed → Preparing → Ready for Pickup → Rider Left → Rider Near You → Delivered
- Shares real-time GPS location to backend (`updateRiderLocation` API call)
- Can change their own password via `RiderOrderDetailScreen`
- Can call the customer directly from the app (via `tel:` link)
- Shift management: `active` / `not_active` shift status

### 3.3 Restaurant / Vendor Admin
- Dedicated `VendorDashboardScreen` for their assigned restaurant only
- Can manage:
  - Store profile (name, address, phone, hours)
  - Full menu (add, edit, delete, toggle active/inactive items per category)
  - Deal items (bundled menu items)
  - View their own orders and live stats (today's orders, pending, completed, earnings, wallet balance, platform fee)
- Cannot access other restaurants, global settings, or financial controls
- Gets push notifications for new orders (if Expo push token registered)
- Can see their own payment and commission summaries

### 3.4 Sub-Admin
- Created by Super Admin with specific module permissions
- Permissions are **granular** (per-module, per-action):
  - Modules: `restaurants`, `orders`, `riders`, `payments`, `commissions`, `delivery_charges`, `location`, `categorical_radius`, `delivery_settings`, `popup_settings`
  - Order actions: `access`, `assign_rider`, `cancel_order`, `update_status`, `print_invoice`
- Cannot access User Management (anti-privilege-escalation enforced in backend)
- Can update their own profile (name, phone, email, address, profile picture)
- Sessions invalidated immediately on status change to `inactive` or forced logout
- Activity audit log tracked (device type, IP, module, action, timestamp)

### 3.5 Super Admin
- Full unrestricted access to all modules
- Exclusively can:
  - Set menu item discounts
  - Generate global invoices (PDF, filterable by day/week/month/custom date range)
  - Create, update, deactivate, and soft-delete sub-admin accounts
  - Force logout users from all devices
  - Reset sub-admin passwords (auto-generated in format `Khushi@XXXX`)
  - Configure the promotional popup (enable/disable, delay, duration, custom image)
  - Set admin service center location and delivery service radius
  - Configure per-store-category delivery radius overrides

---

## 4. FEATURE SET (EXHAUSTIVE)

### 4.1 Customer-Facing Features

#### Home & Discovery
- **Multi-Category Home Screen**: 13 store categories displayed as image cards with icons:
  Restaurants · Stationery · Grocery · Pharmacy · Courier · Pet Supplies · Cosmetics · Electronics · Home Needs · Laundry · Bakery · Fashion · Other Services
- **Location Header**: Customer's saved delivery address shown at top of home screen
- **Promotional Popup Overlay**: Admin-configured marketing popup (with custom image, delay, and display duration) shown on app entry
- **Splash Screen**: Animated hero screen with feature highlights and stat counters (500+ Local Business, 50K+ Happy Customers, 15min Avg Delivery, 4.9 App Rating) — plus a splash video on mobile

#### Store Browsing (`RestaurantListScreen`)
- Filter stores by category (`store_type`)
- Each store card shows: name, address, opening/closing hours, open/closed badge, distance (in km — road distance via OSRM or fallback to Haversine), store image
- Real-time open/closed detection (compares current time to store hours, midnight-crossing supported)
- Responsive grid layout: 1–5 columns depending on screen width (mobile to 4K web)
- Search stores by name (client-side filter in list)
- Distance shown from customer's current location

#### Menu Browsing (`MenuScreen`)
- Browse full menu organized by categories (tabs/filter)
- Filter by category and by Deal items
- Each menu item card: image (with placeholder if no image), item name, original price, discounted price (crossed out original + sale badge if discounted), "Add to Cart" button with animated spring press effect
- Deals section: bundled item display
- Open/Closed store status enforced — cart blocked if store is closed

#### Cart & Checkout (`CartScreen`)
- Full cart management: add, remove, update quantity
- Purchase limit enforcement (daily/monthly per-item caps — checked client-side at add and server-side at order placement)
- Delivery charge calculation in real-time (based on customer's pinned location vs. restaurant location via OSRM)
- Supports:
  - **DELIVERY** order type (address + location required)
  - **TAKE AWAY** order type (no delivery charge)
- Address entry: text field + interactive map picker (`InteractiveLocationMap` component using GPS)
- Backend geocoding proxy for address autocomplete (Nominatim via backend to avoid CORS/429)
- Service charge shown separately
- Order total breakdown: Subtotal + Delivery Charge + Service Charge = Total
- Cash-only payment mode displayed at checkout

#### Order Tracking (`OrderStatusScreen`)
- Animated step-by-step status timeline (Confirmed → Preparing → Ready → Rider Left → Near You → Delivered)
- Each milestone shows timestamp and animated checkmark
- Live rider location on embedded map (`RiderTrackingMap` component)
- Auto-polling while order is active (isFocused-based refresh)
- Rating modal appears after delivery (1–5 stars + complaint text)
- Order cleared from active state after delivery confirmed

#### Order History (`CustomerOrdersScreen`)
- Full history of past orders for logged-in customers
- Filter by status (all, active, delivered, cancelled)

### 4.2 Rider-Facing Features

- **Rider Dashboard** (`RiderDashboardScreen`):
  - List of all assigned orders with status badges
  - Customer name, phone (clickable to call), address, GPS coordinates
  - Order total and item count
  - Tap order to open detail view

- **Order Detail** (`RiderOrderDetailScreen`):
  - Full order breakdown (items, quantities, total)
  - Status update buttons (Preparing → Ready → Rider Left → Near You → Delivered)
  - Customer contact and address
  - Live GPS location sharing to backend

- **Rider Lifecycle**:
  - Login/logout with shift activation
  - Real-time location broadcasting

### 4.3 Admin (Super Admin + Sub-Admin) Features

#### Dashboard (`AdminDashboardScreen`)
- Platform-wide stats: total restaurants, grocery stores, stationery stores, total riders, total users
- Store-type-specific views (switch between Restaurant / Grocery / Stationary)
- Business quick-access cards (navigate to Restaurants, Orders, Riders, Payments, Commissions)
- Delivery assignment mode toggle (AUTO / MANUAL) directly from dashboard
- Invoice download controls:
  - Day / Week / Month presets
  - Custom date range picker
  - PDF download via signed URL

#### Restaurant / Store Management (`AdminRestaurantsScreen` + `AdminRestaurantDetailScreen`)
- List all stores with search, filter by type
- Create new store (name, address, phone, opening/closing times, GPS location, commission rate, delivery charge, store type, city)
- Edit store details
- Upload/view store image (stored as BLOB in MongoDB)
- View auto-generated QR Code for the store (base64 encoded, embedded in response)
- **Restaurant Admin Account**: Each store gets a dedicated sub-admin username (format: `restadmin_<storename>`) and auto-generated password, managed from this screen
- Menu management per store (full CRUD for menu items from within restaurant detail screen)
- CSV bulk import for menu items (Super Admin only — validates name, price, category, deal_items, is_active)
- Per-store financial summary (today's revenue, pending orders, commission due)
- Toggle menu items active/inactive (hide from customer without deletion)
- Discount setting (Super Admin only) — percentage off shown on customer menu screen

#### Order Management (`AdminOrdersScreen`)
- Full order list with real-time polling
- Filter by: status, store, date range
- Order status progression control (Admin can advance any order status)
- Manual rider assignment (from list of online/active riders for that store)
- Rider assignment modal shows: online riders highlighted, offline count noted
- Print order slip (printHelper utility)
- Create manual order (Admin-initiated order on behalf of customer)
- Delete order
- Cancel order
- Delivery settings preview (current charges shown inline)

#### Rider Management (`AdminRidersScreen`)
- List all riders (active and suspended)
- Create new rider (name, email, phone, CNIC, bike number, bike registration, assigned store, shift, password, profile image, store type)
- Edit rider profile
- View rider ratings and complaints
- Toggle account status (active / suspended)
- View rider's GPS coordinates (lat/lng shown in rider card)
- Rider login status displayed (is_logged_in badge)

#### Payment Management (`AdminPaymentsScreen`)
- View all payment records across the platform
- Per-restaurant payment summaries (`AdminRestaurantPaymentsScreen`)
- Record/verify cash payments
- Commission tracking

#### Commission Management (`AdminCommissionsScreen`)
- View commission owed per store (based on `commission_rate` set per restaurant)
- Per-restaurant commission detail (`AdminRestaurantCommissionsScreen`)

#### Delivery Settings (`AdminDeliverySettingsScreen`)
- Configure global delivery charge rules:
  - `free_delivery_radius_km`: Flat-rate delivery radius
  - `fixed_delivery_charge`: Flat charge within that radius (default: Rs. 230)
  - `per_km_charge`: Additional charge per km beyond the radius (default: Rs. 50/km)
  - `service_charge`: Platform service charge applied to all orders
  - `deliveryAssignmentMode`: AUTO or MANUAL rider assignment

#### Location & Radius Settings (`AdminLocationSettingsScreen`)
- Set admin service center coordinates (lat/lng) via:
  - Text field geocoding (Nominatim-powered)
  - Interactive map pin drag
  - Structured address entry (House No., Street No., Area, City, District) — auto-geocodes as you type
- Set maximum service delivery radius (slider, 1–50 km)
- Last updated timestamp displayed

#### Categorical Radius Overrides (`AdminCategoryRadiusScreen`)
- Per-store-type radius overrides (e.g., grocery can have a different max delivery radius than restaurants)
- Applied on top of global location radius

#### Popup / Marketing Settings (`AdminPopupSettingsScreen`)
- Enable/disable the promotional popup shown to customers on app entry
- Set delay before popup appears (in seconds)
- Set how long the popup is displayed (duration in seconds)
- Upload custom popup image (JPEG/PNG/WEBP stored as BLOB in MongoDB)
- Preview current popup image

#### User Management / Team (`AdminUsersScreen`) — Super Admin Only
- Create sub-admin users (full_name, username, phone, email, CNIC, address, job_title, optional profile picture)
- Assign module-level permissions per sub-admin
- Auto-generate secure passwords (format: `Khushi@XXXX`)
- Edit sub-admin details, permissions, and status
- Soft-delete accounts (marks `is_deleted=True`, `status=inactive`, invalidates sessions)
- Force logout from all devices (session version increment)
- Password reset (auto-generated or manual)
- View full audit log per user (action, module, device, IP, timestamp)

#### Admin Profile (`AdminProfileScreen`)
- View own profile (username, full name, role, email, phone, address, profile picture)
- Update own contact details and profile picture
- Platform-wide stats shown (total restaurants, grocery stores, stationery stores, riders, users)

#### Global Invoice (Super Admin Only)
- PDF invoice covering all restaurants / all orders in a period
- Includes: total amount, delivery charges, commissions, per-rider stats (total orders + total amount)
- Period filter: day, week, month, or custom date range (YYYY-MM-DD)
- Accessible via signed token URL (direct browser link — no UI form)

#### Vendor Dashboard (`VendorDashboardScreen`)
- Simplified dashboard for Restaurant Admins
- Stats: today's orders, pending orders, completed orders, earnings, wallet balance, cancelled orders, platform fee
- Menu management (add/edit/delete items with images, categories, deals, pricing)
- Deal builder (bundle existing menu items into a "deal" product)
- View own orders only
- Paginated menu loading (`skip`/`limit`)

---

## 5. KEY CAPABILITIES — COMPACT CARD FORMAT

These 10 capability cards are ready to drop into a website "Features" section:

| # | Capability | Icon | One-Liner |
|---|-----------|------|-----------|
| 1 | **Multi-Store Platform** | 🏪 | Manages restaurants, grocery, stationery, pharmacy, courier & 8 more store categories in one system |
| 2 | **Real-Time Order Tracking** | 📍 | Animated delivery pipeline — customers watch each milestone live with rider location on map |
| 3 | **Smart Delivery Pricing** | 🧮 | Distance-based delivery charges using real road routing (OSRM) with configurable flat rates + per-km overages |
| 4 | **Rider Management** | 🏍️ | End-to-end rider workforce: shift tracking, GPS broadcasting, order assignment, ratings, complaint logging |
| 5 | **Granular Permission System** | 🔐 | Super Admin creates sub-admins with per-module, per-action access — no privilege escalation possible |
| 6 | **Vendor Self-Service** | 🧑‍🍳 | Restaurant admins manage their own menu, deals, and orders from a dedicated vendor dashboard |
| 7 | **Location-Aware Radius Control** | 🎯 | Admin pins the service center on an interactive map and sets per-category delivery radius overrides |
| 8 | **Bulk Menu Import** | 📤 | Upload a CSV to instantly populate hundreds of menu items across a store |
| 9 | **Financial Reporting** | 💰 | PDF global invoices with per-rider summaries, commission tracking, and custom date range filtering |
| 10 | **Marketing Popup System** | 📢 | Admin-controlled promotional overlay: custom image, configurable delay + duration, enabled per app launch |

---

## 6. MAJOR USER WORKFLOWS

### 6.1 Customer Ordering Flow
```
App Launch → Splash Screen (animated + promotional popup)
→ Choose Service (Home Screen — 13 categories)
→ Browse Stores (filtered by store type, sorted by distance)
→ Select Store → Browse Menu (filtered by category/deals)
→ Add Items to Cart (purchase limits enforced)
→ Cart Review (address picker, delivery charge calculated live)
→ Enter Name + Phone + Address + Pin Location on Map
→ Place Order (cash) → Order Created (custom ID: YYXXXX)
→ Order Status Screen (live timeline + rider map)
→ Delivered → Rate Rider (stars + optional complaint)
```

### 6.2 Admin Order Fulfillment Flow
```
New Order Placed by Customer
→ [AUTO mode] Order auto-confirmed immediately
   OR [MANUAL mode] Admin sees "unconfirmed" order → manually confirms
→ Admin/Vendor Admin sees order in AdminOrdersScreen
→ Admin assigns rider (or rider auto-assigned in AUTO mode — queue processed)
→ Vendor Admin updates status: Preparing → Ready for Pickup
→ Rider accepts, updates: Rider Left → Rider Near You → Delivered
→ Order marked delivered → payment recorded → commission calculated
```

### 6.3 New Store Onboarding Flow (Admin)
```
Super Admin → AdminRestaurants → Create Store
→ Enter: name, address, phone, hours, GPS location, commission %, store type, city
→ System generates: KD-ID, restaurant admin username (restadmin_<name>), auto-password, QR code
→ Upload store banner image (optional)
→ Navigate to Restaurant Detail → Add Menu Items (or bulk CSV import)
→ Set item categories, prices, deal bundles, purchase limits, images
→ Store is live and discoverable by customers immediately
```

### 6.4 Rider Onboarding Flow (Admin)
```
Super Admin → AdminRiders → Create Rider
→ Enter: name, email, phone, CNIC, bike number, registration, assigned restaurant, shift, profile image, password, store type
→ Rider credentials created
→ Rider logs in via RiderDashboard
→ Activates shift → appears as "online" in rider picker when admin assigns orders
```

### 6.5 Sub-Admin Creation Flow (Super Admin)
```
Super Admin → Users → Create User
→ Enter: full name, username, phone, email, CNIC, address, job title, optional password (auto-generated if blank)
→ Assign permissions per module (e.g., can access Orders but not Payments)
→ Optional profile photo upload
→ Sub-admin logs in → sees only permitted modules
→ All actions logged with IP, device type, timestamp
```

---

## 7. SYSTEM ARCHITECTURE & END-TO-END WORKFLOW

> This section provides the technical flow diagram description for the website design agent to convert into a visual system architecture diagram.

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    BITES PLATFORM                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │  Customer   │  │   Rider     │  │  Admin (All Roles) │  │
│  │  Mobile/Web │  │  Mobile App │  │  Mobile/Web App   │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────┬─────────┘  │
│         │                │                   │             │
│         └────────────────┴──────────────┬────┘             │
│                                         │                  │
│              React Native (Expo) App    │                  │
│              (Single Codebase)          │                  │
│                                         │                  │
│  ─────────────────────────────────────────────────────     │
│                 REST API (HTTPS)                           │
│  ─────────────────────────────────────────────────────     │
│                                         │                  │
│              FastAPI Backend (Python)   │                  │
│              ┌──────────────────────────┘                  │
│              │                                             │
│  ┌───────────┴────────────────────────────────────┐       │
│  │             API Router Layer                   │       │
│  │  /auth  /restaurants  /menu  /orders           │       │
│  │  /riders  /payments  /dashboard  /admin        │       │
│  │  /admin/users  /public                         │       │
│  └───────────┬────────────────────────────────────┘       │
│              │                                             │
│  ┌───────────┴────────────────────────────────────┐       │
│  │             Service Layer                      │       │
│  │  order_service · restaurant_service            │       │
│  │  rider_service · delivery_service              │       │
│  │  menu_service · payment_service                │       │
│  │  location_service · routing_service            │       │
│  └───────────┬────────────────────────────────────┘       │
│              │                                             │
│  ┌───────────┴───────────────────────────────────┐        │
│  │             MongoDB Atlas                     │        │
│  │  Collections:                                 │        │
│  │  restaurants · menu_items · orders · riders   │        │
│  │  admins · users · payments · activity_logs    │        │
│  │  delivery_settings · counters                 │        │
│  └───────────────────────────────────────────────┘        │
│                                                             │
│  External Services:                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐  │
│  │ Nominatim    │ │ OSRM         │ │ Expo Push         │  │
│  │ (Geocoding)  │ │ (Road Dist.) │ │ Notifications     │  │
│  └──────────────┘ └──────────────┘ └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Complete End-to-End Order Flow (Technical)

```
1. CUSTOMER PLACES ORDER
   ├── CartScreen calls GET /delivery-settings (public) → gets charge config
   ├── CartScreen calls GET /admin/location → gets service center + radius
   ├── CartScreen calls GET /admin/delivery-settings/category-radii → per-type limits
   ├── Customer enters address → CartScreen calls GET /admin/geocode?address=... (admin-proxied Nominatim)
   ├── Customer picks location on InteractiveLocationMap → lat/lng captured
   ├── CartScreen calls GET /orders/road-distance (OSRM via backend) → delivery_charge calculated
   └── CartScreen calls POST /orders → creates order

2. ORDER CREATION (backend: order_service.create_order)
   ├── If customer_location missing → backend geocodes address via Nominatim fallback
   ├── Upsert customer record in `users` collection
   ├── Validate purchase limits (daily/monthly per item via `orders` collection query)
   ├── Calculate subtotal (sum of item.price × item.quantity)
   ├── Fetch restaurant location → calculate_delivery_charge() → OSRM or Haversine
   ├── Check distance ≤ max_delivery_radius (per category) → reject if out of range
   ├── Get service_charge from delivery_settings
   ├── Generate custom order ID (format: YYNNNN — year + 4-digit sequence from counters collection)
   ├── Create order document with status: {confirmed: AUTO_MODE, preparing: false, ...}
   ├── Insert into `orders` collection
   ├── Send push notification to Vendor Admin (Expo Push SDK)
   └── If AUTO mode → trigger process_delivery_queue_for_restaurant()

3. RIDER ASSIGNMENT (AUTO mode)
   ├── startup_check_auto_preparing task runs at app boot via asyncio
   ├── Finds confirmed-but-unassigned orders
   ├── Gets riders with shift_status=active, is_logged_in=true, not suspended
   ├── Assigns least-loaded available rider
   └── Updates order.rider_id

4. RIDER DELIVERS ORDER
   ├── Rider opens RiderDashboard → sees assigned orders
   ├── Rider taps order → RiderOrderDetailScreen
   ├── Each status update → PATCH /orders/{id}/status → updates order.status + timestamps
   ├── Rider app calls PUT /riders/{id}/location every N seconds → updates lat/lng in `riders` collection
   └── Customer's OrderStatusScreen polls GET /orders/{id} every few seconds → sees live rider position on map

5. DELIVERY COMPLETE
   ├── Rider marks delivered → order.status.delivered = true
   ├── Customer sees "Delivered" in timeline
   ├── Rating modal appears → POST /orders/{id}/rate-rider → updates rider.rating_sum + total_ratings
   ├── Payment record created/updated in `payments` collection
   └── Commission calculated from restaurant.commission_rate
```

### Authentication Flow
```
POST /auth/login (username + password)
→ backend verifies hash → generates JWT (role, admin_type, sub, name, session_version)
→ token stored client-side (AsyncStorage on mobile)
→ All protected routes: Authorization: Bearer <token>
→ Backend validates token + checks session_version matches DB (forced logout works by incrementing DB version)
→ Role-based routing: super_admin → AdminDashboard, restaurant_admin → VendorDashboard, rider → RiderDashboard, customer → CustomerHome
```

### Image Storage Flow
```
Upload: Admin/Vendor picks image (Expo ImagePicker or web file input)
→ Image bytes read (or base64 decoded)
→ optimize_image() reduces size
→ Binary stored directly in MongoDB document as BSON Binary field

Serve: Any client requests GET /menu/{item_id}/image or GET /restaurants/{id}/image
→ Backend reads Binary from MongoDB → detects MIME type from magic bytes (PNG/JPEG/WEBP)
→ Returns raw bytes with Cache-Control: public, max-age=86400
```

---

## 8. DATABASE COLLECTIONS REFERENCE

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| `restaurants` | All stores (all types) | name, address, store_type, location{lat,lng}, commission_rate, qr_code, has_image, opening_time, closing_time, kd_id |
| `menu_items` | All menu items across all stores | restaurant_id, name, price, discount_percentage, category, is_deal, deal_items, is_active, purchase_limit_enabled, purchase_limit_type, maximum_allowed_quantity, image (Binary) |
| `orders` | All customer orders | id (custom YYNNNN), restaurant_id, user_id, items[], subtotal, delivery_charge, service_charge, total_amount, status{confirmed/preparing/etc.}, timestamps{}, rider_id, customer_name, customer_phone, customer_address, customer_location{lat,lng}, order_type, distance_km |
| `riders` | All delivery riders | name, email, phone, cnic, bike_number, restaurant_id, shift, shift_status, is_logged_in, latitude, longitude, assigned_orders[], rating_sum, total_ratings, complaints[], account_status |
| `admins` | Super admins + sub-admins + restaurant admins | username, password (hashed), role, admin_type, restaurant_id, permissions{}, session_version, status, is_deleted, expo_push_token, profile_picture (Binary) |
| `users` | Customer records | name, phone, address, city, created_at |
| `payments` | Payment records | restaurant_id, order amounts, commission |
| `delivery_settings` | Global delivery charge config | free_delivery_radius_km, fixed_delivery_charge, per_km_charge, service_charge, deliveryAssignmentMode |
| `activity_logs` | Sub-admin audit trail | user_id, username, role, action, module, description, device, ip_address, timestamp |
| `counters` | Order ID sequence | _id: "order_year_YY", sequence: N |

### Future-Ready Fields (exist in schema, not yet activated)
- `rider_rating` / `rider_complaint` on orders → rider rating system exists
- `expo_push_token` on admins → push notification infrastructure ready
- Schema supports: promo codes, online payments, ratings & reviews (mentioned in dev plan)

---

## 9. SCREENSHOT CAPTURE GUIDE

### For the website agent — these are the screens to capture (use the live deployed app or simulator):

| # | Screen | Path / Navigation | What to Show |
|---|--------|-------------------|--------------|
| 1 | Splash / Landing | App launch | Hero, feature cards, stats bar, CTA buttons |
| 2 | Customer Home | After browse | 13-category grid with images |
| 3 | Restaurant List | Home → Restaurants | Store cards with distance, open/closed status |
| 4 | Menu Screen | Tap any restaurant | Category tabs, item cards with images and prices |
| 5 | Cart Screen | Add items → Cart | Items list, address field, map, delivery charge breakdown |
| 6 | Order Status | After placing order | Animated status timeline, rider map |
| 7 | Admin Dashboard | Admin login | Stats cards, navigation sidebar, invoice controls |
| 8 | Admin Orders | Dashboard → Orders | Order list with status filters, rider assignment modal |
| 9 | Admin Restaurants | Dashboard → Restaurants | Store list + create form |
| 10 | Restaurant Detail | Tap store in admin list | Menu management, stats, bulk import |
| 11 | Rider Dashboard | Rider login | Order assignment list with customer info |
| 12 | Admin Location Settings | Admin → Location | Map with service center pin and radius circle |
| 13 | Admin Users | Admin → Users | Sub-admin list, permission matrix |
| 14 | Vendor Dashboard | Vendor admin login | Store stats, menu editor |
| 15 | Popup Settings | Admin → Popup | Image upload, toggle, timing settings |

---

## 10. WEBSITE COPY — VERIFIED FEATURE DEEP DIVES (Best 6–10 for Visual Sections)

### Feature 1: Real-Time Order Tracking
**Headline:** *Watch Your Order Move — Live*
**Body:** From the moment your order is placed, Bites keeps you in the loop. A live step-by-step timeline shows every milestone — Confirmed, Preparing, Ready, Rider Left, Near You, Delivered — each with the exact timestamp. An embedded map shows your rider's real-time position as they approach. When delivered, rate your experience in seconds.
**Visual:** OrderStatusScreen showing animated timeline + map

### Feature 2: Distance-Intelligent Delivery Pricing
**Headline:** *Fair Charges, Calculated to the Meter*
**Body:** Bites uses real road routing — not straight-line guesses — to calculate your delivery fee. A flat rate applies within the delivery zone, with a per-kilometer charge beyond. Customers see the exact delivery charge before placing their order. Admins configure the radius, flat fee, and per-km rate from a central settings panel.
**Visual:** Cart screen showing delivery charge breakdown | Admin DeliverySettings screen

### Feature 3: 13 Store Categories in One App
**Headline:** *Every Local Business, One Doorstep*
**Body:** Restaurants, grocery stores, stationery shops, pharmacies, laundry services, pet supplies, cosmetics, electronics, fashion, bakeries, courier services, home needs, and more — all on one platform. Customers discover businesses by category, browse listings by distance, and order through one consistent experience.
**Visual:** CustomerHome category grid

### Feature 4: Granular Admin Permissions
**Headline:** *Your Team, Your Rules*
**Body:** The Super Admin can create staff accounts with surgical-precision access control. An order manager can see orders and assign riders but cannot view financials. A restaurant supervisor can manage only their store's menu. Permissions are set per module and per action — and every activity is logged with IP address, device type, and timestamp.
**Visual:** AdminUsersScreen with permission checkboxes

### Feature 5: Vendor Self-Service Dashboard
**Headline:** *Empower Every Business Owner*
**Body:** Each partner business gets its own dedicated vendor dashboard. Restaurant admins can update their store profile, add menu items with photos, create deal bundles, toggle items active/inactive in real time, and monitor today's orders and earnings — all without involving the platform operator.
**Visual:** VendorDashboardScreen with menu editor

### Feature 6: Interactive Location & Radius Management
**Headline:** *Control Your Delivery Zone with Precision*
**Body:** Admins set their service center by typing an address (auto-geocoded live as you type) or by dragging a pin on an interactive map. A radius slider defines the maximum delivery area — and different radii can be set for different store categories. The system enforces these limits at order placement.
**Visual:** AdminLocationSettingsScreen with map + radius slider

### Feature 7: Bulk Menu Management
**Headline:** *A Full Menu in Minutes*
**Body:** Adding hundreds of menu items one by one is a thing of the past. Bites supports CSV bulk import — prepare a spreadsheet with item names, prices, categories, and deal flags, upload it, and your menu is live instantly. Errors are reported row-by-row so nothing slips through.
**Visual:** Admin restaurant detail with bulk import section

### Feature 8: Smart Rider Assignment
**Headline:** *Orders Reach the Right Rider, Automatically*
**Body:** Bites supports both AUTO and MANUAL rider assignment. In AUTO mode, an intelligent background service continuously scans for confirmed orders and assigns the least-burdened available rider — based on shift status, online status, and workload. In MANUAL mode, admins pick from a live list of online riders, instantly seeing who is active and who is offline.
**Visual:** AdminOrders RiderPickerModal showing online/offline riders

---

## 11. PRODUCT POSITIONING STATEMENT

**For Khushi Solutions website — About Bites section:**

> Bites is a complete last-mile delivery operating system built and owned by Khushi Solutions. Unlike off-the-shelf solutions, Bites was engineered from the ground up for the realities of local Pakistani markets — cash-first transactions, geo-aware delivery pricing, and a multi-merchant architecture that lets any local business onboard in minutes. From food to pharmaceuticals, stationery to fashion, Bites manages the entire delivery lifecycle: customer discovery, order placement, rider dispatch, real-time tracking, financial reporting, and team management — in one unified platform.

---

## 12. KEY DIFFERENTIATORS (For Website "Why Choose Us" Section)

| Differentiator | Evidence from Code |
|---------------|-------------------|
| **Full Ownership** | 100% custom codebase, no licensing fees, no vendor lock-in |
| **Multi-Category** | 13+ store types in a single platform — not just food |
| **Road-Accurate Pricing** | OSRM real road routing, not approximations |
| **Security-First Auth** | Session versioning for forced logout, per-action permission matrix, audit logs |
| **Future-Ready Schema** | Database fields for ratings, promo codes, online payments — ready to activate |
| **Cross-Platform** | Same codebase runs on Android, iOS, and Web (React Native + Expo) |
| **Built for Pakistan** | PKR pricing, Lahore-seeded, local business workflows, cash-only ready |
| **Offline-Resilient Images** | BLOB storage in MongoDB — no dependency on CDN or third-party image hosts |

---

*End of PRODUCT-1 Website Content Document*
*Compiled by Khushi Solutions Audit Agent — verified against live codebase*
*Do not publish without review by Khushi Solutions*
