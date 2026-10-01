import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de candidatos",
  description:
    "Compare lado a lado ate 4 candidatos com os dados oficiais do TSE: numero na urna, partido, cargo, ocupacao e plano de governo.",
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}