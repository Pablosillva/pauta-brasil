import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A2540",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            backgroundColor: "#009B3A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 60,
              fontWeight: 800,
            }}
          >
            CP
          </span>
        </div>
        <h1
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: 800,
            margin: 0,
            textAlign: "center",
          }}
        >
          Centro Político
        </h1>
        <p
          style={{
            color: "#009B3A",
            fontSize: 32,
            fontWeight: 600,
            margin: "20px 0 0 0",
            textAlign: "center",
          }}
        >
          Informação, transparência e democracia
        </p>
      </div>
    ),
    size
  );
}
