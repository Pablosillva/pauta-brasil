"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, CalendarClock } from "lucide-react";
import type { Noticia } from "@/lib/noticias";
import Link from "next/link";
import { EditorConteudo } from "@/components/ui/EditorConteudo";
import { CampoImagem } from "@/components/ui/CampoImagem";

interface EditarNoticiaFormProps {
  noticia: Noticia;
}

const CATEGORIAS = [
  "Política",
  "Economia",
  "Justiça",
  "Eleições",
  "Sociedade",
  "Internacional",
];

/** "2026-10-05T14:30", formato aceito por <input type="datetime-local">. */
function paraInputDateTime(valor: Date | string | null): string {
  if (!valor) return "";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "";
  // Desloca 3h: o input mostra hora local, toISOString() mostraria UTC.
  const local = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

const inputClass =
  "w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde";

export function EditarNoticiaForm({ noticia }: EditarNoticiaFormProps) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [confirmandoDelete, setConfirmandoDelete] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/noticias/${noticia.slug}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      router.push("/batata");
      router.refresh();
    } catch (err) {
      setErro((err as Error).message);
      setCarregando(false);
    }
  }

  async function handleDelete() {
    setCarregando(true);
    try {
      const res = await fetch(`/api/noticias/${noticia.slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      router.push("/batata");
      router.refresh();
    } catch (err) {
      setErro((err as Error).message);
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {erro && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {erro}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
          Título
        </label>
        <input name="titulo" required defaultValue={noticia.titulo} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
          Resumo
        </label>
        <input name="resumo" required defaultValue={noticia.resumo} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
          Categoria
        </label>
        <select name="categoria" required defaultValue={noticia.categoria} className={inputClass}>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
          Tags
        </label>
        <input
          name="tags"
          defaultValue={noticia.tags?.join(", ") ?? ""}
          placeholder="Ex: Congresso, Licitações"
          className={inputClass}
        />
        <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
          Separe por vírgula
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="destaque"
            defaultChecked={noticia.destaque}
            className="w-4 h-4 rounded border-cinza-medio dark:border-azul-light text-verde focus:ring-verde"
          />
          <span className="text-sm font-semibold text-azul dark:text-white">
            Marcar como destaque
          </span>
        </label>
      </div>

      <CampoImagem name="imagemCapa" imagemAtual={noticia.imagemCapa} />

      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-azul dark:text-white mb-2">
          <CalendarClock size={15} />
          Data de publicação
        </label>
        <input
          type="datetime-local"
          name="dataPublicacao"
          defaultValue={paraInputDateTime(noticia.createdAt)}
          className={inputClass}
        />
        <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
          Altere para retroagir ou reagendar a publicação.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
          Conteúdo
        </label>
        <EditorConteudo
          name="conteudo"
          defaultValue={noticia.conteudo}
          rows={20}
          placeholder={"## Introdução\n\nEscreva o conteúdo aqui..."}
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-between pt-4 border-t border-cinza-medio dark:border-azul-light">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={carregando}
            className="px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar alterações"}
          </button>
          <Link
            href="/batata"
            className="px-6 py-3 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
          >
            Cancelar
          </Link>
        </div>

        {confirmandoDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600 dark:text-red-400">
              Confirmar exclusão?
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={carregando}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Sim, deletar
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoDelete(false)}
              className="px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-sm transition-colors"
            >
              Não
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoDelete(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition-colors"
          >
            <Trash2 size={14} /> Deletar notícia
          </button>
        )}
      </div>
    </form>
  );
}
