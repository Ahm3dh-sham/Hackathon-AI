import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STILLS_DIR = path.resolve(__dirname, "../public/flyover/stills");
const ARTIFACT_DIR = "C:/Users/Ahmed hisham/.gemini/antigravity/brain/4e2cd9f9-d1f3-47a4-8b95-824f6b46eb0e";

fs.mkdirSync(STILLS_DIR, { recursive: true });

const TIMESTAMPS = [0, 1.6, 2.5, 5, 6.5, 9.3, 11];

async function main() {
  console.log("Launching Chromium with real D3D11 GPU for 1440x1152 WebGL2 still capture...");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: [
      "--use-angle=d3d11",
      "--enable-gpu",
      "--ignore-gpu-blocklist",
      "--hide-scrollbars",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1152 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  await page.goto("http://localhost:3000/flyover/index.html?headless=1", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForFunction(() => window.__FLYOVER_READY__ === true, null, {
    timeout: 30000,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  for (const t of TIMESTAMPS) {
    await page.evaluate((timeVal) => {
      window.seek(timeVal);
    }, t);
    await page.waitForTimeout(80);

    const fileLabel = `still-${t.toFixed(1)}s.png`;
    const publicPath = path.join(STILLS_DIR, fileLabel);
    const artifactPath = path.join(ARTIFACT_DIR, fileLabel);

    await page.screenshot({
      path: publicPath,
      clip: { x: 0, y: 0, width: 1440, height: 1152 },
    });
    fs.copyFileSync(publicPath, artifactPath);
    console.log(`Captured t=${t}s -> ${publicPath} & ${artifactPath}`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
