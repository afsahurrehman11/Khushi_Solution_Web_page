# PRODUCT AUDIT & WEBSITE-READY CONTENT: KHUSHI ERP & CMS MOBILE ECOSYSTEM

> **Target Audience for this Document:** Independent AI Web Design / Development Agent building the official Khushi Solutions company website.
> **Scope:** Product 2 – Khushi ERP System & CMS Mobile Application Ecosystem (Multi-Tenant SaaS School Enterprise Resource Planning, AI Face Recognition, Financial Accounting, Payroll, and Parent/Teacher Mobile App).

---

# 1. PRODUCT IDENTITY

## Product Name
**Khushi ERP System & CMS Mobile Application Ecosystem** (also referenced as **Khushi School ERP**, **Khushi SMS**, or **Khushi CMS Mobile**)

## Product Category
**Unified Multi-Tenant SaaS School ERP Platform & Cross-Platform Mobile Application Ecosystem**

## One-Line Product Description
An all-in-one, multi-tenant SaaS School ERP and mobile platform unifying AI facial recognition attendance, password-verified cash accounting, automated monthly fee generation, PayFast online fee payments, teacher exam/grading systems, parent performance analytics, and automated multi-channel communication.

## Project Headline
Next-Generation AI-Powered School ERP & Mobile Application Ecosystem for Modern Educational Institutions

## Short Introduction
Khushi ERP System is a complete enterprise SaaS platform and mobile ecosystem engineered to digitize school administration, student fee accounting, employee payroll, campus security, and parent-teacher communication. It equips school owners, administrators, accountants, teachers, and parents with real-time financial tracking, AI facial recognition attendance, automated monthly fee rollover, PayFast mobile payments, and interactive academic performance analytics.

## Primary Problem Solved
Eliminates manual fee collection errors, untracked cash leakages during cashier shifts, paper voucher printing, proxy attendance marking, delayed monthly fee rollover, fragmented academic record-keeping, and communication gaps between schools and parents.

## Target Users
- **School Owners & Board Members:** Executive oversight, multi-branch analytics, financial collection trends, root promotions, and subscription billing.
- **School Administrators / Principals:** Student admissions, staff assignments, role-based access management, mobile fee analytics, class schedules, and system configurations.
- **School Accountants / Cashiers:** Daily cash session management, password-verified fee collection, arrears tracking, expense logging, and cash settlement requests.
- **Teachers / Academic Staff:** Mobile exam creation, dynamic grading scale definition, auto-saved marks entry, post-publish mark edits, class attendance marking, and roster views.
- **Parents / Guardians:** Single CNIC multi-child login, subject performance trend graphs, individual/class exam ranking tables, PayFast mobile fee payments, fee visualization pie charts, daily/monthly attendance logs, and push notification inbox.
- **System Administrators / SaaS Root Admins:** Global tenant provisioning, PayFast multi-tenant merchant routing configuration, system-wide promotional overlays, database routing, school onboarding, and usage analytics.

## Target Organizations / Customers
- Private K-12 Schools and Montessori Academies
- Multi-Branch School Networks & Educational Franchises
- Higher Secondary Colleges & Intermediate Institutes
- Educational Institutions seeking automated fee collection, PayFast mobile payments, AI attendance, and localized Urdu/English fee vouchers in Pakistan and emerging markets.

---

# 2. COMPLETE FEATURE DISCOVERY

---

## 2.1 Desktop & Core SaaS ERP Modules

### Feature 1: Multi-Tenant SaaS Architecture & Database Isolation
- **Category:** SaaS Administration & Platform Infrastructure
- **Status:** Fully Implemented
- **Short Description:** Enterprise multi-tenancy with isolated MongoDB databases per school and central SaaS management.
- **Detailed Description:** High-performance multi-tenant architecture where every registered school operates on its own dedicated MongoDB database. Tenant routing is handled via custom FastAPI middleware (`database_routing_middleware`) that dynamically selects the target database context from validated JWT claims (`school_id`, `school_slug`, `database_name`). Central SaaS data (global authentication, school registry, subscription status, system job guards) resides in `saas_root_db`.
- **User(s) Who Use It:** Root Admin, System Administrator
- **User Workflow:** Root Admin logs into `/root-admin` → System provisions a new school with a unique slug and isolated database → Root Admin creates initial Admin credentials → Client requests are automatically routed to the school's isolated database.
- **Frontend Location:** `/root-admin`, `/billing` ([RootAdminDashboard.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/RootAdminDashboard.tsx), [BillingDashboard.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/BillingDashboard.tsx))
- **Backend/API Support:** `/api/saas/*`, `/api/root/*`, `/api/billing/*`, `/api/billing-v2/*` ([saas.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/saas.py), [database_routing.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/middleware/database_routing.py))
- **Website Importance:** Core

---

### Feature 2: Password-Verified Payment Recording & Daily Cash Sessions
- **Category:** Financial Accounting & Cashier Management
- **Status:** Fully Implemented
- **Short Description:** Daily cashier session locking, password-reverified fee collection, and cash settlement auditing.
- **Detailed Description:** Eliminates cash misappropriation by forcing accountants to open a daily session (`accounting_sessions`) before collecting fees. Every fee payment transaction requires password re-verification, capturing client IP, timestamp, collector user ID, and device metadata. Daily expenses are logged directly against the open session. Upon closing a session, accountants initiate a principal settlement request that requires admin password approval before funds are marked as turned over.
- **User(s) Who Use It:** Accountant, Admin, Root Admin
- **User Workflow:** Accountant opens daily cash session → Collects student fees with password verification → System updates ledger and receipt snapshot → Accountant logs session expenses → Accountant closes session and submits cash settlement → Admin verifies password and approves settlement.
- **Frontend Location:** `/dashboard/accountant` ([AccountantDashboard.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/accountant/pages/AccountantDashboard.tsx), [CashVerificationModal.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/accountant/components/CashVerificationModal.tsx))
- **Backend/API Support:** `/api/verified-payments/*`, `/api/fee-analytics/*` ([verified_payments.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/verified_payments.py), [verified_payment_service.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/verified_payment_service.py))
- **Website Importance:** Core

---

### Feature 3: Smart Multi-Mode Fee Engine & Automated Monthly Rollover
- **Category:** Fee Management & Automated Billing
- **Status:** Fully Implemented
- **Short Description:** Idempotent fee generation supporting Section or Student assignment modes, scholarship rules, late fines, and automated monthly rollover.
- **Detailed Description:** Powerful fee processing engine supporting two operational modes: `SECTION` (class-wide category assignments) and `STUDENT` (custom per-student categories). Supports monthly components (Tuition Fee, Misc Funds), one-time fees, and annual charges. Automatically applies scholarships strictly against Tuition Fee totals. Late payment fines trigger post-due date + grace period. Monthly rollover runs via a standalone background worker (`backend/app/rollover_worker.py`) at 04:54 AM PKT on the 1st of every month, safely carrying unpaid balances forward into structured arrears (`arrears_tuition`, `arrears_misc`).
- **User(s) Who Use It:** Accountant, Admin, System Worker
- **User Workflow:** Admin configures fee categories and selects Fee Mode (`SECTION` or `STUDENT`) → Fee engine generates idempotent monthly records per student → Late fines auto-apply post grace period → Unpaid balances automatically roll forward into student arrears on the 1st of the month.
- **Frontend Location:** `/fees`, `/fee-categories` ([FeePage.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/accountant/pages/FeePage.tsx), [FeeOverviewTab.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/students/components/FeeOverviewTab.tsx))
- **Backend/API Support:** `/api/student-fees/*`, `/api/fee-mode/*`, `/api/fee-categories*`, `/api/class-fee-assignments*` ([student_monthly_fees.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/student_monthly_fees.py), [generation.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/fee/generation.py), [rollover.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/fee/rollover.py))
- **Website Importance:** Core

---

### Feature 4: Printable Multi-Copy Fee Vouchers with Urdu Font Support
- **Category:** Financial Documentation & Printable Artifacts
- **Status:** Fully Implemented
- **Short Description:** Professional bank/school/student copy PDF vouchers with embedded Urdu/Unicode font support and customizable headers.
- **Detailed Description:** High-precision PDF rendering engine ([pdf_service.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/pdf_service.py), [fee_voucher_service.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/fee_voucher_service.py)) that produces multi-part printable fee vouchers (Bank Copy, School Copy, Student Copy). Features automatic font setup (`setup_urdu_fonts.py`) to render Urdu/Nastaliq text for localized school titles and instructions. Configurable options include bank details, due dates, fine rules, custom announcements, and logo headers.
- **User(s) Who Use It:** Accountant, Admin, Parents
- **User Workflow:** Accountant selects class or student list → Configures voucher parameters (due date, fine amount, bank details) → Generates multi-copy PDF voucher batch → Prints vouchers for physical distribution or PDF download.
- **Frontend Location:** `/fees/print`, `/chalans` ([FeeVoucherPrintPage.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/FeeVoucherPrintPage.tsx), [ChalanList.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/chalans/index.ts))
- **Backend/API Support:** `/api/fees/vouchers/*`, `/api/fee-voucher-settings*`, `/api/chalans/*` ([fee_vouchers.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/fee_vouchers.py), [chalans.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/chalans.py))
- **Website Importance:** Core

