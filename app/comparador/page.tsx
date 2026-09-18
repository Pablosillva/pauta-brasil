"use client";

import { Suspense } from "react";
import { ComparadorContent } from "./ComparadorContent";

export default function ComparadorPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-12 text-center text-cinza-escuro">
        Carregando comparador...
      </div>
    }>
      <ComparadorContent />
    </Suspense>
  );
}