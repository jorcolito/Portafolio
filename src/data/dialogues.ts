import type {
  DialogueDefaults,
  DialogueId,
  DialogueSequence,
} from "../types";

export const DEFAULT_DIALOGUE_SETTINGS = {
  charactersPerSecond: 38,
  allowInstantReveal: true,
  soundCue: "soft-type",
  locksPlayer: true,
} as const satisfies DialogueDefaults;

export const DIALOGUES = [
  {
    id: "welcome-terminal",
    floorId: "lobby",
    interactionId: "lobby-welcome-terminal",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        speaker: "JORGE LABS",
        text: "Espacio de trabajo cargado.",
        soundCue: "terminal-key",
      },
      {
        speaker: "JORGE LABS",
        text: "Explora el laboratorio o abre Quick View si prefieres ir directo a la información.",
      },
    ],
  },
  {
    id: "robot-welcome",
    floorId: "lobby",
    interactionId: "lobby-robot",
    defaults: {
      ...DEFAULT_DIALOGUE_SETTINGS,
      soundCue: "robot-chirp",
    },
    lines: [
      {
        speaker: "BOT-01",
        portrait: { id: "robot", alt: "Retrato del robot BOT-01" },
        text: "Bienvenido.",
      },
      {
        speaker: "BOT-01",
        portrait: { id: "robot", alt: "Retrato del robot BOT-01" },
        text: "Jorge me construyó durante una noche larga.",
      },
      {
        speaker: "BOT-01",
        portrait: { id: "robot", alt: "Retrato del robot BOT-01" },
        text: "Todavía no entiendo Git.",
      },
    ],
  },
  {
    id: "save-point",
    floorId: "lobby",
    interactionId: "lobby-save-point",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "El progreso no se guarda, pero los recuerdos sí." },
      { text: "Parece suficiente para un portafolio." },
    ],
  },
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
      { text: "Inglés: nivel C1." },
      {
        text: "Útil para documentación, equipos internacionales y mensajes de error a las tres de la mañana.",
      },
    ],
  },
  {
    id: "academic-projects",
    floorId: "education",
    interactionId: "education-academic-projects",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      {
        text: "El archivo reúne proyectos académicos de desarrollo web, redes, HCI y sistemas.",
      },
      { text: "Cada entrega dejó una herramienta nueva y una pregunta mejor." },
    ],
  },
  {
    id: "academic-timeline",
    floorId: "education",
    interactionId: "education-timeline",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "La línea continúa hasta diciembre de 2027." },
      { text: "El aprendizaje, por suerte, no tiene fecha de cierre." },
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
    id: "laptop",
    floorId: "about",
    interactionId: "about-laptop",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Parece que Jorge pasa demasiado tiempo aquí." },
      { text: "Algunos proyectos incluso llegaron a resolver problemas reales." },
    ],
  },
  {
    id: "chessboard",
    floorId: "about",
    interactionId: "about-chess",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [{ text: "Su ELO también está en desarrollo." }],
  },
  {
    id: "ecuador-map",
    floorId: "about",
    interactionId: "about-map",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Guayaquil, Ecuador." },
      { text: "Aquí comenzó esta partida." },
    ],
  },
  {
    id: "travel-bag",
    floorId: "about",
    interactionId: "about-suitcase",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Esta maleta viajó a California en 2025." },
      {
        text: "Volvió con experiencia, historias y menos miedo a hablar con desconocidos.",
      },
      {
        text: "Rush Creek fortaleció la comunicación, la adaptación y el trabajo en equipo de Jorge.",
      },
    ],
  },
  {
    id: "ideas-notebook",
    floorId: "about",
    interactionId: "about-notebook",
    defaults: DEFAULT_DIALOGUE_SETTINGS,
    lines: [
      { text: "Ideas para productos, automatizaciones y experiencias." },
      { text: "La lista crece más rápido que el tiempo disponible." },
    ],
  },
  {
    id: "contact-invitation",
    floorId: "contact",
    interactionId: "contact-terminal",
    defaults: {
      ...DEFAULT_DIALOGUE_SETTINGS,
      charactersPerSecond: 30,
      soundCue: "terminal-key",
    },
    lines: [
      { speaker: "JORGE LABS", text: "Gracias por llegar hasta aquí." },
      { speaker: "JORGE LABS", text: "Ahora sí." },
      { speaker: "JORGE LABS", text: "Hablemos." },
    ],
    completion: { type: "open-contact" },
  },
] as const satisfies readonly DialogueSequence[];

type DialogueIndex = {
  readonly [Id in DialogueId]: Extract<
    (typeof DIALOGUES)[number],
    { readonly id: Id }
  >;
};

export const DIALOGUES_BY_ID = {
  "welcome-terminal": DIALOGUES[0],
  "robot-welcome": DIALOGUES[1],
  "save-point": DIALOGUES[2],
  "cardrive-introduction": DIALOGUES[3],
  "shiko-introduction": DIALOGUES[4],
  "comernova-introduction": DIALOGUES[5],
  "uees-record": DIALOGUES[6],
  "english-certificate": DIALOGUES[7],
  "academic-projects": DIALOGUES[8],
  "academic-timeline": DIALOGUES[9],
  "studied-technologies": DIALOGUES[10],
  laptop: DIALOGUES[11],
  chessboard: DIALOGUES[12],
  "ecuador-map": DIALOGUES[13],
  "travel-bag": DIALOGUES[14],
  "ideas-notebook": DIALOGUES[15],
  "contact-invitation": DIALOGUES[16],
} as const satisfies DialogueIndex;
