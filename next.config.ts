import type { NextConfig } from "next";

/*
 * Content-Security-Policy.
 *
 * O alvo principal e o clickjacking: sem frame-ancestors, o painel /batata
 * pode ser embutido num iframe de outro site com um botao falso por cima, e o
 * admin clica achando que esta no proprio painel. Como a criacao de noticia
 * aceita Markdown executado no servidor, um clique forjado ali e o caminho
 * mais curto para vazar segredo do servidor.
 *
 * As diretivas saomontadas aqui em vez de em varios lugares porque uma CSP
 * As diretivas ficam juntas aqui em vez de espalhadas, porque uma CSP
 *
 * Limite conhecido, e declarado: script-src usa 'unsafe-inline'. O App Router
 * injeta scripts de hidratacao inline, e bloquear isso quebraria o site sem
 * nao-estatico. A alternativa e nonce por requisicao via middleware, ao preco
 * de transformar toda rota em dinamica e perder o que o build estatico ganha.
 * Quem quiser fechar isso depois sabe o preco.
 */
const csp = [
  "default-src 'self'",
  // Base do HTML: impede que um <base> injetado aponte o site inteiro para
  // outro dominio.
  "base-uri 'self'",
  // Formularios so podem ir para o proprio dominio. Sem isso, uma pagina com
  // formulario apontando para fora enviaria dados a um terceiro.
  "form-action 'self'",
  // Sem plugin de objeto, some uma classe inteira de vetor.
  "object-src 'none'",
  // A diretiva que fecha o clickjacking. Vale mais que X-Frame-Options porque
  // nao tem o problema do IE de ignorar em https.
  "frame-ancestors 'none'",
  // next/script do Analytics. O inline e o motivo descrito no comentario acima.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  // Tailwind e varios elementos com style inline.
  "style-src 'self' 'unsafe-inline'",
  // Fotos locais, as do Cloudinary e o fallback de avatar.
  // As fotos de parlamentar vem do host oficial de cada Casa: sem os dois
  // dominios abaixo, as 513 fotos de deputado e as de senador ficam quebradas.
  // Isso foi achado testando a pagina, nao lendo o codigo.
  "img-src 'self' data: blob: https://res.cloudinary.com https://i.pravatar.cc https://www.camara.leg.br https://www.senado.leg.br",
  "font-src 'self' data:",
  // So conexoes feitas pelo navegador. As consultas a Camara, TSE e Senado
  // rodam no servidor e nao sao reguladas por CSP.
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.vercel-insights.com",
  // O Analytics usa iframe.
  "frame-src https://www.googletagmanager.com",
  // Todo recurso http vira https, o que evita mistura de conteudo.
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Em todas as rotas, inclusive as de API. O arquivo de verificacao do
        // Google tambem recebe, o que nao atrapalha: ele so precisa ser
        // baixavel.
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
            ].join(", "),
          },
          // Strict-Transport-Security ja vem do Vercel, com preload. Nao
          // repetimos aqui para nao haver dois valores conflitando.
        ],
      },
    ];
  },
};

export default nextConfig;