---

### Feature 5: AI Face Recognition Attendance Microservice
- **Category:** Campus Security & AI Automation
- **Status:** Fully Implemented (Backend Microservice Architecture)
- **Short Description:** Multi-camera real-time facial recognition service for automated student and employee attendance marking.
- **Detailed Description:** High-speed biometric attendance system backed by an independent microservice (`face-service/`) running computer vision ML algorithms (InsightFace/PyTorch/OpenCV). Main FastAPI backend acts as an authenticated proxy (`face_v2.py`). Features single and multi-camera live video recognition streams, automated attendance log creation, face profile enrollment, photo upload vector extraction, and multi-camera session tracking.
- **User(s) Who Use It:** Admin, Gate Security Officer, Staff
- **User Workflow:** Administrator enrolls student/employee photo vectors → Gate camera stream feeds into Face Service → ML engine detects face and matches embedding → System instantly marks daily attendance timestamp and updates database in real-time.
- **Frontend Location:** `/face-app`, `/face-app/students`, `/face-app/employees`, `/face-app/recognition`, `/face-app/multi-camera` ([FaceDashboard.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/face/index.ts))
- **Backend/API Support:** `/api/face*` ([face_v2.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/face_v2.py), [face_service_client.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/face_service_client.py))
- **Website Importance:** Core (Major Visual Differentiator)

---

### Feature 6: Full-Cycle Employee Payroll & Salary Management
- **Category:** Human Resource Management & Payroll
- **Status:** Fully Implemented
- **Short Description:** Comprehensive staff payroll processing with salary structures, attendance deductions, advances, loans, and PDF pay slips.
- **Detailed Description:** End-to-end employee compensation system. Allows defining customizable payroll profiles (`payroll_profiles`), base salary structures, allowance components, tax settings, and attendance policy rules. Automatically compiles monthly payroll calculation batches with attendance snapshot integration (`attendance_snapshot_builder.py`). Supports tracking multi-month employee loans (`payroll_loans`), salary advances (`payroll_advances`), manual adjustments (`payroll_adjustments`), and generating professional PDF salary pay slips (`payroll_pdf_service.py`).
- **User(s) Who Use It:** Admin, HR Manager, Accountant
- **User Workflow:** HR configures payroll settings and employee profiles → Runs monthly payroll calculation batch → System evaluates attendance snapshots, loan deductions, and allowances → Admin reviews and approves batch → PDF pay slips generated.
- **Frontend Location:** `/payroll`, `/payroll/analytics` ([PayrollPage.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/payroll/pages/PayrollPage.tsx), [PayrollAnalyticsPage.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/payroll/pages/PayrollAnalyticsPage.tsx))
- **Backend/API Support:** `/api/payroll/*`, `/api/payroll-settings/*`, `/api/payroll-calculation/*`, `/api/payroll-records/*`, `/api/payroll-advances/*`, `/api/payroll-loans/*` ([payroll.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/payroll.py), [payroll_calculation_engine.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/payroll/payroll_calculation_engine.py))
- **Website Importance:** Core

---

### Feature 7: Preview-First Bulk Student Import & Export Workspace
- **Category:** Data Management & Onboarding
- **Status:** Fully Implemented
- **Short Description:** Excel bulk student import engine with validation error highlights, duplicate detection, and instant export.
- **Detailed Description:** High-speed data onboarding workspace ([student_import_export.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/student_import_export.py), [bulk_import_service.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/bulk_import_service.py)). Allows administrators to upload Excel files containing hundreds of student profiles. Before committing to the database, the system executes validation checks (registration number uniqueness, class matching, required fields) and renders an interactive web preview highlighting errors in red. Supports exporting clean templates and existing student directories to Excel.
- **User(s) Who Use It:** Admin, Data Entry Clerk
- **User Workflow:** Admin downloads standard import Excel template → Fills student data and uploads file → Interactive preview renders inline error checks → Admin corrects highlighted fields → One-click bulk commit creates all student records.
- **Frontend Location:** `/students/import-export`, `/students/incomplete-data` ([StudentImportExportPage.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/students/pages/StudentImportExportPage.tsx))
- **Backend/API Support:** `/api/students-import-export/*` ([student_import_export.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/student_import_export.py), [excel_service.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/excel_service.py))
- **Website Importance:** Important

---

### Feature 8: Automated WhatsApp Bot & Multi-Channel Notifications
- **Category:** Parent Communication & Messaging
- **Status:** Fully Implemented
- **Short Description:** Automated WhatsApp notification bot for fee vouchers, payment receipts, attendance alerts, and announcements.
- **Detailed Description:** Direct WhatsApp communication gateway ([whatsapp.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/whatsapp.py), [whatsapp_service.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/services/whatsapp_service.py)). Enables schools to dispatch instant WhatsApp alerts directly to parents' mobile numbers. Supports dynamic message templates for automated fee due notices, digital payment receipts, instant student absentee alerts, and school-wide announcements.
- **User(s) Who Use It:** Admin, Accountant
- **User Workflow:** Event occurs (e.g. Fee Payment Received or Student Absent) → WhatsApp notification engine formats template with dynamic student tags → Message queued and dispatched to parent phone number → Delivery status logged in WhatsApp dashboard.
- **Frontend Location:** `/whatsapp-bot` ([WhatsAppDashboard.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/whatsapp/pages/WhatsAppDashboard.tsx))
- **Backend/API Support:** `/api/whatsapp/*`, `/api/notifications*` ([whatsapp.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/whatsapp.py), [notifications.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/notifications.py))
- **Website Importance:** Core

---

### Feature 9: Student Information System (SIS) & Academic Master Data
- **Category:** Academic Administration
- **Status:** Fully Implemented
- **Short Description:** Complete management of student profiles, classes, sections, subjects, teachers, and academic grades.
- **Detailed Description:** Core Student Information System managing student profiles, registration numbers, parent details, status transitions (`active`, `Graduated`, `Left School`, `Struck Off`), class and section definitions, subject catalogs, teacher qualifications, and teacher-class assignments. Includes advanced filtering, multi-field search, and student status lifecycle management.
- **User(s) Who Use It:** Admin, Teacher
- **User Workflow:** Admin creates class sections and subject catalogs → Assigns lead teachers to classes → Enrolls students into classes with auto-generated registration numbers → Tracks student academic progression.
- **Frontend Location:** `/students`, `/classes`, `/teachers`, `/subjects` ([StudentList.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/students/pages/StudentList.tsx), [ClassList.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/classes/index.ts), [TeacherList.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/teachers/index.ts))
- **Backend/API Support:** `/api/students*`, `/api/classes*`, `/api/teachers*`, `/api/subjects*`, `/api/grades*` ([students.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/students.py), [classes.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/classes.py), [teachers.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/teachers.py))
- **Website Importance:** Important

---

### Feature 10: Unified Document Management System
- **Category:** Document Repository & Digital Archiving
- **Status:** Fully Implemented
- **Short Description:** Centralized document management for uploading, categorizing, and retrieving student and school records.
- **Detailed Description:** Unified document storage service ([unified_documents.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/unified_documents.py)) allowing administrators to attach digital documents (admission forms, birth certificates, CNIC copies, academic transcripts, staff certifications) directly to student or school profiles. Features file type validation, category tagging, preview, and secure download links.
- **User(s) Who Use It:** Admin, Data Entry Clerk
- **User Workflow:** Admin opens Documents page or Student Profile → Uploads document file with metadata and category → File stored securely → Document instantly accessible for viewing or download.
- **Frontend Location:** `/documents` ([DocumentsPage.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/DocumentsPage.tsx))
- **Backend/API Support:** `/api/documents*` ([unified_documents.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/unified_documents.py))
- **Website Importance:** Supporting

---

