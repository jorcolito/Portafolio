import type { EducationRecord } from "../types";

export const EDUCATION = [
  {
    id: "uees-computer-science",
    institution: "Universidad Espíritu Santo (UEES)",
    program: "Ingeniería en Ciencias de la Computación",
    status: "En curso",
    expectedGraduation: "Diciembre de 2027",
    location: "Guayaquil, Ecuador",
    summary:
      "Formación universitaria enfocada en fundamentos de computación y construcción de soluciones digitales.",
    areas: [
      "Desarrollo web",
      "Redes",
      "Interacción humano-computador (HCI)",
      "Sistemas",
    ],
  },
] as const satisfies readonly EducationRecord[];

export const EDUCATION_INTERACTIONS = [
  {
    id: "uees-terminal",
    label: "Terminal de la UEES",
    interactionId: "education-uees",
    dialogueId: "uees-record",
  },
  {
    id: "english-certificate",
    label: "Certificado de inglés",
    interactionId: "education-english",
    dialogueId: "english-certificate",
  },
  {
    id: "academic-projects",
    label: "Archivo de proyectos académicos",
    interactionId: "education-academic-projects",
    dialogueId: "academic-projects",
  },
  {
    id: "academic-timeline",
    label: "Línea de tiempo",
    interactionId: "education-timeline",
    dialogueId: "academic-timeline",
  },
  {
    id: "studied-technologies",
    label: "Computadora de tecnologías",
    interactionId: "education-technologies",
    dialogueId: "studied-technologies",
  },
] as const;
