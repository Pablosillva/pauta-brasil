/**
 * Envio de e-mail transacional.
 *
 * Usa a API REST do Resend (sem SDK). Se RESEND_API_KEY nao estiver
 * configurado, o link e apenas registrado no console do servidor — assim o
 * fluxo de cadastro continua funcionando em desenvolvimento e o link pode ser
 * copiado manualmente.
 */

const REMETENTE = process.env.EMAIL_REMETENTE ?? "Centro Político <nao-responda@centropolitico.com.br>";
const RESEND_URL = "https://api.resend.com/emails";

export interface ResultadoEnvio {
  enviado: boolean;
  /** Link gerado, devolvido tambem quando o envio falha, para fins de depuracao. */
  link: string;
  erro?: string;
}

function montarLink(caminho: string, token: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pauta-brasil.vercel.app";
  return `${base.replace(/\/$/, "")}${caminho}?token=${token}`;
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
      return { enviado: false, link, erro: corpo };
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
