import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pauta Brasil — Informação, transparência e democracia",
    template: "%s | Pauta Brasil",
  },
  description:
    "Acompanhe candidatos, propostas e o cenário político do Brasil. Mapa interativo, comparador de propostas, ranking de popularidade e notícias.",
  keywords: [
    "política",
    "eleições 2026",
    "candidatos",
    "Brasil",
    "propostas",
    "mapa eleitoral",
    "comparador de propostas",
  ],
  authors: [{ name: "Pauta Brasil" }],
  creator: "Pauta Brasil",
  publisher: "Pauta Brasil",
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
    siteName: "Pauta Brasil",
    title: "Pauta Brasil — Informação, transparência e democracia",
    description:
      "Acompanhe candidatos, propostas e o cenário político do Brasil em um só lugar.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pauta Brasil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pauta Brasil",
    description:
      "Acompanhe candidatos, propostas e o cenário político do Brasil em um só lugar.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans bg-white text-azul dark:bg-azul-dark dark:text-white flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-[64px] lg:pt-[104px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}