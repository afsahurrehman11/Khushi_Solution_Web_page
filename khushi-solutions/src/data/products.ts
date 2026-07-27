/* ============================================================
   PRODUCT DATA   Single source of truth for all product content
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
  heroVideo: {
    desktop: string;
    mobile: string;
    alt: string;
  };
  heroScreenshot: {
    desktop: string;
    mobile?: string;
    alt: string;
  };
  capabilities: ProductCapability[];
  features: ProductFeature[];
  differentiators: string[];
  techStack: string[];
  integrations: string[];
  userRoles: string[];
}

/* ============================================================
   PRODUCT 1: BITES   Multi-Store Delivery Platform
   Accent: Blue
   ============================================================ */

export const product1: ProductData = {
  id: 'bites',
  number: '01',
  name: 'Bites',
  category: 'Delivery & Business Management',
  headline: 'One Platform. Every Local Business.',
  shortIntro:
    'A complete delivery and operations management platform. Bites connects customers with local businesses and manages the complete lifecycle from browsing to delivery, with a powerful admin control center and a dedicated rider workforce management system.',
  valueProp:
    'Bites is a complete delivery operating system built and owned by Khushi Solutions. Engineered for local markets   cash-first transactions, real road-distance delivery pricing, and a multi-merchant architecture that lets any local business onboard in minutes.',
  accent: 'blue',
  url: null,
  heroVideo: {
    desktop: '/videos/product-1/bites-desktop.mp4',
    mobile: '/videos/product-1/bites-mobile.mp4',
    alt: 'Bites Platform Overview Video',
  },
  heroScreenshot: {
    desktop: '/images/products/product-1/desktop/product-1-hero-desktop.webp',
    mobile: '/images/products/product-1/mobile/product-1-hero-mobile.webp',
    alt: 'Bites Admin Dashboard   Platform overview and management interface',
  },
  capabilities: [
    {
      icon: 'Store',
      name: 'Multi-Store Platform',
      description:
        'Supports restaurants, groceries, pharmacies, and 10+ other business types   all in one app.',
    },
    {
      icon: 'MapPin',
      name: 'Real-Time Order Tracking',
      description:
        'Customers see live updates at every step   and track their rider on a map.',
    },
    {
      icon: 'Calculator',
      name: 'Smart Delivery Pricing',
      description:
        'Fair delivery charges calculated from actual road distance   not guesswork.',
    },
    {
      icon: 'Bike',
      name: 'Rider Management',
      description:
        'End-to-end rider workforce: shift tracking, GPS broadcasting, order assignment, ratings, complaint logging.',
    },
    {
      icon: 'ShieldCheck',
      name: 'Role-Based Access Control',
      description:
        'Create staff accounts with exact module access   and track every action they take.',
    },
    {
      icon: 'ChefHat',
      name: 'Vendor Self-Service',
      description:
        'Business owners manage their own menu, deals, and orders from a dedicated dashboard.',
    },
    {
      icon: 'Target',
      name: 'Location-Aware Radius Control',
      description:
        'Pin the service center on an interactive map and set delivery areas for each business type.',
    },
    {
      icon: 'Upload',
      name: 'Bulk Menu Import',
      description:
        'Upload a spreadsheet to instantly populate hundreds of menu items across a store.',
    },
    {
      icon: 'FileText',
      name: 'Financial Reporting',
      description:
        'Detailed invoices with per-rider summaries, commission tracking, and custom date range filtering.',
    },
    {
      icon: 'Megaphone',
      name: 'Marketing Banners',
      description:
        'Control promotional overlays directly from the admin panel to highlight new stores or offers.',
    },
  ],
  features: [
    {
      eyebrow: 'REAL-TIME TRACKING',
      title: 'Watch Your Order Move   Live',
      description:
        '• Live updates at every step\n• Track rider location on map\n• Exact delivery timestamps',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-order-tracking.webp',
      screenshotAlt: 'Live order tracking timeline with rider map',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'SMART DELIVERY PRICING',
      title: 'Fair Charges, Calculated to the Meter',
      description:
        '• Real road distance, not straight-line guesses\n• Price shown before ordering\n• Configurable flat rates and per-km charges',
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
        '• Order from restaurants, pharmacies, groceries, and more\n• Browse by category\n• One consistent checkout experience',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-categories.webp',
      screenshotAlt: 'Customer home screen showing 13 store category grid',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'ACCESS CONTROL',
      title: 'Your Team, Your Rules',
      description:
        '• Create staff accounts with exact permissions\n• Full activity tracking per user\n• See exactly who did what and when',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-permissions.webp',
      screenshotAlt: 'Admin user permission management interface',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'VENDOR DASHBOARD',
      title: 'Empower Every Business Owner',
      description:
        '• Dedicated vendor dashboards\n• Add menu items and deals instantly\n• Monitor daily orders and earnings',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-vendor.webp',
      screenshotAlt: 'Vendor self-service dashboard with menu editor',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'LOCATION MANAGEMENT',
      title: 'Control Your Delivery Zone with Precision',
      description:
        '• Set service center on an interactive map\n• Slide to adjust maximum delivery radius\n• Different radii for different store types',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-location.webp',
      screenshotAlt: 'Location settings with interactive map and radius slider',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'BULK OPERATIONS',
      title: 'A Full Menu in Minutes',
      description:
        '• Upload a simple spreadsheet\n• Add hundreds of items instantly\n• Ready for customers to order',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-bulk-import.webp',
      screenshotAlt: 'Restaurant detail with bulk CSV import section',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'RIDER ASSIGNMENT',
      title: 'Orders Reach the Right Rider, Automatically',
      description:
        '• Auto-assign to the nearest available rider\n• Manual assignment override\n• Keep deliveries moving fast',
      screenshotPath:
        '/images/products/product-1/features/product-1-feature-rider-assignment.webp',
      screenshotAlt: 'Order management with rider assignment modal',
      screenshotType: 'desktop',
    },
  ],
  differentiators: [
    '100% custom platform   full ownership, no licensing fees',
    '13+ store types in a single app',
    'Real road routing for fair delivery pricing',
    'Secure logins with full activity tracking',
    'Cross-platform app for Android, iOS, and Web',
    'Built for local markets and workflows',
  ],
  techStack: [
    'Cloud-based Backend',
    'Cross-platform App',
    'Real-time Databases',
    'Secure Authentication',
    'Road Distance API',
    'Push Notifications',
  ],
  integrations: [
    'Road Distance APIs',
    'Geocoding Services',
    'Push Notifications',
    'PDF Invoice Generation',
  ],
  userRoles: [
    'Customer',
    'Rider / Delivery Agent',
    'Business Owner',
    'Platform Admin',
    'Staff Member',
  ],
};

