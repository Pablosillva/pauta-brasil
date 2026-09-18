import Link from "next/link";
import { FileText, MapPin } from "lucide-react";

export const metadata = {
  title: "Planos de Governo — Pauta Brasil",
  description: "Acesse os planos de governo dos candidatos por estado.",
};

const estados = [
  { id: "sp", nome: "São Paulo", uf: "SP" },
  { id: "rj", nome: "Rio de Janeiro", uf: "RJ" },
  { id: "mg", nome: "Minas Gerais", uf: "MG" },
  { id: "ba", nome: "Bahia", uf: "BA" },
  { id: "rs", nome: "Rio Grande do Sul", uf: "RS" },
  { id: "pr", nome: "Paraná", uf: "PR" },
  { id: "pe", nome: "Pernambuco", uf: "PE" },
  { id: "ce", nome: "Ceará", uf: "CE" },
];

export default function PlanosPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <FileText size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Documentos oficiais
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Planos de Governo
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          Consulte os planos de governo registrados pelos candidatos. Documentos
          oficiais, resumidos por área temática.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {estados.map((e) => (
          <Link
            key={e.id}
            href={`/mapa`}
            className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-5 hover:border-verde transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-verde/10 text-verde flex items-center justify-center font-bold">
                {e.uf}
              </div>
              <MapPin size={16} className="text-cinza-escuro group-hover:text-verde transition-colors" />
            </div>
            <h3 className="font-bold text-azul dark:text-white mb-1 group-hover:text-verde transition-colors">
              {e.nome}
            </h3>
            <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
              Ver planos cadastrados
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center">
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Estamos trabalhando para adicionar todos os 27 estados. Voltamos em breve
          com o acervo completo. 📄
        </p>
      </div>
    </div>
  );
}