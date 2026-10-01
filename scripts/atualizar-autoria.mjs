/**
 * Troca a autoria das noticias que ficaram com o nome da marca antiga.
 *
 * As noticias foram migradas para o banco antes da renomeacao, entao o campo
 * `autor` ainda diz "Redacao Pauta Brasil" e aparece em todas as paginas.
 * Este script corrige os registros ja gravados; novas noticias usam o valor
 * padrao de src/lib/noticias.ts.
 *
 * E idempotente: rodar de novo nao altera nada.
 *
 * Uso: node scripts/atualizar-autoria.mjs
 */
import { config } from "dotenv";
config({ path: ".env.local" });

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!url) {
  console.log("> atualizar-autoria: DATABASE_URL nao definida, pulando");
  process.exit(0);
}

const { default: postgres } = await import("postgres");
const sql = postgres(url, { prepare: false, ssl: "require" });

/** Padrões de autoria antigos -> novo valor. */
const TROCAS = [
  ["Redação Pauta Brasil", "Redação Centro Político"],
  ["Redacao Pauta Brasil", "Redação Centro Político"],
  ["Pauta Brasil", "Redação Centro Político"],
];

try {
  for (const [antigo, novo] of TROCAS) {
    const alterados = await sql`
      UPDATE noticias
      SET autor = ${novo}
      WHERE autor = ${antigo}
    `;

    // O postgres.js devolve a quantidade em `count`, nao no array direto.
    const total = Number(alterados?.count ?? alterados?.length ?? 0);
    console.log(`> "${antigo}" -> "${novo}": ${total} registro(s)`);
  }

  // Mostra como ficaram os autores, para conferir de relance.
  const autores = await sql`
    SELECT autor, COUNT(*)::int AS total
    FROM noticias
    GROUP BY autor
    ORDER BY total DESC
  `;

  console.log("\n> Autores no banco agora:");
  for (const a of autores) {
    console.log(`   ${String(a.total).padStart(4)}  ${a.autor}`);
  }
} catch (erro) {
  console.error("> atualizar-autoria: falha -", erro.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
