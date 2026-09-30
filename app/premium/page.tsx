import Link from "next/link";
import { Check, Crown, Sparkles, Bell, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Premium",
  description: "Assine o Pauta Brasil Premium e tenha acesso a recursos exclusivos.",
};

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    description: "Acesso básico às informações eleitorais.",
    features: [
      "Ver candidatos e propostas",
      "Mapa eleitoral",
      "Notícias públicas",
      "Comparador básico",
    ],
    cta: "Plano atual",
    disabled: true,
  },
  {
    name: "Premium",
    price: "R$ 19,90",
    period: "/mês",
    description: "Acesso completo a todas as ferramentas.",
    features: [
      "Tudo do plano Gratuito",
      "Ranking de popularidade",
      "Histórico de votação",
      "Análise de patrimônio",
      "Notificações personalizadas",
      "Exportar dados (PDF/CSV)",
      "Sem anúncios",
      "Suporte prioritário",
    ],
    cta: "Assinar Premium",
    disabled: false,
    popular: true,
  },
  {
    name: "Premium Anual",
    price: "R$ 199,90",
    period: "/ano",
    description: "Economize 17% com o plano anual.",
    features: [
      "Tudo do plano Premium",
      "2 meses grátis",
      "Acesso antecipado a novidades",
      "Relatórios exclusivos mensais",
    ],
    cta: "Assinar Anual",
    disabled: false,
  },
];

const benefits = [
  {
    icon: Bell,
    title: "Notificações em tempo real",
    description: "Receba alertas sobre candidatos favoritos e pautas do Congresso.",
  },
  {
    icon: Download,
    title: "Exportação de dados",
    description: "Baixe relatórios completos em PDF ou CSV para análise offline.",
  },
  {
    icon: Shield,
    title: "Sem anúncios",
    description: "Navegação limpa e sem interrupções.",
  },
  {
    icon: Sparkles,
    title: "Conteúdo exclusivo",
    description: "Análises aprofundadas e relatórios mensais de nossos especialistas.",
  },
];

export default function PremiumPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Crown size={20} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Pauta Brasil Premium
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Assine e tenha acesso completo
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl mx-auto">
          Desbloqueie todas as ferramentas de análise política e apoie o
          jornalismo independente e apartidário.
        </p>
      </header>

      {/* Benefícios */}
      <section className="mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
            >
              <b.icon size={24} className="text-verde mb-3" />
              <h3 className="font-bold text-azul dark:text-white mb-2">{b.title}</h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-azul dark:text-white text-center mb-8">
          Escolha seu plano
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 ${
                plan.popular
                  ? "border-verde bg-verde/5 dark:bg-verde/10"
                  : "border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-verde text-white text-xs font-bold rounded-full">
                  MAIS POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-azul dark:text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-azul dark:text-white">
                  {plan.price}
                </span>
                <span className="text-cinza-escuro dark:text-cinza-medio">
                  {" "}
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-verde shrink-0 mt-0.5" />
                    <span className="text-cinza-escuro dark:text-cinza-medio">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "primary" : "outline"}
                className="w-full"
                disabled={plan.disabled}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-azul dark:text-white text-center mb-8">
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Posso cancelar a qualquer momento?",
              a: "Sim. Não há fidelidade. Você pode cancelar quando quiser e mantém o acesso até o fim do período pago.",
            },
            {
              q: "Quais formas de pagamento são aceitas?",
              a: "Aceitamos cartão de crédito, PIX e boleto bancário.",
            },
            {
              q: "Os dados são atualizados com que frequência?",
              a: "Os dados do TSE são atualizados diariamente. Rankings e análises são atualizados semanalmente.",
            },
            {
              q: "O Pauta Brasil é apartidário?",
              a: "Sim. Não recebemos financiamento de partidos políticos. O Premium nos ajuda a manter a independência editorial.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="p-6 rounded-xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
            >
              <h3 className="font-bold text-azul dark:text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="text-center mt-16">
        <p className="text-cinza-escuro dark:text-cinza-medio mb-4">
          Dúvidas? Fale conosco em{" "}
          <a
            href="mailto:contato@pautabrasil.com.br"
            className="text-verde font-semibold hover:underline"
          >
            contato@pautabrasil.com.br
          </a>
        </p>
        <Link href="/" className="text-verde font-semibold hover:underline">
          ← Voltar para a home
        </Link>
      </section>
    </div>
  );
}
