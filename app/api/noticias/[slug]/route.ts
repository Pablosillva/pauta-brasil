import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

const NOTICIAS_DIR = path.join(process.cwd(), "content/noticias");

interface Params {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const formData = await request.formData();
    const titulo = formData.get("titulo") as string;
    const resumo = formData.get("resumo") as string;
    const categoria = formData.get("categoria") as string;
    const conteudo = formData.get("conteudo") as string;
    const tagsInput = formData.get("tags") as string;
    const destaque = formData.get("destaque") === "on";
    const imagemFile = formData.get("imagem") as File | null;

    const filePath = path.join(NOTICIAS_DIR, `${slug}.mdx`);
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    const existingContent = await readFile(filePath, "utf-8");
    const { data: existingData } = matter(existingContent);

    let imagemCapa = existingData.imagemCapa || "";

    if (imagemFile && imagemFile.size > 0) {
      try {
        const blob = await put(
          `noticias/${slug}-${imagemFile.name}`,
          imagemFile,
          { access: "public" }
        );
        imagemCapa = blob.url;
      } catch (err) {
        console.error("Erro ao fazer upload:", err);
      }
    }

    const tags = tagsInput
      ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const novoFrontmatter = matter.stringify(conteudo, {
      ...existingData,
      titulo,
      resumo,
      categoria,
      imagemCapa,
      tags,
      destaque,
    });

    await writeFile(filePath, novoFrontmatter, "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao atualizar notícia:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar notícia" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const filePath = path.join(NOTICIAS_DIR, `${slug}.mdx`);
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao deletar notícia:", err);
    return NextResponse.json(
      { error: "Erro ao deletar notícia" },
      { status: 500 }
    );
  }
}