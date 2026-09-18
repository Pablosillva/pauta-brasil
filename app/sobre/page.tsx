import Link from "next/link";
import { Info, Target, Users, Shield, Mail } from "lucide-react";

export const metadata = {
  title: "Sobre — Pauta Brasil",
  description: "Conheça a missão e os valores do Pauta Brasil.",
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Info size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Institucional
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Sobre o Pauta Brasil
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Informação, transparência e democracia.
        </p>
      </header>

      <section className="prose dark:prose-invert max-w-none space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            Nossa missão
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            O Pauta Brasil nasceu para simplificar o acesso à informação
            política. Acreditamos que uma democracia forte exige cidadãos
            informados. Por isso, reunimos em um só lugar os candidatos, suas
            propostas, seus históricos e seus patrimônios — tudo de forma clara,
            comparável e acessível.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Target size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Transparência
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Todos os dados que publicamos vêm de fontes oficiais: TSE,
              Câmaras, Senado e portais de transparência.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Users size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Para o cidadão
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Ferramentas pensadas para o eleitor comum. Sem jargão, sem
              partidarismo, sem ruído.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Shield size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Isenção
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Não somos filiados a partidos. Apresentamos os fatos. Você tira
              suas próprias conclusões.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Mail size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Fale conosco
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Encontrou um erro? Tem uma sugestão?{" "}
              <a href="mailto:contato@pautabrasil.com.br" className="text-verde font-semibold hover:underline">
                contato@pautabrasil.com.br
              </a>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-verde/10 border border-verde/30">
          <h3 className="font-bold text-azul dark:text-white mb-2">
            Aviso legal
          </h3>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
            Este é um projeto de demonstração. Os dados exibidos são
            fictícios ou adaptados de fontes públicas para fins educacionais.
            Consulte sempre o site oficial do TSE para informações oficiais
            sobre candidatos e eleições.
          </p>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <Link
          href="/"
          className="text-verde font-semibold hover:underline"
        >
          ← Voltar para a home
        </Link>
      </div>
    </div>
  );
}