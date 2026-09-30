import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0A2540"/>
  <text x="50%" y="54%" font-family="Arial, sans-serif" font-size="240" font-weight="800" text-anchor="middle" dominant-baseline="middle" fill="#009B3A">PB</text>
</svg>`;

const publicDir = path.join(process.cwd(), "public");

async function gerarFavicon() {
  // 32x32
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, "favicon-32x32.png"));

  // 16x16
  await sharp(Buffer.from(svg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, "favicon-16x16.png"));

  // 180x180 (apple touch)
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  // 192x192
  await sharp(Buffer.from(svg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "web-app-manifest-192x192.png"));

  // 512x512
  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "web-app-manifest-512x512.png"));

  console.log("✅ Favicons gerados com sucesso!");
}

gerarFavicon();
