import { FLOORS } from "../../data";
import type {
  DialogueSequence,
  FloorLevel,
  ProjectId,
} from "../../types";

export type PortfolioFloor = FloorLevel;

export type PortfolioProjectId = ProjectId;

export interface FloorOption {
  floor: PortfolioFloor;
  label: string;
  shortLabel: string;
}

export const PORTFOLIO_FLOORS: readonly FloorOption[] = FLOORS.map((floor) => ({
  floor: floor.level,
  label: floor.label,
  shortLabel: floor.elevatorLabel,
}));

export type GameDialogue = DialogueSequence & {
  /** Milliseconds per character for the React typewriter. Zero reveals instantly. */
  readonly speed?: number;
};

export type DialogueFollowUp =
  | { type: "project"; projectId: PortfolioProjectId }
  | { type: "quick-view" }
  | { type: "contact" };

export interface InteractionPrompt {
  id: string;
  label: string;
  keyHint: string;
}

/** Phaser -> React. React owns every HTML overlay; Phaser owns world state. */
export type GameToReactEvent =
  | { type: "ready"; floor: PortfolioFloor }
  | { type: "floor-changed"; floor: PortfolioFloor; label: string }
  | { type: "prompt-changed"; prompt: InteractionPrompt | null }
  | {
      type: "dialogue-requested";
      dialogue: GameDialogue;
      after?: DialogueFollowUp;
    }
  | {
      type: "elevator-requested";
      currentFloor: PortfolioFloor;
      floors: readonly FloorOption[];
    }
  | { type: "project-requested"; projectId: PortfolioProjectId }
  | { type: "quick-view-requested" }
  | { type: "contact-requested" }
  | { type: "sound-requested"; sound: "step" | "jump" | "interact" };

/** React -> Phaser. This is intentionally a command stream, not a state store. */
export type ReactToGameCommand =
  | { type: "set-active"; active: boolean }
  | { type: "set-ui-blocked"; blocked: boolean }
  | { type: "set-reduced-motion"; reduced: boolean }
  | { type: "set-muted"; muted: boolean }
  | {
      type: "move";
      direction: "left" | "right";
      pressed: boolean;
    }
  | { type: "jump" }
  | { type: "interact" }
  | { type: "select-floor"; floor: PortfolioFloor }
  | { type: "reset-player" };

export interface PortfolioGameController {
  send(command: ReactToGameCommand): void;
  focus(): void;
  destroy(): void;
}

export interface CreatePortfolioGameOptions {
  parent: HTMLElement;
  initialFloor?: PortfolioFloor;
  reducedMotion?: boolean;
  muted?: boolean;
  onEvent?: (event: GameToReactEvent) => void;
}
