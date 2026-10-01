/**
 * Diagnostico de configuracao.
 *
 * Confere se as variaveis de ambiente necessarias existem e tem formato
 * plausivel. Nao imprime o valor dos segredos: mostra apenas se estao
 * definidos e o tamanho, o suficiente para achar o erro sem expor nada.
 *
 * Uso: node scripts/verificar-config.mjs
 */
import { config } from "dotenv";
import { readFile } from "fs/promises";
import path from "path";

config({ path: ".env.local" });
config({ path: ".env" });

/* ------------------------------------------------------------------ */
/*  Definicoes                                                         */
/* ------------------------------------------------------------------ */

const OBRIGATORIAS = [
  {
    nome: "DATABASE_URL",
    ajuda: "Banco do Supabase. Sem isso noticias e area do usuario nao funcionam.",
    validar: (v) =>
      v.startsWith("postgresql://") || v.startsWith("postgres://")
        ? null
        : "esperado postgresql:// ou postgres://",
  },
  {
    nome: "DIRECT_URL",
    ajuda: "Mesma string do banco, usada pelo drizzle-kit.",
    validar: (v) =>
      v.startsWith("postgresql://") || v.startsWith("postgres://")
        ? null
        : "esperado postgresql:// ou postgres://",
  },
  {
    nome: "NEXT_PUBLIC_SITE_URL",
    ajuda: "Dominio do site. O link de verificacao de e-mail e montado com ele.",
    validar: (v) => {
      if (v.includes("localhost")) {
        return "aponta para localhost: os e-mails nao vao chegar";
      }
      if (!v.startsWith("https://")) return "deve comecar com https://";
      return null;
    },
  },
  {
    nome: "JWT_SECRET",
    ajuda: "Assina o cookie de sessao. Sem isso, qualquer um forja sessao.",
    validar: (v) => (v.length < 32 ? "use ao menos 32 caracteres" : null),
  },
];

const RECOMENDADAS = [
  {
    nome: "RESEND_API_KEY",
    ajuda: "Envia o e-mail de verificacao. Sem isso, o link aparece na tela.",
    validar: (v) => (v.startsWith("re_") ? null : "formato esperado: re_..."),
  },
  {
    nome: "EMAIL_REMETENTE",
    ajuda: "Remetente dos e-mails.",
    validar: (v) =>
      /<[^>]+@[^>]+>/.test(v) ? null : "use o formato Nome <email@dominio>",
  },
  {
    nome: "CLOUDINARY_CLOUD_NAME",
    ajuda: "Upload das capas das noticias.",
  },
  {
    nome: "CLOUDINARY_API_KEY",
    ajuda: "Upload das capas das noticias.",
  },
  {
    nome: "CLOUDINARY_API_SECRET",
    ajuda: "Upload das capas das noticias.",
  },
  {
    nome: "ADMIN_EMAIL",
    ajuda: "Login do painel em /batata.",
  },
  {
    nome: "ADMIN_PASSWORD",
    ajuda: "Login do painel em /batata.",
  },
];

/* ------------------------------------------------------------------ */
/*  Execucao                                                           */
/* ------------------------------------------------------------------ */

function conferir(grupo, titulo) {
  console.log(`\n${titulo}`);

  let problemas = 0;

  for (const item of grupo) {
    const valor = (process.env[item.nome] ?? "").trim();
    const definida = valor.length > 0;

    if (!definida) {
      console.log(`  [ ] ${item.nome.padEnd(30)} nao definida`);
      console.log(`      ${item.ajuda}`);
      problemas++;
      continue;
    }

    const problema = item.validar ? item.validar(valor) : null;

    if (problema) {
      console.log(`  [x] ${item.nome.padEnd(30)} ${problema}`);
      console.log(`      valor tem ${valor.length} caracteres`);
      problemas++;
    } else {
      console.log(
        `  [ok] ${item.nome.padEnd(30)} ${valor.length} caracteres`
      );
    }
  }

  return problemas;
}

console.log("=".repeat(62));
console.log("  Centro Politico - verificacao de configuracao");
console.log("=".repeat(62));

const semArquivo = !(
  await readFile(path.join(process.cwd(), ".env.local"), "utf-8").catch(
    () => null
  )
);

if (semArquivo) {
  console.log(
    "\nAviso: .env.local nao existe. A verificacao abaixo le as variaveis\n" +
      "do ambiente do processo, que no build da Vercel vem do painel."
  );
}

const problemasObrigatorias = conferir(
  OBRIGATORIAS,
  "Obrigatorias (sem elas o site quebra):"
);
const problemasRecomendadas = conferir(
  RECOMENDADAS,
  "Recomendadas (o site funciona sem elas, com ressalvas):"
);

// Avisos especificos que evitam perda de tempo.
console.log("\nAvisos");

const remetente = process.env.EMAIL_REMETENTE ?? "";
const resend = (process.env.RESEND_API_KEY ?? "").trim();

if (resend && remetente.includes("resend.dev")) {
  console.log(
    "  ! EMAIL_REMETENTE usa o dominio de teste do Resend (resend.dev).\n" +
      "    O envio so funciona para o seu proprio e-mail. Para mandar para\n" +
      "    quem se cadastra, valide um dominio em Resend > Domains."
  );
}

if (process.env.ADMIN_EMAIL?.includes("exemplo.com")) {
  console.log(
    "  ! ADMIN_EMAIL ainda e um placeholder (exemplo.com).\n" +
      "    O login do painel em /batata vai recusar qualquer senha."
  );
}

if (!semArquivo) {
  console.log("  (arquivo .env.local lido com sucesso)");
}

const total = problemasObrigatorias + problemasRecomendadas;
console.log(
  `\n${total === 0 ? "Tudo configurado." : `${total} pendencia(s).`}` +
    "\nSe estiver rodando na Vercel, lembrese de adicionar tambem no painel:"
  );
console.log("  https://vercel.com -> projeto -> Settings -> Environment Variables");
console.log("");
