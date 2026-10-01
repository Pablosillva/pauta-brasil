/**
 * Auditoria de rotas e links.
 *
 * Responde a duas perguntas que o verificador de links sozinho nao cobre:
 *
 *   1. Link sem rota   -> quebrado, o visitante cai em 404.
 *   2. Rota sem link   -> orfa, existe mas ninguem chega nela. O Google
 *                        pode indexar, mas nenhum usuario navega ate la.
 *
 * A varredura cobre o cabecalho, o rodape, os menus, o sitemap e os
 * arquivos de dados, que juntos concentram a navegacao do site.
 *
 * Uso: node scripts/auditar-rotas.mjs
 */
import { readdir, readFile } from "fs/promises";
import path from "path";

const RAIZ = process.cwd();

/* ------------------------------------------------------------------ */
/*  Rotas do app                                                       */
/* ------------------------------------------------------------------ */

async function coletarRotas() {
  const rotas = new Set();
  const appDir = path.join(RAIZ, "app");

  async function andar(dir, segmentos) {
    let entradas;
    try {
      entradas = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    // Route groups organizam arquivos e nao entram na URL.
    const uteis = segmentos.filter((s) => !s.startsWith("("));

    for (const entrada of entradas) {
      const caminho = path.join(dir, entrada.name);

      if (entrada.isDirectory()) {
        await andar(caminho, [...segmentos, entrada.name]);
        continue;
      }

      // page.tsx monta a pagina; route.ts monta um endpoint/redirect.
      // Ambos criam uma URL valida.
      if (
        entrada.name === "page.tsx" ||
        entrada.name === "page.ts" ||
        entrada.name.startsWith("route.")
      ) {
        rotas.add("/" + uteis.join("/"));
      }
    }
  }

  await andar(appDir, []);
  return rotas;
}

/* ------------------------------------------------------------------ */
/*  Links                                                              */
/* ------------------------------------------------------------------ */

const PADROES = [
  /\bhref\s*=\s*["'`]([^"'`$]*)["'`]/g,
  /\b(?:redirect|replace|push)\(\s*["'`]([^"'`$]*)["'`]/g,
  /\brota:\s*["'`]([^"'`$]*)["'`]/g,
  /\{(?:loc|url|rota):\s*`?\$\{?siteUrl\}?(\/[^"'`}]*)/g,
];

/** Arquivos que de fato guiam o visitante ate alguma pagina. */
const RELEVANTES = [
  "app",
  "src/components/layout",
  "src/components/home",
  "src/data",
];

/** Rotas que existem de proposito e nao precisam estar no menu. */
const SEM_LINK_ESPERADO = new Set([
  "/", // a home e o ponto de partida
  "/pautas", // redirect 308 para /projetos
  "/deputados", // redirect 308 para /parlamentares
  "/ferramentas/historico", // redirect 308: a versao antiga tinha votos inventados
  "/cadastro",
  "/login",
  "/minha-conta",
  "/recuperar-senha",
  "/redefinir-senha",
  "/verificar-email",
  "/busca", // alcancada pela SearchBar, via router.push
  "/batata/ferramentas",
  "/batata/login",
  "/not-found",
]);

/** Prefixos que nao sao paginas de navegacao. */
const PREFIXOS_IGNORADOS = ["/api/"];

async function coletarLinks() {
  const achados = new Set();

  for (const alvo of RELEVANTES) {
    await varredura(path.join(RAIZ, alvo), achados);
  }

  return achados;
}

async function varredura(dir, achados) {
  let entradas;
  try {
    entradas = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entrada of entradas) {
    const caminho = path.join(dir, entrada.name);

    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === ".next") continue;
      await varredura(caminho, achados);
      continue;
    }

    if (!/\.(ts|tsx|mjs)$/.test(entrada.name)) continue;

    const conteudo = await readFile(caminho, "utf-8");

    for (const padrao of PADROES) {
      padrao.lastIndex = 0;
      let achado;
      while ((achado = padrao.exec(conteudo)) !== null) {
        const href = achado[1].trim();
        if (href.startsWith("/")) achados.add(href.split(/[?#]/)[0]);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Execucao                                                           */
/* ------------------------------------------------------------------ */

function rotaExiste(caminho, rotas) {
  const partes = caminho.split("/").filter(Boolean);
  if (partes.length === 0) return true;

  return [...rotas].some((r) => {
    const rPartes = r.split("/").filter(Boolean);
    if (rPartes.length !== partes.length) return false;
    // Um segmento dinamico casa com qualquer valor.
    return rPartes.every((rp, i) => rp.startsWith("[") || rp === partes[i]);
  });
}

const rotas = await coletarRotas();
const links = await coletarLinks();

console.log("=".repeat(62));
console.log("  Centro Politico - auditoria de rotas");
console.log("=".repeat(62));
console.log(`\n  ${rotas.size} rotas e ${links.size} links unicos\n`);

// 1. Link sem rota
const quebrados = [...links].filter((l) => !rotaExiste(l, rotas)).sort();

// 2. Rota sem link
//    Rotas dinamicas ficam de fora: sao alcancadas por templates como
//    /candidatos/${id}, que nao aparecem como string literal no codigo.
const orfas = [...rotas]
  .filter((r) => r !== "/" && !SEM_LINK_ESPERADO.has(r))
  .filter((r) => !r.includes("[")) // ignora /candidatos/[id] e afins
  .filter((r) => !PREFIXOS_IGNORADOS.some((p) => r.startsWith(p)))
  .filter((r) => ![...links].some((l) => rotaExiste(r, new Set([l]))))
  .sort();

if (quebrados.length === 0) {
  console.log("  [ok] Nenhum link aponta para rota inexistente.");
} else {
  console.log(`  [x] ${quebrados.length} link(s) sem rota correspondente:`);
  for (const q of quebrados) console.log(`      ${q}`);
}

console.log("");

if (orfas.length === 0) {
  console.log("  [ok] Nenhuma rota orfa: todas tem link em algum lugar.");
} else {
  console.log(`  [!] ${orfas.length} rota(s) sem link (orfas):`);
  for (const o of orfas) console.log(`      ${o}`);
  console.log(
    "\n      Ou a rota e util e merece link, ou e residuo de uma\n" +
      "      versao anterior e pode ser removida."
  );
}

const problemas = quebrados.length;
console.log(
  `\n  ${problemas === 0 ? "Nenhum link quebrado." : `${problemas} link(s) quebrado(s).`}`
);
console.log("");

process.exit(problemas > 0 ? 1 : 0);
