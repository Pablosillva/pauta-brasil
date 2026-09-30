import { Hero } from "@/components/home/Hero";
import { CargoCards } from "@/components/home/CargoCards";
import { UltimasNoticias } from "@/components/home/UltimasNoticias";
import { Ferramentas } from "@/components/home/Ferramentas";
import type { Metadata } from "next";

// A home mostra as últimas notícias do banco — precisa refletir publicações novas
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Pauta Brasil",
  },
  description:
    "Explore o mapa eleitoral do Brasil. Descubra quem disputa o poder em cada estado.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <CargoCards />
      <UltimasNoticias />
      <Ferramentas />
    </>
  );
}