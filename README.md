# Naseem Ijaz Hospital — Reception & Patient Management System
### Lahore, Pakistan • Production-Ready Full-Stack Clinical Operations Suite

A deployable outpatient (OPD) reception, queue orchestration, consultation, and patient management platform custom-built for **Naseem Ijaz Hospital** (Jail Road, Lahore, Pakistan).

Designed with a **clean, trustworthy, human-centered hospital design system** inspired by institutions like Aga Khan University Hospital, Shaukat Khanum, Mayo Clinic, and Cleveland Clinic. Built specifically for Pakistani clinical operations with fast keyboard-first workflows, Pakistani CNIC & phone formatting, dual-language English/Urdu support, 80mm thermal receipt printing, A4 letterhead prescription printing, and Server-Sent Events (SSE) TV waiting room screens.

---

## 📸 Verified System Screenshots (Complete Light Redesign)

All screenshots captured directly from the live running application via headless Edge:

| View | Screenshot Path | Description |
|---|---|---|
| **Public Landing Hero (1440px)** | [`docs/redesign/01_home_desktop.png`](./docs/redesign/01_home_desktop.png) | Clean light split hero with real hospital team photo, OPD timings card, and quick booking CTAs |
| **Public Landing Full Page** | [`docs/redesign/01_home_desktop_full.png`](./docs/redesign/01_home_desktop_full.png) | Complete 12-section hospital portal: about stats, 10 departments, 8 doctors, patient journey, testimonials, map |
| **Public Landing Mobile (390px)** | [`docs/redesign/01_home_mobile.png`](./docs/redesign/01_home_mobile.png) | Fully responsive mobile view with clean spacing and touch-optimized action cards |
| **Online Appointment Booking** | [`docs/redesign/02_appointments_desktop.png`](./docs/redesign/02_appointments_desktop.png) | Clean self-service patient booking portal with doctor schedules and SMS confirmation |
| **Split-Screen Login** | [`docs/redesign/03_login_split_desktop.png`](./docs/redesign/03_login_split_desktop.png) | Modern split view: hospital photography with navy overlay on left, clean white auth card with one-click demo credentials on right |
| **OPD Live TV Display (/display)** | [`docs/redesign/04_tv_display_light.png`](./docs/redesign/04_tv_display_light.png) | High-contrast light board with airport-style token callouts, navy "Now Serving" cards, next tokens, and ticker |
| **Admin Dashboard Overview** | [`docs/redesign/05_dashboard_overview.png`](./docs/redesign/05_dashboard_overview.png) | 4 KPI cards, hourly patient flow area chart, patient composition donut, department revenue bar chart, and Queue Alerts |
| **Reception Intake & Token Desk** | [`docs/redesign/06_reception_desk.png`](./docs/redesign/06_reception_desk.png) | 30-sec keyboard patient intake, duplicate warnings, recent patients panel, and instant 80mm slip |
| **Doctor Clinical Console** | [`docs/redesign/07_doctor_console.png`](./docs/redesign/07_doctor_console.png) | Patient queue list, allergy alert banner, vitals, provisional diagnosis, medicine autocomplete, and A4 letterhead Rx |
| **Patients Directory** | [`docs/redesign/08_patients_directory.png`](./docs/redesign/08_patients_directory.png) | Complete patient registry table with soft status chips, search/filters, and view details |
| **Live Queue Kanban** | [`docs/redesign/09_live_queue_kanban.png`](./docs/redesign/09_live_queue_kanban.png) | 3-column live queue tracking (Waiting, In Consultation, Completed) with doctor room filters |
| **Billing & Cash Closing** | [`docs/redesign/10_billing_desk.png`](./docs/redesign/10_billing_desk.png) | Invoices ledger, partial/full refunds, and daily cash closing handover |
| **Reports & Analytics** | [`docs/redesign/11_reports_analytics.png`](./docs/redesign/11_reports_analytics.png) | Operational OPD charts (navy/teal palette), queue status directives, audit log, and Excel export |
| **Settings & Hospital Branding** | [`docs/redesign/12_settings_branding.png`](./docs/redesign/12_settings_branding.png) | Hospital profile configuration, thermal/A4 letterhead templates, and database backup trigger |

---

## 🎨 Hospital Design System & Color Palette

The interface follows a calm, clean, trustworthy visual hierarchy:

- **Color Tokens**:
  - **Primary Navy**: `#0B4F8A` (hover `#093F6E`, light tint `#E8F1F9`) — Trustworthy medical authority.
  - **Secondary Teal**: `#1E9E8F` (hover `#167C70`, light tint `#E6F5F3`) — Healing, hygiene, modern care.
  - **Background**: `#F6F9FC` (light hospital gray-blue)
  - **Surface / Cards**: `#FFFFFF` with 1px border `#E3E9EF` and soft shadow (`0 1px 3px rgba(16,24,40,0.06)`).
  - **Text Primary**: `#1B2733` | **Secondary**: `#5B6B7B` | **Muted**: `#8A97A5`
  - **Status Accents**: Success `#2E9E6B`, Warning `#E39B12`, Danger `#D64545`, Info `#2F80C9`.
  - **Sidebar**: Solid navy `#0B3A66` with white text; active item `#14538F` with 3px teal indicator.
  - **Buttons**: 8px radius (`rounded-lg`) solid navy `#0B4F8A` or secondary white with navy border (no pill buttons).
  - **Cards**: 12px radius (`rounded-xl`).
