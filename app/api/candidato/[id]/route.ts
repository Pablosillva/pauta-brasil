import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { Candidato } from "@/data/candidatos";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Busca o candidato nos arquivos JSON do TSE
  const uf = id.split("-")[0].toLowerCase();
  try {
    const filePath = path.join(process.cwd(), "src/data/tse", `${uf}.json`);
    const conteudo = await readFile(filePath, "utf-8");
    const lista = JSON.parse(conteudo) as Candidato[];
    const candidato = lista.find((c) => c.id === id);

    if (!candidato) {
      return NextResponse.json(
        { error: "Candidato não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(candidato);
  } catch (err) {
    console.error("Erro ao carregar candidato:", err);
    return NextResponse.json(
      { error: "Erro ao carregar candidato" },
      { status: 500 }
    );
  }
}
