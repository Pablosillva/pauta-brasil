import { ImageResponse } from "next/og";

export const alt = "Pauta Brasil — Informação, transparência e democracia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0A2540 0%, #1B3A5C 50%, #009B3A 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#009B3A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            PB
          </div>
          <span style={{ fontSize: "42px", fontWeight: "bold", color: "white" }}>
            Pauta Brasil
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: "bold",
            color: "white",
            lineHeight: 1.1,
            marginBottom: "30px",
            maxWidth: "900px",
          }}
        >
          Informação, transparência e democracia
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "rgba(255,255,255,0.8)",
            maxWidth: "800px",
          }}
        >
          Mapa eleitoral · Comparador de propostas · Notícias · Ranking
        </div>
      </div>
    ),
    { ...size }
  );
}