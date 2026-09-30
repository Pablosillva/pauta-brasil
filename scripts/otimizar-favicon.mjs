import sharp from "sharp";
import path from "path";

const input = path.join(process.cwd(), "public/favicon.png");
const output = path.join(process.cwd(), "public/favicon.png");

async function main() {
  // Corta as bordas brancas e gera um favicon quadrado compacto
  const buffer = await sharp(input)
    .trim({ threshold: 10 })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();

  const { writeFile } = await import("fs/promises");
  await writeFile(output, buffer);

  const meta = await sharp(output).metadata();
  const { statSync } = await import("fs");
  console.log(
    `✅ favicon.png otimizado: ${meta.width}x${meta.height}, ${(statSync(output).size / 1024).toFixed(1)} KB`
  );
}

main();
