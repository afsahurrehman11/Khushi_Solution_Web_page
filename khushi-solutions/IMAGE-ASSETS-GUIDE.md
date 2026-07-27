# Khushi Solutions — Master Image & Video Asset Guide

This guide defines the complete asset directory structure, file naming conventions, aspect ratios, target resolutions, and code integration rules for all future images and media files across the Khushi Solutions platform.

---

## 1. Directory Structure Overview

All media assets must be placed inside the `public/` folder so Next.js and static hosting providers (Hostinger, Netlify, Vercel, Cloudflare Pages) can serve them directly without local path dependencies.

```text
public/
├── images/
│   ├── company/                 # Brand logo, favicon, general company banners
│   ├── hero/                    # Main homepage hero visual assets & fallback banners
│   ├── products/
│   │   ├── product-1/           # PRODUCT 1: Bites (Delivery & Operations Management)
│   │   │   ├── carousel/        # Image carousel / gallery assets (01, 02, 03...)
│   │   │   ├── desktop/         # Web dashboard & high-res browser screenshots
│   │   │   ├── mobile/          # Android / Mobile app interface screenshots
│   │   │   └── features/        # Feature-specific showcase graphics & cards
│   │   └── product-2/           # PRODUCT 2: Khushi SMS / ERP (School Management System)
│   │       ├── carousel/        # Image carousel / gallery assets (01, 02, 03...)
│   │       ├── desktop/         # Accountant / Admin web dashboard screenshots
│   │       ├── mobile/          # Parent / Teacher mobile application screenshots
│   │       └── features/        # Feature-specific showcase graphics & cards
│   └── diagrams/                # Flowcharts, architecture graphics, and ecosystem diagrams
└── videos/
    ├── product-1/               # Bites desktop & mobile demo videos (.mp4)
    └── product-2/               # Khushi SMS / ERP desktop & mobile demo videos (.mp4)
```

---

## 2. File Naming Rules & Conventions

To ensure zero code breakage and automatic path resolution:

* **Format**: All images should ideally be **WebP** (`.webp`) for web performance and small file sizes. SVGs (`.svg`) are used for logos/icons. Videos must be **H.264 MP4** (`.mp4`).
* **Casing**: Use strictly **lowercase kebab-case**.
* **Predictable Structure**: `[product-id]-[section]-[type/number].[ext]`
* **STRICT PROHIBITION**: Never use vague names like `image1.png`, `final.png`, `new-banner.jpg`, `screenshot.png`, or local PC paths (`C:\Users\...`).

### Naming Patterns Matrix

| Target Asset | Product | Correct File Name Example | Path |
| :--- | :--- | :--- | :--- |
| **Hero Desktop Image** | Bites | `bites-hero-desktop.webp` | `/images/products/product-1/desktop/` |
| **Hero Mobile Image** | Bites | `bites-hero-mobile.webp` | `/images/products/product-1/mobile/` |
| **Carousel Slide 1** | Bites | `bites-carousel-01.webp` | `/images/products/product-1/carousel/` |
| **Feature Screenshot** | Bites | `bites-feature-tracking.webp` | `/images/products/product-1/features/` |
| **Hero Video (Desktop)** | Bites | `bites-demo-desktop.mp4` (or `bites-demo.mp4`) | `/videos/product-1/` |
| **Hero Desktop Image** | Khushi SMS | `khushi-erp-hero-desktop.webp` | `/images/products/product-2/desktop/` |
| **Hero Mobile Image** | Khushi SMS | `khushi-erp-hero-mobile.webp` | `/images/products/product-2/mobile/` |
| **Carousel Slide 1** | Khushi SMS | `khushi-erp-carousel-01.webp` | `/images/products/product-2/carousel/` |
| **Feature Screenshot** | Khushi SMS | `khushi-erp-feature-vouchers.webp` | `/images/products/product-2/features/` |
| **Hero Video (Desktop)** | Khushi SMS | `khushi-erp-demo-desktop.mp4` (or `khushi-erp-demo.mp4`) | `/videos/product-2/` |

---

## 3. Comprehensive Asset Slot Reference

Below is the complete inventory of asset slots expected by the frontend code:

### Company & Global Branding Assets

| Slot Name | Folder Path | Required File Name | Aspect Ratio | Rec. Dimensions | Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Brand Logo | `/images/company/` | `logo.png` / `logo.svg` | `1:1` Square | 512 x 512 px | PNG / SVG | Main Khushi Solutions navbar & footer logo |
| Favicon | `/` | `favicon.ico` | `1:1` Square | 64 x 64 px | ICO / PNG | Browser tab favicon icon |
| OpenGraph Banner | `/images/company/` | `og-image.webp` | `1.91:1` | 1200 x 630 px | WebP | Social media sharing banner preview |

