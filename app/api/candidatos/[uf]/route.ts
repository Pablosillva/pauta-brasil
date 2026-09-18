import { NextRequest, NextResponse } from "next/server";
import { carregarCandidatosDoEstado } from "@/data/loader-tse";

export const dynamic = "force-static";
export const revalidate = 86400;

interface Params {
  params: Promise<{ uf: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { uf } = await params;
  const ufLimpa = uf.trim().toUpperCase();

  if (ufLimpa.length !== 2) {
    return NextResponse.json(
      { error: "UF deve ter 2 caracteres", recebido: uf },
      { status: 400 }
    );
  }

  const candidatos = await carregarCandidatosDoEstado(ufLimpa);

  if (!Array.isArray(candidatos)) {
    return NextResponse.json(
      { error: "Erro no formato dos dados", tipo: typeof candidatos },
      { status: 500 }
    );
  }

  return NextResponse.json(candidatos, {
    headers: {
      "Cache-Control":
        "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}