"use client";

import { useState } from "react";
import Brazil from "@svg-maps/brazil";

interface Location {
  id: string;
  name: string;
  path: string;
}

interface MapaBrasilProps {
  onEstadoClick?: (estadoId: string, estadoNome: string) => void;
  estadoSelecionado?: string | null;
}

export function MapaBrasil({
  onEstadoClick,
  estadoSelecionado,
}: MapaBrasilProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <svg
      viewBox={Brazil.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-2xl"
      role="img"
      aria-label="Mapa interativo do Brasil"
    >
      {Brazil.locations.map((location: Location) => {
        const isHovered = hoverId === location.id;
        const isSelected = estadoSelecionado === location.id;

        return (
          <path
            key={location.id}
            id={location.id}
            d={location.path}
            onMouseEnter={() => setHoverId(location.id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => onEstadoClick?.(location.id, location.name)}
            className="cursor-pointer transition-all duration-200"
            style={{
              fill: isSelected
                ? "#009B3A"
                : isHovered
                ? "#00C44A"
                : "#1B3A5C",
              stroke: "#0A2540",
              strokeWidth: 1,
              filter: isHovered ? "brightness(1.2)" : "none",
            }}
          >
            <title>{location.name}</title>
          </path>
        );
      })}
    </svg>
  );
}