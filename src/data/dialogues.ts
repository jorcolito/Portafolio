import type {
  DialogueDefaults,
  DialogueId,
  DialogueSequence,
} from "../types";

export const DEFAULT_DIALOGUE_SETTINGS = {
  charactersPerSecond: 64,
  allowInstantReveal: true,
  soundCue: "soft-type",
  locksPlayer: true,
} as const satisfies DialogueDefaults;

export const DIALOGUES = [
  {
    id: "cardrive-introduction",
    floorId: "projects",
    interactionId: "project-cardrive",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Una terminal controla el garaje completo." },
      {
        text: "CarDrive organiza la operación diaria de una rentadora real de vehículos.",
      },
      { text: "La ficha técnica contiene el resto del sistema." },
    ],
    completion: { type: "open-project", projectId: "cardrive" },
  },
  {
    id: "shiko-introduction",
    floorId: "projects",
    interactionId: "project-shiko",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Pedidos, anuncios y productos llegan desde fuentes distintas." },
      {
        text: "SHIKO busca convertir ese ruido operativo en métricas útiles para dropshippers de Ecuador.",
      },
    ],
    completion: { type: "open-project", projectId: "shiko" },
  },
  {
    id: "comernova-introduction",
    floorId: "projects",
    interactionId: "project-comernova",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Cada cosa parece estar exactamente donde debe." },
      {
        text: "Comernova lleva esa misma claridad a una tienda de organización del hogar.",
      },
    ],
    completion: { type: "open-project", projectId: "comernova" },
  },
  {
    id: "uees-record",
    floorId: "education",
    interactionId: "education-uees",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        speaker: "ARCHIVO ACADÉMICO",
        text: "Ingeniería en Ciencias de la Computación — UEES.",
        soundCue: "terminal-key",
      },
      {
        speaker: "ARCHIVO ACADÉMICO",
        text: "Graduación estimada: diciembre de 2027.",
      },
    ],
  },
  {
    id: "english-certificate",
    floorId: "education",
    interactionId: "education-english",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        speaker: "ARCHIVO ACADÉMICO",
        text: "Cambridge C1 Advanced · Statement of Results.",
        soundCue: "terminal-key",
      },
      {
        speaker: "ARCHIVO ACADÉMICO",
        text: "Resultado oficial con nivel CEFR C1, Overall Score 180 y Grade C. El documento mostrado es el Statement of Results, no el certificado formal.",
      },
    ],
  },
  {
    id: "aws-certificate",
    floorId: "education",
    interactionId: "education-aws",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        speaker: "ARCHIVO ACADÉMICO",
        text: "Entrenamiento AWS Academy Data Engineering completado.",
        soundCue: "terminal-key",
      },
      {
        speaker: "ARCHIVO ACADÉMICO",
        text: "La evidencia disponible es la insignia AWS Academy Data Engineering Trained: acredita la formación completada, pero no es una certificación profesional de AWS.",
      },
    ],
  },
  {
    id: "studied-technologies",
    floorId: "education",
    interactionId: "education-technologies",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        text: "Frontend, backend, datos y despliegue comparten esta estación.",
      },
      {
        text: "La tecnología cambia; comprender el problema sigue siendo la parte importante.",
      },
    ],
  },
  {
    id: "work-method",
    floorId: "about",
    interactionId: "about-method",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        text: "No empiezo por el framework: primero entiendo a la persona, la operación y qué resultado haría que el trabajo valga la pena.",
      },
      {
        text: "Después convierto esa claridad en un flujo simple, una base técnica mantenible y entregas pequeñas que el equipo puede revisar.",
      },
      {
        text: "Me importa tanto construir bien como explicar por qué: documento decisiones, pido feedback temprano y dejo el producto preparado para crecer.",
      },
    ],
  },
  {
    id: "ecuador-map",
    floorId: "about",
    interactionId: "about-map",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Guayaquil, Ecuador." },
      { text: "Desde aquí estudio, construyo productos y colaboro con equipos remotos." },
    ],
  },
] as const satisfies readonly DialogueSequence[];

type DialogueIndex = {
  readonly [Id in DialogueId]: Extract<
    (typeof DIALOGUES)[number],
    { readonly id: Id }
  >;
};

export const DIALOGUES_BY_ID = {
  "cardrive-introduction": DIALOGUES[0],
  "shiko-introduction": DIALOGUES[1],
  "comernova-introduction": DIALOGUES[2],
  "uees-record": DIALOGUES[3],
  "english-certificate": DIALOGUES[4],
  "aws-certificate": DIALOGUES[5],
  "studied-technologies": DIALOGUES[6],
  "work-method": DIALOGUES[7],
  "ecuador-map": DIALOGUES[8],
} as const satisfies DialogueIndex;
