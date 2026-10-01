import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "centro-politico-secret-key-2026"
);

const COOKIE_NAME = "centro_user";
const TOKEN_EXPIRY = "7d";

export interface SessaoUsuario {
  id: string;
  email: string;
  nome: string;
  plano: "gratuito" | "premium";
}

/** Cria o JWT e grava o cookie httpOnly da sessão do leitor. */
export async function criarSessaoUsuario(payload: SessaoUsuario): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return token;
}

export async function verificarTokenUsuario(
  token: string
): Promise<SessaoUsuario | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessaoUsuario;
  } catch {
    return null;
  }
}

/** Lê a sessão do cookie. Retorna null se não houver ou estiver expirada. */
export async function getSessaoUsuario(): Promise<SessaoUsuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verificarTokenUsuario(token);
}

export async function encerrarSessaoUsuario(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Redireciona para /login se não houver sessão. Use no topo de páginas. */
export async function exigirSessao(): Promise<SessaoUsuario> {
  const sessao = await getSessaoUsuario();

  if (!sessao) {
    redirect("/login?proximo=/minha-conta");
  }

  return sessao;
}
