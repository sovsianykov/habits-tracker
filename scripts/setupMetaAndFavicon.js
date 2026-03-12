#!/usr/bin/env node
/**
 * Setup favicons and metadata for the Habbits PWA.
 * Run: node scripts/setupMetaAndFavicon.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC = path.join(__dirname, "..", "public");
const APP = path.join(__dirname, "..", "src", "app");

// Indigo-600 (#6366f1) — matches theme_color in manifest and layout
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#6366f1"/>
  <!-- Checkmark / habit tick -->
  <polyline points="16,34 26,44 48,20" fill="none" stroke="white" stroke-width="6"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const svgBuf = Buffer.from(SVG);

async function generate() {
  // favicon.png  64x64
  await sharp(svgBuf)
    .resize(64, 64)
    .png()
    .toFile(path.join(PUBLIC, "favicon.png"));
  console.log("✓ public/favicon.png");

  // favicon.ico  32x32 (PNG-in-ICO is accepted by all modern browsers)
  await sharp(svgBuf)
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC, "favicon.ico"));
  console.log("✓ public/favicon.ico");

  // apple-touch-icon  180x180
  await sharp(svgBuf)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png");

  // PWA icons referenced in manifest.json
  await sharp(svgBuf)
    .resize(192, 192)
    .png()
    .toFile(path.join(PUBLIC, "icon-192.png"));
  console.log("✓ public/icon-192.png");

  await sharp(svgBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC, "icon-512.png"));
  console.log("✓ public/icon-512.png");

  console.log("\nAll favicon files generated.");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
