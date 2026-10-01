import Link from "next/link";
import { Info, Target, Users, Shield, Mail } from "lucide-react";

export const metadata = {
  title: "Sobre — Centro Político",
  description: "Conheça a missão e os valores do Centro Político.",
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
          Sobre o Centro Político
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Dados eleitorais e fiscalização do poder, com base em fontes oficiais.
        </p>
      </header>

      <section className="prose dark:prose-invert max-w-none space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            Nossa missão
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            O Centro Político nasceu para simplificar o acesso à informação
            política. Acreditamos que uma democracia forte exige cidadãos
            informados. Por isso, reunimos em um só lugar os candidatos, suas
            fotos, suas propostas, os planos de governo registrados no TSE e os
            registros de votação do Congresso — tudo de forma clara, comparável
            e acessível.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Target size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Transparência
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Todos os dados que publicamos vêm de fontes oficiais: TSE, Câmara
              dos Deputados, Senado e portais de transparência. Onde a fonte não
              tem o dado, a página fica em branco.
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
              Não somos filiados a partidos e não ordenamos candidatos por
              preferência. Apresentamos os fatos. Você tira suas próprias
              conclusões.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Mail size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Fale conosco
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Encontrou um erro? Tem uma sugestão?{" "}
              <a
                href="mailto:contato@centropolitico.com.br"
                className="text-verde font-semibold hover:underline"
              >
                contato@centropolitico.com.br
              </a>
            </p>
          </div>
        </div>

        {/* Escopo do projeto */}
        <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light">
          <h2 className="text-xl font-bold text-azul dark:text-white mb-3">
            O que já funciona e o que não funciona
          </h2>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed mb-4">
            Preferimos declarar o escopo real do projeto a apresentar cobertura
            completa onde não temos. Hoje o Centro Político funciona com:
          </p>
          <ul className="space-y-1.5 text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
            <li>— Todos os candidatos registrados no TSE nas 27 unidades</li>
            <li>— Fotos oficiais de campanha</li>
            <li>— Planos de governo em PDF, como enviados ao TSE</li>
            <li>— Votações nominais do Congresso, com o voto de cada deputado</li>
            <li>— Tramitação completa de projetos de lei</li>
          </ul>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Ainda não cobrimos Dados de senadores, de eleições anteriores a 2024, e o histórico de gastos. Essas lacunas estão listadas na página de limitações conhecidas.
          </p>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light flex flex-wrap gap-6">
        <Link href="/metodologia" className="text-verde font-semibold hover:underline">
          Metodologia
        </Link>
        <Link href="/fontes" className="text-verde font-semibold hover:underline">
          Fontes de dados
        </Link>
        <Link href="/recursos" className="text-verde font-semibold hover:underline">
          Todos os recursos
        </Link>
        <Link href="/" className="text-verde font-semibold hover:underline">
          ← Voltar para a home
        </Link>
      </div>
    </div>
  );
}