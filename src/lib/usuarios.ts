import { db } from "@/db";
import { favoritos, usuarios, votosUsuario, type Usuario } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  conferirSenha,
  gerarHashSenha,
  gerarId,
  gerarToken,
} from "@/lib/senha";
import { criarSessaoUsuario, type SessaoUsuario } from "@/lib/sessao-usuario";

export type { Usuario } from "@/db/schema";

const VALIDADE_TOKEN_MS = 1000 * 60 * 60 * 24; // 24 horas
const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 1000 * 60 * 15; // 15 minutos

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

/* ------------------------------------------------------------------ */
/*  Cadastro                                                            */
/* ------------------------------------------------------------------ */

export interface ResultadoCadastro {
  ok: boolean;
  erro?: string;
  tokenVerificacao?: string;
  usuario?: Usuario;
}

export async function cadastrarUsuario(dados: {
  nome: string;
  email: string;
  senha: string;
  uf?: string;
}): Promise<ResultadoCadastro> {
  const nome = dados.nome.trim();
  const email = normalizarEmail(dados.email);

  if (nome.length < 2) return { ok: false, erro: "Informe seu nome completo." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, erro: "Informe um e-mail válido." };
  }

  const existente = await buscarUsuarioPorEmail(email);
  if (existente) {
    return { ok: false, erro: "Já existe uma conta com este e-mail." };
  }

  const tokenVerificacao = gerarToken();

  const [criado] = await db
    .insert(usuarios)
    .values({
      id: gerarId(),
      nome,
      email,
      senhaHash: await gerarHashSenha(dados.senha),
      emailVerificado: false,
      tokenVerificacao,
      tokenVerificacaoExpira: new Date(Date.now() + VALIDADE_TOKEN_MS),
      uf: dados.uf || null,
      plano: "gratuito",
    })
    .returning();

  return { ok: true, usuario: criado, tokenVerificacao };
}

export async function buscarUsuarioPorEmail(
  email: string
): Promise<Usuario | null> {
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, normalizarEmail(email)))
    .limit(1);
  return usuario ?? null;
}

export async function buscarUsuarioPorId(id: string): Promise<Usuario | null> {
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);
  return usuario ?? null;
}

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

export type ResultadoLogin =
  | { ok: true; sessao: string }
  | {
      ok: false;
      erro: string;
      precisaVerificar?: boolean;
      reenviarVerificacao?: boolean;
    };

export async function loginUsuario(
  email: string,
  senha: string
): Promise<ResultadoLogin> {
  const usuario = await buscarUsuarioPorEmail(email);

  // Mensagem generica: nao revela se o e-mail existe.
  const erroGenerico = "E-mail ou senha incorretos.";

  if (!usuario) {
    // Gasta tempo parecido com um scrypt real para nao vazar a existencia.
    await conferirSenha(senha, "scrypt$00$00");
    return { ok: false, erro: erroGenerico };
  }

  if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
    const minutos = Math.ceil(
      (usuario.bloqueadoAte.getTime() - Date.now()) / 60000
    );
    return {
      ok: false,
      erro: `Conta bloqueada por excesso de tentativas. Tente em ${minutos} minuto(s).`,
    };
  }

  const senhaCorreta = await conferirSenha(senha, usuario.senhaHash);

  if (!senhaCorreta) {
    const tentativas = usuario.tentativasLogin + 1;
    await db
      .update(usuarios)
      .set({
        tentativasLogin: tentativas,
        bloqueadoAte:
          tentativas >= MAX_TENTATIVAS
            ? new Date(Date.now() + BLOQUEIO_MS)
            : null,
      })
      .where(eq(usuarios.id, usuario.id));
    return { ok: false, erro: erroGenerico };
  }

  if (!usuario.emailVerificado) {
    return {
      ok: false,
      erro: "Confirme seu e-mail para ativar a conta.",
      precisaVerificar: true,
    };
  }

  await db
    .update(usuarios)
    .set({ tentativasLogin: 0, bloqueadoAte: null, atualizadoEm: new Date() })
    .where(eq(usuarios.id, usuario.id));

  const sessao = await criarSessaoUsuario({
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    plano: usuario.plano === "premium" ? "premium" : "gratuito",
  });

  return { ok: true, sessao };
}

/* ------------------------------------------------------------------ */
/*  Verificacao de e-mail                                              */
/* ------------------------------------------------------------------ */

export async function verificarEmail(token: string): Promise<Usuario | null> {
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.tokenVerificacao, token))
    .limit(1);

  if (!usuario) return null;

  if (
    usuario.tokenVerificacaoExpira &&
    usuario.tokenVerificacaoExpira < new Date()
  ) {
    return null;
  }

  const [verificado] = await db
    .update(usuarios)
    .set({
      emailVerificado: true,
      tokenVerificacao: null,
      tokenVerificacaoExpira: null,
      atualizadoEm: new Date(),
    })
    .where(eq(usuarios.id, usuario.id))
    .returning();

  return verificado ?? null;
}

