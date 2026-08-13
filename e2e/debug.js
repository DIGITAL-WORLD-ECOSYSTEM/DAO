const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });

  try {
    await page.goto('http://localhost:3030/login', { waitUntil: 'networkidle' });
    const content = await page.content();
    console.log("HTML length:", content.length);
    const formCount = await page.locator('form').count();
    console.log("Forms found:", formCount);
  } catch (err) {
    console.error("Error:", err);
  }
  
  await browser.close();
})();
