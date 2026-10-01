/**
 * Migração automática do banco.
 *
 * Roda no `prebuild` (Vercel tem acesso ao banco durante o build) e cria as
 * tabelas caso ainda não existam. Todos os comandos são idempotentes:
 * podem ser executados quantas vezes forem preciso sem apagar dados.
 *
 * Para rodar manualmente: npm run db:migrar
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!url) {
  console.log("> migrate: DATABASE_URL nao definida, pulando");
  process.exit(0);
}

const { default: postgres } = await import("postgres");

const sql = postgres(url, { prepare: false, ssl: "require" });

/** Cada item e um comando executado em ordem. */
const COMANDOS = [
  `CREATE TABLE IF NOT EXISTS noticias (
     id varchar(255) PRIMARY KEY,
     slug varchar(255) NOT NULL UNIQUE,
     titulo varchar(500) NOT NULL,
     resumo text NOT NULL,
     conteudo text NOT NULL,
     autor varchar(255) NOT NULL,
     categoria varchar(100) NOT NULL,
     imagem_capa text,
     tags jsonb DEFAULT '[]'::jsonb,
     destaque boolean DEFAULT false NOT NULL,
     publicado boolean DEFAULT true NOT NULL,
     created_at timestamp DEFAULT now() NOT NULL,
     updated_at timestamp DEFAULT now() NOT NULL
   )`,

  `CREATE TABLE IF NOT EXISTS usuarios (
     id varchar(64) PRIMARY KEY,
     nome varchar(120) NOT NULL,
     email varchar(255) NOT NULL,
     senha_hash text NOT NULL,
     email_verificado boolean DEFAULT false NOT NULL,
     token_verificacao varchar(128),
     token_verificacao_expira timestamp,
     token_reset varchar(128),
     token_reset_expira timestamp,
     plano varchar(30) DEFAULT 'gratuito' NOT NULL,
     uf varchar(2),
     tentativas_login integer DEFAULT 0 NOT NULL,
     bloqueado_ate timestamp,
     criado_em timestamp DEFAULT now() NOT NULL,
     atualizado_em timestamp DEFAULT now() NOT NULL
   )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_idx ON usuarios (email)`,

  `CREATE TABLE IF NOT EXISTS favoritos (
     id varchar(64) PRIMARY KEY,
     usuario_id varchar(64) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
     candidato_id varchar(128) NOT NULL,
     criado_em timestamp DEFAULT now() NOT NULL
   )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS favoritos_unico_idx ON favoritos (usuario_id, candidato_id)`,

  `CREATE TABLE IF NOT EXISTS votos_usuario (
     id varchar(64) PRIMARY KEY,
     usuario_id varchar(64) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
     votacao_id varchar(32) NOT NULL,
     voto varchar(20) NOT NULL,
     criado_em timestamp DEFAULT now() NOT NULL
   )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS votos_usuario_unico_idx ON votos_usuario (usuario_id, votacao_id)`,

  // Colunas que podem faltar em bancos criados por versoes anteriores.
  `ALTER TABLE noticias ADD COLUMN IF NOT EXISTS imagem_capa text`,
  `ALTER TABLE noticias ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb`,
  `ALTER TABLE noticias ADD COLUMN IF NOT EXISTS destaque boolean DEFAULT false NOT NULL`,
];

let falhas = 0;

try {
  for (const comando of COMANDOS) {
    await sql.unsafe(comando);
  }

  const tabelas = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;

  console.log(`> migrate: ok (${tabelas.length} tabela(s))`);
  for (const t of tabelas) console.log(`   - ${t.table_name}`);
} catch (erro) {
  // A migracao nunca deve derrubar o build: o app lida com tabelas ausentes.
  falhas = 1;
  console.error("> migrate: falha ao preparar o banco:", erro.message);
} finally {
  await sql.end();
}

process.exit(falhas);
