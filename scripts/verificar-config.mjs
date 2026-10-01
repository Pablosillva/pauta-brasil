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
  {
    nome: "PORTAL_TRANSPARENCIA_API_KEY",
    ajuda: "Habilita a aba de gastos. Sem a chave a tela declara o bloqueio.",
    ajuda: "Habilita a aba de gastos. Sem a chave a tela declara o bloqueio.",
    validar: (v) =>
      /^[a-z0-9]{32}$/.test(v)
        ? null
        : "a chave da CGU tem 32 caracteres alfanumericos minusculos",
  },
  {
    nome: "SENADO_API_KEY",
    ajuda: "Habilita materias de autoria e votacoes de senador.",
  },
  {
    nome: "GOOGLE_SITE_VERIFICATION",
    ajuda: "Token da verificacao de propriedade no Search Console.",
    validar: (v) =>
      // O layout normaliza o valor, aceitando token, prefixo ou a tag
      // inteira. Aqui so avisamos quando nao ha nada reconhecivel.
      /google-site-verification/i.test(v) || /^[A-Za-z0-9_-]{20,}$/.test(v)
        ? null
        : "nao parece um token do Search Console",
  },
  {
    nome: "NEXT_PUBLIC_GA_ID",
    ajuda: "ID de medicao do Google Analytics, no formato G-XXXXXXX.",
    validar: (v) =>
      /^G-[A-Za-z0-9]{4,}$/.test(v.trim())
        ? null
        : "o ID de medicao comeca com G-, por exemplo G-ABC1234",
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

const WEBMAIL_GRATIS = [
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.com.br",
  "outlook.com", "live.com", "yahoo.com", "yahoo.com.br",
  "icloud.com", "uol.com.br", "bol.com.br",
];

if (resend && remetente) {
  const email = (remetente.match(/<([^>]+)>/) ?? [null, remetente])[1]
    .trim()
    .toLowerCase();
  const dominio = email.split("@")[1] ?? "";

  if (WEBMAIL_GRATIS.includes(dominio)) {
    console.log(
      `  ! EMAIL_REMETENTE usa ${dominio}, e webmail gratis.\n` +
        "    NENHUM provedor de e-mail transacional envia a partir de um\n" +
        "    dominio desses: quem controla o dominio precisa autorizar por\n" +
        "    SPF/DKIM, e essas empresas nao autorizam terceiros. O envio vai\n" +
        "    falhar para todos, menos para voce.\n" +
        "    Resolva assim:\n" +
        "      a) Registre um dominio no Resend (Domains > Add Domain) e use\n" +
        "         contato@seudominio. Exige ter um dominio proprio.\n" +
        "      b) Para testar agora, use onboarding@resend.dev. So envia para\n" +
        "         o e-mail cadastrado na sua conta Resend."
    );
  } else if (!dominio.endsWith("resend.dev")) {
    console.log(
      `  ! EMAIL_REMETENTE usa ${dominio}. Confirme que esse dominio esta\n` +
        "    verificado no Resend (Domains). Sem verificacao o envio e recusado."
    );
  }
}

const chavesCloudinary = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const definidasCloudinary = chavesCloudinary.filter(
  (c) => (process.env[c] ?? "").trim()
);

if (definidasCloudinary.length > 0 && definidasCloudinary.length < 3) {
  const faltando = chavesCloudinary.filter((c) => !definidasCloudinary.includes(c));
  console.log(
    `  ! Cloudinary incompleto: faltam ${faltando.join(", ")}.` +
      "\n    Rode  npm run testar:cloudinary  para conferir."
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
