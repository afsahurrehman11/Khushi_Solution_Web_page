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

## 🌐 Hostinger Web App Deployment Guide

This project is 100% frontend-only, production-ready, and fully compatible with **Hostinger Web App Hosting** (Node.js/Next.js) or Static Hosting via GitHub integration.

### Environment Variable Setup on Hostinger
When deploying on Hostinger via GitHub or Node.js Web App deployment:

1. Navigate to your Hostinger Control Panel -> **Web Applications** / **Node.js Application**.
2. Go to **Environment Variables**.
3. Add your Web3Forms access key:
   - **Key**: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - **Value**: `YOUR_ACTUAL_WEB3FORMS_ACCESS_KEY`
4. Add any optional contact or social media overrides (`NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_EMAIL`, etc.).

### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (or standard Next.js build output)
- **Node.js Version**: 20.x or 22.x
- **Start Command**: `npm run start`

### GitHub Auto-Deployment
- Connect your GitHub repository to Hostinger.
- On `git push origin main`, Hostinger will automatically fetch, build, and deploy the updated application cleanly.
- All product routes (`/products/bites` and `/products/khushi-erp`) will function out-of-the-box with zero backend configuration required.

