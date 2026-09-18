import { ImageResponse } from "next/og";
import { candidatos, nomesEstados } from "@/data/candidatos";

export const alt = "Perfil do candidato";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const candidato = candidatos.find((c) => c.id === id);

  if (!candidato) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0A2540",
            color: "white",
            fontSize: "60px",
            fontWeight: "bold",
          }}
        >
          Candidato não encontrado
        </div>
      ),
      { ...size }
    );
  }

  const estado =
    nomesEstados[candidato.estadoId] ?? candidato.estadoId.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0A2540 0%, #1B3A5C 100%)",
          padding: "60px",
          gap: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={candidato.foto}
          alt={candidato.nome}
          width="280"
          height="280"
          style={{
            width: "280px",
            height: "280px",
            borderRadius: "140px",
            objectFit: "cover",
            border: "6px solid #009B3A",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              color: "#00C44A",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "3px",
              marginBottom: "16px",
            }}
          >
            {candidato.cargo} · {estado}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "68px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {candidato.nome}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "32px",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Nº {candidato.numero} · {candidato.partido}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "30px",
              fontSize: "22px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            pautabrasil.com.br
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}