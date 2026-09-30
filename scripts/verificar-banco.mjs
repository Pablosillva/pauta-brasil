import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DIRECT_URL ou DATABASE_URL não definida no .env.local");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

async function main() {
  console.log("🔌 Conectando ao banco...\n");

  const tabelas = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;

  console.log("📋 Tabelas no banco:");
  if (tabelas.length === 0) {
    console.log("   (nenhuma tabela encontrada)");
  } else {
    tabelas.forEach((t) => console.log(`   - ${t.table_name}`));
  }

  const temNoticias = tabelas.some((t) => t.table_name === "noticias");

  if (temNoticias) {
    const [{ count }] = await sql`SELECT COUNT(*) as count FROM noticias`;
    console.log(`\n✅ Tabela 'noticias' existe com ${count} registro(s)`);
  } else {
    console.log("\n❌ Tabela 'noticias' NÃO existe");
    console.log("   Execute: npx drizzle-kit push --force");
  }

  await sql.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});