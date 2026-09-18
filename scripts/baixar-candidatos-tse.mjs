import { writeFile, mkdir, rm, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

// ============ CONFIGURAÇÃO ============
const ANO = 2022;
const BASE_URL = `https://cdn.tse.jus.br/estatistica/sead/odsele`;
const OUTPUT_DIR = path.join(process.cwd(), "src/data/tse");

const DATASETS = {
  candidatos: {
    url: `${BASE_URL}/consulta_cand/consulta_cand_${ANO}.zip`,
    file: "consulta_cand",
  },
  bens: {
    url: `${BASE_URL}/bem_candidato/bem_candidato_${ANO}.zip`,
    file: "bem_candidato",
  },
};

const TMP_DIR = path.join(process.cwd(), ".tmp-tse");
const OUTPUT_FILE = path.join(process.cwd(), "src/data/candidatos-tse.json");

// ============ HELPERS ============
function normalizarCargo(cargoOriginal) {
  const mapa = {
    "PRESIDENTE": "Presidente",
    "GOVERNADOR": "Governador",
    "SENADOR": "Senador",
    "DEPUTADO FEDERAL": "Deputado Federal",
    "DEPUTADO ESTADUAL": "Deputado Estadual",
    "DEPUTADO DISTRITAL": "Deputado Estadual",
  };
  return mapa[cargoOriginal] ?? null;
}

function normalizarStatus(situacao) {
  const deferidos = ["2", "12", "16", "17"];
  if (deferidos.includes(situacao)) return "Candidato oficial";
  return "Pré-candidato";
}

function normalizarGenero(codigo) {
  return codigo === "2" ? "F" : "M";
}

function gerarId(candidato, uf, cargo) {
  const ufLower = uf.toLowerCase();
  const cargoAbrev = {
    "Presidente": "pres",
    "Governador": "gov",
    "Senador": "sen",
    "Deputado Federal": "df",
    "Deputado Estadual": "de",
  }[cargo] || "outro";
  return `${ufLower}-${cargoAbrev}-${candidato.NR_CANDIDATO}`;
}

// ============ DOWNLOAD ============
async function baixarZip(url, destino) {
  console.log(`📥 Baixando: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao baixar ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destino, buffer);
  console.log(`✅ Salvo em ${destino}`);
}

async function extrairZip(zipPath, destinoDir) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(destinoDir, true);
  console.log(`📂 Extraído em ${destinoDir}`);
}

// ============ PROCESSAMENTO ============
async function processarCandidatos() {
  const dir = path.join(TMP_DIR, DATASETS.candidatos.file);
  const arquivos = await readdir(dir);

  const resultado = [];

  for (const arquivo of arquivos) {
    if (!arquivo.endsWith(".csv")) continue;
    const ufMatch = arquivo.match(/_([A-Z]{2})\.csv$/);
    const uf = ufMatch ? ufMatch[1] : "BR";
    console.log(`📄 Processando ${uf}...`);

    const conteudo = await readFile(path.join(dir, arquivo), "latin1");
    const registros = parse(conteudo, {
      columns: true,
      delimiter: ";",
      skip_empty_lines: true,
      relax_column_count: true,
    });

    for (const r of registros) {
      const cargo = normalizarCargo(r.DS_CARGO);
      if (!cargo) continue;

      const id = gerarId(r, r.SG_UF, cargo);
      resultado.push({
        id,
        nome: r.NM_CANDIDATO,
        numero: r.NR_CANDIDATO,
        partido: r.SG_PARTIDO,
        cargo,
        estadoId: `br-${r.SG_UF.toLowerCase()}`,
        foto: `https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/${ANO}/${r.SQ_CANDIDATO}`,
        idade: 0,
        genero: normalizarGenero(r.CD_GENERO),
        status: normalizarStatus(r.CD_SITUACAO_CANDIDATURA),
        bio: "",
        propostas: [],
        historico: [],
        patrimonio: [],
        redesSociais: [],
      });
    }
  }

  return resultado;
}

// ============ MAIN ============
async function main() {
  try {
    if (existsSync(TMP_DIR)) await rm(TMP_DIR, { recursive: true });
    await mkdir(TMP_DIR, { recursive: true });

    for (const [nome, cfg] of Object.entries(DATASETS)) {
      const zipPath = path.join(TMP_DIR, `${nome}.zip`);
      await baixarZip(cfg.url, zipPath);
      await extrairZip(zipPath, path.join(TMP_DIR, cfg.file));
    }

    console.log("🔨 Processando candidatos...");
    const candidatos = await processarCandidatos();
    console.log(`✅ ${candidatos.length} candidatos processados`);

    // Agrupa por estado
    const porEstado = {};
    for (const c of candidatos) {
      const uf = c.estadoId.replace("br-", "").toUpperCase();
      if (!porEstado[uf]) porEstado[uf] = [];
      porEstado[uf].push(c);
    }

    // Cria pasta de saída
    if (existsSync(OUTPUT_DIR)) await rm(OUTPUT_DIR, { recursive: true });
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Salva um arquivo por estado
    for (const [uf, lista] of Object.entries(porEstado)) {
      const arquivo = path.join(OUTPUT_DIR, `${uf.toLowerCase()}.json`);
      await writeFile(arquivo, JSON.stringify(lista), "utf-8");
      console.log(`💾 ${uf}: ${lista.length} candidatos`);
    }

    // Salva um índice com o total por estado (útil para previews)
    const indice = Object.fromEntries(
      Object.entries(porEstado).map(([uf, lista]) => [uf, lista.length])
    );
    await writeFile(
      path.join(OUTPUT_DIR, "_indice.json"),
      JSON.stringify(indice, null, 2),
      "utf-8"
    );

    console.log(`✅ ${Object.keys(porEstado).length} arquivos gerados`);

    await rm(TMP_DIR, { recursive: true });
    console.log("🧹 Temporários limpos");
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

main();