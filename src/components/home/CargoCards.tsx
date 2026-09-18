import Link from "next/link";
import { User, Users, Landmark, Building2 } from "lucide-react";

const cargos = [
  {
    titulo: "Presidente",
    descricao: "Eleição Federal 2026",
    info: "2º turno",
    href: "/candidatos?cargo=presidente",
    icon: User,
    cor: "bg-verde",
  },
  {
    titulo: "Governadores",
    descricao: "Eleição Estadual 2026",
    info: "27 estados",
    href: "/candidatos?cargo=governador",
    icon: Landmark,
    cor: "bg-azul",
  },
  {
    titulo: "Senadores",
    descricao: "Eleição Federal 2026",
    info: "54 vagas",
    href: "/candidatos?cargo=senador",
    icon: Users,
    cor: "bg-verde-dark",
  },
  {
    titulo: "Deputados Federais",
    descricao: "Eleição Federal 2026",
    info: "513 vagas",
    href: "/candidatos?cargo=deputado-federal",
    icon: Building2,
    cor: "bg-azul-light",
  },
];

export function CargoCards() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cargos.map((cargo) => {
          const Icon = cargo.icon;
          return (
            <Link
              key={cargo.titulo}
              href={cargo.href}
              className="group bg-white dark:bg-azul-light border border-cinza-medio dark:border-azul rounded-xl p-5 hover:shadow-lg hover:border-verde dark:hover:border-verde transition-all"
            >
              <div
                className={`w-12 h-12 rounded-lg ${cargo.cor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-lg text-azul dark:text-white mb-1">
                {cargo.titulo}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-3">
                {cargo.descricao}
              </p>
              <span className="inline-block text-xs font-semibold text-verde bg-verde/10 px-2 py-1 rounded">
                {cargo.info}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}