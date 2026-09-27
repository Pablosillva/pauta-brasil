import { writeFile, mkdir, rm, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

// ============ CONFIGURAÇÃO ============
const ANO = 2026;
const BASE_URL = `https://cdn.tse.jus.br/estatistica/sead/odsele`;

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
const OUTPUT_DIR = path.join(process.cwd(), "src/data/tse");

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
  // TSE: 2 = Masculino, 4 = Feminino
  // (códigos conforme padrão do TSE)
  if (codigo === "2") return "M";
  if (codigo === "4") return "F";
  return "M"; // fallback
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

  // Inclui o SQ_CANDIDATO para garantir unicidade
  return `${ufLower}-${cargoAbrev}-${candidato.SQ_CANDIDATO}`;
}

function formatarValor(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
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

      let idade = 0;
      if (r.DT_NASCIMENTO) {
        const [dia, mes, ano] = r.DT_NASCIMENTO.split("/").map(Number);
        const nascimento = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        idade = Math.floor(
          (hoje - nascimento) / (365.25 * 24 * 60 * 60 * 1000)
        );
      }

      resultado.push({
        id,
        nome: r.NM_CANDIDATO,
        nomeUrna: r.NM_URNA_CANDIDATO || r.NM_CANDIDATO,
        numero: r.NR_CANDIDATO,
        partido: r.SG_PARTIDO,
        cargo,
        estadoId: `br-${r.SG_UF.toLowerCase()}`,
        foto: `/fotos/${r.SG_UF.toUpperCase()}/${r.SQ_CANDIDATO}.webp`,
        idade,
        genero: normalizarGenero(r.CD_GENERO),
        status: normalizarStatus(r.CD_SITUACAO_CANDIDATURA),
        situacaoDetalhada: r.DS_SITUACAO_CANDIDATURA || "",
        ocupacao: r.DS_OCUPACAO || "",
        grauInstrucao: r.DS_GRAU_INSTRUCAO || "",
        planoGovernoUrl: ["Presidente", "Governador", "Senador"].includes(cargo)
          ? `/planos/${r.SG_UF.toUpperCase()}/${r.SQ_CANDIDATO}.pdf`
          : null,
        bio: "",
        propostas: [],
        historico: [],
        patrimonio: [],
        redesSociais: [],
        _sqCandidato: r.SQ_CANDIDATO,
        _uf: r.SG_UF,
      });
    }
  }

  // Remove duplicatas por ID (mantém o primeiro)
  const vistos = new Set();
  const semDuplicatas = [];
  for (const c of resultado) {
    if (vistos.has(c.id)) {
      console.log(`⚠️  Duplicata removida: ${c.id} (${c.nome})`);
      continue;
    }
    vistos.add(c.id);
    semDuplicatas.push(c);
  }

  console.log(`✅ ${resultado.length - semDuplicatas.length} duplicatas removidas`);
  return semDuplicatas;

  return resultado;
}

async function processarBens() {
  const dir = path.join(TMP_DIR, DATASETS.bens.file);
  const arquivos = await readdir(dir);
  const bensPorCandidato = new Map();

  for (const arquivo of arquivos) {
    if (!arquivo.endsWith(".csv")) continue;

    const conteudo = await readFile(path.join(dir, arquivo), "latin1");
    const registros = parse(conteudo, {
      columns: true,
      delimiter: ";",
      skip_empty_lines: true,
      relax_column_count: true,
    });

    for (const r of registros) {
      const sq = r.SQ_CANDIDATO;
      if (!sq) continue;

      if (!bensPorCandidato.has(sq)) {
        bensPorCandidato.set(sq, []);
      }

      const valor = parseFloat(
        (r.VR_BEM_CANDIDATO || "0").replace(",", ".")
      );

      bensPorCandidato.get(sq).push({
        bem: r.DS_BEM_CANDIDATO || "Bem não especificado",
        valor: formatarValor(valor),
      });
    }
  }

  // === DEDUPLICAÇÃO ===
  // Remove bens duplicados (mesmo nome + mesmo valor) de cada candidato
  let totalDuplicatasRemovidas = 0;
  for (const [sq, bens] of bensPorCandidato.entries()) {
    const vistos = new Set();
    const unicos = [];
    for (const b of bens) {
      const chave = `${b.bem.trim()}|${b.valor}`;
      if (vistos.has(chave)) {
        totalDuplicatasRemovidas++;
        continue;
      }
      vistos.add(chave);
      unicos.push(b);
    }
    bensPorCandidato.set(sq, unicos);
  }

  console.log(`💰 Bens processados para ${bensPorCandidato.size} candidatos`);
  console.log(`🧹 ${totalDuplicatasRemovidas} bens duplicados removidos`);
  return bensPorCandidato;
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

    console.log("💰 Processando bens...");
    const bens = await processarBens();

    console.log("🔗 Pulando redes sociais (dataset indisponível)");
    const redes = new Map();

    for (const c of candidatos) {
      if (bens.has(c._sqCandidato)) {
        c.patrimonio = bens.get(c._sqCandidato);
      }
      if (redes.has(c._sqCandidato)) {
        c.redesSociais = redes.get(c._sqCandidato);
      }
      delete c._sqCandidato;
      delete c._uf;
    }

    const porEstado = {};
    for (const c of candidatos) {
      const uf = c.estadoId.replace("br-", "").toUpperCase();
      if (!porEstado[uf]) porEstado[uf] = [];
      porEstado[uf].push(c);
    }

    if (existsSync(OUTPUT_DIR)) await rm(OUTPUT_DIR, { recursive: true });
    await mkdir(OUTPUT_DIR, { recursive: true });

    for (const [uf, lista] of Object.entries(porEstado)) {
      const arquivo = path.join(OUTPUT_DIR, `${uf.toLowerCase()}.json`);
      await writeFile(arquivo, JSON.stringify(lista), "utf-8");
      console.log(`💾 ${uf}: ${lista.length} candidatos`);
    }

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