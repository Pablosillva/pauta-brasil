import { NextRequest, NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const DIR = path.join(process.cwd(), "src/data/tse");

/** Arquivos comecados com "_" sao indices internos, nao listas de candidatos. */
function ehArquivoDeCandidatos(nome: string): boolean {
  return nome.endsWith(".json") && !nome.startsWith("_");
}

/**
 * Lista candidatos do TSE.
 *
 * Sem parametros, aceita filtros (uf, cargo, partido, q, limite) e devolve
 * somente a lista resumida. Com `ids=a,b,c`, devolve os candidatos completos
 * pedidos - e o que o comparador usa, evitando baixar ~17 MB de JSON.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    const arquivos = (await readdir(DIR)).filter(ehArquivoDeCandidatos);

    /* ---- Busca por ids: so le os arquivos necessarios ---- */
    const ids = params.get("ids");

    if (ids) {
      const desejados = new Set(ids.split(",").filter(Boolean));
      const encontrados: unknown[] = [];

      for (const arquivo of arquivos) {
        // Descarta o arquivo se nenhum id pedido pertence a este estado.
        const uf = arquivo.replace(/\.json$/, "").toUpperCase();
        if (![...desejados].some((id) => id.toUpperCase().includes(`-${uf}-`))) {
          continue;
        }

        try {
          const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));
          for (const c of lista) {
            if (desejados.has(c.id)) encontrados.push(c);
          }
        } catch {
          // arquivo ilegivel: segue sem ele
        }

        if (encontrados.length === desejados.size) break;
      }

      return NextResponse.json(encontrados);
    }

    /* ---- Listagem com filtros ---- */
    const uf = params.get("uf");
    const cargo = params.get("cargo");
    const partido = params.get("partido");
    const termo = params.get("q")?.trim().toLowerCase();
    const limite = Math.min(Number(params.get("limite")) || 500, 2000);

    // Com termo de busca ou sem filtro de UF, le todos os estados.
    const estados = uf
      ? [`${uf.toUpperCase()}.json`]
      : termo || !cargo
        ? arquivos
        : arquivos;

    const todos: Record<string, unknown>[] = [];

    for (const arquivo of estados) {
      try {
        const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));
        todos.push(...lista);
      } catch {
        // arquivo ausente: segue
      }
    }

    const filtrados = todos.filter((c) => {
      if (uf && c.estadoId !== `br-${uf.toLowerCase()}`) return false;
      if (cargo && c.cargo !== cargo) return false;
      if (partido && c.partido !== partido) return false;
      if (termo) {
        const alvo = `${c.nome} ${c.nomeUrna ?? ""}`.toLowerCase();
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });

    // Resumo enxuto: a listagem nao precisa dos campos pesados.
    const resumo = filtrados.slice(0, limite).map((c) => ({
      id: c.id,
      nome: c.nome,
      nomeUrna: c.nomeUrna,
      numero: c.numero,
      partido: c.partido,
      cargo: c.cargo,
      estadoId: c.estadoId,
      foto: c.foto,
      idade: c.idade,
      genero: c.genero,
      status: c.status,
      planoGovernoUrl: c.planoGovernoUrl,
    }));

    return NextResponse.json({ total: filtrados.length, candidatos: resumo });
  } catch (erro) {
    console.error("Erro ao carregar candidatos:", erro);
    return NextResponse.json(
      { error: "Erro ao carregar candidatos" },
      { status: 500 }
    );
  }
}
