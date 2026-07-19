import type {
  DialogueId,
  EducationLibraryItem,
  EducationRecord,
  InteractionId,
} from "../types";

interface EducationInteraction {
  readonly id: string;
  readonly label: string;
  readonly interactionId: Extract<InteractionId, `education-${string}`>;
  readonly dialogueId: DialogueId;
}

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

/**
 * Recruiter-facing academic library. It deliberately contains only the three
 * credentials Jorge asked to show; no empty project volumes or invented data.
 */
export const EDUCATION_LIBRARY = [
  {
    id: "uees-degree-volume",
    kind: "degree",
    shelfLabel: "FORMACIÓN / UEES",
    title: "Ingeniería en Ciencias de la Computación",
    summary:
      "Formación universitaria en curso, con foco en fundamentos de computación y construcción de software.",
    status: "in-progress",
    statusLabel: "En curso",
    metadata: [
      "Universidad Espíritu Santo (UEES)",
      "Guayaquil, Ecuador",
      "Graduación estimada: diciembre de 2027",
    ],
    resource: null,
  },
  {
    id: "english-c1-volume",
    kind: "language-certificate",
    shelfLabel: "INGLÉS / CAMBRIDGE",
    title: "Cambridge C1 Advanced · Statement of Results",
    summary:
      "Resultado oficial de Cambridge English que acredita nivel CEFR C1. El documento adjunto es un Statement of Results, no el certificado formal.",
    status: "verified",
    statusLabel: "Verificado · C1",
    metadata: ["Overall score: 180", "Pass at Grade C", "Marzo 2023"],
    evidenceImage: {
      src: "/credentials/cambridge-c1-statement-of-results.png",
      alt: "Vista previa del Statement of Results de Cambridge C1 Advanced",
      width: 595,
      height: 842,
      presentation: "document",
    },
    resource: {
      id: "cambridge-c1-statement-of-results",
      kind: "certificate",
      label: "Abrir Statement of Results",
      ariaLabel: "Abrir el Statement of Results de Cambridge C1 Advanced",
      availability: "available",
      href: "/credentials/cambridge-c1-statement-of-results.pdf",
    },
  },
  {
    id: "aws-certificate-volume",
    kind: "cloud-certificate",
    shelfLabel: "AWS ACADEMY / DATA",
    title: "AWS Academy Data Engineering Training",
    summary:
      "Entrenamiento de Data Engineering completado en AWS Academy. La evidencia disponible es una insignia de finalización de formación, no una certificación profesional de AWS.",
    status: "completed",
    statusLabel: "Completado · insignia disponible",
    metadata: ["AWS Academy", "Data Engineering", "Training badge"],
    evidenceImage: {
      src: "/credentials/aws-academy-data-engineering-trained.png",
      alt: "Insignia AWS Academy Data Engineering Trained",
      width: 601,
      height: 601,
      presentation: "badge",
    },
    resource: {
      id: "aws-academy-data-engineering-badge",
      kind: "certificate",
      label: "Abrir insignia",
      ariaLabel: "Abrir la insignia AWS Academy Data Engineering Trained",
      availability: "available",
      href: "/credentials/aws-academy-data-engineering-trained.png",
    },
  },
] as const satisfies readonly EducationLibraryItem[];

export const EDUCATION_INTERACTIONS = [
  {
    id: "uees-terminal",
    label: "Libro: expediente UEES",
    interactionId: "education-uees",
    dialogueId: "uees-record",
  },
  {
    id: "english-certificate",
    label: "Libro: Cambridge C1",
    interactionId: "education-english",
    dialogueId: "english-certificate",
  },
  {
    id: "aws-certificate",
    label: "Libro: insignia AWS Academy",
    interactionId: "education-aws",
    dialogueId: "aws-certificate",
  },
  {
    id: "technologies-workstation",
    label: "Estación: tecnologías de trabajo",
    interactionId: "education-technologies",
    dialogueId: "studied-technologies",
  },
] as const satisfies readonly EducationInteraction[];
