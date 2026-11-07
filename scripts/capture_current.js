const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const currentDir = path.join(__dirname, '..', 'docs', 'current');
  if (!fs.existsSync(currentDir)) fs.mkdirSync(currentDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  const viewports = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '390px', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    // 1. Capture Public Landing
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `landing_${vp.name}.png`), fullPage: true });

    // 2. Capture Public Appointments
    await page.goto('http://localhost:3000/appointments', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `public_appointments_${vp.name}.png`), fullPage: true });

    // 3. Capture TV Display
    await page.goto('http://localhost:3000/display', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `display_${vp.name}.png`), fullPage: true });

    // 4. Capture Login Page
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `login_${vp.name}.png`), fullPage: true });

    // Now log in as admin
    console.log(`Logging in as Admin for ${vp.name}...`);
    await page.fill('input[type="email"]', 'admin@naseemijaz.pk');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // 5. Capture Dashboard / Reports
    await page.screenshot({ path: path.join(currentDir, `dashboard_${vp.name}.png`), fullPage: true });

    // 6. Capture Reception
    await page.goto('http://localhost:3000/dashboard/reception', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `reception_${vp.name}.png`), fullPage: true });

    // 7. Capture Patients
    await page.goto('http://localhost:3000/dashboard/patients', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `patients_${vp.name}.png`), fullPage: true });

    // 8. Capture Appointments
    await page.goto('http://localhost:3000/dashboard/appointments', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `appointments_${vp.name}.png`), fullPage: true });

    // 9. Capture Queue
    await page.goto('http://localhost:3000/dashboard/queue', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `queue_${vp.name}.png`), fullPage: true });

    // 10. Capture Doctor Panel
    await page.goto('http://localhost:3000/dashboard/doctor', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `doctor_${vp.name}.png`), fullPage: true });

    // 11. Capture Billing
    await page.goto('http://localhost:3000/dashboard/billing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `billing_${vp.name}.png`), fullPage: true });

    // 12. Capture Reports
    await page.goto('http://localhost:3000/dashboard/reports', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `reports_${vp.name}.png`), fullPage: true });

    // 13. Capture Settings
    await page.goto('http://localhost:3000/dashboard/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(currentDir, `settings_${vp.name}.png`), fullPage: true });

    console.log(`✓ Completed capturing all pages for ${vp.name}!`);
    await context.close();
  }

  await browser.close();
  console.log('--- Finished capturing all current app screenshots! ---');
}

main().catch(console.error);
