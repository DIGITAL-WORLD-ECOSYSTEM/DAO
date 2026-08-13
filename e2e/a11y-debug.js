const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  
  async function runAxe(path, label) {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`http://localhost:3030${path}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('form');
      const results = await new AxeBuilder({ page }).analyze();
      
      const violations = results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map(n => ({
          html: n.html,
          target: n.target
        }))
      }));
      
      fs.writeFileSync(`axe-${label}.json`, JSON.stringify(violations, null, 2));
      console.log(`[${label}] Violations:`, violations.length);
    } catch (err) {
      console.error(`[${label}] Error:`, err);
    }
    await page.close();
  }

  await runAxe('/login', 'login');
  await runAxe('/register', 'register');
  
  await browser.close();
})();
