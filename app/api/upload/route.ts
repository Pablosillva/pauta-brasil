import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { enviarParaCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const arquivo = formData.get("file") as File | null;

    if (!arquivo || arquivo.size === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (!arquivo.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas arquivos de imagem são permitidos" },
        { status: 400 }
      );
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
      return NextResponse.json(
        { error: "Imagem muito grande. Máximo: 10 MB" },
        { status: 400 }
      );
    }

    const { url, publicId } = await enviarParaCloudinary(arquivo);

    return NextResponse.json({ url, publicId });
  } catch (err) {
    console.error("Erro no upload:", err);
    return NextResponse.json(
      {
        error:
          (err as Error).message ??
          "Erro ao enviar a imagem. Verifique as credenciais do Cloudinary.",
      },
      { status: 500 }
    );
  }
}
