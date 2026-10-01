"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/*
 * Envio de pageview no roteamento do App Router.
 *
 * Um cuidado que costuma faltar: o gtag("config") inicial ja registra uma
 * visualizacao. Como o efeito abaixo roda tambem na primeira renderizacao,
 * a mesma pagina era contada duas vezes sem este send_page_view: false no
 * bootstrap.
 *
 * O padrao adotado e o recomendado pelo Google para SPA:
 *
 *   1. config com send_page_view: false, sem contar nada ainda
 *   2. um pageview explicito a cada troca de rota, pulando a primeira
 */
function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    if (typeof window.gtag !== "function") return;

    const query = searchParams?.toString();
    const url = pathname + (query ? `?${query}` : "");

    // Inclui a primeira renderizacao de proposito: como o bootstrap usou
    // send_page_view: false, e este evento que faz a contagem inicial.
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}