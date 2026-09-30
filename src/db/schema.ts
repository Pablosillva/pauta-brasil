import { pgTable, text, varchar, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

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