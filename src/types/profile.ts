import type { ResourceLink } from "./links";

export type TechnologyCategoryId =
  | "frontend"
  | "backend"
  | "data"
  | "tools-and-deployment";

export type TechnologyId =
  | "react"
  | "typescript"
  | "javascript"
  | "vite"
  | "html"
  | "css"
  | "python"
  | "fastapi"
  | "java"
  | "sql"
  | "postgresql"
  | "supabase"
  | "firebase"
  | "git"
  | "github"
  | "vercel";

export interface TechnologyCategory {
  readonly id: TechnologyCategoryId;
  readonly label: string;
}

export interface Technology {
  readonly id: TechnologyId;
  readonly name: string;
  readonly categoryId: TechnologyCategoryId;
}

export interface TechnologyGroup extends TechnologyCategory {
  readonly technologies: readonly Technology[];
}

export interface SpokenLanguage {
  readonly id: "spanish" | "english";
  readonly name: string;
  readonly level: "Nativo" | "C1";
}

export type ProfessionalInterestId =
  | "full-stack"
  | "applied-ai"
  | "saas"
  | "experience-design"
  | "automation"
  | "digital-products";

export interface ProfessionalInterest {
  readonly id: ProfessionalInterestId;
  readonly label: string;
}

export interface PortfolioProfile {
  readonly name: string;
  readonly brandName: string;
  readonly title: string;
  readonly location: string;
  readonly introduction: string;
  readonly summary: string;
  readonly availability: string;
  readonly workPrinciples: readonly string[];
  readonly languages: readonly SpokenLanguage[];
  readonly interests: readonly ProfessionalInterest[];
  readonly technologyIds: readonly TechnologyId[];
  readonly contactLinks: readonly ResourceLink[];
}

export interface EducationRecord {
  readonly id: string;
  readonly institution: string;
  readonly program: string;
  readonly status: "En curso";
  readonly expectedGraduation: string;
  readonly location: string;
  readonly summary: string;
  readonly areas: readonly string[];
}

export type EducationLibraryItemKind =
  | "degree"
  | "language-certificate"
  | "cloud-certificate"
  | "university-project";

export type EducationLibraryItemStatus =
  | "in-progress"
  | "verified"
  | "document-pending"
  | "details-pending";

export interface EducationLibraryItem {
  readonly id: string;
  readonly kind: EducationLibraryItemKind;
  readonly shelfLabel: string;
  readonly title: string;
  readonly summary: string;
  readonly status: EducationLibraryItemStatus;
  readonly statusLabel: string;
  readonly metadata: readonly string[];
  readonly resource: ResourceLink | null;
}

export interface ExperienceRecord {
  readonly id: string;
  readonly organization: string;
  readonly title: string;
  readonly location: string;
  readonly periodLabel: string;
  readonly startYear: number;
  readonly endYear: number;
  readonly summary: string;
  readonly skills: readonly string[];
}
