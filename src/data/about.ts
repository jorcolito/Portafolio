import type { AboutObject } from "../types";

export const ABOUT_OBJECTS = [
  {
    id: "work-method-board",
    label: "Método de trabajo",
    interactionId: "about-method",
    action: { type: "dialogue", dialogueId: "work-method" },
    accessibleDescription:
      "Panel central con el método de trabajo de Jorge, desde el problema hasta la entrega.",
  },
  {
    id: "ecuador-map",
    label: "Mapa de Ecuador",
    interactionId: "about-map",
    action: { type: "dialogue", dialogueId: "ecuador-map" },
    accessibleDescription: "Mapa de Ecuador con Guayaquil señalada.",
  },
  {
    id: "chessboard",
    label: "Tablero de ajedrez",
    interactionId: "about-chess",
    action: { type: "chess" },
    accessibleDescription: "Tablero que abre la actividad pública de @jorcolito en Chess.com.",
  },
] as const satisfies readonly AboutObject[];
