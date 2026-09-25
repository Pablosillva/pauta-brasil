import { NextRequest, NextResponse } from "next/server";
import { candidatos as mockados } from "@/data/candidatos";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // 1ª tentativa: candidato mockado
  const mockado = mockados.find((c) => c.id === id);
  if (mockado) {
    return NextResponse.json(mockado);
  }

  // 2ª tentativa: candidato do TSE
  const uf = id.split("-")[0].toLowerCase();
  try {
    const mod = await import(`@/data/tse/${uf}.json`);
    const lista = ((mod as any).default ?? mod) as any[];
    const candidato = lista.find((c: any) => c.id === id);

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