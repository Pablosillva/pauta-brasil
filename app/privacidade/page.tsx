import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade do Centro Político.",
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Shield size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Legal
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Política de Privacidade
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Última atualização: 1 de setembro de 2026
        </p>
      </header>

      <section className="prose dark:prose-invert max-w-none space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            1. Coleta de Dados
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Coletamos apenas as informações necessárias para fornecer nossos
            serviços. Isso inclui:
          </p>
          <ul className="list-disc pl-6 text-cinza-escuro dark:text-cinza-medio space-y-2 mt-3">
            <li>
              <strong>Dados de cadastro:</strong> nome e e-mail (quando você cria
              uma conta ou assina a newsletter);
            </li>
            <li>
              <strong>Dados de uso:</strong> páginas visitadas, tempo de
              permanência e interações com o site;
            </li>
            <li>
              <strong>Dados de pagamento:</strong> processados por gateways de
              pagamento seguros (não armazenamos números de cartão).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            2. Uso dos Dados
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Utilizamos os dados coletados para:
          </p>
          <ul className="list-disc pl-6 text-cinza-escuro dark:text-cinza-medio space-y-2 mt-3">
            <li>Fornecer e melhorar nossos serviços;</li>
            <li>Personalizar sua experiência no site;</li>
            <li>Enviar notificações e newsletters (com seu consentimento);</li>
            <li>Processar assinaturas Premium;</li>
            <li>Analisar o uso do site para otimização;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            3. Compartilhamento de Dados
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com
            terceiros para fins de marketing. Podemos compartilhar dados apenas
            com:
          </p>
          <ul className="list-disc pl-6 text-cinza-escuro dark:text-cinza-medio space-y-2 mt-3">
            <li>
              <strong>Prestadores de serviços:</strong> hospedagem, análise de
              dados e processamento de pagamento (sob acordos de
              confidencialidade);
            </li>
            <li>
              <strong>Autoridades:</strong> quando exigido por lei ou ordem
              judicial.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            4. Cookies
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Utilizamos cookies para melhorar sua experiência no site. Você pode
            desativar os cookies nas configurações do seu navegador, mas isso
            pode afetar a funcionalidade do site.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            5. Segurança
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Adotamos medidas técnicas e organizacionais para proteger seus dados
            contra acesso não autorizado, alteração, divulgação ou destruição.
            Isso inclui criptografia, controles de acesso e monitoramento
            regular.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            6. Seus Direitos (LGPD)
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            De acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº
            13.709/2018), você tem direito a:
          </p>
          <ul className="list-disc pl-6 text-cinza-escuro dark:text-cinza-medio space-y-2 mt-3">
            <li>Acessar seus dados pessoais;</li>
            <li>Corrigir dados incompletos ou desatualizados;</li>
            <li>Solicitar a eliminação de dados;</li>
            <li>Revogar o consentimento;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>Informar-se sobre o compartilhamento de dados.</li>
          </ul>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed mt-3">
            Para exercer seus direitos, entre em contato pelo e-mail{" "}
            <a
              href="mailto:contato@centropolitico.com.br"
              className="text-verde font-semibold hover:underline"
            >
              contato@centropolitico.com.br
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            7. Retenção de Dados
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Mantemos seus dados apenas pelo tempo necessário para cumprir as
            finalidades describedas nesta política ou exigido por lei. Após
            esse período, os dados são eliminados ou anonimizados.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            8. Alterações nesta Política
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente. A
            versão mais recente estará sempre disponível nesta página.
            Recomendamos que você revise esta política regularmente.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
            9. Contato
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre
            como tratamos seus dados, entre em contato conosco pelo e-mail{" "}
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
