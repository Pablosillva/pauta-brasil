import Link from "next/link";
import { ThumbsUp, ThumbsDown, Minus, Ban } from "lucide-react";
import { rotuloVoto, type CorVoto } from "@/lib/camara";
import type { Deputado } from "@/lib/camara";

const ESTILO: Record<CorVoto, string> = {
  verde:
    "bg-verde/10 text-verde border-verde/30",
  vermelho:
    "bg-red-100 dark:bg-red-900/25 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800",
  neutro:
    "bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio border-cinza-medio dark:border-azul-light",
};

function Icone({ cor }: { cor: CorVoto }) {
  if (cor === "verde") return <ThumbsUp size={13} />;
  if (cor === "vermelho") return <ThumbsDown size={13} />;
  return <Minus size={13} />;
}

/** Etiqueta colorida de um voto (Sim / Não / Abstenção). */
export function BadgeVoto({ voto }: { voto: string }) {
  const { texto, cor } = rotuloVoto(voto);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${ESTILO[cor]}`}
    >
      <Icone cor={cor} />
      {texto}
    </span>
  );
}

/** Resultado da votação: aprovada, rejeitada ou não voting. */
export function BadgeResultado({ aprovacao }: { aprovacao: number }) {
  if (aprovacao === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-verde/10 text-verde border border-verde/30 text-xs font-bold">
        Aprovada
      </span>
    );
  }

  if (aprovacao === 2) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/25 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 text-xs font-bold">
        Rejeitada
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio border border-cinza-medio dark:border-azul-light text-xs font-bold">
      <Ban size={12} /> Não sustained
    </span>
  );
}

/** Cartão compacto de deputado usado nas listas de votação. */
export function CartaoDeputado({
  deputado,
  voto,
  mostrarVoto = true,
}: {
  deputado: Deputado;
  voto?: string;
  mostrarVoto?: boolean;
}) {
  return (
    <Link
      href={`/deputados/${deputado.id}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={deputado.urlFoto}
        alt=""
        loading="lazy"
        className="w-11 h-11 rounded-full object-cover bg-cinza-medio dark:bg-azul-light flex-shrink-0"
      />

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-azul dark:text-white truncate text-sm">
          {deputado.nome}
        </p>
        <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
          {deputado.siglaPartido}/{deputado.siglaUf}
        </p>
      </div>

      {mostrarVoto && voto && <BadgeVoto voto={voto} />}
    </Link>
  );
}
