import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { atualizarNoticia, deletarNoticia, buscarNoticia } from "@/lib/noticias";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const existente = await buscarNoticia(slug);
    if (!existente) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const titulo = (formData.get("titulo") as string)?.trim();
    const resumo = (formData.get("resumo") as string)?.trim();
    const categoria = formData.get("categoria") as string;
    const conteudo = (formData.get("conteudo") as string) ?? existente.conteudo;
    const tagsInput = (formData.get("tags") as string) ?? "";
    const destaque = formData.get("destaque") === "on";
    const imagemFile = formData.get("imagem") as File | null;

    if (!titulo || !resumo) {
      return NextResponse.json(
        { error: "Título e resumo são obrigatórios" },
        { status: 400 }
      );
    }

    let imagemCapa = existente.imagemCapa;
    if (imagemFile && imagemFile.size > 0) {
      try {
        const blob = await put(
          `noticias/${Date.now()}-${imagemFile.name}`,
          imagemFile,
          { access: "public" }
        );
        imagemCapa = blob.url;
      } catch (err) {
        console.error("Erro ao fazer upload:", err);
      }
    }

    await atualizarNoticia(slug, {
      titulo,
      resumo,
      categoria,
      conteudo,
      imagemCapa,
      tags: tagsInput
        ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      destaque,
      publicado: existente.publicado,
    });

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
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const deletada = await deletarNoticia(slug);
    if (!deletada) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao deletar notícia:", err);
    return NextResponse.json(
      { error: "Erro ao deletar notícia" },
      { status: 500 }
    );
  }
}
