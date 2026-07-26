/* ============================================================
   PRODUCT DATA — Single source of truth for all product content
   All image paths centralized here for easy replacement.
   ============================================================ */

export type ProductAccent = 'blue' | 'green';

export interface ProductCapability {
  icon: string;
  name: string;
  description: string;
}

export interface ProductFeature {
  eyebrow: string;
  title: string;
  description: string;
  screenshotPath: string;
  screenshotAlt: string;
  screenshotType: 'desktop' | 'mobile';
}

export interface ProductData {
  id: string;
  number: string;
  name: string;
  category: string;
  headline: string;
  shortIntro: string;
  valueProp: string;
  accent: ProductAccent;
  url: string | null;
  heroScreenshot: {
    desktop: string;
    mobile?: string;
    alt: string;
  };
  capabilities: ProductCapability[];
  topFeatures: ProductFeature[];
  remainingFeatures: ProductFeature[];
  differentiators: string[];
  techStack: string[];
  integrations: string[];
  userRoles: string[];
}

/* ============================================================
   PRODUCT 1: BITES — Multi-Store Delivery Platform
   Source: PRODUCT-1-WEBSITE-CONTENT.md
   Accent: Blue
   ============================================================ */

export const product1: ProductData = {
  id: 'bites',
  number: '01',
  name: 'Bites',
  category: 'Multi-Store Delivery & Business Management Platform',
  headline: 'One Platform. Every Local Business.',
  shortIntro:
    'A full-stack, multi-role on-demand delivery and operations management platform. Bites connects customers with local businesses — from restaurants to grocery stores to stationery shops — and manages the complete lifecycle from browsing to delivery, with a powerful admin control center and a dedicated rider workforce management system.',
  valueProp:
    'Bites is a complete last-mile delivery operating system built and owned by Khushi Solutions. Engineered for local Pakistani markets — cash-first transactions, geo-aware delivery pricing, and a multi-merchant architecture that lets any local business onboard in minutes.',
  accent: 'blue',
  url: null,
  heroScreenshot: {
    desktop: '/images/products/product-1/desktop/product-1-hero-desktop.webp',
    mobile: '/images/products/product-1/mobile/product-1-hero-mobile.webp',
    alt: 'Bites Admin Dashboard — Platform overview and management interface',
  },
  capabilities: [
    {
      icon: 'Store',
      name: 'Multi-Store Platform',
      description:
        'Manages restaurants, grocery, stationery, pharmacy, courier & 8 more store categories in one system.',
    },
    {
      icon: 'MapPin',
      name: 'Real-Time Order Tracking',
      description:
        'Animated delivery pipeline — customers watch each milestone live with rider location on map.',
    },
    {
      icon: 'Calculator',
      name: 'Smart Delivery Pricing',
      description:
        'Distance-based delivery charges using real road routing (OSRM) with configurable flat rates + per-km overages.',
    },
    {
      icon: 'Bike',
      name: 'Rider Management',
      description:
        'End-to-end rider workforce: shift tracking, GPS broadcasting, order assignment, ratings, complaint logging.',
    },
    {
      icon: 'ShieldCheck',
      name: 'Granular Permission System',
      description:
        'Super Admin creates sub-admins with per-module, per-action access — no privilege escalation possible.',
    },
    {
      icon: 'ChefHat',
      name: 'Vendor Self-Service',
      description:
        'Restaurant admins manage their own menu, deals, and orders from a dedicated vendor dashboard.',
    },
    {
      icon: 'Target',
      name: 'Location-Aware Radius Control',
      description:
        'Admin pins the service center on an interactive map and sets per-category delivery radius overrides.',
    },
    {
      icon: 'Upload',
      name: 'Bulk Menu Import',
      description:
        'Upload a CSV to instantly populate hundreds of menu items across a store.',
    },
    {
      icon: 'FileText',
      name: 'Financial Reporting',
      description:
        'PDF global invoices with per-rider summaries, commission tracking, and custom date range filtering.',
    },
    {
      icon: 'Megaphone',
      name: 'Marketing Popup System',
      description:
        'Admin-controlled promotional overlay: custom image, configurable delay + duration, enabled per app launch.',
    },
  ],
  topFeatures: [
    {
      eyebrow: 'REAL-TIME TRACKING',
      title: 'Watch Your Order Move — Live',
      description:
        'From the moment your order is placed, Bites keeps you in the loop. A live step-by-step timeline shows every milestone — Confirmed, Preparing, Ready, Rider Left, Near You, Delivered — each with the exact timestamp. An embedded map shows your rider\'s real-time position as they approach.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-order-tracking.webp',
      screenshotAlt: 'Live order tracking timeline with rider map',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'SMART DELIVERY PRICING',
      title: 'Fair Charges, Calculated to the Meter',
      description:
        'Bites uses real road routing — not straight-line guesses — to calculate your delivery fee. A flat rate applies within the delivery zone, with a per-kilometer charge beyond. Customers see the exact delivery charge before placing their order.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-delivery-pricing.webp',
      screenshotAlt:
        'Cart showing delivery charge breakdown with distance calculation',
      screenshotType: 'mobile',
    },
    {
      eyebrow: '13 STORE CATEGORIES',
      title: 'Every Local Business, One Doorstep',
      description:
        'Restaurants, grocery stores, stationery shops, pharmacies, laundry services, pet supplies, cosmetics, electronics, fashion, bakeries, courier services, home needs, and more — all on one platform. Customers discover businesses by category and order through one consistent experience.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-categories.webp',
      screenshotAlt: 'Customer home screen showing 13 store category grid',
      screenshotType: 'mobile',
    },
  ],
  remainingFeatures: [
    {
      eyebrow: 'ACCESS CONTROL',
      title: 'Your Team, Your Rules',
      description:
        'The Super Admin can create staff accounts with surgical-precision access control. Permissions are set per module and per action — and every activity is logged with IP address, device type, and timestamp.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-permissions.webp',
      screenshotAlt: 'Admin user permission management interface',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'VENDOR DASHBOARD',
      title: 'Empower Every Business Owner',
      description:
        'Each partner business gets its own dedicated vendor dashboard. Restaurant admins can update their store profile, add menu items, create deal bundles, and monitor today\'s orders and earnings.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-vendor.webp',
      screenshotAlt: 'Vendor self-service dashboard with menu editor',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'LOCATION MANAGEMENT',
      title: 'Control Your Delivery Zone with Precision',
      description:
        'Admins set their service center by typing an address or dragging a pin on an interactive map. A radius slider defines the maximum delivery area — and different radii can be set for different store categories.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-location.webp',
      screenshotAlt: 'Location settings with interactive map and radius slider',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'BULK OPERATIONS',
      title: 'A Full Menu in Minutes',
      description:
        'Adding hundreds of menu items one by one is a thing of the past. Bites supports CSV bulk import — prepare a spreadsheet with item names, prices, categories, and deal flags, upload it, and your menu is live instantly.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-bulk-import.webp',
      screenshotAlt: 'Restaurant detail with bulk CSV import section',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'RIDER ASSIGNMENT',
      title: 'Orders Reach the Right Rider, Automatically',
      description:
        'Bites supports both AUTO and MANUAL rider assignment. In AUTO mode, an intelligent background service assigns the least-burdened available rider. In MANUAL mode, admins pick from a live list of online riders.',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-rider-assignment.webp',
      screenshotAlt: 'Order management with rider assignment modal',
      screenshotType: 'desktop',
    },
  ],
  differentiators: [
    '100% custom codebase — full ownership, no licensing fees, no vendor lock-in',
    '13+ store types in a single platform — not just food delivery',
    'OSRM real road routing for delivery pricing, not straight-line approximations',
    'Session versioning for forced logout, per-action permission matrix, audit logs',
    'Cross-platform: same codebase runs on Android, iOS, and Web (React Native + Expo)',
    'Built for Pakistan: PKR pricing, local business workflows, cash-only ready',
  ],
  techStack: [
    'Python',
    'FastAPI',
    'MongoDB Atlas',
    'React Native (Expo)',
    'JWT Authentication',
    'OSRM Road Routing',
    'OpenStreetMap Nominatim',
    'Expo Push Notifications',
  ],
  integrations: [
    'OSRM (Road Distance)',
    'Nominatim (Geocoding)',
    'Expo Push Notifications',
    'PDF Invoice Generator',
  ],
  userRoles: [
    'Customer',
    'Rider / Delivery Agent',
    'Restaurant / Vendor Admin',
    'Super Admin',
    'Sub-Admin',
  ],
};

