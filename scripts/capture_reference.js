const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const refDir = path.join(__dirname, '..', 'docs', 'reference');
  if (!fs.existsSync(refDir)) fs.mkdirSync(refDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
  });

  const viewports = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '390px', width: 390, height: 844 },
  ];

  const pagesToCapture = [
    { name: 'home', url: 'https://www.kontrora.com/' },
    { name: 'features', url: 'https://www.kontrora.com/#spotlight' },
    { name: 'pricing', url: 'https://www.kontrora.com/#pricing' },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    for (const item of pagesToCapture) {
      console.log(`Capturing ${item.name} at ${vp.name}...`);
      try {
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1500);

        if (item.name === 'home' && vp.name === '1440px') {
          // Extract empirical computed styles
          const computed = await page.evaluate(() => {
            const h1 = document.querySelector('h1');
            const h2 = document.querySelector('h2');
            const heroBtn = document.querySelector('.btn-hero-primary, .btn-primary, button');
            const nav = document.querySelector('nav');
            const card = document.querySelector('.ed-metric, .feature-card, .ed-shift-item');

            const getProps = (el) => {
              if (!el) return null;
              const cs = window.getComputedStyle(el);
              return {
                fontFamily: cs.fontFamily,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                letterSpacing: cs.letterSpacing,
                color: cs.color,
                backgroundColor: cs.backgroundColor,
                borderRadius: cs.borderRadius,
                padding: cs.padding,
                margin: cs.margin,
                border: cs.border,
                boxShadow: cs.boxShadow,
              };
            };

            return {
              h1: getProps(h1),
              h2: getProps(h2),
              heroButton: getProps(heroBtn),
              nav: getProps(nav),
              card: getProps(card),
            };
          });

          fs.writeFileSync(path.join(refDir, 'computed_styles.json'), JSON.stringify(computed, null, 2));
          console.log('✓ Saved computed_styles.json');
        }

        const shotPath = path.join(refDir, `${item.name}_${vp.name}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });
        console.log(`✓ Saved ${shotPath} (${fs.statSync(shotPath).size} bytes)`);
      } catch (err) {
        console.error(`Error on ${item.name} ${vp.name}:`, err.message);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log('--- All Kontrora references successfully saved! ---');
}

main().catch(console.error);