- **Typography**:
  - Headings: `Poppins` (600/700) loaded via `next/font/google`.
  - Body & UI: `Inter` (400/500/600).
  - Urdu Localization: `Noto Nastaliq Urdu` with automated RTL layout (`dir="rtl"`).
- **Real Verified Photography**:
  - All images stored locally in `/public/images/`, `/public/images/doctors/`, and `/public/images/departments/` with full photographer attribution in [`/public/images/CREDITS.md`](./public/images/CREDITS.md).
  - No external CDN dependencies for images. All `<Image>` tags use explicit dimensions and lazy loading.
- **Copy & Tone**:
  - Plain, human, dignified hospital language. Zero AI buzzwords. "Queue Alerts" for OPD queue management.

---

## 🧪 QA Verification Status (Browser-Driven Playwright Suite)

- **Audit Report**: Detailed breakdown available in [`/docs/QA-REPORT.md`](./docs/QA-REPORT.md)
- **Test Command**: `node tests/e2e/critical-flows.js` (runs real Playwright Edge test runner)
- **Unit Test Command**: `npm test` (runs Vitest core suite)
- **Critical Flow Results**: **14 / 14 PASSED (100% Pass Rate)**:
  - `AUTH-01`: Invalid password rejection & alert banner &rarr; **PASS**
  - `AUTH-02`: Admin login & session persistence across reload &rarr; **PASS**
  - `AUTH-03`: Role-based route protection (Receptionist blocked from `/settings`) &rarr; **PASS**
  - `AUTH-04`: CNIC masking for non-admin (`35201-*******-1`) vs unmasked for Admin &rarr; **PASS**
  - `PAT-01`: Patient registration with Urdu characters & auto sequential MR number &rarr; **PASS**
  - `PAT-02`: Live duplicate detection warning by mobile number &rarr; **PASS**
  - `OPD-01`: OPD consultation token creation & 80mm thermal receipt render &rarr; **PASS**
  - `APT-01`: Public online appointment booking with SMS notification simulation &rarr; **PASS**
  - `APT-02`: Double-booking prevention (composite unique constraint returns HTTP 409 Conflict) &rarr; **PASS**
  - `QUE-01`: SSE Live Queue TV Display connection & Web Audio chime callout &rarr; **PASS**
  - `DOC-01`: Doctor consultation console with vitals, diagnosis, and prescription builder &rarr; **PASS**
  - `BIL-01`: Billing ledger invoices and partial/full refund workflow &rarr; **PASS**
  - `REP-01`: Operational KPIs & multi-sheet Excel download (`.xlsx`) &rarr; **PASS**
  - `SET-01`: Hospital branding and emergency helpline configuration updates &rarr; **PASS**

---

## ⚙️ Tech Stack

- **Framework**: Next.js 14 (App Router, Standalone Docker Output) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database & ORM**: PostgreSQL (Production / Docker) & SQLite (Zero-config local dev) via Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider with bcrypt + JWT sessions)
- **Real-Time Queue**: Server-Sent Events (SSE) for live TV display with Web Audio API hospital chime
- **Printing**: Print-optimized CSS for 80mm thermal slips & A4 letterhead prescriptions
- **Exporting**: ExcelJS for multi-sheet reports & Recharts for KPI charts
- **i18n**: English & Urdu (`Noto Nastaliq Urdu`, RTL auto-switch)
- **Testing**: Vitest automated unit test suite + Playwright E2E browser suite

---

## 🔑 Demo Role Credentials

The login page (`/login`) includes **one-click demo credential buttons**:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@naseemijaz.pk` | `Admin@123` | Full access: all modules, settings, audits, backups |
| **Receptionist** | `reception@naseemijaz.pk` | `Reception@123` | Patient intake, visit entry, tokens, queue, billing |
| **Doctor (Cardiology)** | `doctor@naseemijaz.pk` | `Doctor@123` | Doctor console, patient queue, vitals, Rx letterhead |
| **Accountant** | `accountant@naseemijaz.pk` | `Accountant@123` | Invoices, refunds, daily cash handover closing, KPIs |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (tested on Node v20 & v24)
- npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/muzammal5-svg/hospital-system.git
cd "hospital-system"
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default `.env` is pre-configured with SQLite for instant zero-dependency execution).*

### 3. Generate Database & Seed
```bash
# Push schema & create tables
npm run db:push

