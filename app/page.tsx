import { Hero } from "@/components/home/Hero";
import { CargoCards } from "@/components/home/CargoCards";
import { UltimasNoticias } from "@/components/home/UltimasNoticias";
import { Ferramentas } from "@/components/home/Ferramentas";
import { PainelNumeros } from "@/components/home/PainelNumeros";
import type { Metadata } from "next";

// A home mostra as últimas notícias do banco — precisa refletir publicações novas
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Centro Político — Dados eleitorais e fiscalização do poder",
  },
  description:
    "Candidatos, fotos e planos de governo do TSE, alem das votacoes nominais do Congresso. Dados oficiais, sem estimativas.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <PainelNumeros />
      <CargoCards />
      <UltimasNoticias />
      <Ferramentas />
    </>
  );
}