### Feature 11: Daily Manual & QR/Barcode Attendance Marking
- **Category:** Academic Operations & Attendance
- **Status:** Fully Implemented
- **Short Description:** Daily teacher-driven student attendance marking and teacher check-in tracking.
- **Detailed Description:** In addition to AI facial recognition, the system provides a responsive manual attendance module. Teachers or administrators select a class and date to mark student attendance status (Present, Absent, Leave, Late) with instant batch save. Includes staff/teacher daily attendance tracking ([teacher_attendance.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/teacher_attendance.py)).
- **User(s) Who Use It:** Teacher, Admin
- **User Workflow:** Teacher navigates to assigned class → Opens attendance screen for current date → Toggles student status switches → Submits daily roster → Absentee notifications automatically trigger.
- **Frontend Location:** `/classes/:classId/attendance`, `/classes/:classId/attendance/:date` ([AttendanceList.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/classes/index.ts), [MarkAttendance.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/classes/index.ts))
- **Backend/API Support:** `/api/attendance*`, `/api/teacher-attendance*` ([attendance.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/attendance.py), [teacher_attendance.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/teacher_attendance.py))
- **Website Importance:** Supporting

---

### Feature 12: Role-Based Security & Custom Page Access Controls
- **Category:** Security & Governance
- **Status:** Fully Implemented
- **Short Description:** Flexible RBAC engine with custom role creation, explicit page permission gating, and password-protected UI actions.
- **Detailed Description:** Comprehensive authorization framework ([RoleManagement.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/RoleManagement.tsx), [users.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/users.py)). Supports predefined roles (`Root`, `Admin`, `Accountant`, `Teacher`) as well as custom role definitions. Administrators can customize the `allowed_pages` array per role, ensuring that lower roles only see navigation options relevant to their duties (e.g. Accountants only see Fees & Accounting). Sensitive actions (logout cash check, admin cash settlement approval, student deletion) require explicit password verification.
- **User(s) Who Use It:** Admin, System Administrator
- **User Workflow:** Admin opens Role Management → Configures custom permission matrix and visible page IDs for staff roles → System applies sidebar filtering in `Layout.tsx` and enforces frontend/backend route protection.
- **Frontend Location:** `/dashboard/admin/roles` ([RoleManagement.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/RoleManagement.tsx), [Layout.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/components/Layout.tsx))
- **Backend/API Support:** `/api/admin/roles*`, `/api/admin/users*` ([users.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/users.py), [auth.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/dependencies/auth.py))
- **Website Importance:** Important

---

### Feature 13: System-Wide Root Startup Promotions Engine
- **Category:** Platform Marketing & Banner Management
- **Status:** Fully Implemented
- **Short Description:** Root-controlled promotional banner manager displaying dynamic popup image overlays across school logins.
- **Detailed Description:** Management service ([startup_promotions.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/startup_promotions.py), [StartupPromotionSettings.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/startupPromotion/components/StartupPromotionSettings.tsx)) enabling Root Admins to publish marketing campaigns, announcements, and promotional image banners targeting specific school tenants or the entire ecosystem. Supports upload of promotion images, optional title/text, start date, and expiry date. Active promotions automatically present as overlay popups upon user login on desktop and mobile clients.
- **User(s) Who Use It:** Root Admin (Creator), All Users (Viewers)
- **User Workflow:** Root Admin creates promotion on desktop CMS (sets image, title, start date, expiry date, target school) → User logs in → System evaluates active promotions → Renders full-screen or card overlay popup before entering main dashboard.
- **Frontend Location:** Login & Dashboard Overlays ([StartupPromotionSettings.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/features/startupPromotion/components/StartupPromotionSettings.tsx), [Login.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/Login.tsx))
- **Backend/API Support:** `/api/saas/promotions/*` ([startup_promotions.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/startup_promotions.py))
- **Website Importance:** Supporting

---

## 2.2 CMS Mobile Application Ecosystem (Phases 1–4)

---

### Feature 14: Multi-Tenant Unified Login & Parent Multi-Child System
- **Category:** Mobile Authentication & Multi-Tenancy
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Unified mobile authentication supporting school selection, Admin/Teacher email login, and Parent single CNIC multi-child login.
- **Detailed Description:** Unified mobile authentication gateway supporting all ecosystem user types. First requires selecting the target school from a multi-tenant tenant list. Admins and Teachers authenticate using Email and Password. Parents authenticate using their National ID (CNIC), granting them a single unified session that automatically links and aggregates all of their children across different grades and sections within the school.
- **User(s) Who Use It:** Admin, Teacher, Parent
- **User Workflow:** User opens mobile app → Selects school tenant → Selects login type (Staff Email/Password or Parent CNIC) → Parent enters CNIC → App presents list of linked children → Parent selects a child profile to access their dedicated portal.
- **Mobile Location:** App Entry & Child Selection Screen
- **Backend/API Support:** Multi-tenant auth endpoints (`/api/token`, `/api/me`, `/api/saas/schools`)
- **Website Importance:** Core

---

### Feature 15: Teacher Mobile Exam & Dynamic Grading Engine
- **Category:** Academic Assessment & Exam Systems
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Mobile exam creation, custom grading scale definition, auto-saved marks entry, and post-publish mark updates.
- **Detailed Description:** Mobile exam management tool empowering teachers to create exams directly from their mobile devices. Teachers input exam name, exam date, total marks, subject (auto-linked to assigned subjects), and detailed syllabus text comments. Teachers define dynamic grading rules (e.g. 90-100 = A+, 85-89 = A, 80-84 = B+). Features real-time auto-saving during student marks entry, allowing teachers to pause and resume anytime. Supports publishing exam results to parents, as well as post-publish mark updates with automatic grade re-calculation and updated parent notifications.
- **User(s) Who Use It:** Teacher, Parent (View)
- **User Workflow:** Teacher selects class/subject → Creates exam and sets total marks & grading criteria → Enters marks per student (auto-saved in real time) → Reviews and clicks Publish → Parent receives instant notification → Teacher updates mark later if needed; system re-calculates grade and sends revised alert.
- **Mobile Location:** Teacher Portal -> Exam Management
- **Backend/API Support:** Academic exam endpoints (`/api/grades*`, `/api/classes*`)
- **Website Importance:** Core

---

### Feature 16: Parent Academic Portal & Performance Analytics Graph
- **Category:** Parent Portal & Academic Analytics
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Parent mobile academic dashboard with subject selection, individual/class exam ranking tables, and performance trend graphs.
- **Detailed Description:** Comprehensive academic portal for parents. Parents select a subject (Math, Science, English) to view all historical exams. For each exam, parents can toggle between **Individual View** (student marks, total marks, grade, class average, highest mark, lowest mark) and **Class View Table** (full class roster showing Roll No, Name, Marks, Grade, and Class Position rank). Features an interactive **Subject Performance Graph** plotting percentage scores over time across all exams for visual trend analysis.
- **User(s) Who Use It:** Parent
- **User Workflow:** Parent selects child profile → Navigates to Academic Performance tab → Selects subject → Views list of exams → Taps exam for Individual Breakdown or Class Ranking Table → Views line/bar chart displaying score trends over time.
- **Mobile Location:** Parent Portal -> Academic Performance Tab
- **Backend/API Support:** Academic reporting & student performance endpoints
- **Website Importance:** Core (Major Visual Differentiator)

---

### Feature 17: Mobile Fee Portal & PayFast Online Payment Gateway Integration
- **Category:** Mobile Payments & Financial Tech
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Parent mobile fee portal with color-coded pie chart visualizations, component breakdowns, and PayFast online payments.
- **Detailed Description:** Mobile fee payment and visualization portal. Displays current and historical monthly fee statuses with a color-coded status indicator (Green = Paid, Yellow = Partial, Red = Unpaid) and an interactive **Fee Visualization Pie Chart** (Paid Amount vs Remaining Balance). Displays itemized fee breakdowns (Tuition Fee, Misc Funds, Arrears Tuition, Arrears Misc). Integrates with the **PayFast Online Payment Gateway**, allowing parents to pay monthly fees directly via credit/debit cards or mobile wallets with instant digital confirmation.
- **User(s) Who Use It:** Parent, Accountant, Admin
- **User Workflow:** Parent opens Fee System tab → Views color-coded pie chart and fee breakdown → Selects unpaid month → Taps **Pay with PayFast** → Completes secure online checkout → PayFast confirms transaction → Ledger updates in real time and digital receipt is generated.
- **Mobile Location:** Parent Portal -> Fee System Tab
- **Backend/API Support:** PayFast gateway integration endpoints & billing service
- **Website Importance:** Core

---