# Seed with 10 departments, 8 doctors, 50 demo patients, and visits
npm run db:seed
```

### 4. Run Automated Tests
```bash
# Core unit tests
npm test

# Full browser E2E test suite
node tests/e2e/critical-flows.js
```

### 5. Start Production Server or Dev Server
```bash
# Production mode (fastest)
npm run build
npm start

# Development mode
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐳 Docker Deployment (App + PostgreSQL)

A complete production `docker-compose.yml` and multi-stage `Dockerfile` are included.

### Run with Docker Compose:
```bash
docker-compose up -d --build
```

This starts:
1. `nih_postgres`: PostgreSQL 16 Alpine on port `5432` with healthcheck and persistent volume `pgdata`.
2. `nih_web_app`: Production Next.js standalone container on port `3000`.

To seed the Docker database:
```bash
docker exec -it nih_web_app node prisma/seed.js
```

---

## 🌐 Deploy to Vercel (with Supabase or Neon Postgres)

1. Push your repository to GitHub.
2. In Vercel, import your project.
3. Configure the Environment Variables in the Vercel dashboard:
   - `DATABASE_URL`: Your Supabase or Neon PostgreSQL connection string (e.g. `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres?schema=public`)
   - `NEXTAUTH_SECRET`: Random 32+ character string
   - `NEXTAUTH_URL`: Your Vercel production domain (e.g. `https://naseem-ijaz-hospital.vercel.app`)
   - `SMS_PROVIDER`: `mock` (or `twilio` / `generic_http`)
4. Build command: `prisma generate && next build` (configured in [`vercel.json`](./vercel.json)).
5. Deploy.

---

## 🖥️ Alternative VPS Production Guide (Ubuntu 22.04 LTS + Docker + Nginx + SSL)

### Step 1: Install Docker & Nginx on VPS
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx
sudo systemctl enable --now docker
```

### Step 2: Clone Project & Launch Containers
```bash
cd /opt
sudo git clone https://github.com/muzammal5-svg/hospital-system.git hospital
cd hospital
sudo docker-compose up -d --build
```

### Step 3: Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/hospital`:
```nginx
server {
    server_name naseemijazhospital.pk www.naseemijazhospital.pk;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Support Server-Sent Events (SSE) for TV Queue
        proxy_buffering off;
        proxy_read_timeout 86400s;
    }
}
```
Enable site and test:
```bash
sudo ln -s /etc/nginx/sites-available/hospital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Provision SSL with Let's Encrypt
```bash
sudo certbot --nginx -d naseemijazhospital.pk -d www.naseemijazhospital.pk
```

---

## 📱 SMS & WhatsApp Notification Integration

The system uses a pluggable interface ([`src/lib/sms.ts`](./src/lib/sms.ts)).

### Options in `.env`:
1. **Mock Provider** (`SMS_PROVIDER=mock`): Default. Logs SMS payloads to console and audit trail without external charges.
2. **Twilio** (`SMS_PROVIDER=twilio`):
   ```env
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   TWILIO_FROM_PHONE=+1234567890
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```
3. **Generic Pakistani HTTP SMS Gateway** (`SMS_PROVIDER=generic_http`):
   Compatible with Jazz, Telenor, Zong, and Brandverse SMS APIs:
   ```env
   SMS_PROVIDER=generic_http
   GENERIC_SMS_ENDPOINT=https://api.sms-gateway.pk/v1/send
   GENERIC_SMS_API_KEY=your-api-key
   GENERIC_SMS_SENDER_ID=NI-HOSPITAL
   ```

---

## ⌨️ Reception Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| **F2** | Open Patient Registration Form |
| **F3** / **Ctrl+K** | Open Global Patient Command Palette Search |
| **F4** | Issue New OPD Token |
| **Ctrl+P** | Print Active 80mm Slip or A4 Prescription |
| **Esc** | Close Active Modal or Drawer |

---

## 🔄 Switching Databases (PostgreSQL vs SQLite)

To switch between PostgreSQL (for Docker/Production) and SQLite (for zero-config local development):
```bash
# Switch schema and .env to PostgreSQL
npm run db:switch-postgres

# Switch schema and .env to SQLite
npm run db:switch-sqlite
```

---

## 🛡️ Security & Privacy
- Passwords hashed with `bcryptjs` (salt rounds: 10)
- Role-based middleware & API route protection
- Automated CNIC masking (`35201-*******-1`) for non-admin staff
- Rate-limiting enabled on public appointment booking and contact forms
- Honeypot anti-spam protection on all public forms
- Full database audit trail on registrations, visits, and cash transactions
- Healthcheck endpoint: `GET /api/health`

---

## 🏥 Hospital Details
**Naseem Ijaz Hospital**  
Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan  
UAN Helpline: +92 42 3578 9000  
Emergency 24/7 Direct: +92 42 3578 9999  
Email: `info@naseemijazhospital.pk`
