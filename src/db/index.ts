import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// O Supabase exige SSL. A opção `ssl: 'require'` força a conexão segura.
// A opção `prepare: false` é obrigatória para o pooler de transação.
const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require', // ← Força o SSL
});

export const db = drizzle(client, { schema });