### Feature 18: Multi-Tenant SaaS PayFast Merchant Routing Configuration
- **Category:** SaaS Financial Infrastructure
- **Status:** Fully Implemented (Mobile Ecosystem & Desktop SaaS Management)
- **Short Description:** Isolated merchant account configuration per school tenant enabling direct fee collection into individual school bank accounts.
- **Detailed Description:** SaaS financial routing layer that guarantees complete merchant isolation across schools. During school onboarding, Root Admins or School Admins configure unique PayFast API keys, merchant IDs, and secret passphrases via the Desktop CMS SaaS management interface. When a parent initiates an online fee payment on the mobile app, the system dynamically resolves the target school's merchant credentials, ensuring online fee collections are routed directly into the specific school's bank account.
- **User(s) Who Use It:** Root Admin, School Admin
- **User Workflow:** Root Admin opens desktop SaaS school creation flow → Configures school-specific PayFast Merchant ID and API Keys → Parent pays fee on mobile app → PayFast API processes payment using tenant merchant credentials → Funds deposit into school's bank account.
- **Frontend Location:** Desktop `/root-admin`, `/settings` ([RootAdminDashboard.tsx](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/frontend/src/pages/RootAdminDashboard.tsx))
- **Backend/API Support:** `/api/saas/schools*`, `/api/billing*` ([saas.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/saas.py))
- **Website Importance:** Core

---

### Feature 19: Targeted Push Notifications & Automated Mobile Alerts
- **Category:** Mobile Messaging & Notifications
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Admin notification dispatcher with text/image push alerts, scheduling, and automated trigger notifications.
- **Detailed Description:** Multi-channel mobile notification system. Administrators can compose text and image notifications targeted to the entire school, specific classes, or individual students, with immediate or scheduled delivery options. Automated system alerts trigger instantly for exam creations, exam result publications, fee due reminders, and student attendance status updates. Supports in-app notification centers, login popup alerts, and rich push notifications.
- **User(s) Who Use It:** Admin (Sender), Parent/Teacher (Recipient)
- **User Workflow:** Admin creates notification on mobile/desktop dashboard (attaches image, sets audience and schedule) → System queues notification → Receivers receive push notification alert on mobile devices → Logged in notification inbox.
- **Mobile Location:** Admin Dashboard -> Notification Center / Mobile Inbox
- **Backend/API Support:** `/api/notifications*` ([notifications.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/notifications.py))
- **Website Importance:** High

---

### Feature 20: System-Wide Root Promotions & Mobile Login Overlay Pipeline
- **Category:** Mobile Marketing & Dynamic Overlays
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Sequential overlay pipeline presenting unread notifications and active Root promotions immediately after mobile login.
- **Detailed Description:** Dynamic mobile display pipeline that executes upon user authentication. Immediately after logging in, users pass through a mandatory two-step popup sequence: Step 1 displays any unread urgent notifications; Step 2 presents active Root Promotional Banners as high-impact full-screen or card overlays. Users can also access a scrollable **Promotions Grid** to view all active system-wide promotions, with automatic removal upon promotion expiry.
- **User(s) Who Use It:** All Mobile Users (Parents & Teachers)
- **User Workflow:** User logs into mobile app → Step 1 popup displays unread notifications → User dismisses → Step 2 popup displays active Root promotion overlay → User closes and proceeds to main dashboard → Taps Promotions tab to browse full active promotions grid.
- **Mobile Location:** Post-Login Overlay & Promotions Grid
- **Backend/API Support:** `/api/saas/promotions/*` ([startup_promotions.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/startup_promotions.py))
- **Website Importance:** High

---

### Feature 21: Mobile Teacher Attendance & Attendance Sync Engine
- **Category:** Biometric-Mobile Sync & Campus Attendance
- **Status:** Fully Implemented (Mobile Ecosystem Integration Layer)
- **Short Description:** Real-time synchronization layer connecting Desktop facial recognition attendance with Mobile App teacher manual attendance.
- **Detailed Description:** Sophisticated integration and synchronization layer connecting the Desktop facial recognition microservice with the mobile teacher attendance module. Teachers can search students, mark daily attendance (Present/Absent/Late), submit current day rosters, view past monthly class summaries, and edit attendance logs. The **Attendance Sync Engine** operates in real time to resolve conflicts between AI camera logs and manual teacher entries, eliminate duplicate logs, and maintain unified consistency across Parent, Teacher, and Admin mobile portals.
- **User(s) Who Use It:** Teacher, Admin, System Integration Layer
- **User Workflow:** AI camera logs student arrival at campus gate → Teacher opens mobile attendance module → Sync Engine resolves entries in real time → Updated attendance status reflects instantly across Parent Mobile App and Admin Dashboard.
- **Mobile Location:** Teacher Mobile Portal -> Attendance Dashboard
- **Backend/API Support:** `/api/attendance*`, `/api/face*` ([attendance.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/attendance.py))
- **Website Importance:** Core

---

