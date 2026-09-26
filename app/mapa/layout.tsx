import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa Eleitoral",
  description:
    "Explore os candidatos por estado.",
};

export default function ComparadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}