/** Reenvia o link de verificacao e devolve o novo token (ou null). */
export async function reenviarVerificacao(
  email: string
): Promise<string | null> {
  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario || usuario.emailVerificado) return null;

  const token = gerarToken();

  await db
    .update(usuarios)
    .set({
      tokenVerificacao: token,
      tokenVerificacaoExpira: new Date(Date.now() + VALIDADE_TOKEN_MS),
    })
    .where(eq(usuarios.id, usuario.id));

  return token;
}

/* ------------------------------------------------------------------ */
/*  Reset de senha                                                     */
/* ------------------------------------------------------------------ */

export async function solicitarResetSenha(email: string): Promise<string | null> {
  const usuario = await buscarUsuarioPorEmail(email);
  // Sempre retorna algo para nao revelar quais e-mails existem.
  if (!usuario) return null;

  const token = gerarToken();

  await db
    .update(usuarios)
    .set({
      tokenReset: token,
      tokenResetExpira: new Date(Date.now() + VALIDADE_TOKEN_MS),
    })
    .where(eq(usuarios.id, usuario.id));

  return token;
}

export async function redefinirSenha(
  token: string,
  novaSenha: string
): Promise<{ ok: boolean; erro?: string }> {
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.tokenReset, token))
    .limit(1);

  if (!usuario) return { ok: false, erro: "Link inválido ou já utilizado." };

  if (usuario.tokenResetExpira && usuario.tokenResetExpira < new Date()) {
    return { ok: false, erro: "Link expirado. Solicite um novo." };
  }

  await db
    .update(usuarios)
    .set({
      senhaHash: await gerarHashSenha(novaSenha),
      tokenReset: null,
      tokenResetExpira: null,
      tentativasLogin: 0,
      bloqueadoAte: null,
      atualizadoEm: new Date(),
    })
    .where(eq(usuarios.id, usuario.id));

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/*  Perfil                                                             */
/* ------------------------------------------------------------------ */

export async function atualizarPerfil(
  id: string,
  dados: { nome?: string; uf?: string }
): Promise<Usuario | null> {
  const [atualizado] = await db
    .update(usuarios)
    .set({
      ...(dados.nome ? { nome: dados.nome.trim() } : {}),
      ...(dados.uf !== undefined ? { uf: dados.uf || null } : {}),
      atualizadoEm: new Date(),
    })
    .where(eq(usuarios.id, id))
    .returning();

  return atualizado ?? null;
}

export async function definirPlano(id: string, plano: "gratuito" | "premium") {
  const [atualizado] = await db
    .update(usuarios)
    .set({ plano, atualizadoEm: new Date() })
    .where(eq(usuarios.id, id))
    .returning();

  return atualizado ?? null;
}

/* ------------------------------------------------------------------ */
/*  Favoritos                                                          */
/* ------------------------------------------------------------------ */

export async function listarFavoritos(usuarioId: string) {
  return await db
    .select()
    .from(favoritos)
    .where(eq(favoritos.usuarioId, usuarioId))
    .orderBy(desc(favoritos.criadoEm));
}

export async function alternarFavorito(
  usuarioId: string,
  candidatoId: string
): Promise<{ favoritado: boolean }> {
  const [existente] = await db
    .select()
    .from(favoritos)
    .where(
      and(eq(favoritos.usuarioId, usuarioId), eq(favoritos.candidatoId, candidatoId))
    )
    .limit(1);

  if (existente) {
    await db.delete(favoritos).where(eq(favoritos.id, existente.id));
    return { favoritado: false };
  }

  await db.insert(favoritos).values({
    id: gerarId(),
    usuarioId,
    candidatoId,
  });

  return { favoritado: true };
}

export async function listarIdsFavoritos(usuarioId: string): Promise<string[]> {
  const lista = await listarFavoritos(usuarioId);
  return lista.map((f) => f.candidatoId);
}

/* ------------------------------------------------------------------ */
/*  Votos em pautas                                                    */
/* ------------------------------------------------------------------ */

export async function salvarVotoPauta(
  usuarioId: string,
  votacaoId: string,
  voto: string
) {
  const [existente] = await db
    .select()
    .from(votosUsuario)
    .where(
      and(
        eq(votosUsuario.usuarioId, usuarioId),
        eq(votosUsuario.votacaoId, votacaoId)
      )
    )
    .limit(1);

  if (existente) {
    await db
      .update(votosUsuario)
      .set({ voto })
      .where(eq(votosUsuario.id, existente.id));
    return;
  }

  await db.insert(votosUsuario).values({
    id: gerarId(),
    usuarioId,
    votacaoId,
    voto,
  });
}

export async function listarVotosPauta(usuarioId: string) {
  return await db
    .select()
    .from(votosUsuario)
    .where(eq(votosUsuario.usuarioId, usuarioId));
}

/** Estatísticas agregadas do site, usadas na home e no painel do usuário. */
export async function contarUsuarios(): Promise<number> {
  const [linha] = await db.select({ total: sql<number>`count(*)` }).from(usuarios);
  return Number(linha?.total ?? 0);
}

export type { SessaoUsuario };
