import { MDXRemote } from "next-mdx-remote/rsc";

interface NoticiaConteudoProps {
  conteudo: string;
}

export function NoticiaConteudo({ conteudo }: NoticiaConteudoProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-azul dark:prose-headings:text-white prose-a:text-verde prose-strong:text-azul dark:prose-strong:text-white">
      <MDXRemote source={conteudo} />
    </div>
  );
}