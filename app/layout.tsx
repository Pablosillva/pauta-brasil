import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { jsonLdSite, jsonLdOrganization } from "@/lib/seo";
import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  verification: {
    google: "JGTBz0Q25olmwGq1mocPS0OO5XMBGrtLMhunmHwdUfs",
  },
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
      "Acompanhe candidatos, propostas e o cenário político do Brasil em um só lugar.",
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
