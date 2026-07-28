# Khushi Solutions — Executive Platform & Media Asset Documentation

Khushi Solutions is a modern Next.js web application showcasing production-grade software platforms:
1. **Bites** — Multi-Store Delivery & Operations Management Platform
2. **Khushi SMS / ERP** — AI-Powered School ERP & Mobile Application Ecosystem

---

## 🚀 Getting Started

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 📁 Master Folder & Media Asset Architecture

All media assets (images, screenshots, videos, and icons) are managed inside the `public/` directory so they are fully portable and hostable across static hosts like Hostinger, Netlify, Vercel, or AWS S3.

Detailed asset placement rules, file naming conventions, aspect ratio requirements, and future replacement instructions are documented in [`IMAGE-ASSETS-GUIDE.md`](./IMAGE-ASSETS-GUIDE.md).

```text
public/
├── images/
│   ├── company/                 # Company logo, favicon, og-image
│   ├── hero/                    # Homepage hero graphics & fallback banners
│   ├── products/
│   │   ├── product-1/           # PRODUCT 1: Bites
│   │   │   ├── carousel/        # Carousel slides (01, 02, 03...)
│   │   │   ├── desktop/         # Web dashboard screenshots
│   │   │   ├── mobile/          # Android mobile app screenshots
│   │   │   └── features/        # Feature-specific graphics
│   │   └── product-2/           # PRODUCT 2: Khushi SMS / ERP
│   │       ├── carousel/        # Carousel slides (01, 02, 03...)
│   │       ├── desktop/         # Accountant & Admin web screenshots
│   │       ├── mobile/          # Parent & Teacher mobile app screenshots
│   │       └── features/        # Feature-specific graphics
│   └── diagrams/                # Flowcharts & visual graph assets
└── videos/
    ├── product-1/               # Bites desktop & mobile demo videos (.mp4)
    └── product-2/               # Khushi SMS desktop & mobile demo videos (.mp4)
```

---

## 📸 Media Asset & Naming Rules Summary

### 1. File Naming Rules
* All media filenames must be **predictable**, **lowercase kebab-case**, and follow the pattern:
  `[product-id]-[section]-[type/number].[ext]`
* **Examples**:
  - `bites-hero-desktop.webp`
  - `bites-hero-mobile.webp`
  - `bites-carousel-01.webp`
  - `bites-feature-tracking.webp`
  - `khushi-erp-hero-desktop.webp`
  - `khushi-erp-hero-mobile.webp`
  - `khushi-erp-feature-attendance.webp`
  - `khushi-erp-demo-desktop.mp4` (or `khushi-erp-demo.mp4`)
* **Strict prohibition**: Vague filenames like `image1.png`, `final.png`, or `screenshot.png` are prohibited to prevent path confusion in code.

### 2. Image Carousels
* The carousel component supports dynamic scaling (from 1 to 8+ images) without layout distortion.
* Use zero-padded 2-digit indexing for carousel files (`bites-carousel-01.webp`, `bites-carousel-02.webp`, etc.).
* Recommended aspect ratio for carousel slides is `16:9` or `16:10`.

### 3. Video Assets
* Video files must be web-optimized H.264 MP4 (`.mp4`).
* Desktop video slots enforce `16:9` (`aspect-video`) rounded containers. Mobile videos enforce `9:16`.
* Videos are configured with `autoPlay`, `loop`, `muted`, `playsInline`, and `controls={false}` to guarantee browser autoplay compliance and native overlay controls.

### 4. Code Integration & Single Source of Truth
* All media paths are centralized in `src/data/products.ts`.
* The code reads public root-relative URLs (e.g., `'/videos/product-1/bites-demo.mp4'`).
* Adding or updating assets requires zero code layout modifications; simply drop the file in the designated folder with the exact documented filename.

---

## 🛠️ Step-by-Step Future Asset Workflow

When adding new production images or demo videos:

1. **Optimize Media**: Convert images to `.webp` format and compress videos to H.264 `.mp4`.
2. **Target Folder**: Place the file into the exact matching directory inside `public/images/products/product-1/` or `product-2/`.
3. **Exact Filename**: Name the asset according to the matrix in [`IMAGE-ASSETS-GUIDE.md`](./IMAGE-ASSETS-GUIDE.md).
4. **Register (if new slot)**: Add the path string to `src/data/products.ts` if adding new carousel or feature slots.
5. **Deploy**: Build or push to your static host (`npm run build`).

For full asset tables, aspect ratio guides, and resolution specs, consult [`IMAGE-ASSETS-GUIDE.md`](./IMAGE-ASSETS-GUIDE.md).

---

## 🌐 MANUAL NETLIFY DEPLOYMENT

This website is configured for **Static Export** (`output: 'export'`) and direct **manual upload to Netlify** without connecting GitHub.

### Step 1: Install Dependencies
Ensure all project dependencies are installed locally:
```bash
npm install
```

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env.local` (or `.env.production`):
   ```bash
   cp .env.example .env.local
   ```
2. Set your actual Web3Forms access key:
   ```env
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY="YOUR_ACTUAL_WEB3FORMS_ACCESS_KEY"
   ```
*(Note: Because Next.js static export bakes `NEXT_PUBLIC_*` environment variables into the HTML/JS output during build time, ensure this variable is set before running `npm run build`.)*

### Step 3: Run the Production Build
Generate the static export directory by running:
```bash
npm run build
```
Next.js will compile the project and generate a complete, self-contained **`out`** folder in the root directory.

### Step 4: Upload to Netlify
1. Log in to [Netlify App](https://app.netlify.com).
2. Go to **Sites** -> **Add new site** -> **Deploy manually**.
3. Drag and drop the **`out`** folder (or drag and drop all the **contents inside the `out` folder**).
4. Netlify will instantly deploy your website live.

### Step 5: Route Handling & Web3Forms Verification
- **Static Routes**: All routes (`/`, `/products/bites/`, `/products/khushi-erp/`) are pre-rendered into static HTML (`out/products/bites/index.html`). Direct browser refreshes will never cause a 404 error.
- **Web3Forms**: The contact form submits directly from the user's browser to `https://api.web3forms.com/submit`. No server or backend function is needed.

### Step 6: Connecting Custom Domain
1. In Netlify Site Settings, go to **Domain management** -> **Add custom domain**.
2. Enter your custom domain name (e.g. `khushisolutions.com`).
3. Update your domain DNS records (CNAME or A records) to point to Netlify as instructed by the Netlify dashboard.

### Step 7: How to Redeploy Future Code & Asset Changes
Whenever you update code or add new media files (`public/images/products/...`):
1. Place assets in the correct folder (refer to [`IMAGE-ASSETS-GUIDE.md`](./IMAGE-ASSETS-GUIDE.md)).
2. Run `npm run build`.
3. Go to Netlify -> Your Site -> **Deploys** -> Drag and drop the newly generated **`out`** folder to trigger an instant update.
