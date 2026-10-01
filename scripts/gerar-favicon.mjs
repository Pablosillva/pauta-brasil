/**
 * Gera o favicon do Centro Politico: circulo verde com a sigla CP.
 *
 * Desenho feito com SVG e rasterizado pelo sharp, entao nao depende de nenhum
 * arquivo de imagem externo. Rodar novamente e seguro: sobrescreve o PNG.
 *
 * Uso: npm run favicon
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import path from "path";

const SAIDA = path.join(process.cwd(), "public/favicon.png");

// Mesma verde da marca (#009B3A).
const VERDE = "#009B3A";
const VERDE_ESCURO = "#007A2E";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${VERDE}"/>
      <stop offset="100%" stop-color="${VERDE_ESCURO}"/>
    </linearGradient>
  </defs>

  <!-- Circulo de fundo -->
  <circle cx="256" cy="256" r="248" fill="url(#g)"/>

  <!-- Anel interno, da respiro visual ao redor da sigla -->
  <circle cx="256" cy="256" r="206" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="6"/>

  <!-- Sigla CP -->
  <text
    x="256"
    y="256"
    font-family="Helvetica, Arial, sans-serif"
    font-size="200"
    font-weight="700"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="-6"
  >CP</text>
</svg>
`.trim();

const buffer = await sharp(Buffer.from(svg))
  .resize(512, 512)
  .png({ compressionLevel: 9, effort: 10, palette: true })
  .toBuffer();

writeFileSync(SAIDA, buffer);

const meta = await sharp(SAIDA).metadata();

console.log(`> favicon gerado: public/favicon.png`);
console.log(`   ${meta.width}x${meta.height}, ${(buffer.length / 1024).toFixed(1)} KB`);
