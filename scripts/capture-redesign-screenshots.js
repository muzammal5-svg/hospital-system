const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'docs', 'redesign');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function capture() {
  console.log('[Capture] Launching Edge browser...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  // Desktop context
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await desktop.newPage();

  // Mobile context
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mPage = await mobile.newPage();

  console.log('[Capture] 1. Capturing Public Home Page (Desktop & Mobile)...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '01_home_desktop.png'), fullPage: false });
  await page.screenshot({ path: path.join(OUT_DIR, '01_home_desktop_full.png'), fullPage: true });

  await mPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await mPage.waitForTimeout(1500);
  await mPage.screenshot({ path: path.join(OUT_DIR, '01_home_mobile.png'), fullPage: false });

  console.log('[Capture] 2. Capturing Appointments Booking Page...');
  await page.goto('http://127.0.0.1:3000/appointments', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '02_appointments_desktop.png') });

  console.log('[Capture] 3. Capturing Split-Screen Login Page...');
  await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '03_login_split_desktop.png') });

  await mPage.goto('http://127.0.0.1:3000/login', { waitUntil: 'domcontentloaded' });
  await mPage.waitForTimeout(1500);
  await mPage.screenshot({ path: path.join(OUT_DIR, '03_login_mobile.png') });

  console.log('[Capture] 4. Capturing High-Contrast Light TV Board (/display)...');
  await page.goto('http://127.0.0.1:3000/display', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '04_tv_display_light.png') });

  console.log('[Capture] 5. Logging in as Admin to capture Dashboard pages...');
  await page.goto('http://127.0.0.1:3000/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"]', 'admin@naseemijaz.pk');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('[Capture] 6. Dashboard Admin Overview...');
  await page.screenshot({ path: path.join(OUT_DIR, '05_dashboard_overview.png') });

  console.log('[Capture] 7. Reception Desk...');
  await page.goto('http://127.0.0.1:3000/dashboard/reception', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '06_reception_desk.png') });

  console.log('[Capture] 8. Doctor Consultation Console...');
  await page.goto('http://127.0.0.1:3000/dashboard/doctor', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '07_doctor_console.png') });

  console.log('[Capture] 9. Patients Directory...');
  await page.goto('http://127.0.0.1:3000/dashboard/patients', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '08_patients_directory.png') });

  console.log('[Capture] 10. Live Queue Kanban...');
  await page.goto('http://127.0.0.1:3000/dashboard/queue', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '09_live_queue_kanban.png') });

  console.log('[Capture] 11. Billing & Daily Cash Closing...');
  await page.goto('http://127.0.0.1:3000/dashboard/billing', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '10_billing_desk.png') });

  console.log('[Capture] 12. Reports & Analytics...');
  await page.goto('http://127.0.0.1:3000/dashboard/reports', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '11_reports_analytics.png') });

  console.log('[Capture] 13. Settings & Hospital Branding...');
  await page.goto('http://127.0.0.1:3000/dashboard/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '12_settings_branding.png') });

  await browser.close();
  console.log('[Capture] All redesign screenshots captured successfully into docs/redesign!');
}

capture().catch((err) => {
  console.error('[Capture] Error:', err);
  process.exit(1);
});
