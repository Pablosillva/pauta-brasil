import sharp from "sharp";
import { statSync, renameSync, unlinkSync } from "fs";
import path from "path";

const file = path.join(process.cwd(), "public/favicon.png");
const temp = path.join(process.cwd(), "public/favicon.tmp.png");

async function main() {
  const antes = statSync(file).size;

  // Reduz para 512x512 e comprime o PNG.
  // Mantém as bordas para preservar o fundo azul-marinho e o respiro visual.
  const buffer = await sharp(file)
    .resize(512, 512, { fit: "contain" })
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toBuffer();

  const { writeFileSync } = await import("fs");
  writeFileSync(temp, buffer);

  // Substitui o arquivo original
  try {
    unlinkSync(file);
  } catch {
    // ignora se estiver bloqueado momentarily
  }
  renameSync(temp, file);

  const meta = await sharp(file).metadata();
  const depois = statSync(file).size;

  console.log(`✅ favicon.png otimizado`);
  console.log(`   ${meta.width}x${meta.height}`);
  console.log(
    `   ${(antes / 1024).toFixed(1)} KB → ${(depois / 1024).toFixed(1)} KB`
  );
}

main();
