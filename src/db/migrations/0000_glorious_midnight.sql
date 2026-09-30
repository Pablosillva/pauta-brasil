CREATE TABLE "noticias" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"titulo" varchar(500) NOT NULL,
	"resumo" text NOT NULL,
	"conteudo" text NOT NULL,
	"autor" varchar(255) NOT NULL,
	"categoria" varchar(100) NOT NULL,
	"imagem_capa" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"destaque" boolean DEFAULT false NOT NULL,
	"publicado" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "noticias_slug_unique" UNIQUE("slug")
);
