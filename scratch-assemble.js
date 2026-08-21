const { chromium } = require("playwright-core");
const OUT = "C:/Users/ethea/AppData/Local/Temp/claude/c--Users-ethea-Downloads-eliteworker-site-eliteworker-site/1dad803a-ae83-4564-8925-d94541de34fc/scratchpad/";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: OUT + "assemble-A-t0.png" });
  await page.waitForTimeout(120);
  await page.screenshot({ path: OUT + "assemble-B-t120.png" });
  await page.waitForTimeout(200);
  await page.screenshot({ path: OUT + "assemble-C-t320.png" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + "assemble-D-t620.png" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + "assemble-E-t1120.png" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUT + "assemble-F-t1720.png" });
  await browser.close();
})();
