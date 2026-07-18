import type { AboutObject } from "../types";

export const ABOUT_OBJECTS = [
  {
    id: "laptop",
    label: "Laptop",
    interactionId: "about-laptop",
    dialogueId: "laptop",
    accessibleDescription:
      "Laptop de trabajo con proyectos de software abiertos.",
  },
  {
    id: "chessboard",
    label: "Tablero de ajedrez",
    interactionId: "about-chess",
    dialogueId: "chessboard",
    accessibleDescription: "Tablero de ajedrez a mitad de una partida.",
  },
  {
    id: "ecuador-map",
    label: "Mapa de Ecuador",
    interactionId: "about-map",
    dialogueId: "ecuador-map",
    accessibleDescription: "Mapa de Ecuador con Guayaquil señalada.",
  },
  {
    id: "travel-bag",
    label: "Caja de prototipos",
    interactionId: "about-suitcase",
    dialogueId: "travel-bag",
    accessibleDescription:
      "Caja con bocetos, pruebas y prototipos descartados durante el desarrollo de productos.",
  },
  {
    id: "ideas-notebook",
    label: "Cuaderno de ideas",
    interactionId: "about-notebook",
    dialogueId: "ideas-notebook",
    accessibleDescription:
      "Cuaderno con ideas de productos y bocetos de interfaces.",
  },
] as const satisfies readonly AboutObject[];