/* ============================================================
   PRODUCT 2: KHUSHI ERP SYSTEM & CMS MOBILE ECOSYSTEM
   Source: PRODUCT-2-WEBSITE-CONTENT.md
   Accent: Green
   ============================================================ */

export const product2: ProductData = {
  id: 'khushi-erp',
  number: '02',
  name: 'Khushi SMS',
  category:
    'Unified Multi-Tenant SaaS School ERP & Cross-Platform Mobile Ecosystem',
  headline: 'AI-Powered School ERP & Mobile Application Ecosystem',
  shortIntro:
    'A complete enterprise SaaS platform and mobile ecosystem engineered to digitize school administration, student fee accounting, employee payroll, campus security, and parent-teacher communication. Equips school owners, administrators, accountants, teachers, and parents with real-time financial tracking, AI facial recognition attendance, automated monthly fee rollover, PayFast mobile payments, and interactive academic performance analytics.',
  valueProp:
    'Khushi ERP System eliminates financial leakages, manual attendance errors, paper voucher printing, and communication gaps between schools and parents. By combining isolated database security, password-verified cash sessions, PayFast multi-tenant online payments, AI facial recognition, and localized Urdu fee vouchers, Khushi ERP provides the most complete educational administration solution.',
  accent: 'green',
  url: null,
  heroScreenshot: {
    desktop:
      '/images/products/product-2/desktop/product-2-hero-desktop.webp',
    mobile: '/images/products/product-2/mobile/product-2-hero-mobile.webp',
    alt: 'Khushi SMS Accountant Dashboard paired with Mobile Parent Academic Portal',
  },
  capabilities: [
    {
      icon: 'ShieldCheck',
      name: 'Multi-Tenant SaaS Architecture',
      description:
        'Isolated database security per school with centralized SaaS management.',
    },
    {
      icon: 'LockKeyhole',
      name: 'Password-Verified Accounting',
      description:
        'Zero-leakage daily cash sessions with mandatory password re-verification.',
    },
    {
      icon: 'Calculator',
      name: 'Smart Fee Engine & Auto-Rollover',
      description:
        'Dual-mode monthly fee generation, auto fine calculation, and background rollover.',
    },
    {
      icon: 'Printer',
      name: 'Multi-Copy Fee Vouchers & Urdu Support',
      description:
        'Print-ready bank/school/student vouchers with native Urdu typography.',
    },
    {
      icon: 'ScanFace',
      name: 'AI Face Recognition Attendance',
      description:
        'Real-time multi-camera facial recognition for student and staff attendance.',
    },
    {
      icon: 'CreditCard',
      name: 'PayFast Mobile Fee Payments',
      description:
        'Direct online fee payments via PayFast with multi-tenant merchant routing.',
    },
    {
      icon: 'GraduationCap',
      name: 'Teacher Mobile Exam & Grading',
      description:
        'Mobile exam creation, dynamic grading scales, auto-saved marks, and post-publish edits.',
    },
    {
      icon: 'TrendingUp',
      name: 'Parent Academic Performance Graph',
      description:
        'Subject-wise performance trend graphs and class ranking tables for parents.',
    },
    {
      icon: 'RefreshCw',
      name: 'Biometric-to-Mobile Attendance Sync',
      description:
        'Real-time conflict resolution connecting facial recognition with mobile attendance.',
    },
    {
      icon: 'Banknote',
      name: 'Full-Cycle HR & Staff Payroll',
      description:
        'Automated monthly salary calculation, loan deductions, and PDF payslips.',
    },
    {
      icon: 'MessageSquare',
      name: 'Automated WhatsApp Notifications',
      description:
        'Instant WhatsApp fee receipts, due alerts, and absentee notifications.',
    },
    {
      icon: 'FileSpreadsheet',
      name: 'Preview-First Bulk Excel Import',
      description:
        'One-click Excel student onboarding with real-time error highlighting.',
    },
    {
      icon: 'Megaphone',
      name: 'Root Promotional Overlay Pipeline',
      description:
        'System-wide promotional banners and sequential post-login overlay popups.',
    },
  ],
  topFeatures: [
    {
      eyebrow: 'ACADEMIC ANALYTICS',
      title: 'Parent Academic Performance Analytics & Class Ranking',
      description:
        'Parents view interactive subject performance trend graphs, class averages, highest and lowest scores, and full class roster position ranking tables on their mobile phones. Replaces confusing paper report cards with real-time visual progress analytics.',
      screenshotPath:
        '/images/products/product-2/mobile/product-2-feature-academic-graph.webp',
      screenshotAlt:
        'Parent Mobile App showing Subject Performance Graph and Class Position Ranking Table',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'MOBILE PAYMENTS',
      title: 'PayFast Online Payments & Fee Visualization',
      description:
        'Parents pay fees online instantly via PayFast with multi-tenant merchant account routing. A color-coded pie chart shows paid vs remaining amounts with Green/Yellow/Red status indicators. Funds route directly to the specific school\'s bank account.',
      screenshotPath:
        '/images/products/product-2/mobile/product-2-feature-payfast.webp',
      screenshotAlt:
        'Parent Mobile Fee System with Pie Chart and PayFast Checkout',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'CASH SECURITY',
      title: 'Password-Verified Cash Sessions & Financial Audit',
      description:
        'Eliminates cashier cash leakage through daily session locks, password re-verification on every payment, and principal settlement approval workflows. Every rupee is tracked with IP address, timestamp, and collector metadata.',
      screenshotPath:
        '/images/products/product-2/desktop/product-2-feature-cash-sessions.webp',
      screenshotAlt:
        'Accountant Dashboard with active session and password verification modal',
      screenshotType: 'desktop',
    },
  ],
  remainingFeatures: [
    {
      eyebrow: 'AI ATTENDANCE',
      title: 'Multi-Camera AI Face Recognition & Attendance Sync',
      description:
        'Real-time facial recognition processing multi-camera campus gate streams synchronized with teacher mobile attendance apps. The Attendance Sync Engine resolves conflicts between AI camera logs and manual teacher entries in real time.',
      screenshotPath:
        '/images/products/product-2/desktop/product-2-feature-face-recognition.webp',
      screenshotAlt:
        'Multi-Camera Face Stream showing live video grid and attendance log',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'DOCUMENT GENERATION',
      title: 'Multi-Copy Fee Vouchers with Urdu Typography',
      description:
        'Generates bank-compliant 3-copy fee vouchers (Bank, School, Student) with custom logo headers and native Urdu Noto Nastaliq font rendering for localized school titles and instructions.',
      screenshotPath:
        '/images/products/product-2/desktop/product-2-feature-vouchers.webp',
      screenshotAlt:
        'Fee Voucher Print Preview rendering multi-copy PDF voucher',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'MOBILE EXAM SYSTEM',
      title: 'Teacher Mobile Exam & Dynamic Grading Engine',
      description:
        'Teachers create exams, set total marks, define custom grade scale rules (e.g., 90–100 = A+), enter auto-saved student marks, and update published results. Parents receive instant push notification with student marks, grade, and class position.',
      screenshotPath:
        '/images/products/product-2/mobile/product-2-feature-exams.webp',
      screenshotAlt: 'Teacher Mobile Exam Builder and Marks Entry Screen',
      screenshotType: 'mobile',
    },
  ],
  differentiators: [
    'Multi-Tenant SaaS PayFast Merchant Routing — online fees deposit directly into each school\'s bank account',
    'Real-time biometric-to-mobile attendance sync — zero-conflict AI gate cameras to parent apps',
    'Parent academic visual analytics — performance trend graphs and class position rankings',
    'Password-verified daily cash sessions — zero cash leakage with audit-ready settlement approvals',
    'Native multi-copy PDF fee vouchers with localized Urdu Noto Nastaliq font rendering',
  ],
  techStack: [
    'React 18',
    'TypeScript',
    'FastAPI (Python 3.12)',
    'MongoDB (Multi-Tenant)',
    'PyTorch / InsightFace (AI)',
    'PayFast Payment Gateway',
    'ReportLab PDF Engine',
    'CMS Mobile Application',
  ],
  integrations: [
    'PayFast Online Payment Gateway',
    'Remote AI Face Recognition Service',
    'WhatsApp Messaging Gateway',
    'Push Notification Engine',
    'ReportLab PDF & Urdu Font Engine',
  ],
  userRoles: [
    'Root Admin',
    'School Admin',
    'Accountant',
    'Teacher',
    'Parent / Guardian',
  ],
};

export const products: ProductData[] = [product1, product2];
