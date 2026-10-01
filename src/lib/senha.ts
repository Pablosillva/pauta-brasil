import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt) as (
  senha: string,
  salt: Buffer,
  tamanho: number
) => Promise<Buffer>;

const TAMANHO_CHAVE = 64;

/**
 * Gera hash da senha usando scrypt com salt aleatorio.
 * Formato armazenado: scrypt$<salt-hex>$<hash-hex>
 */
export async function gerarHashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16);
  const chave = await scryptAsync(senha.normalize("NFKC"), salt, TAMANHO_CHAVE);
  return `scrypt$${salt.toString("hex")}$${chave.toString("hex")}`;
}

/** Confere a senha contra o hash guardado, sem vazar tempo de comparacao. */
export async function conferirSenha(senha: string, hash: string): Promise<boolean> {
  try {
    const partes = hash.split("$");
    if (partes.length !== 3 || partes[0] !== "scrypt") return false;

    const salt = Buffer.from(partes[1], "hex");
    const esperado = Buffer.from(partes[2], "hex");

    const calculado = await scryptAsync(
      senha.normalize("NFKC"),
      salt,
      esperado.length
    );

    return (
      calculado.length === esperado.length && timingSafeEqual(calculado, esperado)
    );
  } catch {
    return false;
  }
}

/** Regras minimas de senha. Retorna a mensagem de erro ou null se valida. */
export function validarForcaSenha(senha: string): string | null {
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  if (!/[a-zA-Z]/.test(senha)) return "A senha deve conter ao menos uma letra.";
  if (!/[0-9]/.test(senha)) return "A senha deve conter ao menos um número.";
  return null;
}

/** Token hexadecimal seguro para verificacao de e-mail e reset de senha. */
export function gerarToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function gerarId(): string {
  return randomBytes(16).toString("hex");
}
