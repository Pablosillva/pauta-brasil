import Link from "next/link";
import { Home, MapPin, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 text-verde mb-4">
          <Compass size={22} />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Erro 404
          </span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold text-azul dark:text-white mb-4">
          Página não encontrada
        </h1>

        <p className="text-lg text-cinza-escuro dark:text-cinza-medio mb-10">
          O endereço que você tentou acessar não existe (ou ainda não
          construímos). Mas não se preocupe — temos muito conteúdo para
          você explorar.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            <Home size={18} />
            Voltar para a home
          </Link>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-azul dark:border-white text-azul dark:text-white hover:bg-azul hover:text-white dark:hover:bg-white dark:hover:text-azul font-semibold transition-colors"
          >
            <MapPin size={18} />
            Explorar o mapa
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Link href="/portal" className="p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:text-verde font-medium transition-colors">
            Portal
          </Link>
          <Link href="/candidatos" className="p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:text-verde font-medium transition-colors">
            Candidatos
          </Link>
          <Link href="/comparador" className="p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:text-verde font-medium transition-colors">
            Comparador
          </Link>
          <Link href="/noticias" className="p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:text-verde font-medium transition-colors">
            Notícias
          </Link>
        </div>
      </div>
    </div>
  );
}