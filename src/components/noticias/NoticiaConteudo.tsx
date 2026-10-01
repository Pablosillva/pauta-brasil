import { MDXRemote } from "next-mdx-remote/rsc";
import { normalizarConteudo } from "@/lib/noticias";

interface NoticiaConteudoProps {
  conteudo: string;
}

export function NoticiaConteudo({ conteudo }: NoticiaConteudoProps) {
  /*
   * Normaliza tambem na leitura, nao so na gravacao. As noticias ja gravadas
   * antes desta correcao estao no banco com CRLF do Windows, e o parser
   * Markdown trata o "\r" como texto solto: o paragrafo deixa de ser separado
   * e a linha "-1 deputado federal" perde a lista. Sem isto, corrigir o gravado
   * nao resolveria o que ja estava publicado.
   */
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-azul dark:prose-headings:text-white prose-a:text-verde prose-strong:text-azul dark:prose-strong:text-white">
      <MDXRemote source={normalizarConteudo(conteudo)} />
    </div>
  );
}