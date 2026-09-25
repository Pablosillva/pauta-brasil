"use client";

import { useState } from "react";

interface FotoCandidatoProps {
  src: string;
  alt: string;
  className?: string;
}

// SVG placeholder com a inicial do nome
function Placeholder({ nome, className }: { nome: string; className?: string }) {
  const inicial = nome.trim().charAt(0).toUpperCase();
  return (
    <div
      className={`${className} bg-gradient-to-br from-verde/20 to-azul/20 flex items-center justify-center font-bold text-verde dark:text-verde-light`}
    >
      <span className="text-2xl">{inicial || "?"}</span>
    </div>
  );
}

export function FotoCandidato({ src, alt, className = "" }: FotoCandidatoProps) {
  const [erro, setErro] = useState(false);

  if (erro || !src) {
    return <Placeholder nome={alt.replace("Foto de ", "")} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErro(true)}
    />
  );
}