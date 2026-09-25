import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ uf: string; sq: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { uf, sq } = await params;
  const ufUpper = uf.toUpperCase();

  try {
    // 1. Busca os dados do candidato na API do TSE
    const urlCandidato = `https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2026/${ufUpper}/${sq}`;

    const res = await fetch(urlCandidato, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PautaBrasil/1.0)",
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      return new NextResponse("Candidato não encontrado", { status: 404 });
    }

    const data = await res.json();

    // 2. A foto pode estar em diferentes campos dependendo da resposta
    // Tenta os campos mais comuns
    const fotoUrl =
      data.fotoUrl ||
      data.urlFoto ||
      data.foto ||
      (data.candidato && data.candidato.fotoUrl);

    if (!fotoUrl) {
      return new NextResponse("Foto não disponível", { status: 404 });
    }

    // 3. Baixa a imagem
    const imgRes = await fetch(fotoUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PautaBrasil/1.0)",
      },
    });

    if (!imgRes.ok) {
      return new NextResponse("Erro ao baixar foto", { status: imgRes.status });
    }

    const buffer = await imgRes.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": imgRes.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("Erro no proxy de foto:", err);
    return new NextResponse("Erro interno", { status: 500 });
  }
}