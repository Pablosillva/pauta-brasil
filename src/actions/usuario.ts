"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  alternarFavorito,
  atualizarPerfil,
  cadastrarUsuario,
  loginUsuario,
  redefinirSenha,
  reenviarVerificacao,
  salvarVotoPauta,
  solicitarResetSenha,
} from "@/lib/usuarios";
import { encerrarSessaoUsuario } from "@/lib/sessao-usuario";
import { enviarResetSenha, enviarVerificacaoEmail } from "@/lib/email";
import { validarForcaSenha } from "@/lib/senha";

export interface EstadoForm {
  erro?: string;
  sucesso?: string;
  /** Exibido quando o envio de e-mail falhou, para permitir recuperar o link. */
  linkDebug?: string;
}

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

/* ------------------------------------------------------------------ */
/*  Cadastro                                                           */
/* ------------------------------------------------------------------ */

export async function acaoCadastrar(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const nome = str(formData.get("nome"));
  const email = str(formData.get("email"));
  const senha = str(formData.get("senha"));
  const confirmacao = str(formData.get("confirmarSenha"));
  const uf = str(formData.get("uf"));

  if (senha !== confirmacao) {
    return { erro: "As senhas nao conferem." };
  }

  const problemaSenha = validarForcaSenha(senha);
  if (problemaSenha) return { erro: problemaSenha };

  const resultado = await cadastrarUsuario({ nome, email, senha, uf });

  if (!resultado.ok) return { erro: resultado.erro ?? "Nao foi possivel criar a conta." };
  if (!resultado.tokenVerificacao || !resultado.usuario) {
    return { erro: "Nao foi possivel gerar o link de verificacao." };
  }

  const envio = await enviarVerificacaoEmail(
    resultado.usuario.email,
    resultado.usuario.nome,
    resultado.tokenVerificacao
  );

  return {
    sucesso:
      "Cadastro criado! Enviamos o link de confirmacao para o seu e-mail. Verifique também a caixa de spam.",
    linkDebug: envio.enviado ? undefined : envio.link,
  };
}

export async function acaoReenviarVerificacao(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const email = str(formData.get("email"));
  const token = await reenviarVerificacao(email);

  if (!token) {
    // Nao revela se o e-mail existe ou ja foi confirmado.
    return {
      sucesso:
        "Se houver uma conta pendente de confirmacao, o link sera enviado novamente.",
    };
  }

  const envio = await enviarVerificacaoEmail(email, "", token);

  return {
    sucesso: "Link de confirmacao reenviado.",
    linkDebug: envio.enviado ? undefined : envio.link,
  };
}

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

export async function acaoLogin(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const email = str(formData.get("email"));
  const senha = str(formData.get("senha"));
  const proximo = str(formData.get("proximo")) || "/minha-conta";

  // Destino interno apenas: impede open redirect via ?proximo=https://...
  const destino = proximo.startsWith("/") && !proximo.startsWith("//")
    ? proximo
    : "/minha-conta";

  const resultado = await loginUsuario(email, senha);

  if (!resultado.ok) {
    return { erro: resultado.erro ?? "Nao foi possivel entrar." };
  }

  revalidatePath("/minha-conta");
  redirect(destino);
}

export async function acaoSair(): Promise<void> {
  await encerrarSessaoUsuario();
  revalidatePath("/minha-conta");
  redirect("/");
}

/* ------------------------------------------------------------------ */
/*  Senha                                                              */
/* ------------------------------------------------------------------ */

export async function acaoSolicitarReset(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const email = str(formData.get("email"));
  const token = await solicitarResetSenha(email);

  if (!token) {
    return {
      sucesso:
        "Se este e-mail estiver cadastrado, enviaremos as instrucoes de redefinicao.",
    };
  }

  const envio = await enviarResetSenha(email, "", token);

  return {
    sucesso: "Instrucoes de redefinicao enviadas.",
    linkDebug: envio.enviado ? undefined : envio.link,
  };
}

export async function acaoRedefinirSenha(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const token = str(formData.get("token"));
  const senha = str(formData.get("senha"));
  const confirmacao = str(formData.get("confirmarSenha"));

  if (senha !== confirmacao) return { erro: "As senhas nao conferem." };

  const problemaSenha = validarForcaSenha(senha);
  if (problemaSenha) return { erro: problemaSenha };

  const resultado = await redefinirSenha(token, senha);
  if (!resultado.ok) return { erro: resultado.erro ?? "Link invalido." };

  return { sucesso: "Senha alterada! Voce ja pode entrar com a nova senha." };
}

/* ------------------------------------------------------------------ */
/*  Perfil e favoritos                                                 */
/* ------------------------------------------------------------------ */

export async function acaoAtualizarPerfil(formData: FormData): Promise<void> {
  const { getSessaoUsuario } = await import("@/lib/sessao-usuario");
  const sessao = await getSessaoUsuario();
  if (!sessao) redirect("/login?proximo=/minha-conta");

  await atualizarPerfil(sessao.id, {
    nome: str(formData.get("nome")),
    uf: str(formData.get("uf")),
  });

  revalidatePath("/minha-conta");
}

export async function acaoAlternarFavorito(candidatoId: string): Promise<void> {
  const { getSessaoUsuario } = await import("@/lib/sessao-usuario");
  const sessao = await getSessaoUsuario();
  if (!sessao) return;

  await alternarFavorito(sessao.id, candidatoId);
  revalidatePath("/minha-conta");
  revalidatePath(`/candidatos/${candidatoId}`);
}

export async function acaoSalvarVoto(
  votacaoId: string,
  voto: string
): Promise<void> {
  const { getSessaoUsuario } = await import("@/lib/sessao-usuario");
  const sessao = await getSessaoUsuario();
  if (!sessao) return;

  await salvarVotoPauta(sessao.id, votacaoId, voto);
  revalidatePath("/pautas");
}
