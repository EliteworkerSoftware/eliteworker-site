const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
  const box = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("p")).find(p => p.textContent?.includes("Prefer a live walkthrough"));
    const section = heading.closest("section");
    const rect = section.getBoundingClientRect();
    return { top: rect.top + window.scrollY };
  });
  await page.evaluate((y) => window.scrollTo(0, y - 50), box.top);
  await page.waitForTimeout(300);
  await page.screenshot({ path: "scratch-align-desktop.png" });
  await browser.close();
})();
