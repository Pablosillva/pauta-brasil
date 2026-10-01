import type { Metadata } from "next";
import { ComparadorContent } from "./ComparadorContent";

export const metadata: Metadata = {
  title: "Comparador de candidatos",
  description:
    "Compare lado a lado ate 4 candidatos com os dados oficiais do TSE: numero na urna, partido, cargo, ocupacao e plano de governo.",
};

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparadorPage({ searchParams }: PageProps) {
  const { ids } = await searchParams;

  // A query e lida no servidor, evitando sincronizar estado por efeito.
  const idsIniciais = (ids ?? "").split(",").filter(Boolean).slice(0, 4);

  return <ComparadorContent idsIniciais={idsIniciais} />;
}
