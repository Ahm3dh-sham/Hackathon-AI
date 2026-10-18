import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname, "../public/flyover");
const PIECES_DIR = path.join(OUT_DIR, "pieces");

fs.mkdirSync(PIECES_DIR, { recursive: true });

async function main() {
  console.log("Launching headless Chromium at 1440px wide, deviceScaleFactor: 2...");
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
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  console.log("Opening http://localhost:3000?capture=1 ...");
  await page.goto("http://localhost:3000?capture=1", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForSelector("#top", { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  // Scroll to bottom once so lazy images and scroll animations finish, then back to top
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);

  // Lock animations/transitions & collect page metrics + data-layer coordinates
  const metadata = await page.evaluate(() => {
    const style = document.createElement("style");
    style.id = "capture-lock-style";
    style.textContent = `
      html {
        scroll-behavior: auto !important;
      }
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
    window.scrollTo({ top: 0, behavior: "instant" });

    const pageWidth = 1440;
    const pageHeight = Math.round(document.documentElement.scrollHeight);

    const heroEl = document.getElementById("top");
    const heroRect = heroEl ? heroEl.getBoundingClientRect() : { top: 0, height: 860 };
    const heroBottom = Math.round(heroRect.top + window.scrollY + heroRect.height);

    const sec2TitleEl = document.getElementById("workflow-title");
    const sec2TitleY = sec2TitleEl
      ? Math.round(sec2TitleEl.getBoundingClientRect().top + window.scrollY + sec2TitleEl.getBoundingClientRect().height * 0.5)
      : 1180;

    const footerEl = document.querySelector("footer.site-footer");
    const footerY = footerEl
      ? Math.round(footerEl.getBoundingClientRect().top + window.scrollY + 80)
      : pageHeight - 160;

    const layers = [];
    const els = Array.from(document.querySelectorAll("[data-layer]"));
    for (const el of els) {
      const id = el.getAttribute("data-layer");
      const r = el.getBoundingClientRect();
      const x = Math.round(r.left + window.scrollX);
      const y = Math.round(r.top + window.scrollY);
      const width = Math.round(r.width);
      const height = Math.round(r.height);
      const pad = 28;

      const clipX = Math.max(0, x - pad);
      const clipY = Math.max(0, y - pad);
      const clipRight = Math.min(pageWidth, x + width + pad);
      const clipBottom = Math.min(pageHeight, y + height + pad);

      layers.push({
        id,
        x,
        y,
        width,
        height,
        pad,
        clip: {
          x: clipX,
          y: clipY,
          width: clipRight - clipX,
          height: clipBottom - clipY,
        },
        file: `/flyover/pieces/${id}.png`,
      });
    }

    return {
      pageWidth,
      pageHeight,
      heroBottom,
      sec2TitleY,
      footerY,
      layers,
    };
  });

  console.log(`Page dimensions: ${metadata.pageWidth}x${metadata.pageHeight}, layers: ${metadata.layers.length}`);

  // 1. Screenshot the full page with [data-layer] pieces hidden
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("[data-layer]")) {
      el.style.visibility = "hidden";
    }
  });
  await page.waitForTimeout(100);

  const basePath = path.join(OUT_DIR, "page-base.png");
  await page.screenshot({
    path: basePath,
    fullPage: true,
    omitBackground: false,
  });
  console.log("Saved base page screenshot ->", basePath);

  // 2. Screenshot each [data-layer] piece alone on a transparent background with 28px padding
  // To guarantee 100% transparency around the piece while keeping its exact styling,
  // we hide everything except the target piece and its ancestors/descendants.
  for (const layer of metadata.layers) {
    await page.evaluate((targetId) => {
      for (const el of document.querySelectorAll(".is-isolated-ancestor")) {
        el.classList.remove("is-isolated-ancestor");
      }
      const target = document.querySelector(`[data-layer="${targetId}"]`);
      if (target) {
        target.style.visibility = "visible";
        let parent = target.parentElement;
        while (parent && parent !== document.documentElement) {
          parent.classList.add("is-isolated-ancestor");
          parent = parent.parentElement;
        }
      }

      let styleEl = document.getElementById("piece-isolation-style");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "piece-isolation-style";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        html, body {
          background: transparent !important;
          background-image: none !important;
        }
        .is-isolated-ancestor {
          background: transparent !important;
          background-image: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
        .is-isolated-ancestor::before,
        .is-isolated-ancestor::after {
          display: none !important;
          opacity: 0 !important;
        }
        body *:not(.is-isolated-ancestor):not([data-layer="${targetId}"]):not([data-layer="${targetId}"] *) {
          visibility: hidden !important;
          opacity: 0 !important;
        }
        [data-layer="${targetId}"],
        [data-layer="${targetId}"] * {
          visibility: visible !important;
        }
        [data-layer="${targetId}"] {
          box-shadow: none !important;
        }
        article[data-layer="${targetId}"],
        .preview-window[data-layer="${targetId}"],
        .doc-paper[data-layer="${targetId}"],
        .float-chip[data-layer="${targetId}"] {
          background-color: #fffdf8 !important;
        }
      `;
    }, layer.id);

    const viewportClip = await page.evaluate((clip) => {
      const targetScroll = Math.max(0, clip.y - 120);
      window.scrollTo({ top: targetScroll, behavior: "instant" });
      const actualScrollY = window.scrollY;
      return {
        x: clip.x,
        y: Math.max(0, clip.y - actualScrollY),
        width: clip.width,
        height: Math.min(clip.height, window.innerHeight - Math.max(0, clip.y - actualScrollY)),
      };
    }, layer.clip);

    await page.waitForTimeout(40);
    const piecePath = path.join(PIECES_DIR, `${layer.id}.png`);
    await page.screenshot({
      path: piecePath,
      clip: viewportClip,
      omitBackground: true,
    });
    console.log(`Saved piece [${layer.id}] (${viewportClip.width}x${viewportClip.height}) -> ${piecePath}`);
  }

  const jsonPath = path.join(OUT_DIR, "layers.json");
  fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2), "utf-8");
  console.log("Saved layer metadata ->", jsonPath);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
