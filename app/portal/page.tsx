import { HeroPortal } from "./HeroPortal";
import { MapaDoPoder } from "./MapaDoPoder";
import { NoticiasDestaque } from "./NoticiasDestaque";
import { AnalisesColunas } from "./AnalisesColunas";
import { RankingPopularidade } from "./RankingPopularidade";

export const metadata = {
  title: "Modo Portal — Pauta Brasil",
  description: "Notícias, análises e o cenário político do Brasil.",
};

export default function PortalPage() {
  return (
    <>
      <HeroPortal />
      <MapaDoPoder />
      <NoticiasDestaque />
      <AnalisesColunas />
      <RankingPopularidade />
    </>
  );
}