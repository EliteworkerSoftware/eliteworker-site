const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[console] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  await page.goto("http://localhost:3000/about", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scratch-about2-hero.png" });

  for (let y = 0; y < 2400; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.screenshot({ path: "scratch-about2-full.png", fullPage: true });

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log("scrollWidth", scrollWidth, "clientWidth", clientWidth);
  console.log("errors", errors);
  await browser.close();
})();
