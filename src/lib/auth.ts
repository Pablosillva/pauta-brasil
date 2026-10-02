import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { segredoAdmin } from "@/lib/sessao-segredos";

const JWT_SECRET = segredoAdmin();

const COOKIE_NAME = "pauta_auth";

/** Distingue o token do painel do token de conta comum. */
export const TIPO_ADMIN = "admin";
const TOKEN_EXPIRY = "7d";

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
}

export async function createToken(payload: AuthPayload): Promise<string> {
  /*
   * O campo typ separa este token do token de conta comum. Sem ele, um
   * visitante que se cadastra recebia um token que o painel aceitava como
   * sessao de admin: bastava copiar o cookie centro_user para pauta_auth.
   *
   * Com o typ, verifyToken recusa qualquer token que nao seja de admin.
   */
  return new SignJWT({ ...payload, typ: TIPO_ADMIN })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Recusa token de outra finalidade, mesmo que a assinatura seja valida.
    if (payload.typ !== TIPO_ADMIN) return null;

    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
