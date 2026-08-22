const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[console] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // Hero W (right side, mid)
  await page.screenshot({ path: "scratch-thirdbar-hero.png", clip: { x: 1200, y: 300, width: 400, height: 500 } });

  // Platform W (top-right)
  await page.evaluate(() => window.scrollTo(0, 950));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "scratch-thirdbar-platform.png", clip: { x: 1200, y: 100, width: 400, height: 400 } });

  // Final CTA W (top-right)
  await page.evaluate(() => document.querySelector("footer").scrollIntoView({ block: "end" }));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollBy(0, -1400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "scratch-thirdbar-cta.png" });

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log("scrollWidth", scrollWidth, "clientWidth", clientWidth);
  console.log("errors", errors);
  await browser.close();
})();
