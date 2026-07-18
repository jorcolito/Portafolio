import type {
  EducationLibraryItem,
  EducationRecord,
  PlaceholderResourceLink,
} from "../types";

function pendingCertificate(
  id: string,
  label: string,
  placeholderMessage: string,
): PlaceholderResourceLink {
  return {
    id,
    kind: "certificate",
    label,
    ariaLabel: `${label}, pendiente de incorporar`,
    availability: "placeholder",
    href: null,
    placeholderMessage,
  };
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
    shelfLabel: "CLOUD / AWS",
    title: "Credencial AWS",
    summary:
      "Espacio listo para incorporar una credencial AWS verificable. El nombre, nivel y fecha se publicarán únicamente cuando esté disponible el documento.",
    status: "document-pending",
    statusLabel: "Documento pendiente",
    metadata: ["Nombre por verificar", "Nivel y fecha por verificar"],
    resource: pendingCertificate(
      "aws-certificate-placeholder",
      "Certificado AWS pendiente",
      "La credencial AWS todavía no ha sido proporcionada.",
    ),
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
    label: "Libro: credencial AWS",
    interactionId: "education-aws",
    dialogueId: "aws-certificate",
  },
] as const;
