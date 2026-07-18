import type { ResourceLink } from "./links";
import type { FloorId, InteractionId } from "./game";
import type { TechnologyId } from "./profile";

export type ProjectId = "cardrive" | "shiko" | "comernova";

export type ProjectStatusId =
  | "mvp-in-development"
  | "mvp-design-and-architecture"
  | "in-development";

export interface ProjectStatus {
  readonly id: ProjectStatusId;
  readonly label: string;
  readonly tone: "active" | "planning";
}

export interface ProjectScene {
  readonly floorId: Extract<FloorId, "projects">;
  readonly interactionId: InteractionId;
  readonly concept: string;
  readonly objectLabel: string;
  readonly accentColor: string;
}

export interface ProjectMediaPlaceholder {
  readonly kind: "placeholder";
  readonly label: string;
  readonly alt: string;
}

export interface ProjectLinks {
  readonly demo: ResourceLink;
  readonly repository: ResourceLink;
}

export interface PortfolioProject {
  readonly id: ProjectId;
  readonly name: string;
  readonly category: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly problemSolved: string;
  readonly features: readonly string[];
  readonly technologyIds: readonly TechnologyId[];
  readonly technologyNote?: string;
  readonly status: ProjectStatus;
  readonly scene: ProjectScene;
  readonly media: ProjectMediaPlaceholder;
  readonly links: ProjectLinks;
}
