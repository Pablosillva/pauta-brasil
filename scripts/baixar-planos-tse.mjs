import { writeFile, mkdir, rm, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import AdmZip from "adm-zip";

const BASE_URL = "https://cdn.tse.jus.br/estatistica/sead/odsele/proposta_governo";
const ANO = 2026;

const OUTPUT_DIR = path.join(process.cwd(), "public/planos");
const TMP_DIR = path.join(process.cwd(), ".tmp-planos");

const UFS = process.argv[2] ? [process.argv[2].toUpperCase()] : null;

// Só presidentes e governadores entregam proposta de governo
const UFS_DISPONIVEIS = [
  "BR", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

async function baixarZip(url, destino) {
  console.log(`📥 Baixando: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destino, buffer);
  console.log(`✅ Salvo (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
}

async function processarUF(uf) {
  const destinoDir = path.join(OUTPUT_DIR, uf);

  // Pula se já tem planos
  if (existsSync(destinoDir)) {
    const arquivos = await readdir(destinoDir);
    if (arquivos.length > 0) {
      console.log(`⏭️  ${uf}: já baixado (${arquivos.length} PDFs), pulando`);
      return arquivos.length;
    }
  }

  const url = `${BASE_URL}/proposta_governo_${ANO}_${uf}.zip`;
  const zipPath = path.join(TMP_DIR, `${uf}.zip`);

  try {
    await baixarZip(url, zipPath);
    if (!existsSync(destinoDir)) await mkdir(destinoDir, { recursive: true });

    const zip = new AdmZip(zipPath);
    let contador = 0;

    for (const entry of zip.getEntries()) {
      const nomeOriginal = path.basename(entry.entryName);
      if (!nomeOriginal.toLowerCase().endsWith(".pdf")) continue;

      // Padrão: 2026BR280002539826_01.pdf
      // Extrai o SQ (12 dígitos após UF)
      const match = nomeOriginal.match(/^\d{4}[A-Z]{2}(\d+)_\d+\.pdf$/i);

      let nomeFinal;
      if (match) {
        nomeFinal = `${match[1]}.pdf`;
      } else {
        nomeFinal = nomeOriginal;
        console.log(`⚠️  Formato inesperado: ${nomeOriginal}`);
      }

      const conteudo = entry.getData();
      await writeFile(path.join(destinoDir, nomeFinal), conteudo);
      contador++;
    }

    console.log(`✅ ${uf}: ${contador} propostas extraídas`);
    return contador;
  } catch (err) {
    console.error(`❌ Erro em ${uf}: ${err.message}`);
    return 0;
  }
}

async function main() {
  if (!existsSync(TMP_DIR)) await mkdir(TMP_DIR, { recursive: true });
  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });

  const ufs = UFS ?? UFS_DISPONIVEIS;

  let total = 0;
  for (const uf of ufs) {
    total += await processarUF(uf);
  }

  await rm(TMP_DIR, { recursive: true });
  console.log(`\n🎉 Total: ${total} propostas salvas em public/planos/`);
}

main();