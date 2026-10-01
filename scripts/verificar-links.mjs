/**
 * Confere se todo link interno do projeto aponta para uma rota existente.
 *
 * Rodar no build evita publicar links quebrados. Varre href/Link de arquivos
 * .ts e .tsx, resolve o caminho e compara com as pastas e arquivos de rota.
 *
 * Uso: node scripts/verificar-links.mjs
 */
import { readdir, readFile, stat } from "fs/promises";
import path from "path";

const RAIZ = process.cwd();
const DIRETORIOS = ["app", "src"];

/* ------------------------------------------------------------------ */
/*  Rotas disponiveis                                                 */
/* ------------------------------------------------------------------ */

/** Rotas fixas de API. */
const ROTAS_API = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/candidatos",
  "/api/upload",
]);

async function coletarRotas(diretorio) {
  const rotas = new Set();
  const completo = path.join(RAIZ, diretorio);

  /* Route groups como (protegido) organizam arquivos, mas nao fazem parte
     da URL. Precisam sair do caminho para a comparacao dar certo. */
  const semGrupos = (segmentos) => segmentos.filter((s) => !s.startsWith("("));

  async function andar(atual, segmentos) {
    let entradas;
    try {
      entradas = await readdir(atual, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entrada of entradas) {
      const caminho = path.join(atual, entrada.name);

      if (entrada.isDirectory()) {
        await andar(caminho, [...segmentos, entrada.name]);
        continue;
      }

      const nome = entrada.name;

      // page.tsx vira a rota do diretorio onde esta.
      if (nome === "page.tsx" || nome === "page.ts" || nome === "page.jsx") {
        rotas.add("/" + semGrupos(segmentos).join("/"));
      }

      // route.ts dentro de api/ vira um endpoint.
      if (nome.startsWith("route.") && segmentos[0] === "api") {
        rotas.add("/" + semGrupos(segmentos).join("/"));
      }
    }
  }

  await andar(completo, []);
  return rotas;
}

/* ------------------------------------------------------------------ */
/*  Links encontrados                                                  */
/* ------------------------------------------------------------------ */

const PADROES = [
  // <Link href="..."> e <a href="...">
  /\bhref\s*=\s*["'`]([^"'`$]*)["'`]/g,
  // redirect("...") e router.push("...")
  /\b(?:redirect|replace|push)\(\s*["'`]([^"'`$]*)["'`]/g,
];

async function coletarLinks(diretorio) {
  const achados = [];
  const completo = path.join(RAIZ, diretorio);

  async function andar(atual) {
    let entradas;
    try {
      entradas = await readdir(atual, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entrada of entradas) {
      const caminho = path.join(atual, entrada.name);

      if (entrada.isDirectory()) {
        if (entrada.name === "node_modules" || entrada.name === ".next") continue;
        await andar(caminho);
        continue;
      }

      if (!/\.(ts|tsx|js|jsx|mjs)$/.test(entrada.name)) continue;

      const conteudo = await readFile(caminho, "utf-8");
      const linhas = conteudo.split(/\r?\n/);

      linhas.forEach((linha, i) => {
        for (const padrao of PADROES) {
          padrao.lastIndex = 0;
          let achado;
          while ((achado = padrao.exec(linha)) !== null) {
            achados.push({
              arquivo: path.relative(RAIZ, caminho),
              linha: i + 1,
              href: achado[1],
            });
          }
        }
      });
    }
  }

  await andar(completo);
  return achados;
}

/* ------------------------------------------------------------------ */
/*  Execucao                                                           */
/* ------------------------------------------------------------------ */

const rotas = new Set();

for (const dir of DIRETORIOS) {
  for (const rota of await coletarRotas(dir)) rotas.add(rota);
}

for (const r of ROTAS_API) rotas.add(r);

// Rotas dinamicas: [slug] casa com qualquer valor.
function rotaExiste(caminho) {
  const partes = caminho.split("/").filter(Boolean);

  for (const parte of partes) {
    if (parte.startsWith("[")) continue;
    // Segmentos literais precisam bater com algum elemento de rota.
    return [...rotas].some((r) => {
      const rPartes = r.split("/").filter(Boolean);
      if (rPartes.length !== partes.length) return false;
      return rPartes.every(
        (rp, i) => rp.startsWith("[") || rp === partes[i]
      );
    });
  }

  return rotas.has("/");
}

const links = (await coletarLinks(DIRETORIOS[0])).concat(
  await coletarLinks(DIRETORIOS[1])
);

const quebrados = [];
const vistos = new Set();

for (const link of links) {
  const href = link.href.trim();

  // Ignora URLs externas, mailto, tel, ancora e templates dinamicos.
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.includes("${") ||
    href.includes("#")
  ) {
    continue;
  }

  // Corta query string e hash.
  const caminho = href.split(/[?#]/)[0];
  if (caminho === "/") continue;

  const chave = `${link.arquivo}|${caminho}`;
  if (vistos.has(chave)) continue;
  vistos.add(chave);

  if (!rotaExiste(caminho)) quebrados.push(link);
}

if (quebrados.length === 0) {
  console.log(`> verificar-links: ${vistos.size} links internos, todos validos`);
  process.exit(0);
}

console.error(`> verificar-links: ${quebrados.length} link(s) quebrado(s):`);
for (const q of quebrados) {
  console.error(`   ${q.arquivo}:${q.linha} -> ${q.href}`);
}
process.exit(1);