/* ============================================================
   PRODUCT 2: KHUSHI ERP SYSTEM & CMS MOBILE ECOSYSTEM
   Accent: Green
   ============================================================ */

export const product2: ProductData = {
  id: 'khushi-erp',
  number: '02',
  name: 'Khushi SMS',
  category: 'School ERP & Mobile Ecosystem',
  headline: 'AI-Powered School ERP & Mobile Application Ecosystem',
  shortIntro:
    'A complete platform engineered to digitize school administration, student fee accounting, employee payroll, campus security, and parent-teacher communication. Equips schools with real-time financial tracking, AI facial recognition attendance, automated monthly fees, online payments, and interactive academic analytics.',
  valueProp:
    'Khushi SMS eliminates financial leakages, manual attendance errors, paper printing, and communication gaps between schools and parents. By combining isolated database security, password-verified cash sessions, online payments, AI facial recognition, and localized fee vouchers, it provides a complete educational administration solution.',
  accent: 'green',
  url: null,
  heroVideo: {
    desktop: '/videos/product-2/khushi-erp-desktop.mp4',
    mobile: '/videos/product-2/khushi-erp-mobile.mp4',
    alt: 'Khushi SMS Platform Overview Video',
  },
  heroScreenshot: {
    desktop: '/images/products/product-2/desktop/product-2-hero-desktop.webp',
    mobile: '/images/products/product-2/mobile/product-2-hero-mobile.webp',
    alt: 'Khushi SMS Accountant Dashboard paired with Mobile Parent Academic Portal',
  },
  capabilities: [
    {
      icon: 'ShieldCheck',
      name: 'Multi-School Architecture',
      description:
        'Isolated database security per school with centralized management.',
    },
    {
      icon: 'LockKeyhole',
      name: 'Password-Verified Accounting',
      description:
        'Every rupee collected is tracked with daily session locks and password verification.',
    },
    {
      icon: 'Calculator',
      name: 'Smart Fee Engine',
      description:
        'Dual-mode monthly fee generation, auto fine calculation, and background rollover.',
    },
    {
      icon: 'Printer',
      name: 'Multi-Copy Fee Vouchers',
      description:
        'Print-ready bank/school/student vouchers with native typography.',
    },
    {
      icon: 'ScanFace',
      name: 'AI Face Recognition Attendance',
      description:
        'Real-time multi-camera facial recognition for student and staff attendance.',
    },
    {
      icon: 'CreditCard',
      name: 'Online Fee Payments',
      description:
        'Direct online fee payments with automatic routing to the correct school bank account.',
    },
    {
      icon: 'GraduationCap',
      name: 'Teacher Mobile Exam & Grading',
      description:
        'Mobile exam creation, custom grade rules, and instant results publishing.',
    },
    {
      icon: 'TrendingUp',
      name: 'Parent Academic Analytics',
      description:
        'Subject-wise performance trend graphs and class ranking tables for parents on their phones.',
    },
    {
      icon: 'RefreshCw',
      name: 'Attendance Sync',
      description:
        'Instant syncing between camera facial recognition and mobile app attendance.',
    },
    {
      icon: 'Banknote',
      name: 'Full-Cycle HR & Staff Payroll',
      description:
        'Automated monthly salary calculation, loan deductions, and digital payslips.',
    },
    {
      icon: 'MessageSquare',
      name: 'Automated Messaging',
      description:
        'Instant WhatsApp fee receipts, due alerts, and absentee notifications.',
    },
    {
      icon: 'FileSpreadsheet',
      name: 'Bulk Excel Import',
      description:
        'One-click Excel student onboarding with real-time error highlighting.',
    },
    {
      icon: 'Megaphone',
      name: 'Promotional Overlays',
      description:
        'System-wide promotional banners and informational popups.',
    },
  ],
  features: [
    {
      eyebrow: 'ACADEMIC ANALYTICS',
      title: 'Parent Academic Performance Analytics',
      description:
        '• Interactive performance trend graphs\n• Class position ranking tables\n• Replaces confusing paper report cards',
      screenshotPath:
        '/images/products/product-2/mobile/product-2-feature-academic-graph.webp',
      screenshotAlt:
        'Parent Mobile App showing Subject Performance Graph and Class Position Ranking Table',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'MOBILE PAYMENTS',
      title: 'Online Payments & Fee Tracking',
      description:
        '• Pay fees instantly online\n• Clear paid vs remaining status charts\n• Funds go straight to the school bank account',
      screenshotPath:
        '/images/products/product-2/mobile/product-2-feature-payfast.webp',
      screenshotAlt:
        'Parent Mobile Fee System with Pie Chart and Online Checkout',
      screenshotType: 'mobile',
    },
    {
      eyebrow: 'CASH SECURITY',
      title: 'Password-Verified Cash Sessions',
      description:
        '• Daily session locks\n• Password verification on every payment\n• Complete audit trail for every rupee',
      screenshotPath:
        '/images/products/product-2/desktop/product-2-feature-cash-sessions.webp',
      screenshotAlt:
        'Accountant Dashboard with active session and password verification modal',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'AI ATTENDANCE',
      title: 'Multi-Camera AI Face Recognition',
      description:
        '• Live multi-camera processing\n• Syncs directly to parent apps\n• Automatically handles manual overrides',
      screenshotPath:
        '/images/products/product-2/desktop/product-2-feature-face-recognition.webp',
      screenshotAlt:
        'Multi-Camera Face Stream showing live video grid and attendance log',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'DOCUMENT GENERATION',
      title: 'Multi-Copy Fee Vouchers',
      description:
        '• Generates 3-copy fee vouchers instantly\n• Native typography support\n• Ready for bank processing',
      screenshotPath:
        '/images/products/product-2/desktop/product-2-feature-vouchers.webp',
      screenshotAlt:
        'Fee Voucher Print Preview rendering multi-copy PDF voucher',
      screenshotType: 'desktop',
    },
    {
      eyebrow: 'MOBILE EXAM SYSTEM',
      title: 'Teacher Mobile Exam & Grading',
      description:
        '• Teachers enter marks directly on their phones\n• Custom grading scale rules\n• Parents notified instantly on publish',
      screenshotPath:
        '/images/products/product-2/mobile/product-2-feature-exams.webp',
      screenshotAlt: 'Teacher Mobile Exam Builder and Marks Entry Screen',
      screenshotType: 'mobile',
    },
  ],
  differentiators: [
    'Online fees deposit directly into each school\'s bank account',
    'Zero-conflict AI camera attendance sent straight to parent apps',
    'Parent academic visual analytics and class position rankings',
    'Password-verified daily cash sessions to prevent cash leakage',
    'Native multi-copy PDF fee vouchers with native typography',
  ],
  techStack: [
    'Cloud-based Platform',
    'Secure Databases',
    'AI Facial Recognition',
    'Online Payment Gateways',
    'Cross-platform Apps',
  ],
  integrations: [
    'Online Payment Gateways',
    'AI Face Recognition',
    'WhatsApp Messaging',
    'Push Notifications',
    'PDF & Font Generation',
  ],
  userRoles: [
    'Platform Admin',
    'School Admin',
    'Accountant',
    'Teacher',
    'Parent / Guardian',
  ],
};

export const products: ProductData[] = [product1, product2];