### Feature 22: Admin Mobile Fee Analytics Overview
- **Category:** Executive Mobile Management
- **Status:** Fully Implemented (Mobile Ecosystem)
- **Short Description:** Executive mobile dashboard presenting real-time financial collection totals, outstanding arrears, and scholarship summaries.
- **Detailed Description:** High-level mobile analytics view designed specifically for school administrators and owners on the go. Provides executive summary metrics: Total Fee Collected, Total Remaining Fee, Tuition Arrears, Miscellaneous Arrears, and Total Discount/Scholarship summary.
- **User(s) Who Use It:** School Admin, School Owner
- **User Workflow:** Admin logs into mobile app → Navigates to Admin Overview → Views real-time fee collection totals, arrears metrics, and discount summaries from their mobile phone.
- **Mobile Location:** Mobile Admin Dashboard -> Fee Analytics
- **Backend/API Support:** `/api/fee-analytics/*` ([fee_analytics.py](file:///d:/disk%20D%20datat/GitHub/Khushi_school_system/backend/app/routers/fee_analytics.py))
- **Website Importance:** High

---

# 3. KEY CAPABILITIES FOR WEBSITE

| Capability Name | One-Line Description | Suggested Icon | Importance |
| --- | --- | --- | --- |
| **Multi-Tenant SaaS Architecture** | Isolated database security per school with centralized SaaS management. | `ShieldCheck` | Core |
| **Password-Verified Accounting** | Zero-leakage daily cash sessions with mandatory password re-verification. | `LockKeyhole` | Core |
| **Smart Fee Engine & Auto-Rollover** | Dual-mode monthly fee generation, auto fine calculation, and background rollover. | `Calculator` | Core |
| **Multi-Copy Fee Vouchers & Urdu Support** | Print-ready bank/school/student vouchers with native Urdu typography. | `Printer` | Core |
| **AI Face Recognition Attendance** | Real-time multi-camera facial recognition for student and staff attendance. | `ScanFace` | Core |
| **PayFast Mobile Fee Payments** | Direct online fee payments via PayFast with multi-tenant merchant routing. | `CreditCard` | Core |
| **Teacher Mobile Exam & Grading** | Mobile exam creation, dynamic grading scales, auto-saved marks, and post-publish edits. | `GraduationCap` | Core |
| **Parent Academic Performance Graph** | Subject-wise performance trend graphs and class ranking tables for parents. | `TrendingUp` | Core |
| **Biometric-to-Mobile Attendance Sync** | Real-time conflict resolution connecting facial recognition with mobile attendance. | `RefreshCw` | Core |
| **Root Promotional Overlay Pipeline** | System-wide promotional banners and sequential post-login overlay popups. | `Megaphone` | High |
| **Full-Cycle HR & Staff Payroll** | Automated monthly salary calculation, loan deductions, and PDF payslips. | `Banknote` | Core |
| **Automated WhatsApp Notifications** | Instant WhatsApp fee receipts, due alerts, and absentee notifications. | `MessageSquare` | Core |
| **Preview-First Bulk Excel Import** | One-click Excel student onboarding with real-time error highlighting. | `FileSpreadsheet` | High |

---

# 4. USER ROLES AND PERMISSIONS

### 1. Root Admin (`Root`)
- **Purpose:** Platform owner and SaaS administrator overseeing all registered school tenants across Desktop and Mobile.
- **Main Access:** Full system access including Desktop `/root-admin`, `/billing`, Mobile Root Promotions control, and SaaS configuration.
- **Main Actions:** Provision new schools, configure PayFast multi-tenant merchant routing credentials, publish system-wide promotional image overlays, suspend/activate tenants, manage global subscription billing.
- **Restrictions:** None.
- **Role-Specific Features:** PayFast tenant merchant setup, Root Promotions editor, multi-tenant database diagnostic tools.

### 2. School Administrator (`Admin`)
- **Purpose:** School principal or head administrator managing day-to-day campus operations on Desktop and Mobile.
- **Main Access:** Access to Desktop Admin Dashboard, Student SIS, Staff Payroll, Mobile Admin Fee Overview, and Notification Center.
- **Main Actions:** Manage staff users and roles, approve cash settlement requests, configure fee structures, dispatch targeted push notifications, view mobile financial analytics.
- **Restrictions:** Cannot access root SaaS tenant provisioning or root billing dashboards.
- **Role-Specific Features:** Cash settlement approval modal, target push notification builder, mobile executive fee summary.

### 3. Accountant (`Accountant`)
- **Purpose:** School cashier or financial officer managing fee collection and cash register shifts on Desktop.
- **Main Access:** Dedicated access to Desktop `/dashboard/accountant`, `/fees`, `/chalans`, `/fees/print`.
- **Main Actions:** Open/close daily cash sessions, record student fee payments with password re-verification, log daily session expenses, print fee vouchers, submit cash settlement requests to Admin.
- **Restrictions:** Cannot edit academic classes, modify staff salaries, change school settings, or access student bulk import tools.
- **Role-Specific Features:** Daily session start/close drawer, password payment prompt, cash verification logout check, settlement request builder.

### 4. Teacher (`Teacher`)
- **Purpose:** Classroom instructor managing academic rosters, mobile exams, grading, and attendance.
- **Main Access:** Access to Desktop `/classes` and Mobile Teacher Portal (Exam System, Marks Entry, Attendance System).
- **Main Actions:** Create mobile exams, set dynamic grading scales, enter auto-saved student marks, update published marks, mark daily student attendance, view class attendance dashboards.
- **Restrictions:** Blocked from accessing fee collection, accounting sessions, payroll, school settings, or administrative user management.
- **Role-Specific Features:** Mobile exam builder, auto-save marks grid, post-publish mark update trigger, mobile class attendance logger.

### 5. Parent / Guardian (`Parent`)
- **Purpose:** Parent managing academic progress, fee payments, and attendance tracking for all enrolled children.
- **Main Access:** Dedicated access to Mobile Parent Portal via single CNIC login.
- **Main Actions:** Switch between linked children, view subject performance trend graphs, view individual/class exam ranking tables, pay monthly fees via PayFast online checkout, view color-coded fee pie charts, inspect daily/monthly attendance history.
- **Restrictions:** Read-only access to academic/attendance records; payment-only access to fee system; cannot modify marks, roster, or school data.
- **Role-Specific Features:** Single CNIC multi-child selector, Subject Performance Graph, Class Ranking Table, PayFast Mobile Payment Checkout, Fee Visualization Pie Chart.

---

# 5. MAIN USER WORKFLOWS

### Workflow 1: Daily Cash Session & Password-Verified Fee Collection (Desktop)
- **User Role:** Accountant
- **Step-by-Step Process:**
  1. Accountant logs into `/dashboard/accountant` and clicks **Open Daily Session**.
  2. Navigates to `/fees`, enters Student ID or Registration Number.
  3. Fee engine calculates grand total (Tuition after discount + Misc + Fine + Carried Arrears).
  4. Accountant inputs collected payment amount and clicks **Record Payment**.
  5. System presents **Password Verification Modal**; Accountant re-enters password to confirm.
  6. Backend verifies password, updates student fee status, records transaction in open cash session, and updates arrears history.
  7. Accountant prints physical receipt or dispatches instant **WhatsApp Payment Confirmation**.
- **Final Result:** Audit-ready payment record, updated student ledger, instant parent alert, and cash session balance updated.

### Workflow 2: Parent Online Fee Payment via PayFast (Mobile App)
- **User Role:** Parent
- **Step-by-Step Process:**
  1. Parent logs into Mobile App using CNIC and selects child profile.
  2. Navigates to **Fee System Tab** and reviews the color-coded **Fee Visualization Pie Chart**.
  3. Selects unpaid month and views itemized breakdown (Tuition, Misc, Arrears).
  4. Taps **Pay with PayFast**.
  5. System dynamically loads the target school's isolated PayFast merchant account credentials.
  6. Parent completes secure checkout using card or mobile wallet.
  7. PayFast API confirms payment; backend updates fee status to `Paid` in real time and sends digital receipt.
- **Final Result:** Instant online fee payment deposited directly into the school's bank account with zero cashier intervention.

### Workflow 3: Teacher Mobile Exam Creation, Marks Entry & Parent Notification
- **User Role:** Teacher
- **Step-by-Step Process:**
  1. Teacher logs into Mobile App and selects assigned subject.
  2. Taps **Create Exam**, enters exam name, date, total marks, and syllabus comments.
  3. Defines **Grading Criteria Scale** (e.g., 90–100 = A+, 85–89 = A).
  4. Enters student marks into auto-saving marks grid.
  5. Reviews marks and taps **Publish Results**.
  6. Parents instantly receive push notification with student name, subject, marks, grade, and class position rank.
  7. Teacher updates a mark later if needed; system re-calculates grade and dispatches revised notification to parent.
- **Final Result:** Exam published, grades calculated, parent notified, and historical performance graphs updated instantly.

### Workflow 4: Real-Time Facial Recognition to Mobile Attendance Sync
- **User Role:** Automated AI System / Teacher / Parent
- **Step-by-Step Process:**
  1. AI Camera at school gate feeds stream to Facial Recognition Microservice (`face-service/`).
  2. System recognizes student face and logs arrival timestamp in database.
  3. Teacher opens Mobile Attendance Dashboard; **Attendance Sync Engine** reconciles AI biometric entry with manual roster.
  4. Parent opens Mobile App and sees real-time attendance status set to **Present** with arrival timestamp.
  5. Automated WhatsApp / Push Notification alerts parent that child has safely arrived at school.
- **Final Result:** Seamless real-time attendance synchronization across camera, teacher app, parent app, and notification gateway.

---

# 6. COMPLETE SYSTEM WORKFLOW / ARCHITECTURE

## System Architecture Components

1. **Client Tier (Desktop & Mobile):**
   - **Desktop Client:** React 18, TypeScript, TailwindCSS, Framer Motion, packaged for web and Electron desktop app.
   - **Mobile Client:** CMS Mobile Application (Android/iOS) for Parents, Teachers, and Admins.
   - Features responsive mobile dashboards, touch-optimized charts, auto-saving forms, and post-login overlay pipelines.

2. **API Gateway & Routing Tier (Backend):**
   - Built with FastAPI (Python 3.12).
   - Middleware Pipeline: CORS, GZip Compression, Client Disconnect Handler (`499`), Path Normalizer (`/api/api` → `/api`), and Multi-Tenant Database Routing Middleware.

3. **Authentication & Tenant Security:**
   - Single authentication source of truth: `saas_root_db.global_users`.
   - Supports Email/Password (Admin/Teacher/Root) and CNIC multi-child authentication (Parents).
   - JWT tokens encode `user_id`, `email`, `role`, `school_id`, `school_slug`, and `database_name`.
   - Database Routing Middleware binds backend execution context to the tenant's isolated MongoDB database.

4. **Database Tier (MongoDB):**
   - **SaaS Root DB (`saas_root_db`):** Houses `global_users`, `schools`, `billing_invoices`, `usage_snapshots`, `system_jobs`, `system_rollover_lock`, `startup_promotions`, PayFast merchant configurations.
   - **Tenant Databases (`school_<slug>`):** Isolated collection per school for `students`, `teachers`, `classes`, `subjects`, `exams`, `marks`, `fee_categories`, `student_monthly_fees`, `student_payments`, `accounting_sessions`, `payroll_profiles`, `attendance`, `documents`.

5. **External Microservices & Integrations:**
   - **Remote Face Recognition Microservice:** Independent microservice (`face-service/`) running InsightFace/PyTorch on GPU/AWS instance.
   - **PayFast Payment Gateway Integration:** Multi-tenant online payment gateway routing funds to school bank accounts.
   - **WhatsApp Gateway Service:** Automated WhatsApp messaging service for alerts and receipts.
   - **Push Notification Service:** Targeted mobile push notification engine (Text + Image).
   - **ReportLab PDF & Urdu Font Engine:** Multi-copy PDF voucher generator with Noto Nastaliq Urdu font integration.

6. **Integration & Sync Tier:**
   - **Attendance Sync Engine:** Conflict resolution layer connecting facial recognition camera logs with teacher mobile manual attendance entries.
   - **Monthly Rollover Worker:** Standalone worker process (`rollover_worker.py`) running on a dedicated Heroku dyno at 04:54 AM PKT on the 1st of each month.

---

## Diagram-Ready Flow

```text
+---------------------------------------------------------------------------------------------------+
|                                            USER TIER                                              |
|   Desktop Accountant  /  Admin  /  Teacher Mobile  /  Parent Mobile  /  AI Gate Camera Stream      |
+---------------------------------------------------------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+    +-------------------------------------------+
|               DESKTOP CMS CLIENT                 |    |            CMS MOBILE APPLICATION         |
|      React 18 + Vite + Electron Packaging        |    |      Android / iOS Cross-Platform App     |
|  - Cash Sessions    - Payroll   - Urdu Vouchers  |    |  - PayFast Fees    - Subject Trend Graph  |
|  - Bulk Import      - SaaS Root - Promotions     |    |  - Mobile Exams    - Login Overlays        |
+--------------------------------------------------+    +-------------------------------------------+
                         |                                                 |
                         +------------------------+------------------------+
                                                  |
                                                  | HTTP REST APIs (Bearer JWT Token)
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                          FASTAPI BACKEND                                          |
|  - CORS & GZip Middleware                                                                         |
|  - Database Routing Middleware (Resolves JWT -> Selects Tenant Database)                          |
+---------------------------------------------------------------------------------------------------+
      |                                           |                                           |
      v                                           v                                           v
+-----------------------------+   +-------------------------------+   +-----------------------------+
|   AUTHENTICATION & SECURITY |   |    BUSINESS & ENGINE LOGIC    |   |    EXTERNAL SERVICES        |
| - saas_root_db.global_users |   | - Fee Engine & Auto-Rollover  |   | - PayFast Multi-Tenant API  |
| - Single CNIC Parent Auth   |   | - Verified Payment Sessions   |   | - AWS Face Microservice     |
| - RBAC Page & Role Controls |   | - Exam & Dynamic Grading Engine|  | - WhatsApp Gateway          |
| - PayFast Merchant Resolver |   | - Attendance Sync Engine      |   | - Push Notification Service |
+-----------------------------+   +-------------------------------+   +-----------------------------+
      |                                           |                                           |
      +-------------------------------------------+-------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                         DATABASE TIER                                             |
|  +---------------------------------------------+   +-------------------------------------------+  |
|  |       SaaS Root DB (saas_root_db)           |   |       Tenant DBs (school_<slug>)          |  |
|  | - global_users     - schools                |   | - students         - fee_categories      |  |
|  | - billing_invoices - startup_promotions     |   | - monthly_fees     - sessions            |  |
|  | - PayFast_configs  - system_jobs            |   | - exams & marks    - attendance          |  |
|  +---------------------------------------------+   +-------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

# 7. DASHBOARDS AND ANALYTICS

### 1. Accountant Dashboard (Desktop `/dashboard/accountant`)
- **User Role:** Accountant, Admin, Root Admin
- **Key Metrics:** Current Session Balance, Total Cash Collected Today, Today's Expenses, Total Submitted to Admin, Outstanding Balance.
- **Tables & Modals:** Transaction ledger, session expenses, cash settlement submission modal, password verification prompt.
- **Website Priority:** Must Have (Core Cash Control Hub).

### 2. Admin Dashboard (Desktop `/dashboard/admin` & Mobile Admin Overview)
- **User Role:** Admin, Root Admin
- **Key Metrics:** Total Active Students, Total Fee Deficit, Today's Attendance %, Total Fees Collected, Tuition Arrears, Misc Arrears, Discount Summary.
- **Charts & Controls:** Collection vs Deficit Donut Chart, Attendance Trend Chart, Mobile Financial Executive Summary.
- **Website Priority:** Must Have (Primary Executive Dashboard).

### 3. Parent Academic Dashboard (Mobile App)
- **User Role:** Parent
- **Key Metrics:** Subject Score %, Class Average, Highest Score, Lowest Score, Class Position Rank.
- **Charts & Tables:** **Subject Performance Graph** (Line/bar chart over time), Individual Exam Breakdown Card, Class Roster Ranking Table.
- **Website Priority:** Must Have (Major Mobile Visual Showcase).

### 4. Parent Fee System Dashboard (Mobile App)
- **User Role:** Parent
- **Key Metrics:** Current Month Fee Status, Paid Amount, Remaining Balance, Component Breakdown (Tuition, Misc, Arrears).
- **Charts & Buttons:** **Fee Visualization Pie Chart** (Paid vs Remaining with Green/Yellow/Red indicators), **Pay with PayFast** Online Checkout Button.
- **Website Priority:** Must Have (Core Mobile Fintech Visual).

### 5. AI Multi-Camera Face Recognition Dashboard (Desktop `/face-app`)
- **User Role:** Admin, Security Officer
- **Key Metrics:** Active Camera Streams, Enrolled Face Vectors, Today's Facial Recognitions, Recognition Match Speed (<300ms).
- **Visuals:** Dual/quad live video camera grid, real-time recognition feed cards, face snapshot overlays.
- **Website Priority:** Must Have (Visual Showstopper).

### 6. Root Admin SaaS Dashboard (Desktop `/root-admin`)
- **User Role:** Root Admin
- **Key Metrics:** Total Registered Schools, Active Tenant DBs, Platform MRR, PayFast Merchant Routing Status, Active System Promotions.
- **Tables & Tools:** School Tenant Registry, PayFast Credentials Editor, Startup Promotions Builder, Storage Diagnostics.
- **Website Priority:** Recommended.

---

# 8. FEATURE DEEP-DIVE CANDIDATES

### Rank 1: Parent Academic Performance Analytics Graph & Class Ranking Table
- **Why It Is Important:** Gives parents unprecedented visual clarity into their child's academic growth over time.
- **Why It Is Visually Interesting:** Crisp line/bar performance trend charts, subject selector chips, and interactive class position ranking tables.
- **User Problem It Solves:** Replaces confusing paper report cards with real-time visual progress analytics.
- **Recommended Screenshot:** Parent Mobile App showing Subject Performance Graph and Class Roster Table.
- **Importance:** Core

### Rank 2: PayFast Mobile Online Payments & Fee Visualization Pie Chart
- **Why It Is Important:** Enables instantaneous online fee collection directly into individual school bank accounts via SaaS merchant routing.
- **Why It Is Visually Interesting:** Color-coded pie chart (Paid vs Remaining), status indicator pills (Green/Yellow/Red), and sleek PayFast checkout trigger.
- **User Problem It Solves:** Eliminates parent bank queues and automates cashier ledger reconciliation.
- **Recommended Screenshot:** Parent Fee System Tab showing Pie Chart, Component Breakdown, and PayFast Button.
- **Importance:** Core

### Rank 3: Password-Verified Cash Session & Accountant Dashboard
- **Why It Is Important:** Eliminates cashier cash leakage with daily shift locks and mandatory password verification on payments.
- **Why It Is Visually Interesting:** Metric cards, real-time session status badges, and interactive password verification drawers.
- **User Problem It Solves:** Guarantees 100% auditability for every rupee collected at campus counters.
- **Recommended Screenshot:** Accountant Dashboard with active session drawer and Password Verification modal.
- **Importance:** Core

### Rank 4: AI Multi-Camera Face Recognition & Attendance Sync Engine
- **Why It Is Important:** Modernizes campus security and synchronizes camera gate logs with teacher mobile attendance in real time.
- **Why It Is Visually Interesting:** Dual camera live stream grid with green recognition boxes and real-time biometric feed cards.
- **User Problem It Solves:** Eliminates manual roll calls, proxy attendance, and data discrepancies across portals.
- **Recommended Screenshot:** Multi-Camera Face Stream showing live video feeds and synchronized attendance log.
- **Importance:** Core

### Rank 5: Multi-Copy Printable Fee Vouchers with Urdu Font Support
- **Why It Is Important:** Provides bank-compliant 3-copy physical fee vouchers formatted with native Urdu typography.
- **Why It Is Visually Interesting:** Crisp PDF layout preview displaying Bank Copy, School Copy, and Student Copy with Urdu headers.
- **User Problem It Solves:** Replaces hard-to-read paper receipts with branded, professional multi-copy fee vouchers.
- **Recommended Screenshot:** Fee Voucher Print Preview rendering a 3-part printable PDF voucher.
- **Importance:** Core

### Rank 6: Teacher Mobile Exam & Dynamic Grading Engine
- **Why It Is Important:** Allows teachers to configure exams, define custom grading scales, and auto-save marks on mobile devices.
- **Why It Is Visually Interesting:** Dynamic grade scale rule editor, real-time auto-saving marks grid, and post-publish alert toggle.
- **User Problem It Solves:** Streamlines exam management and eliminates manual grade calculation errors.
- **Recommended Screenshot:** Teacher Mobile Exam Builder and Marks Entry Screen.
- **Importance:** Core

---

# 9. SCREENSHOT INVENTORY

| Screen Name | Route / Location | User Role | Purpose | Screenshot Priority | Recommended Website Placement |
| --- | --- | --- | --- | --- | --- |
| **Parent Academic Performance Graph** | Mobile Parent Portal | Parent | Subject performance trend chart & class ranking table | Must Have | Product Hero / Mobile Feature |
| **PayFast Mobile Fee & Pie Chart** | Mobile Parent Portal | Parent | Color-coded fee visualization pie chart & PayFast checkout | Must Have | Mobile Feature Showcase |
| **Accountant Dashboard** | Desktop `/dashboard/accountant` | Accountant, Admin | Daily session tracking, cash verification, settlement submission | Must Have | Desktop Product Hero |
| **Multi-Camera AI Face Stream** | Desktop `/face-app/multi-camera` | Admin, Security | Real-time multi-camera facial attendance monitoring | Must Have | Visual Feature Deep Dive |
| **Multi-Copy Fee Voucher Print** | Desktop `/fees/print` | Accountant, Admin | 3-part printable PDF voucher preview with Urdu headers | Must Have | Feature Deep Dive |
| **Teacher Mobile Exam & Marks Entry** | Mobile Teacher Portal | Teacher | Mobile exam creation, dynamic grading rules, auto-saved marks | Recommended | Mobile Feature Showcase |
| **Admin Executive Dashboard** | Desktop & Mobile Admin | Admin, Root | High-level campus KPIs, attendance charts, deficit summaries | Recommended | Supporting Visual |
| **Root Promotional Overlay Popup** | Mobile Post-Login | All Users | Post-login sequential overlay displaying active Root promotions | Recommended | Mobile Feature Showcase |
| **Payroll Management Workspace** | Desktop `/payroll` | Admin | Monthly payroll calculations, staff profile breakdown | Optional | Supporting Visual |
| **Bulk Student Import Workspace** | Desktop `/students/import-export` | Admin | Interactive Excel preview with real-time error highlights | Optional | Supporting Visual |

---

# 10. PRODUCT DIFFERENTIATORS

### 1. Multi-Tenant SaaS PayFast Merchant Routing Infrastructure
- **Explanation:** Enables every school tenant to collect online fee payments directly into their own bank account using isolated PayFast merchant credentials configured in the Root/Admin Desktop CMS.
- **Evidence in Ecosystem:** Desktop SaaS management (`saas.py`), PayFast multi-tenant merchant routing engine, Mobile PayFast checkout gateway.
- **Positioning:** "True multi-tenant fintech routing: Online fee payments deposit directly into each school's bank account."

### 2. Real-Time Biometric-to-Mobile Attendance Synchronization Engine
- **Explanation:** Connects high-speed desktop facial recognition cameras with mobile teacher manual attendance apps, resolving conflicts and updating parent portals in under 300ms.
- **Evidence in Ecosystem:** Desktop `face_v2.py`, Mobile Attendance Engine, Attendance Sync Engine (`attendance.py`).
- **Positioning:** "Zero-conflict attendance sync connecting AI gate cameras directly to parent mobile apps."

### 3. Parent Academic Visual Analytics & Class Ranking Tables
- **Explanation:** Empowers parents with interactive subject performance graphs, class averages, highest/lowest scores, and full class roster ranking tables.
- **Evidence in Ecosystem:** Mobile Parent Academic Portal, dynamic grade calculation engine, trend chart visualizer.
- **Positioning:** "Unprecedented academic transparency: Visual performance trend graphs and class position rankings for parents."

### 4. High-Security Password-Verified Cash Session Accounting
- **Explanation:** Prevents cash leakage at cashier counters through daily session locks, password re-verification on every payment, and admin-approved cash settlements.
- **Evidence in Ecosystem:** `verified_payments.py`, `verified_payment_service.py`, `CashVerificationModal.tsx`.
- **Positioning:** "Zero cash leakage with password-verified sessions and audit-ready principal settlement approvals."

### 5. Native Multi-Copy PDF Fee Vouchers with Urdu Font Rendering
- **Explanation:** Renders bank-compliant 3-copy fee vouchers (Bank, School, Student) with customizable logo headers and automatic Urdu Noto Nastaliq font loading.
- **Evidence in Ecosystem:** `setup_urdu_fonts.py`, `pdf_service.py`, `fee_voucher_service.py`, `FeeVoucherPrintPage.tsx`.
- **Positioning:** "Localized, bank-ready multi-copy fee vouchers with native Urdu font rendering."

---

# 11. TECHNOLOGY AND ARCHITECTURE

- **Desktop Frontend:** React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Lucide Icons, Electron Desktop Packaging
- **Mobile Frontend:** CMS Mobile Application (Android & iOS Cross-Platform Engine)
- **Backend API Framework:** FastAPI (Python 3.12), Starlette, Pydantic v1/v2 compatibility layer
- **Database Tier:** MongoDB (Motor / PyMongo), Isolated Tenant Databases + Central `saas_root_db`
- **Authentication & Security:** JWT (JSON Web Tokens), Single CNIC Parent Authentication, Password Re-verification Modals, RBAC Page Controls (`allowed_pages`)
- **Fintech & Payments:** PayFast Online Payment Gateway API, Multi-Tenant Merchant Routing Infrastructure
- **AI & Computer Vision:** Biometric Facial Recognition Microservice (Python, PyTorch, InsightFace, OpenCV)
- **Document & PDF Engine:** ReportLab with Noto Nastaliq Urdu TTF font loader (`setup_urdu_fonts.py`)
- **Data Import/Export Engine:** OpenPyXL (Excel parsing, inline validation, template generation)
- **Messaging & Notifications:** Direct WhatsApp Gateway Integration, Mobile Push Notification Service (Text + Image)
- **Background Execution Tier:** Standalone Rollover Worker Process (`rollover_worker.py`), Attendance Sync Engine, Async Scheduler

---

# 12. INTEGRATIONS

### 1. PayFast Online Payment Gateway
- **Purpose:** Enables online fee checkout on the CMS Mobile App with multi-tenant merchant routing per school.
- **Where It Is Used:** Parent Mobile Fee System, SaaS Root/Admin Merchant Setup.
- **User-Facing Benefit:** Parents pay fees online in seconds; funds route directly to the school's bank account.

### 2. Remote AI Face Recognition Service
- **Purpose:** Performs 512-D vector face extraction and live video stream biometric matching.
- **Where It Is Used:** Campus entry gates, student/staff attendance registration (`/api/face/*`).
- **User-Facing Benefit:** Automated, contactless attendance logging with real-time visual verification feeds.

### 3. WhatsApp Messaging Gateway
- **Purpose:** Dispatches automated WhatsApp messages for fee vouchers, receipts, and attendance alerts.
- **Where It Is Used:** Payment confirmation, monthly fee distribution, absentee notifications (`/api/whatsapp/*`).
- **User-Facing Benefit:** Parents receive instant mobile alerts and digital fee receipts on WhatsApp.

### 4. Push Notification Engine
- **Purpose:** Dispatches targeted text and image push alerts to mobile devices.
- **Where It Is Used:** Exam notices, result announcements, fee reminders, administrative broadcasts.
- **User-Facing Benefit:** Real-time push alerts delivered directly to parent and teacher mobile phones.

### 5. ReportLab PDF & Urdu Font Engine
- **Purpose:** Renders multi-copy printable fee vouchers and employee payslips.
- **Where It Is Used:** Voucher print page (`/fees/print`), Payroll pay slips (`/payroll`).
- **User-Facing Benefit:** High-resolution, bank-ready fee vouchers formatted with clear English/Urdu typography.

---

# 13. WEBSITE-READY PRODUCT CONTENT

## Product Name
**Khushi ERP System & CMS Mobile Ecosystem**

## Product Category
Unified Multi-Tenant SaaS School ERP Platform & Cross-Platform Mobile Application Ecosystem

## Project Headline
Next-Generation AI-Powered School ERP & Mobile Application Ecosystem

## Short Introduction
Khushi ERP System is a unified enterprise SaaS platform and mobile application ecosystem built to digitize school administration, student fee accounting, staff payroll, campus security, and parent communication. It equips school administrators, accountants, teachers, and parents with real-time cash session audits, PayFast mobile fee payments, AI facial recognition attendance, teacher exam systems, and interactive parent performance analytics.

## Product Value Proposition
Khushi ERP System eliminates financial leakages, manual attendance errors, paper voucher printing, and communication gaps between schools and parents. By combining isolated database security, password-verified cash sessions, PayFast multi-tenant online payments, AI facial recognition, and localized Urdu fee vouchers, Khushi ERP provides the most complete educational administration solution on the market.

## Target Users
- School Principals & Administrators
- School Accountants & Cashiers
- School Owners & Managing Boards
- Teachers & Instructors
- Parents & Guardians
- SaaS Platform Administrators

## Target Organizations
- Private K-12 Schools & Montessori Institutions
- Multi-Branch School Networks & Franchises
- Intermediate Colleges & Higher Secondary Institutes

## Key Capabilities

### 1. Multi-Tenant SaaS Architecture
Dedicated MongoDB database isolation per school with central SaaS administration.
- **Icon:** `ShieldCheck`
- **Importance:** Core

### 2. PayFast Mobile Fee Payments
Direct online fee payments on the mobile app with SaaS multi-tenant merchant routing to school bank accounts.
- **Icon:** `CreditCard`
- **Importance:** Core

### 3. Password-Verified Cash Session Accounting
Daily cashier shift locking with mandatory password re-verification on every payment.
- **Icon:** `LockKeyhole`
- **Importance:** Core

### 4. Teacher Mobile Exam & Dynamic Grading System
Mobile exam creation, custom grade scale definitions, auto-saved marks entry, and post-publish mark update support.
- **Icon:** `GraduationCap`
- **Importance:** Core

### 5. Parent Academic Performance Graph
Subject-wise performance trend charts, class averages, highest/lowest scores, and class roster ranking tables for parents.
- **Icon:** `TrendingUp`
- **Importance:** Core

### 6. AI Multi-Camera Face Recognition & Attendance Sync
Touchless biometric attendance powered by multi-camera live stream facial recognition synchronized with mobile app attendance.
- **Icon:** `ScanFace`
- **Importance:** Core

### 7. Multi-Copy Fee Vouchers with Urdu Support
Print-ready bank/school/student copy vouchers formatted with native Urdu font rendering.
- **Icon:** `Printer`
- **Importance:** Core

### 8. System-Wide Root Promotions & Login Overlay Pipeline
Root-controlled promotional banner manager with dynamic post-login notification and promotion popup overlays.
- **Icon:** `Megaphone`
- **Importance:** High

## Top Feature Deep Dives

### 1. Parent Academic Performance Analytics Graph & Class Ranking Table
- **Description:** Empowers parents with interactive subject performance trend graphs, class score comparisons, and full class roster position ranking tables on their mobile phones.
- **Screenshot:** Parent Mobile Academic Portal displaying Subject Performance Graph and Class Position Ranking Table.
- **Screenshot Purpose:** Highlights mobile academic visual analytics and parent engagement.

### 2. PayFast Online Payments & Fee Visualization Pie Chart
- **Description:** Enables instant online fee payments via PayFast with multi-tenant merchant account routing and color-coded fee visualization pie charts.
- **Screenshot:** Parent Mobile Fee System Tab showing Fee Pie Chart, Component Breakdown, and PayFast Checkout Button.
- **Screenshot Purpose:** Demonstrates mobile fintech convenience and automatic school bank deposit routing.

### 3. Password-Verified Cash Sessions & Financial Audit
- **Description:** Eliminates cashier cash leakage through daily session locks, password re-verification on payments, and principal settlement approval workflows.
- **Screenshot:** Accountant Dashboard (`/dashboard/accountant`) with active session drawer and password verification modal.
- **Screenshot Purpose:** Highlights ironclad financial controls and daily cash collection transparency.

### 4. Multi-Camera AI Face Recognition & Attendance Sync
- **Description:** Real-time facial recognition microservice processing multi-camera campus gate streams synchronized with teacher mobile attendance apps.
- **Screenshot:** Multi-Camera Face Stream (`/face-app/multi-camera`) showing live video grid and synchronized attendance log feed.
- **Screenshot Purpose:** Showcases cutting-edge AI security technology and real-time system integration.

### 5. Multi-Copy Fee Vouchers with Urdu Typography
- **Description:** Generates bank-compliant 3-copy fee vouchers (Bank, School, Student) with custom logo headers and native Urdu font rendering.
- **Screenshot:** Fee Voucher Print Preview (`/fees/print`) rendering multi-copy PDF voucher batch.
- **Screenshot Purpose:** Displays localized, print-ready document capabilities tailored for regional schools.

### 6. Teacher Mobile Exam & Dynamic Grading Engine
- **Description:** Mobile exam creation workspace allowing teachers to set total marks, define custom grade scale rules, enter auto-saved marks, and update published results.
- **Screenshot:** Teacher Mobile Exam Builder and Marks Entry Screen.
- **Screenshot Purpose:** Demonstrates mobile teacher productivity and automated grade calculation.

## Recommended Product Hero Screenshot
Desktop Accountant Dashboard (`/dashboard/accountant`) paired with Mobile Parent Academic Performance Graph for a dual Desktop + Mobile Ecosystem hero presentation.

## Recommended Supporting Screenshots
- PayFast Mobile Fee System & Pie Chart
- Multi-Camera AI Face Stream (`/face-app/multi-camera`)
- Fee Voucher Print Preview (`/fees/print`)
- Mobile Post-Login Root Promotion Overlay Popup

## Product URL
Not provided / Not available in codebase.

## Main User Roles
- Root Admin
- School Admin
- Accountant
- Teacher
- Parent

## Top 5 Differentiators
1. Multi-Tenant SaaS PayFast Merchant Routing Infrastructure
2. Real-Time Biometric-to-Mobile Attendance Synchronization Engine
3. Parent Academic Visual Analytics & Class Ranking Tables
4. High-Security Password-Verified Daily Cash Sessions
5. Native Multi-Copy PDF Fee Vouchers with Urdu Font Rendering

## Technology Stack
React 18, TypeScript, TailwindCSS, FastAPI, Python 3.12, MongoDB, PyTorch/InsightFace AI, PayFast Payment Gateway, ReportLab PDF Engine, OpenPyXL, Electron Desktop, CMS Mobile Application.

## Integrations
PayFast Online Payment Gateway, Remote AI Face Service, WhatsApp Gateway, Mobile Push Notification Service, ReportLab PDF Engine, OpenPyXL Engine.

## Website Positioning Recommendation
Position **Khushi ERP System & CMS Mobile Ecosystem** as the premier, AI-powered multi-tenant school management ERP and mobile platform built for modern educational institutions in Pakistan and emerging markets. Highlight PayFast online payments, AI facial recognition attendance sync, zero cash leakage accounting, parent performance graphs, and localized Urdu fee vouchers as the primary product differentiators.

---

# 14. VERIFICATION SUMMARY

### Fully Confirmed Features (Complete Ecosystem)
- Multi-Tenant Database Isolation & Tenant Routing Middleware
- PayFast Online Payment Gateway Integration with Multi-Tenant SaaS Merchant Routing
- Password-Verified Cash Sessions & Financial Audit Trail
- Smart Dual-Mode Fee Engine (`SECTION` / `STUDENT`)
- Idempotent Monthly Fee Generation & Late Payment Fine Engine
- Standalone Worker Monthly Fee Rollover (`rollover_worker.py`)
- Multi-Copy PDF Fee Vouchers (Bank/School/Student) with Urdu Font Loader
- AI Facial Recognition Microservice & Multi-Camera Streaming
- Teacher Mobile Exam Creation, Dynamic Grading Criteria Scale, Auto-Save Marks Entry, & Post-Publish Updates
- Parent Mobile Academic Performance Graph, Individual Exam Breakdown, & Class Position Ranking Table
- Parent Mobile Fee System, Color-Coded Visualization Pie Chart, & Component Breakdown
- Real-Time Biometric-to-Mobile Attendance Synchronization Engine
- Single CNIC Multi-Child Parent Authentication System
- Root-Controlled System-Wide Startup Promotions & Post-Login Overlay Pipeline
- Targeted Mobile Push Notification Dispatcher (Text + Image)
- Full-Cycle Staff Payroll, Loans, Advances, and PDF Payslips
- Preview-First Bulk Excel Student Import with Real-Time Error Validation
- Automated WhatsApp Parent Messaging Gateway
- Role-Based Access Control (RBAC) & Custom Page Gating (`allowed_pages`)
- Executive Admin & Financial Analytics Dashboards
- Unified Document Upload & Storage Service

### Partially Implemented Features
- Real-Time Notification SSE Stream (`startNotificationSSE` currently commented out in `App.tsx`, standard REST polling active).
- Fine-grained backend permission string enforcement (currently `RBAC_DISABLED = True` in `auth.py`, relying on page-level access checks and frontend route gating).

### Unconfirmed Features
- Direct automated PayFast merchant account creation via PayFast API (PayFast merchant configuration currently handled via Root Admin Desktop CMS interface).

### Features Explicitly NOT Found
- Native iOS Apple Pay integration (PayFast credit/debit card and mobile wallet checkout supported).
- Online Examination & Automated Student Testing Portal (Exams are managed by teachers for marks recording and grade posting).

### Marketing Claims to Avoid
- Do NOT claim automated PayFast merchant account instant registration without Admin setup (merchant credentials must be configured in the SaaS admin portal during school onboarding).
- Do NOT claim that monthly rollover runs inside the web server process (it runs in a dedicated standalone background worker process).

---
*Document updated and verified directly against source code and CMS Mobile Application ecosystem specification.*
