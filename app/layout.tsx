import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  jsonLdSite,
  jsonLdOrganization,
  normalizarTokenGoogle,
} from "@/lib/seo";
import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL as siteUrl } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  /*
   * O token do Google Search Console e por propriedade: cada dominio tem o
   * seu. Como o site mudou de endereco, o valor antigo nao valida o novo.
   * Por isso vem do ambiente em vez de ficar fixo no codigo.
   * Em Search Console: adicionar propriedade > prefixo de URL > HTML.
   *
   * O valor passa por normalizarTokenGoogle porque o Google entrega a tag
   * HTML inteira e o natural e colar a linha toda. Nesse caso o Next.js
   * escapa o markup e o Search Console recusa a meta tag. A funcao aceita o
   * token, o token com prefixo e a tag completa.
   */
  verification: (() => {
    const token = normalizarTokenGoogle(process.env.GOOGLE_SITE_VERIFICATION);
    return token ? { google: token } : undefined;
  })(),
  title: {
    default: "Centro Político — Dados eleitorais, transparência e democracia",
    template: "%s | Centro Político",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  description:
    "Centro de dados e fiscalização política do Brasil: candidatos, fotos, propostas, planos de governo, votações no Congresso e mapa eleitoral.",
  keywords: [
    "centro político",
    "política",
    "eleições 2026",
    "candidatos 2026",
    "resultado eleições",
    "fotos candidatos",
    "plano de governo",
    "votação deputados",
    "mapa eleitoral",
    "comparador de propostas",
    "ranking de candidatos",
    "notícias política",
    "transparência",
    "dados abertos",
    "democracia",
  ],
  authors: [{ name: "Centro Político" }],
  creator: "Centro Político",
  publisher: "Centro Político",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Centro Político",
    title: "Centro Político — Dados eleitorais e transparência",
    description:
      "Candidatos, fotos, propostas, planos de governo e votações do Congresso com dados oficiais do TSE e da Câmara.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Centro Político",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Centro Político",
    description:
      "Candidatos, fotos, planos de governo e votacoes do Congresso com dados oficiais do TSE e da Camara.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A2540" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [jsonLdSite(), jsonLdOrganization()];
  return (
    <html
      lang="pt-BR"
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans bg-white text-azul dark:bg-azul-dark dark:text-white flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1 pt-[64px] lg:pt-[104px]">{children}</main>
        <Footer />
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
