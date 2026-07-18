import type { ExperienceRecord } from "../types";

export const EXPERIENCE = [
  {
    id: "rush-creek-2025",
    organization: "Rush Creek Lodge and Spa",
    title: "Experiencia internacional",
    location: "California, Estados Unidos",
    periodLabel: "2025",
    startYear: 2025,
    endYear: 2025,
    summary:
      "Experiencia laboral internacional que fortaleció la comunicación, la adaptación, el trabajo en equipo y la atención al cliente.",
    skills: [
      "Comunicación",
      "Adaptación",
      "Trabajo en equipo",
      "Atención al cliente",
    ],
  },
] as const satisfies readonly ExperienceRecord[];
