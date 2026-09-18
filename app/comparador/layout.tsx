import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de propostas",
  description:
    "Compare lado a lado as propostas de até 4 candidatos por tema: Saúde, Educação, Economia e mais.",
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}