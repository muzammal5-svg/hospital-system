const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const styles = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const body = document.body;
    const btn = document.querySelector('.btn-pill');
    return {
      bodyFont: window.getComputedStyle(body).fontFamily,
      h1Font: window.getComputedStyle(h1).fontFamily,
      btnFont: window.getComputedStyle(btn).fontFamily,
    };
  });

  console.log('COMPUTED_FONTS:', JSON.stringify(styles, null, 2));
  await browser.close();
}

main().catch(console.error);
