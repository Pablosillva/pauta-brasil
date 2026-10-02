import { createHmac } from "crypto";

/**
 * Segredo de assinatura de sessao.
 *
 * Antes o projeto tinha o padrao
 *
 *   process.env.JWT_SECRET || "centro-politico-secret-altere-em-producao"
 *
 * com dois defeitos que se somavam:
 *
 * 1. O valor de reserva estava no codigo, portanto no GitHub. Se a variavel
 *    faltasse em qualquer ambiente, o site passaria a aceitar token assinado
 *    com uma senha publica, que qualquer pessoa le em cinco linhas.
 * 2. Admin e leitor usavam o mesmo segredo e nao distinguiam os tokens. Um
 *    token de conta comum servia como sessao de admin.
 *
 * Aqui a exigencia e explicita: sem JWT_SECRET o processo nao sobe, em vez de
 * cair num segredo conhecido.
 */
export function exigirSegredo(nome: string): string {
  const valor = (process.env[nome] ?? "").trim();

  if (!valor) {
    throw new Error(
      `[sessao] ${nome} nao esta definida. Defina no ambiente antes de rodar o site.`
    );
  }

  if (valor.length < 32) {
    throw new Error(
      `[sessao] ${nome} tem ${valor.length} caracteres. Use ao menos 32.`
    );
  }

  return valor;
}

/**
 * Segredo do painel, derivado do segredo base com um dominio proprio.
 *
 * A derivacao nao e decorativa: mesmo que os dois.usem o mesmo material, as
 * chaves ficam distintas, e um token vazado da area do leitor nao vale como
 * sessao de administracao mesmo que o campo typ seja ignorado por engano.
 *
 * O dominio e fixo de proposito. Trocar a frase invalida todas as sessoes de
 * admin, entao nao deve mudar sem ser uma decisao consciente.
 */
const DOMINIO_ADMIN = "centro-politico/painel/v1";

export function segredoAdmin(): Uint8Array {
  const base = exigirSegredo("JWT_SECRET");

  // digest() devolve Buffer, que o jose da build web recusa. Envolvemos em
  // Uint8Array para o tipo passar, e nao ha copia alem disso.
  return new Uint8Array(createHmac("sha256", base).update(DOMINIO_ADMIN).digest());
}

/** Segredo da sessao do leitor. */
export function segredoUsuario(): Uint8Array {
  return new TextEncoder().encode(exigirSegredo("JWT_SECRET"));
}