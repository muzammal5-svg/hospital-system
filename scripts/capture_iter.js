const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const iterName = process.argv[2] || 'iter1';
  const outDir = path.join(__dirname, '..', 'docs', 'after', iterName);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Starting capture for ${iterName} into ${outDir}...`);

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

    // 1. Landing
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `landing_${vp.name}.png`), fullPage: true });

    // Verify computed font and styles
    if (vp.name === '1440px') {
      const styles = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const btn = document.querySelector('.btn-pill');
        const c1 = window.getComputedStyle(h1);
        const c2 = window.getComputedStyle(btn);
        return {
          h1Font: c1.fontFamily,
          h1Size: c1.fontSize,
          h1Weight: c1.fontWeight,
          h1LineHeight: c1.lineHeight,
          h1LetterSpacing: c1.letterSpacing,
          btnFont: c2.fontFamily,
          btnLetterSpacing: c2.letterSpacing,
          btnTextTransform: c2.textTransform,
        };
      });
      fs.writeFileSync(path.join(outDir, 'computed_verification.json'), JSON.stringify(styles, null, 2));
      console.log('Verified computed styles:', styles);
    }

    // 2. Public Appointments
    await page.goto('http://localhost:3000/appointments', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `public_appointments_${vp.name}.png`), fullPage: true });

    // 3. TV Display
    await page.goto('http://localhost:3000/display', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `display_${vp.name}.png`), fullPage: true });

    // 4. Login
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `login_${vp.name}.png`), fullPage: true });

    // Login as Admin
    console.log(`Logging in for ${vp.name}...`);
    await page.fill('input[type="email"]', 'admin@naseemijaz.pk');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // 5. Dashboard
    await page.screenshot({ path: path.join(outDir, `dashboard_${vp.name}.png`), fullPage: true });

    // 6. Reception
    await page.goto('http://localhost:3000/dashboard/reception', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `reception_${vp.name}.png`), fullPage: true });

    // 7. Patients
    await page.goto('http://localhost:3000/dashboard/patients', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `patients_${vp.name}.png`), fullPage: true });

    // 8. Appointments
    await page.goto('http://localhost:3000/dashboard/appointments', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `appointments_${vp.name}.png`), fullPage: true });

    // 9. Queue
    await page.goto('http://localhost:3000/dashboard/queue', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `queue_${vp.name}.png`), fullPage: true });

    // 10. Doctor
    await page.goto('http://localhost:3000/dashboard/doctor', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `doctor_${vp.name}.png`), fullPage: true });

    // 11. Billing
    await page.goto('http://localhost:3000/dashboard/billing', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `billing_${vp.name}.png`), fullPage: true });

    // 12. Reports
    await page.goto('http://localhost:3000/dashboard/reports', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `reports_${vp.name}.png`), fullPage: true });

    // 13. Settings
    await page.goto('http://localhost:3000/dashboard/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, `settings_${vp.name}.png`), fullPage: true });

    console.log(`✓ Completed capturing ${iterName} for ${vp.name}!`);
    await context.close();
  }

  await browser.close();
  console.log(`--- Finished capturing all ${iterName} screenshots! ---`);
}

main().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
