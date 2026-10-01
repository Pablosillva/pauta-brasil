import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do Centro Político.",
};

export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <FileText size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Legal
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Termos de Uso
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Última atualização: 1 de setembro de 2026
        </p>
      </header>

      <section className="prose dark:prose-invert max-w-none space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            1. Aceitação dos Termos
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Ao acessar e usar o Centro Político, você concorda com estes Termos de
            Uso. Se você não concordar com qualquer parte destes termos, não
            utilize o site.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            2. Uso do Site
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            O Centro Político é uma plataforma de informação política. Você se
            compromete a usar o site apenas para fins lícitos e de acordo com
            estes termos. É proibido:
          </p>
          <ul className="list-disc pl-6 text-cinza-escuro dark:text-cinza-medio space-y-2 mt-3">
            <li>Usar o site para atividades ilegais ou fraudulentas;</li>
            <li>Tentar acessar sistemas ou dados sem autorização;</li>
            <li>Reproduzir, distribuir ou comercializar o conteúdo sem autorização;</li>
            <li>Interferir no funcionamento do site;</li>
            <li>Coletar informações de outros usuários sem consentimento.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            3. Conteúdo e Dados
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Os dados exibidos no Centro Político são obtidos de fontes oficiais,
            principalmente do Tribunal Superior Eleitoral (TSE). Embora nos
            esforcemos para manter as informações precisas e atualizadas, não
            garantimos a exatidão, completude ou atualidade de todos os dados.
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed mt-3">
            O Centro Político não se responsabiliza por decisões tomadas com base
            nas informações exibidas no site. Consulte sempre os canais oficiais
            para confirmar informações.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            4. Propriedade Intelectual
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Todo o conteúdo do site, incluindo textos, gráficos, logos, ícones e
            imagens, é propriedade do Centro Político ou de seus licenciadores e
            está protegido por leis de direitos autorais. Você não pode
            reproduzir, distribuir ou criar obras derivadas sem autorização
            expressa.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            5. Assinatura Premium
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Ao assinar o plano Premium, você concorda em pagar a taxa recorrente
            mensal ou anual. A assinatura pode ser cancelada a qualquer momento,
            mas não há reembolso proporcional para o período já pago. O acesso
            Premium é mantido até o fim do ciclo de faturamento.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            6. Limitação de Responsabilidade
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            O Centro Político não se responsabiliza por danos diretos, indiretos,
            incidentais ou consequenciais decorrentes do uso ou incapacidade de
            usar o site. Isso inclui, mas não se limita a, perda de dados,
            lucros cessantes ou interrupção de negócios.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            7. Modificações
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Podemos atualizar estes Termos de Uso periodicamente. A versão mais
            recente estará sempre disponível nesta página. O uso continuado do
            site após alterações constitui aceitação dos novos termos.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            8. Lei Aplicável
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Estes termos são regidos pelas leis da República Federativa do
            Brasil. Qualquer disputa será submetida ao jurisdição exclusiva dos
            tribunais brasileiros.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            9. Contato
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato
            conosco pelo e-mail{" "}
            <a
              href="mailto:contato@centropolitico.com.br"
              className="text-verde font-semibold hover:underline"
            >
              contato@centropolitico.com.br
            </a>
            .
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
