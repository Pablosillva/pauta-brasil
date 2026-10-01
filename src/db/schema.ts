import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const noticias = pgTable("noticias", {
  id: varchar("id", { length: 255 }).primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titulo: varchar("titulo", { length: 500 }).notNull(),
  resumo: text("resumo").notNull(),
  conteudo: text("conteudo").notNull(),
  autor: varchar("autor", { length: 255 }).notNull(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  imagemCapa: text("imagem_capa"),
  tags: jsonb("tags").$type<string[]>().default([]),
  destaque: boolean("destaque").default(false).notNull(),
  publicado: boolean("publicado").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Noticia = typeof noticias.$inferSelect;
export type NovaNoticia = typeof noticias.$inferInsert;

/* ------------------------------------------------------------------ */
/*  Área do usuário                                                     */
/* ------------------------------------------------------------------ */

export const usuarios = pgTable(
  "usuarios",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    nome: varchar("nome", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    senhaHash: text("senha_hash").notNull(),

    /** E-mail confirmado pelo link enviado no cadastro. */
    emailVerificado: boolean("email_verificado").default(false).notNull(),
    tokenVerificacao: varchar("token_verificacao", { length: 128 }),
    tokenVerificacaoExpira: timestamp("token_verificacao_expira"),

    tokenReset: varchar("token_reset", { length: 128 }),
    tokenResetExpira: timestamp("token_reset_expira"),

    /** gratuito | premium */
    plano: varchar("plano", { length: 30 }).default("gratuito").notNull(),
    /** UF preferida, usada para sugerir candidatos na home. */
    uf: varchar("uf", { length: 2 }),

    tentativasLogin: integer("tentativas_login").default(0).notNull(),
    bloqueadoAte: timestamp("bloqueado_ate"),

    criadoEm: timestamp("criado_em").defaultNow().notNull(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("usuarios_email_idx").on(t.email)]
);

export type Usuario = typeof usuarios.$inferSelect;
export type NovoUsuario = typeof usuarios.$inferInsert;

/** Candidatos que o usuário salvou para acompanhar. */
export const favoritos = pgTable(
  "favoritos",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    usuarioId: varchar("usuario_id", { length: 64 })
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    candidatoId: varchar("candidato_id", { length: 128 }).notNull(),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("favoritos_unico_idx").on(t.usuarioId, t.candidatoId)]
);

export type Favorito = typeof favoritos.$inferSelect;

/** Votação salva pelo usuário nas pautas companionas. */
export const votosUsuario = pgTable(
  "votos_usuario",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    usuarioId: varchar("usuario_id", { length: 64 })
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    votacaoId: varchar("votacao_id", { length: 32 }).notNull(),
    voto: varchar("voto", { length: 20 }).notNull(),
    criadoEm: timestamp("criado_em").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("votos_usuario_unico_idx").on(t.usuarioId, t.votacaoId)]
);

export type VotoUsuario = typeof votosUsuario.$inferSelect;