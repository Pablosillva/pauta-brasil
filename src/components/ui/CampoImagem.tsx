"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface CampoImagemProps {
  name: string;
  imagemAtual?: string | null;
  rotulo?: string;
  dica?: string;
}

export function CampoImagem({
  name,
  imagemAtual,
  rotulo = "Imagem de capa",
  dica = "Recomendado: 1200x675px (16:9), JPG ou PNG",
}: CampoImagemProps) {
  const [preview, setPreview] = useState<string | null>(imagemAtual ?? null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const cloudinaryVazio = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  async function handleUpload(arquivo: File) {
    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem.");
      return;
    }

    if (arquivo.size > 10 * 1024 * 1024) {
      setErro("Imagem muito grande. Máximo: 10 MB.");
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      const data = new FormData();
      data.append("file", arquivo);

      const res = await fetch("/api/upload", { method: "POST", body: data });

      if (!res.ok) {
        const corpo = await res.json().catch(() => ({}));
        throw new Error(corpo.error ?? "Falha no upload");
      }

      const { url } = await res.json();
      setPreview(url);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  function remover() {
    setPreview(null);
    setErro("");
    // Limpa o campo file escondido para permitir reenvio do mesmo arquivo
    const input = document.getElementById(`${name}-file`) as HTMLInputElement | null;
    if (input) input.value = "";
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
        {rotulo}
      </label>

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-cinza-medio dark:border-azul-light">
            <Image
              src={preview}
              alt="Pré-visualização da capa"
              width={800}
              height={450}
              unoptimized
              className="w-full h-auto object-cover"
            />
            <button
              type="button"
              onClick={remover}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
            Imagem selecionada. Envie o formulário para salvar.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-lg border-2 border-dashed border-cinza-medio dark:border-azul-light p-6 text-center">
          <Upload size={24} className="mx-auto text-cinza-escuro mb-2" />
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-3">
            Arraste uma imagem ou clique para selecionar
          </p>
        </div>
      )}

      <input
        id={`${name}-file`}
        type="file"
        accept="image/*"
        disabled={enviando}
        onChange={(e) => {
          const arquivo = e.target.files?.[0];
          if (arquivo) handleUpload(arquivo);
        }}
        className="mt-3 w-full max-w-md p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white text-sm file:mr-3 file:rounded-md file:border-0 file:bg-verde file:px-3 file:py-1.5 file:text-white file:font-semibold disabled:opacity-50"
      />

      {/* Campo escondido com a URL final enviada ao Cloudinary */}
      <input type="hidden" name={name} value={preview ?? ""} />

      {enviando && (
        <p className="flex items-center gap-2 text-xs text-cinza-escuro dark:text-cinza-medio mt-2">
          <Loader2 size={14} className="animate-spin" />
          Enviando para o Cloudinary...
        </p>
      )}

      {erro && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">{erro}</p>
      )}

      {!cloudinaryVazio && !imagemAtual && !preview && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
          Aviso: Cloudinary ainda não configurado no Vercel. A imagem pode não
          ser enviada.
        </p>
      )}

      <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-2">{dica}</p>
    </div>
  );
}