---

### Product 1: Bites (Delivery & Business Management Platform)

| Slot Name | Folder Path | Exact File Name | Category | Ratio | Dimensions | Status | What Asset Should Show |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Hero Video (Desktop) | `/videos/product-1/` | `bites-demo-desktop.mp4` (alias `bites-demo.mp4`) | Desktop Video | `16:9` | 1920 x 1080 px | **Required** | High-definition live platform walkthrough of Bites order dispatch & admin web panel. |
| Hero Video (Mobile) | `/videos/product-1/` | `bites-demo-mobile.mp4` | Mobile Video | `9:16` | 1080 x 1920 px | Optional | Vertical screen recording of customer app checkout or rider live navigation. |
| Hero Screenshot (Desktop) | `/images/products/product-1/desktop/` | `bites-hero-desktop.webp` | Desktop Image | `16:10` | 1920 x 1200 px | **Required** | Browser window preview of Bites Admin Control Center dashboard. |
| Hero Screenshot (Mobile) | `/images/products/product-1/mobile/` | `bites-hero-mobile.webp` | Android Image | `9:16` | 1080 x 1920 px | **Required** | Android mockup screenshot of Bites Customer Store Browsing screen. |
| Feature: Merchant Dashboard | `/images/products/product-1/features/` | `bites-feature-merchant.webp` | Desktop Image | `16:10` | 1600 x 1000 px | **Required** | Vendor acceptance tablet view or merchant order dashboard. |
| Feature: Rider Tracking | `/images/products/product-1/features/` | `bites-feature-tracking.webp` | Android Image | `9:16` | 1080 x 1920 px | **Required** | Android app screenshot showing live map rider location & ETA. |
| Feature: Distance Pricing | `/images/products/product-1/features/` | `bites-feature-pricing.webp` | Desktop Image | `16:10` | 1600 x 1000 px | Optional | Admin panel setting zone-based road distance delivery fees. |
| Carousel Slide 1 | `/images/products/product-1/carousel/` | `bites-carousel-01.webp` | Carousel | `16:9` | 1920 x 1080 px | Optional | Multi-store store selection grid UI. |
| Carousel Slide 2 | `/images/products/product-1/carousel/` | `bites-carousel-02.webp` | Carousel | `16:9` | 1920 x 1080 px | Optional | Rider app shift management screen. |
| Carousel Slide 3 | `/images/products/product-1/carousel/` | `bites-carousel-03.webp` | Carousel | `16:9` | 1920 x 1080 px | Optional | Customer digital receipt & checkout UI. |

---

### Product 2: Khushi SMS / ERP (School Management Ecosystem)

| Slot Name | Folder Path | Exact File Name | Category | Ratio | Dimensions | Status | What Asset Should Show |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Hero Video (Desktop) | `/videos/product-2/` | `khushi-erp-demo-desktop.mp4` (alias `khushi-erp-demo.mp4`) | Desktop Video | `16:9` | 1920 x 1080 px | **Required** | Video demo of AI camera attendance feed & accountant fee collection portal. |
| Hero Video (Mobile) | `/videos/product-2/` | `khushi-erp-demo-mobile.mp4` | Mobile Video | `9:16` | 1080 x 1920 px | Optional | Vertical screen recording of parent mobile academic portal & push alerts. |
| Hero Screenshot (Desktop) | `/images/products/product-2/desktop/` | `khushi-erp-hero-desktop.webp` | Desktop Image | `16:10` | 1920 x 1200 px | **Required** | Accountant Dashboard showing active cash session lock & monthly stats. |
| Hero Screenshot (Mobile) | `/images/products/product-2/mobile/` | `khushi-erp-hero-mobile.webp` | Android Image | `9:16` | 1080 x 1920 px | **Required** | Parent Mobile App showing Student Performance Trend Graph & Ranking. |
| Feature: Academic Analytics | `/images/products/product-2/features/` | `khushi-erp-feature-academic-graph.webp` | Android Image | `9:16` | 1080 x 1920 px | **Required** | Parent app subject-wise performance chart & term ranking table. |
| Feature: Online Fee Payment | `/images/products/product-2/features/` | `khushi-erp-feature-payfast.webp` | Android Image | `9:16` | 1080 x 1920 px | **Required** | Parent app fee voucher checkout screen with bank routing options. |
| Feature: Cash Sessions | `/images/products/product-2/desktop/` | `khushi-erp-feature-cash-sessions.webp` | Desktop Image | `16:10` | 1600 x 1000 px | **Required** | Accountant daily session lock & password verification modal. |
| Feature: AI Face Attendance | `/images/products/product-2/desktop/` | `khushi-erp-feature-face-recognition.webp` | Desktop Image | `16:10` | 1600 x 1000 px | **Required** | Multi-camera AI facial recognition live grid and real-time log stream. |
| Feature: Fee Vouchers | `/images/products/product-2/desktop/` | `khushi-erp-feature-vouchers.webp` | Desktop Image | `16:10` | 1600 x 1000 px | **Required** | 3-copy PDF fee voucher print preview interface. |
| Feature: Teacher Marks Entry | `/images/products/product-2/mobile/` | `khushi-erp-feature-exams.webp` | Android Image | `9:16` | 1080 x 1920 px | **Required** | Teacher mobile exam builder & mobile marks entry form. |
| Carousel Slide 1 | `/images/products/product-2/carousel/` | `khushi-erp-carousel-01.webp` | Carousel | `16:9` | 1920 x 1080 px | Optional | Bulk Excel student onboarding import tool with error highlighting. |
| Carousel Slide 2 | `/images/products/product-2/carousel/` | `khushi-erp-carousel-02.webp` | Carousel | `16:9` | 1920 x 1080 px | Optional | Full-cycle HR staff payroll & salary slip generator. |

