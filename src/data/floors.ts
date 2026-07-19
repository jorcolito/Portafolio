import type { FloorDefinition, FloorId } from "../types";

export const FLOORS = [
  {
    id: "lobby",
    level: 0,
    label: "Lobby",
    elevatorLabel: "Lobby",
    sceneKey: "LobbyScene",
    sectionAnchor: "presentacion",
    description:
      "Punto de entrada a JORGE LABS, con controles, bienvenida y acceso a la vista rápida.",
    accentColor: "#65ee78",
    interactionIds: [
      "lobby-welcome-terminal",
      "lobby-robot",
      "lobby-save-point",
    ],
  },
  {
    id: "projects",
    level: -1,
    label: "Proyectos",
    elevatorLabel: "Proyectos",
    sceneKey: "ProjectsScene",
    sectionAnchor: "proyectos",
    description:
      "Laboratorio de prototipos donde cada estación representa un producto.",
    accentColor: "#6af06f",
    interactionIds: [
      "project-cardrive",
      "project-shiko",
      "project-comernova",
    ],
  },
  {
    id: "education",
    level: -2,
    label: "Educación",
    elevatorLabel: "Educación",
    sceneKey: "EducationScene",
    sectionAnchor: "educacion",
    description:
      "Archivo académico interactivo con formación, idiomas y áreas de estudio.",
    accentColor: "#a971ff",
    interactionIds: [
      "education-uees",
      "education-english",
      "education-academic-projects",
      "education-timeline",
      "education-technologies",
    ],
  },
  {
    id: "about",
    level: -3,
    label: "Sobre mí",
    elevatorLabel: "Sobre mí",
    sceneKey: "AboutScene",
    sectionAnchor: "sobre-mi",
    description:
      "Estudio personal con objetos que revelan intereses, origen y experiencia.",
    accentColor: "#38d9f1",
    interactionIds: [
      "about-laptop",
      "about-chess",
      "about-map",
      "about-suitcase",
      "about-notebook",
    ],
  },
  {
    id: "contact",
    level: -4,
    label: "Contacto",
    elevatorLabel: "Contacto",
    sceneKey: "ContactModal",
    sectionAnchor: "contacto",
    description:
      "Acceso directo a los canales profesionales y al CV, sin una escena intermedia.",
    accentColor: "#f2c84b",
    interactionIds: [],
  },
] as const satisfies readonly FloorDefinition[];

type FloorIndex = {
  readonly [Id in FloorId]: Extract<
    (typeof FLOORS)[number],
    { readonly id: Id }
  >;
};

export const FLOORS_BY_ID = {
  lobby: FLOORS[0],
  projects: FLOORS[1],
  education: FLOORS[2],
  about: FLOORS[3],
  contact: FLOORS[4],
} as const satisfies FloorIndex;
