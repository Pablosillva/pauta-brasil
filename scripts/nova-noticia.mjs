import prompts from "prompts";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const NOTICIAS_DIR = path.join(process.cwd(), "content/noticias");
const IMAGENS_DIR = path.join(process.cwd(), "public/noticias/imagens");

const CATEGORIAS = [
  "Política",
  "Economia",
  "Justiça",
  "Eleições",
  "Sociedade",
  "Internacional",
  "Tecnologia",
  "Saúde",
  "Educação",
  "Meio Ambiente",
];

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);
}

async function main() {
  console.log("\n📰 Criar nova notícia — Pauta Brasil\n");

  const respostas = await prompts([
    {
      type: "text",
      name: "titulo",
      message: "Título da notícia:",
      validate: (v) => (v.trim().length > 5 ? true : "Título muito curto"),
    },
    {
      type: "text",
      name: "resumo",
      message: "Resumo (1-2 frases):",
      validate: (v) => (v.trim().length > 10 ? true : "Resumo muito curto"),
    },
    {
      type: "select",
      name: "categoria",
      message: "Categoria:",
      choices: CATEGORIAS.map((c) => ({ title: c, value: c })),
    },
    {
      type: "text",
      name: "autor",
      message: "Autor:",
      initial: "Redação Pauta Brasil",
    },
    {
      type: "text",
      name: "imagemCapa",
      message: "Nome do arquivo de imagem (deixe vazio se não tiver):",
      initial: "",
    },
    {
      type: "text",
      name: "tags",
      message: "Tags (separadas por vírgula):",
      initial: "",
    },
    {
      type: "confirm",
      name: "destaque",
      message: "É notícia de destaque?",
      initial: false,
    },
  ]);

  if (!respostas.titulo) {
    console.log("\n❌ Cancelado.");
    process.exit(0);
  }

  const slug = slugify(respostas.titulo);
  const data = new Date().toISOString().split("T")[0];

  const tagsArray = respostas.tags
    ? respostas.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const imagemCapa = respostas.imagemCapa
    ? `/noticias/imagens/${respostas.imagemCapa}`
    : "";

  const frontmatter = [
    "---",
    `titulo: "${respostas.titulo.replace(/"/g, '\\"')}"`,
    `resumo: "${respostas.resumo.replace(/"/g, '\\"')}"`,
    `data: "${data}"`,
    `autor: "${respostas.autor}"`,
    `categoria: "${respostas.categoria}"`,
    `imagemCapa: "${imagemCapa}"`,
    `tags: [${tagsArray.map((t) => `"${t}"`).join(", ")}]`,
    `destaque: ${respostas.destaque}`,
    "---",
    "",
    "## Introdução",
    "",
    "Escreva aqui o primeiro parágrafo da notícia...",
    "",
    "## Desenvolvimento",
    "",
    "Continue o texto aqui...",
    "",
    "> \"Use citações assim para dar credibilidade à notícia.\"",
    "",
    "## Conclusão",
    "",
    "Finalize a notícia aqui...",
    "",
  ].join("\n");

  if (!existsSync(NOTICIAS_DIR)) {
    await mkdir(NOTICIAS_DIR, { recursive: true });
  }

  const filePath = path.join(NOTICIAS_DIR, `${slug}.mdx`);

  if (existsSync(filePath)) {
    console.log(`\n❌ Já existe uma notícia com esse título: ${slug}.mdx`);
    process.exit(1);
  }

  await writeFile(filePath, frontmatter, "utf-8");

  console.log("\n✅ Notícia criada com sucesso!\n");
  console.log(`   Arquivo: content/noticias/${slug}.mdx`);
  console.log(`   Slug:    /noticias/${slug}\n`);

  if (respostas.imagemCapa) {
    console.log(
      `   📸 Lembre-se de colocar a imagem em public/noticias/imagens/${respostas.imagemCapa}\n`
    );
  } else {
    console.log(
      `   💡 Sem imagem. Adicione depois no frontmatter se quiser.\n`
    );
  }

  console.log("   Para editar: abra o arquivo no VS Code.\n");
}

main().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});