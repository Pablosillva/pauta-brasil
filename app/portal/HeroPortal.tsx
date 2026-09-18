import Link from "next/link";
import { MapPin, Newspaper, TrendingUp } from "lucide-react";

export function HeroPortal() {
  return (
    <section className="relative bg-azul dark:bg-azul-dark text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_30%,#009B3A_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#00C44A_0%,transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verde/20 text-verde-light text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-verde-light animate-pulse" />
            Modo Portal
          </span>

          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Acompanhe as notícias, análises e o{" "}
            <span className="text-verde-light">cenário político</span> do Brasil
          </h1>

          <p className="text-lg text-white/80 max-w-2xl mb-8">
            Fora de época de eleição, o Pauta Brasil se transforma em um portal
            completo de política: notícias diárias, análises de especialistas,
            rankings de popularidade e ferramentas permanentes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark font-semibold transition-colors"
            >
              <MapPin size={18} />
              Ver mapa do poder
            </Link>
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 hover:bg-white hover:text-azul font-semibold transition-colors"
            >
              <Newspaper size={18} />
              Últimas notícias
            </Link>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-verde-light">27</p>
              <p className="text-sm text-white/60">Governadores monitorados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-verde-light">513</p>
              <p className="text-sm text-white/60">Deputados federais</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-verde-light">5.570</p>
              <p className="text-sm text-white/60">Municípios cobertos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}