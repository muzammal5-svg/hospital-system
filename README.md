# Naseem Ijaz Hospital — Reception & Patient Management System
### Lahore, Pakistan • Production-Ready Full-Stack Clinical Operations Suite

A deployable outpatient (OPD) reception, queue orchestration, consultation, and patient management platform custom-built for **Naseem Ijaz Hospital** (Jail Road, Lahore, Pakistan).

Designed with the **Kontrora SaaS Design System** (extracted from [kontrora.com](https://www.kontrora.com/)), adapted for Pakistani clinical operations with keyboard-first workflows, Pakistani CNIC & phone formatting, dual-language English/Urdu support, 80mm thermal receipt printing, A4 letterhead prescription printing, and Server-Sent Events (SSE) TV waiting room screens.

---

## 📸 Verified System Screenshots (Phase 1 Redesign & Phase 2 QA Evidence)

All screenshots captured directly from the live running application via headless Edge:

| View | Screenshot Path | Description |
|---|---|---|
| **Public Landing Hero (1440px)** | [`docs/after/iter3/landing_1440px.png`](./docs/after/iter3/landing_1440px.png) | Kontrora deep-gradient mesh hero, fluid Syne headline, micro-tracked pill CTAs |
| **Public Landing Mobile (390px)** | [`docs/after/iter3/landing_390px.png`](./docs/after/iter3/landing_390px.png) | Responsive mobile view with clean spacing and touch-optimized layout |
| **Reception Intake & Token Desk** | [`docs/after/iter3/reception_1440px.png`](./docs/after/iter3/reception_1440px.png) | 30-sec keyboard patient intake, duplicate warnings, and instant 80mm slip |
| **OPD Live TV Display (/display)** | [`docs/after/iter3/display_1440px.png`](./docs/after/iter3/display_1440px.png) | Airport-style waiting board with pulsing now-serving callout and audio chime |
| **Doctor Clinical Console** | [`docs/after/iter3/doctor_1440px.png`](./docs/after/iter3/doctor_1440px.png) | Patient vitals, provisional diagnosis, medicine autocomplete, and A4 letterhead Rx |
| **Billing & Cash Closing** | [`docs/after/iter3/billing_1440px.png`](./docs/after/iter3/billing_1440px.png) | Invoices ledger, partial/full refunds, and daily cash closing handover |
| **80mm Thermal Receipt Render** | [`docs/qa-evidence/opd_thermal_receipt_80mm.png`](./docs/qa-evidence/opd_thermal_receipt_80mm.png) | Thermal receipt modal formatted for 80mm roll printers with QR verification |
| **Online Appointment Booking** | [`docs/after/iter3/public_appointments_1440px.png`](./docs/after/iter3/public_appointments_1440px.png) | Self-service booking portal with doctor schedules and SMS confirmation |

---

## 🧪 QA Verification Status (Browser-Driven Playwright Suite)

- **Audit Report**: Detailed breakdown available in [`/docs/QA-REPORT.md`](./docs/QA-REPORT.md)
- **Design Audit**: Iteration notes available in [`/docs/design-audit.md`](./docs/design-audit.md)
- **Test Command**: `npm run test:e2e` (runs real Playwright Edge test runner)
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

## 🎨 Design System & Kontrora Tokens

The design tokens were extracted directly from `kontrora.com` and mapped to hospital operations in [`/design/tokens.json`](./design/tokens.json).

- **Typography**:
  - Display / Headings: `Syne` (weights 700/800, tight letter-spacing `-0.02em`)
  - Body & Numbers: `DM Sans` (weights 400, 500, 600, 700)
  - Urdu Locale: `Noto Nastaliq Urdu` with automated RTL layout (`dir="rtl"`)
- **Color Palette**:
  - Public Hero & Dark Mode: `#050505` to `#07161F` deep radial gradient
  - Kontrora Bone Accent: `#EDE8E0` (dim: `rgba(237, 232, 224, 0.08)`)
  - Primary Clinical Teal: `#0EA5A4` (hover: `#0B7F86`, glow: `rgba(14, 165, 164, 0.35)`)
  - Medical Blue: `#2563EB`
  - Emergency Alert: `#DC2626` (pulsing red)
  - Inside App: **Light Mode by default** (`#F4F8FA` surfaces) for long clinical shifts, with an instant dark mode toggle.
- **Controls**: Pill-shaped CTA buttons (`rounded-full`, min 44px height for touch screens).

---

## ⚙️ Tech Stack

- **Framework**: Next.js 14 (App Router, Standalone Docker Output) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables + Framer Motion
- **Database & ORM**: PostgreSQL (Production / Docker) & SQLite (Zero-config local dev) via Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider with bcrypt + JWT sessions)
- **Real-Time Queue**: Server-Sent Events (SSE) for live TV display with Web Audio API hospital chime
- **Printing**: Print-optimized CSS for 80mm thermal slips & A4 letterhead prescriptions
- **Exporting**: ExcelJS for multi-sheet reports & Recharts for KPI charts
- **i18n**: English & Urdu (`Noto Nastaliq Urdu`, RTL auto-switch)
- **Testing**: Vitest automated test suite

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
git clone <repo-url>
cd "hospital managment system"
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
npm run test
```

### 5. Start Next.js Development Server
```bash
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
sudo git clone <repo-url> hospital
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
