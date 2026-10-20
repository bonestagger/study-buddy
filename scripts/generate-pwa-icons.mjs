import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const svgPath = path.join(publicDir, 'icon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');

  const maskableSvgPath = path.join(publicDir, 'icon-maskable.svg');
  const maskableSvgContent = fs.readFileSync(maskableSvgPath, 'utf-8');

  const getHtml = (content) => `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, html { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: transparent; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  const targets = [
    { size: 192, out: path.join(iconsDir, 'icon-192x192.png'), content: svgContent },
    { size: 512, out: path.join(iconsDir, 'icon-512x512.png'), content: svgContent },
    { size: 180, out: path.join(publicDir, 'apple-touch-icon.png'), content: svgContent },
    { size: 192, out: path.join(publicDir, 'icon-192.png'), content: svgContent },
    { size: 512, out: path.join(publicDir, 'icon-512.png'), content: svgContent },
    { size: 192, out: path.join(iconsDir, 'icon-maskable-192x192.png'), content: maskableSvgContent },
    { size: 512, out: path.join(iconsDir, 'icon-maskable-512x512.png'), content: maskableSvgContent },
  ];

  for (const t of targets) {
    const page = await browser.newPage({
      viewport: { width: t.size, height: t.size },
      deviceScaleFactor: 2,
    });
    await page.setContent(getHtml(t.content));
    await page.screenshot({ path: t.out, omitBackground: false });
    console.log(`Generated: ${t.out} (${t.size}x${t.size})`);
    await page.close();
  }

  await browser.close();
  console.log('All PWA icons successfully generated!');
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
