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
    default: "Pauta Brasil — Informação, transparência e democracia",
    template: "%s | Pauta Brasil",
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
    "Acompanhe candidatos, propostas e o cenário político do Brasil. Mapa interativo, comparador de propostas, ranking de popularidade e notícias.",
  keywords: [
    "política",
    "eleições 2026",
    "candidatos",
    "Brasil",
    "propostas",
    "mapa eleitoral",
    "comparador de propostas",
    "ranking de popularidade",
    "notícias política",
    "transparência",
    "democracia",
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
