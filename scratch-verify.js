const { chromium } = require("playwright-core");
const OUT = "C:/Users/ethea/AppData/Local/Temp/claude/c--Users-ethea-Downloads-eliteworker-site-eliteworker-site/1dad803a-ae83-4564-8925-d94541de34fc/scratchpad/";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: OUT + "v3-hero-viewport.png" }); // no scroll - what's visible at load, viewport height 900

  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll("h2")).find((el) => el.textContent.includes("The same job"));
    if (h2) h2.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + "v3-teasers.png" });
  console.log("hero errors:", errors);
  await page.close();

  const page2 = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  const errors2 = [];
  page2.on("console", (msg) => { if (msg.type() === "error") errors2.push(msg.text()); });
  await page2.goto("http://localhost:3000/platform", { waitUntil: "networkidle" });
  await page2.waitForTimeout(1200);
  await page2.screenshot({ path: OUT + "v3-platform.png", fullPage: true });
  console.log("platform errors:", errors2);

  await browser.close();
})();
