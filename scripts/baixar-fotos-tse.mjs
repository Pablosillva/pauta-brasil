import { writeFile, mkdir, rm, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import AdmZip from "adm-zip";
import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "public/fotos");
const TMP_DIR = path.join(process.cwd(), ".tmp-fotos");

// Configurações de otimização
const LARGURA_MAX = 200;     // pixels
const ALTURA_MAX = 200;      // pixels
const QUALIDADE = 75;        // 0-100
const FORMATO = "webp";      // webp | jpeg | png

// UFs para baixar (ou todas se vazio)
const UFS = process.argv[2] ? [process.argv[2].toUpperCase()] : null;

async function baixarZip(url, destino) {
  console.log(`📥 Baixando: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destino, buffer);
  console.log(`✅ Salvo (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
}

async function otimizarImagem(buffer) {
  return sharp(buffer)
    .resize(LARGURA_MAX, ALTURA_MAX, {
      fit: "cover",
      position: "center",
    })
    .webp({ quality: QUALIDADE })
    .toBuffer();
}

async function processarUF(uf) {
  const destinoDir = path.join(OUTPUT_DIR, uf);

  // Pula se já tem fotos
  if (existsSync(destinoDir)) {
    const arquivos = await readdir(destinoDir);
    if (arquivos.length > 10) {
      console.log(`⏭️  ${uf}: já baixado (${arquivos.length} fotos), pulando`);
      return arquivos.length;
    }
  }

  const url = `https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes2026/fotos/foto_cand2026_${uf}_div.zip`;
  const zipPath = path.join(TMP_DIR, `${uf}.zip`);

  try {
    await baixarZip(url, zipPath);
    if (!existsSync(destinoDir)) await mkdir(destinoDir, { recursive: true });

    const zip = new AdmZip(zipPath);
    let contador = 0;
    let totalOriginal = 0;
    let totalOtimizado = 0;

    for (const entry of zip.getEntries()) {
      const nomeOriginal = path.basename(entry.entryName);
      if (!nomeOriginal.toLowerCase().match(/\.(jpg|jpeg|png)$/)) continue;

      const match = nomeOriginal.match(/(\d{11,12})/);
      let nomeFinal;
      if (match) {
        nomeFinal = `${match[1]}.${FORMATO}`;
      } else {
        const base = nomeOriginal.replace(/\.(jpg|jpeg|png)$/i, "");
        nomeFinal = `${base}.${FORMATO}`;
      }

      const conteudoOriginal = entry.getData();
      totalOriginal += conteudoOriginal.length;

      try {
        const otimizado = await otimizarImagem(conteudoOriginal);
        totalOtimizado += otimizado.length;
        await writeFile(path.join(destinoDir, nomeFinal), otimizado);
        contador++;
      } catch (err) {
        // Se falhar a otimização, salva o original
        console.warn(`⚠️  Erro ao otimizar ${nomeOriginal}, salvando original`);
        await writeFile(path.join(destinoDir, nomeOriginal), conteudoOriginal);
        contador++;
      }
    }

    const economia = ((1 - totalOtimizado / totalOriginal) * 100).toFixed(1);
    console.log(
      `✅ ${uf}: ${contador} fotos otimizadas (economia: ${economia}%)`
    );
    return contador;
  } catch (err) {
    console.error(`❌ Erro em ${uf}: ${err.message}`);
    return 0;
  }
}

async function main() {
  if (!existsSync(TMP_DIR)) await mkdir(TMP_DIR, { recursive: true });
  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });

  const ufs = UFS ?? [
    "BR",
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  let total = 0;
  for (const uf of ufs) {
    total += await processarUF(uf);
  }

  await rm(TMP_DIR, { recursive: true });
  console.log(`\n🎉 Total: ${total} fotos salvas em public/fotos/`);
}

main();