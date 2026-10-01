import { SITE_URL } from "@/lib/config";

/**
 * Envio de e-mail transacional.
 *
 * Usa a API REST do Resend (sem SDK). Se RESEND_API_KEY nao estiver
 * configurado, o link e apenas registrado no console do servidor — assim o
 * fluxo de cadastro continua funcionando em desenvolvimento e o link pode ser
 * copiado manualmente.
 */

const REMETENTE =
  process.env.EMAIL_REMETENTE ??
  "Centro Politico <onboarding@resend.dev>";
const RESEND_URL = "https://api.resend.com/emails";

/**
 * Dominios de webmail gratis (gmail, hotmail, yahoo) que o Resend nao aceita
 * como remetente. Nenhum provedor transacional pode enviar "de" um dominio
 * desses: quem controla o dominio precisa autorizar o envio por SPF/DKIM, e
 * essas empresas nao concedem isso a terceiros.
 */
const DOMINIOS_BLOQUEADOS = [
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.com.br",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "yahoo.com.br",
  "icloud.com",
  "me.com",
  "uol.com.br",
  "bol.com.br",
];

export interface ResultadoEnvio {
  enviado: boolean;
  /** Link gerado, devolvido tambem quando o envio falha, para fins de depuracao. */
  link: string;
  erro?: string;
  /** Explicacao pronta para mostrar ao usuario, quando o envio nao sai. */
  aviso?: string;
}

/** Extrai o endereco de dentro de "Nome <email@dominio>". */
function extrairEmail(remetente: string): string {
  const achado = remetente.match(/<([^>]+)>/);
  return (achado ? achado[1] : remetente).trim().toLowerCase();
}

/**
 * Confere se o remetente pode ser usado pelo Resend.
 * Retorna a explicacao do problema, ou null quando esta tudo certo.
 */
export function validarRemetente(remetente: string): string | null {
  const email = extrairEmail(remetente);

  if (!email || !email.includes("@")) {
    return "EMAIL_REMETENTE mal formatado. Use: Nome <email@dominio>";
  }

  const dominio = email.split("@")[1];

  if (DOMINIOS_BLOQUEADOS.includes(dominio)) {
    return (
      `O Resend nao permite enviar a partir de ${dominio}. Webmail gratis ` +
      "nao concede autorizacao de envio a provedores. Registre um dominio " +
      "proprio no Resend e use contato@seudominio, ou use o endereco de " +
      "teste onboarding@resend.dev (que so envia para o seu proprio e-mail)."
    );
  }

  if (dominio.endsWith("resend.dev")) return null;

  return (
    `Confirme se o dominio ${dominio} esta verificado no Resend ` +
    "(Domains > Add Domain). Sem verificacao o envio e recusado."
  );
}

function montarLink(caminho: string, token: string): string {
  return `${SITE_URL}${caminho}?token=${token}`;
}

async function enviar(
  para: string,
  assunto: string,
  html: string,
  link: string
): Promise<ResultadoEnvio> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY nao configurada. Link para ${para}: ${link}`
    );
    return { enviado: false, link, erro: "Servidor de e-mail nao configurado" };
  }

  // Detecta remetente invalido antes de gastar uma chamada na API, e devolve
  // uma explicacao util em vez do erro cru do Resend.
  const problemaRemetente = validarRemetente(REMETENTE);

  if (problemaRemetente) {
    console.error(`[email] remetente invalido: ${problemaRemetente}`);
    return { enviado: false, link, erro: problemaRemetente, aviso: problemaRemetente };
  }

  try {
    const resposta = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: REMETENTE, to: [para], subject: assunto, html }),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text();
      console.error("[email] Resend respondeu:", resposta.status, corpo);

      // O Resend devolve JSON com "message" nos erros de dominio.
      let mensagem = corpo;
      try {
        const dados = JSON.parse(corpo) as { message?: string; name?: string };
        if (dados.message) mensagem = `${dados.name ?? "erro"}: ${dados.message}`;
      } catch {
        // resposta nao era JSON: mantem o texto
      }

      return { enviado: false, link, erro: mensagem, aviso: mensagem };
    }

    return { enviado: true, link };
  } catch (erro) {
    console.error("[email] falha de rede:", erro);
    return { enviado: false, link, erro: (erro as Error).message };
  }
}

const ESTILO_BOTAO = `
  display:inline-block;background:#009B3A;color:#fff;text-decoration:none;
  padding:14px 28px;border-radius:8px;font-weight:700;margin:24px 0;
`;
const ESTILO_CAIXA = `
  max-width:560px;margin:0 auto;background:#f7f9f8;border:1px solid #e2e8e5;
  border-radius:12px;padding:32px;font-family:system-ui,-apple-system,sans-serif;color:#0A2540;
`;

export async function enviarVerificacaoEmail(
  email: string,
  nome: string,
  token: string
): Promise<ResultadoEnvio> {
  const link = montarLink("/verificar-email", token);

  return await enviar(
    email,
    "Confirme seu e-mail — Centro Político",
    `<div style="${ESTILO_CAIXA}">
       <h1 style="margin:0 0 16px;font-size:22px">Bem-vindo ao Centro Político, ${nome}!</h1>
       <p style="line-height:1.6">Confirme seu e-mail para ativar sua conta e acompanhar seus candidatos salvos.</p>
       <a href="${link}" style="${ESTILO_BOTAO}">Confirmar meu e-mail</a>
       <p style="font-size:13px;color:#5a6b75;line-height:1.6">
         O link vale por 24 horas. Se voce nao fez esta cadastro, ignore este e-mail.
       </p>
     </div>`,
    link
  );
}

export async function enviarResetSenha(
  email: string,
  nome: string,
  token: string
): Promise<ResultadoEnvio> {
  const link = montarLink("/redefinir-senha", token);

  return await enviar(
    email,
    "Redefinir sua senha — Centro Político",
    `<div style="${ESTILO_CAIXA}">
       <h1 style="margin:0 0 16px;font-size:22px">Redefinir senha</h1>
       <p style="line-height:1.6">Ola, ${nome}. Recebemos um pedido para alterar a senha da sua conta.</p>
       <a href="${link}" style="${ESTILO_BOTAO}">Criar nova senha</a>
       <p style="font-size:13px;color:#5a6b75;line-height:1.6">
         O link vale por 24 horas. Se voce nao pediu isso, sua senha continua a mesma.
       </p>
     </div>`,
    link
  );
}
