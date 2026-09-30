import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "src/data/tse");
    const arquivos = await readdir(dir);
    const todos: unknown[] = [];

    for (const arquivo of arquivos) {
      if (arquivo === "_indice.json" || !arquivo.endsWith(".json")) continue;
      try {
        const conteudo = await readFile(path.join(dir, arquivo), "utf-8");
        todos.push(...JSON.parse(conteudo));
      } catch {
        // ignora arquivo inválido
      }
    }

    return NextResponse.json(todos);
  } catch (err) {
    console.error("Erro ao carregar candidatos:", err);
    return NextResponse.json(
      { error: "Erro ao carregar candidatos" },
      { status: 500 }
    );
  }
}
