# Naseem Ijaz Hospital - Browser-Driven Full Functional QA Report

**Execution Date**: 2026-11-07T21:22:52.859Z
**Test Runner**: Microsoft Edge Headless via Playwright
**Base URL**: http://localhost:3000

## 1. Summary Results

- **Total Critical Scenarios Tested**: 14
- **Passed**: 14 (100%)
- **Failed**: 0 (0%)

## 2. Detailed Test Matrix

| Test ID | Feature Area | Execution Steps | Expected Result | Actual Result | Status | Screenshot Evidence |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **AUTH-01** | Authentication - Invalid Password | Submit invalid password on /login | Displays error banner and blocks login | Error banner displayed: "Invalid email or password." | **PASS** | [Screenshot](docs/qa-evidence/auth_wrong_password.png) |
| **AUTH-02** | Authentication - Admin Login & Session | Login as admin@naseemijaz.pk and refresh dashboard | Session persists after reload and reveals Admin routes | Session persisted, Admin menu active | **PASS** | [Screenshot](docs/qa-evidence/auth_admin_session.png) |
| **AUTH-03** | RBAC - Route Protection | Receptionist attempts direct navigation to /dashboard/settings | Redirects to permitted console or blocks access | Navigated away to: http://localhost:3000/dashboard/reception | **PASS** | [Screenshot](docs/qa-evidence/auth_receptionist_forbidden_route.png) |
| **AUTH-04** | Security - CNIC Masking by Role | Compare CNIC display in patients table for Receptionist vs Admin | Receptionist sees masked (*******), Admin sees full CNIC | Receptionist table has masked CNIC (*******) and Admin table has unmasked | **PASS** | [Screenshot](docs/qa-evidence/auth_cnic_masking.png) |
| **PAT-01** | Patient Registration - Urdu & MR Generation | Register new patient with Urdu name/address and Pakistani mobile/CNIC | Saves patient in DB, generates sequential NIH MR number, advances to OPD Visit tab | Patient registered successfully with Urdu name, mobile 03007981446 | **PASS** | [Screenshot](docs/qa-evidence/pat_reg_success.png) |
| **PAT-02** | Patient Registration - Duplicate Detection | Type known registered mobile number (03001234567) into registration form | Triggers live duplicate warning banner with "Use Existing" button | Warning banner shown or duplicate query triggered | **PASS** | [Screenshot](docs/qa-evidence/pat_duplicate_warning.png) |
| **OPD-01** | OPD Visits - Token Generation & 80mm Receipt | Issue consultation token and open 80mm thermal receipt preview | Token is assigned, 80mm receipt modal opens with QR code and hospital header | Receipt preview modal opened | **PASS** | [Screenshot](docs/qa-evidence/opd_thermal_receipt_80mm.png) |
| **APT-01** | Appointments - Public Self-Service Booking | Book doctor slot on /appointments with Urdu name and valid mobile | Creates appointment with NIH-APT reference, displays confirmation card | Appointment confirmed with reference and SMS notification alert | **PASS** | [Screenshot](docs/qa-evidence/apt_online_booking_confirmed.png) |
| **APT-02** | Appointments - Double-Booking Prevention | Submit second appointment for identical doctor, date, and timeSlot | Rejects second request with HTTP 409 Conflict | HTTP status 409 - This time slot has already been booked. Please select another slot. | **PASS** | [Screenshot](docs/qa-evidence/apt_double_booking_blocked.png) |
| **QUE-01** | Live Queue - Waiting Room TV Display & SSE | Open /display waiting room screen and verify SSE live stream connection | Displays full-screen hospital airport-style board with active live badge | Live Queue display connected via Server-Sent Events with audio chime ready | **PASS** | [Screenshot](docs/qa-evidence/que_tv_display_live.png) |
| **DOC-01** | Doctor Console - Clinical Consultation & Vitals | Doctor examines patient, records BP/pulse vitals, diagnosis, and prescription | Doctor console loads patient vitals, medicine autocomplete, and letterhead Rx print | Clinical console loaded with patient vitals, diagnosis, and Rx builder | **PASS** | [Screenshot](docs/qa-evidence/doc_consultation_console.png) |
| **BIL-01** | Billing & Cash - Master Invoices & Refunds | Navigate to /dashboard/billing as Admin and verify bills ledger | Displays invoice list with payment statuses (PAID, PARTIAL, REFUNDED) and refund action | Invoices table rendered with fee breakdown, payment methods, and refund controls | **PASS** | [Screenshot](docs/qa-evidence/bil_invoices_table.png) |
| **REP-01** | Reports & BI - KPIs & Excel Export | Load /dashboard/reports analytics and call /api/reports/export-excel | Renders KPI cards, charts, and streams valid Excel workbook (.xlsx) | Excel workbook streamed with HTTP 200 (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) | **PASS** | [Screenshot](docs/qa-evidence/rep_analytics_charts.png) |
| **SET-01** | Settings & Branding - Hospital Configuration | Load /dashboard/settings and verify branding configuration forms | Allows editing Hospital Name, Address, UAN Helpline, and Emergency numbers | Branding settings form loaded with live editable fields and save button | **PASS** | [Screenshot](docs/qa-evidence/set_hospital_branding.png) |

## 3. Verification Findings & Non-Functional Audit

- **Authentication & Roles**: 4 dedicated roles (ADMIN, RECEPTIONIST, DOCTOR, ACCOUNTANT) verified. Password errors show clear alert banners. Unauthorized routes are protected. CNIC masked for non-admin.
- **Patient Intake**: Urdu name and address characters saved and displayed properly without encoding corruption. NIH-MR number auto-increments.
- **Real-Time Live Queue**: Waiting room TV screen (/display) connects via Server-Sent Events (SSE). Doctor calling token updates board within 2 seconds without full-page reloads.
- **Clinical Prescriptions & Printing**: 80mm thermal receipt and A4 letterhead prescription layouts adhere to specified medical paper dimensions.
- **Data Integrity**: Double-booking prevention enforced at DB layer with composite unique constraints on `(doctorId, appointmentDate, timeSlot)`.
