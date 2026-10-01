/**
 * Testa o upload no Cloudinary com um arquivo de imagem gerado na hora.
 *
 * Confere as tres credenciais e mostra a URL resultante, para saber se as
 * capas das noticias vao funcionar.
 *
 * Uso: node scripts/testar-cloudinary.mjs
 */
import { config } from "dotenv";
import sharp from "sharp";
import { writeFile, unlink } from "fs/promises";
import path from "path";

config({ path: ".env.local" });

const { v2: cloudinary } = await import("cloudinary");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("> testar-cloudinary");
console.log(`   cloud name: ${cloudName ?? "(nao definido)"}`);
console.log(`   api key:    ${apiKey ? "definida" : "(nao definida)"}`);
console.log(`   secret:     ${apiSecret ? "definido" : "(nao definido)"}`);

if (!cloudName || !apiKey || !apiSecret) {
  console.error("\n   FALHOU: falta uma das tres credenciais.\n");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Cria uma imagem de teste: 1600x900, verde, com um retangulo.
const buffer = await sharp({
  create: {
    width: 1600,
    height: 900,
    channels: 4,
    background: { r: 0, g: 155, b: 58, alpha: 1 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="1600" height="900">
           <rect x="500" y="350" width="600" height="200" fill="#ffffff" rx="16"/>
           <text x="800" y="470" font-family="Arial" font-size="72" font-weight="bold"
                 fill="#009B3A" text-anchor="middle">teste</text>
         </svg>`
      ),
      top: 0,
      left: 0,
    },
  ])
  .png()
  .toBuffer();

const arquivo = path.join(process.cwd(), ".teste-upload.png");
await writeFile(arquivo, buffer);

try {
  const resultado = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "centro-politico/teste",
        resource_type: "image",
        transformation: [
          { width: 1600, height: 1600, crop: "limit" },
          { fetch_format: "auto", quality: "auto" },
        ],
      },
      (erro, res) => (erro || !res ? reject(erro) : resolve(res))
    );

    stream.end(buffer);
  });

  console.log("\n   UPLOAD OK");
  console.log(`   url:      ${resultado.secure_url}`);
  console.log(`   publicId: ${resultado.public_id}`);
  console.log(`   largura:  ${resultado.width}px  altura: ${resultado.height}px`);
  console.log(`   formato:  ${resultado.format}  ${Math.round(resultado.bytes / 1024)} KB`);

  // Confirma que a URL responde (as vezes o recurso demora a propagar).
  const checagem = await fetch(resultado.secure_url, {
    signal: AbortSignal.timeout(20000),
  });
  console.log(`   url publica: HTTP ${checagem.status}`);

  // Remove o arquivo de teste para nao sujar o painel.
  await cloudinary.uploader.destroy(resultado.public_id);
  console.log("\n   arquivo de teste removido do Cloudinary");

  console.log("\n   Configure as mesmas tres variaveis no Vercel.\n");
} catch (erro) {
  console.error("\n   FALHOU NO UPLOAD:", erro.message);
  console.error(
    "   Verifique o Cloud name, a API key e o API secret no painel.\n"
  );
  process.exitCode = 1;
} finally {
  await unlink(arquivo).catch(() => {});
}