---

## 4. Carousel Asset Handling Rules

The product pages and homepage galleries feature responsive carousels that dynamically render image slides.

1. **Dynamic Image Scaling**: The carousel component supports any number of images (e.g., 1 image, 3 images, or 8+ images).
2. **File Naming Order**: Carousel files must follow zero-padded 2-digit indexing:
   - `bites-carousel-01.webp`
   - `bites-carousel-02.webp`
   - `bites-carousel-03.webp`
3. **No Layout Shift**: Adding new slides into the carousel array inside `src/data/products.ts` will instantly display the images in sequence without altering grid dimensions or breaking layout structure.
4. **Target Aspect Ratio**: `16:9` or `16:10` landscape images are recommended for all carousel slides.

---

## 5. Video Playback & Asset Rules

Video playback on product hero sections follows strict browser standards for reliable execution on Hostinger, Netlify, and static CDN environments:

1. **Video File Format**: Must be web-optimized H.264 / AAC `.mp4` video files.
2. **Attributes Required**:
   - `autoPlay`: Starts automatically without user gesture.
   - `loop`: Seamless continuous loop playback.
   - `muted`: Required by modern browsers (Chrome, Safari, Edge) to allow autoplay.
   - `playsInline`: Prevents iOS mobile devices from forcing native full-screen video players.
   - `controls={false}`: Hides default browser controls in favor of custom UI overlay buttons.
3. **Aspect Ratio Preservation**: Desktop hero video containers enforce standard `16:9` (`aspect-video`) rounded containers. Mobile videos enforce `9:16`.
4. **Fallback Poster**: Every video should have a matching static screenshot poster image defined (`bites-hero-desktop.webp` or `khushi-erp-hero-desktop.webp`) to display instantly while video streams load.

---

## 6. Hosting & Static Portability Rules

To ensure assets render perfectly on static hosting (Hostinger, Netlify, Vercel, Cloudflare, S3):

* **Root-Relative Paths**: Always specify paths starting with a leading slash `/` pointing to the `public/` directory (e.g., `/videos/product-1/bites-demo.mp4` instead of `./public/videos/...` or local file URLs `file:///C:/...`).
* **Case Sensitivity**: Linux web servers (Hostinger / Netlify) are strictly case-sensitive. Ensure file extensions in code (`.webp`, `.mp4`) match exact disk filenames.
* **No Code Modification Required**: Replacing existing images or videos only requires dropping the new file into the designated folder with the exact matching filename.

---

## 7. Step-by-Step Future Asset Replacement Workflow

When you are ready to add final production screenshots or videos:

1. **Optimize Media**: Convert images to `.webp` format using tools like Squoosh, Sharp, or Photoshop. Compress `.mp4` videos using HandBrake or ffmpeg.
2. **Select Target Folder**: Place the file into the exact corresponding subfolder inside `public/images/` or `public/videos/`.
3. **Apply Name**: Rename the file according to the **Master Asset Table** above (e.g., `bites-demo.mp4` or `khushi-erp-hero-desktop.webp`).
4. **Register in Product Data (if new slot)**: If adding a new feature or carousel item, add the relative path string (e.g., `'/images/products/product-1/carousel/bites-carousel-04.webp'`) to `src/data/products.ts`.
5. **Rebuild / Deploy**: Run `npm run build` or push to your Git repository. The web application will immediately render the new visuals seamlessly.
