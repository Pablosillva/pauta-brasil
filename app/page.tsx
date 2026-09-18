import { Hero } from "@/components/home/Hero";
import { CargoCards } from "@/components/home/CargoCards";
import { UltimasNoticias } from "@/components/home/UltimasNoticias";
import { Ferramentas } from "@/components/home/Ferramentas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início",
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