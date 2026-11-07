# Visual Design Audit: Reference (Kontrora) vs. Naseem Ijaz Hospital System

**Audit Date**: November 7, 2026  
**Reference Target**: [https://www.kontrora.com/](https://www.kontrora.com/) (Captured at 1440px and 390px in `/docs/reference/`)  
**Current Baseline**: Captured at 1440px and 390px in `/docs/current/`  
**Goal**: Elevate visual craftsmanship from initial prototype (2/10) to a world-class, production-ready SaaS + Hospital experience (10/10) matching Kontrora's aesthetics with trustworthy medical domain adaptation.

---

## 1. Concrete Visual Gaps & Findings

| Visual Dimension | Reference (Kontrora) | Current App Baseline | Concrete Gap / Problem | Fix / Target Spec |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Typography** | Syne Bold/700, 68px (scales to 88px+), line-height 1.15, letter-spacing -0.025em to -0.04em, bone-white `#EDE8E0`. | Static `text-4xl md:text-7xl` with standard sans weight, line-height ~1.15. | Lacks fluid clamp, tight leading (1.02-1.06), and distinct Syne geometric character on mobile & tablet. | Implement `clamp(2.8rem, 7vw, 5.8rem)` with `leading-[1.03]` and tracking `-0.035em` using `Syne` display font. |
| **Hero Structure & Viewport** | Full-viewport height (`min-h-[92vh]`), deep atmospheric ambient radial glow, layered gradient mesh. | `pt-36 pb-24`, standard section container, feels like a traditional webpage header rather than immersive software experience. | Doesn't fill screen naturally on 1440px, lacks dark gradient mesh depth and floating badge glow. | Full viewport min-h-[90vh], layered radial gradient mesh (`#050505` to `#07161F` to `#0A2330`), ambient teal light cone. |
| **Pill Buttons** | DM Sans, 11.5px (0.72rem), font-weight 800, uppercase letter-spacing +0.12em (+1.15px), pill radius (9999px), subtle border. | Standard `text-sm` pill buttons with normal letter-spacing and standard padding. | Buttons look like generic Bootstrap pills rather than Kontrora's refined micro-tracked pill CTAs. | Enforce Kontrora pill styling: `font-bold text-[11px] sm:text-xs tracking-[0.14em] uppercase py-3.5 px-7 rounded-full`. |
| **Section Spacing & Rhythm** | 96px to 140px vertical padding (`py-28` to `py-36`) on desktop, 64px to 80px on mobile. 1240px container max-width. | Spacing varies from `py-16` to `py-24`, some sections feel crowded. | Vertical cadence is uneven; lacks breathing room between large stat blocks and feature grids. | Standardize all section paddings: `py-28 md:py-36` desktop, `py-20` mobile. Container max-w-7xl with uniform horizontal gutters. |
| **Card Styling & Borders** | Dark near-black surfaces (`#0B0F14`, `#111111`) with hairline 1px borders (`rgba(237,232,224,0.10)`), 20px-24px radius, soft drop shadow. | Inconsistent borders (some `border-white/10`, some default), standard 12px radius. | Cards look flat and lack the Kontrora luxury glass-surface depth. | 20px (`rounded-2xl`) border-radius, `border border-white/[0.09] bg-[#0A0D12]`, subtle hover glow with `hover:border-teal-500/40`. |
| **Numbered 01/02/03 Sections** | Huge subdued numerals (48px-64px), bone-dim `#EDE8E0/20` or muted teal, high contrast with title. | Numbers present but standard size and spacing, lacking the dramatic editorial poster feel. | Visual hierarchy does not guide the eye down the page. | Numeral size `text-5xl md:text-6xl font-black font-display text-teal-400/30 group-hover:text-teal-400/90 transition-colors`. |
| **Product Showcase Mockup** | Real high-resolution app screenshots enclosed in a luxury browser frame with dark chrome and window controls. | Hand-coded HTML mini mockups that feel simplistic. | Doesn't showcase the actual live software UI authentically. | Replace with genuine browser-frame mockup embedding real views of Reception Intake, Doctor Consultation, and Live TV Queue. |
| **Staff Dashboard Interior** | Professional enterprise SaaS feel: clean white `#FFFFFF` cards on soft grey `#F4F8FA`, fixed sidebar, top bar with breadcrumb & user role pill, sticky table headers. | Basic sidebar layout, table headers lack sticky glass effect, status badges lack colored dot indicators. | Looks utilitarian rather than an elite hospital operating system. | Complete dashboard restyle: sticky table headers, hover rows, status pills with pulsing/solid indicator dots, floating form labels, breadcrumbs. |
| **TV Queue Display (`/display`)** | Large 4K/1080p airport/hospital board aesthetic with high-contrast split panels (Now Calling vs Upcoming), clear audio bell. | Basic grid board. | Lacks the high-impact airport flight-board luxury feel. | High contrast navy/black glass card board, animated token pulse, flashing emergency alerts, room directions. |
| **Urdu / RTL Support** | Symmetrical RTL mirroring, readable Noto Nastaliq Urdu font, line-height 1.85+, proper Urdu label spacing. | Basic `dir="rtl"`, but some flex directions and icons do not mirror properly. | Awkward icon placement and tight Urdu line heights. | Proper logical classes (`ms-*`, `me-*`, `start-*`, `end-*`), custom `font-urdu` styling, and increased line height for Urdu glyphs. |

---

## 2. Iteration Plan

- **Iteration 1**: Typography, Hero, Pill Buttons, and Section Rhythm Overhaul.
  - Apply fluid clamp headline typography (`clamp(2.8rem, 7.5vw, 5.8rem)`) with tight line height (`1.03`).
  - Upgrade hero with full-viewport height, atmospheric mesh background, ambient teal cone, and Kontrora micro-tracked pill CTAs.
  - Implement luxury browser-frame product showcase.
- **Iteration 2**: Numbered 01/02/03 Cards, Stat Blocks, Medical Visuals, Doctor Directory, and Booking Interface.
  - Upgrade cards with hairline borders (`rgba(255,255,255,0.08)`), dark glass surfaces, and glowing hover states.
  - Doctor cards with gradient avatar rings, clinical badges, and clean fee tags.
  - Clean bilingual support (English + Nastaliq Urdu) across all public components.
- **Iteration 3**: Staff Interior Dashboard Polish, TV Waiting Room Board, and Sticky Tables.
  - Refine sidebar with active teal pills, shortcut badges (`F2`, `F4`, `Ctrl+K`), role badges, and breadcrumb header.
  - Enhance table rows with hover states, sticky headers, and status chips (Waiting, Consulting, Completed, Emergency).
  - Modernize TV display (`/display`) with airport-style split screen, pulsing callout tokens, and audio chime.

---

## 3. Iteration Log & Verification

### Iteration 1: Typography, Fluid Clamp, Pill Micro-Tracking, and Hero Mesh
- **Changes Applied**:
  - `Syne` fluid clamp typography `hero-headline`: `clamp(2.6rem, 6.8vw, 5.8rem)` with tight leading `1.03` and tight tracking `-0.038em`.
  - Micro-tracked pill CTAs (`.btn-pill`): `letterSpacing: 0.12em (1.44px)`, `fontWeight: 700/800`, `textTransform: uppercase`, min-height 44px.
  - Full-viewport dark hero (`min-h-[92vh]`) with layered gradient mesh (`#07161F` to `#050505`), radial teal glow, and subtle ambient dot matrix.
  - Realistic browser-frame product showcase with live reception token mockup, queue board simulation, and A4 prescription preview.
  - Standardized section padding to generous `py-28 md:py-36` on desktop.
- **Empirical Computed Style Verification** (`docs/after/iter1/computed_verification.json`):
  - `h1Font`: `"__Syne_d8518d, __Syne_Fallback_d8518d, Syne, sans-serif"` (Verified Syne loaded, no system fallback)
  - `h1Size`: `92.8px` (Fluid clamp verified)
  - `h1Weight`: `800`
  - `h1LineHeight`: `95.584px` (1.03 ratio)
  - `h1LetterSpacing`: `-3.5264px` (-0.038em)
  - `btnFont`: `"__DM_Sans_d9d98a, __DM_Sans_Fallback_d9d98a, -apple-system, BlinkMacSystemFont, sans-serif"`
  - `btnLetterSpacing`: `1.44px` (+0.12em Kontrora micro-tracking)
- **Screenshots Saved**: `docs/after/iter1/` (26 screenshots at 1440px and 390px).

---

### Iteration 2: Numbered 01/02/03 Feature Cards, Doctor Grid, and Online Booking Portal
- **Changes Applied**:
  - Numbered cards: dramatic `01 / 02 / 03` numerals with subtle teal glow and bone/teal hover highlights.
  - Doctor directory cards: gradient avatar initial rings, clear specialty tags, room number badges, and fee tags in PKR.
  - Public booking portal (`/appointments`): upgraded with ambient glow mesh, guideline cards (Arrive 15 mins early, pay at reception, parking/wheelchair assistance).
  - Stat blocks: large numerals (30+ min, 5+, 0) with high-contrast text and dark surface cards (`#0A0D12`).
  - Bilingual typography: integrated Noto Nastaliq Urdu with line height 1.8+ and symmetrical RTL alignment.
- **Screenshots Saved**: `docs/after/iter2/` (26 screenshots at 1440px and 390px).

---

### Iteration 3: Staff Interior Dashboard, TV Waiting Room Board, and Sticky Tables
- **Changes Applied**:
  - Fixed sidebar with active indicator pills, shortcut badges (`F2`, `F4`, `Ctrl+K`), and user role chip.
  - Top bar with live breadcrumbs, role pill, language switcher, and TV display shortcut.
  - Table styling: sticky headers with subtle blur, zebra/hover rows, and status chips (Waiting, In Consultation, Completed, Emergency).
  - TV Display (`/display`): airport-style split screen, pulsing callout token with room number and doctor name, live digital clock, and audio chime toggle.
  - Keyboard shortcuts (`F2`, `F3`, `F4`, `Ctrl+K`) registered in layout and client views.
  - CNIC masking verified: full formatting for ADMIN, masked for non-admin.
- **Screenshots Saved**: `docs/after/iter3/` (26 screenshots at 1440px and 390px).
