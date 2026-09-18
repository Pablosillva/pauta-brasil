import Link from "next/link";
import { Mail } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../icons/BrandIcons";

const parceiros = [
  { nome: "Google News", href: "#" },
  { nome: "TSE", href: "#" },
  { nome: "Globo", href: "#" },
  { nome: "Folha de S.Paulo", href: "#" },
  { nome: "UOL", href: "#" },
  { nome: "BAND", href: "#" },
];

const linksInstitucionais = [
  { label: "Sobre", href: "/sobre" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Fale Conosco", href: "/contato" },
];

const linksFerramentas = [
  { label: "Mapa Eleitoral", href: "/mapa" },
  { label: "Comparador", href: "/comparador" },
  { label: "Ranking", href: "/ferramentas/ranking" },
  { label: "Notícias", href: "/noticias" },
];

const redesSociais = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-azul dark:bg-azul-dark text-white mt-16">
      {/* Faixa de parceiros */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-xs uppercase tracking-wider text-white/50 mb-4">
            Nossos parceiros
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {parceiros.map((p) => (
              <Link
                key={p.nome}
                href={p.href}
                className="text-sm font-semibold text-white/70 hover:text-verde-light transition-colors"
              >
                {p.nome}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Marca */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-verde flex items-center justify-center text-white font-bold">
              PB
            </div>
            <span className="font-bold text-lg">Pauta Brasil</span>
          </Link>
          <p className="text-sm text-white/60 leading-relaxed">
            Informação, transparência e democracia. Acompanhe candidatos,
            propostas e o cenário político do Brasil em um só lugar.
          </p>
        </div>

        {/* Institucional */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">
            Institucional
          </h4>
          <ul className="space-y-2">
            {linksInstitucionais.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 hover:text-verde-light transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ferramentas */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">
            Ferramentas
          </h4>
          <ul className="space-y-2">
            {linksFerramentas.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 hover:text-verde-light transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter + redes */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">
            Receba novidades
          </h4>
          <form className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark text-sm font-semibold transition-colors"
            >
              Assinar
            </button>
          </form>

          <div className="flex gap-3">
            {redesSociais.map((r) => {
              const Icon = r.icon;
              return (
                <Link
                  key={r.label}
                  href={r.href}
                  aria-label={r.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-verde transition-colors"
                >
                  <Icon size={16} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} Pauta Brasil. Todos os direitos
            reservados.
          </p>
          <p>
            Feito com <span className="text-verde-light">♥</span> para a
            democracia brasileira.
          </p>
        </div>
      </div>
    </footer>
  );
}