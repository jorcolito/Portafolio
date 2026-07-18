import type { ProjectId } from "./projects";

export type FloorId =
  | "lobby"
  | "projects"
  | "education"
  | "about"
  | "contact";

export type FloorLevel = 0 | -1 | -2 | -3 | -4;

export type InteractionId =
  | "lobby-welcome-terminal"
  | "lobby-robot"
  | "lobby-save-point"
  | "project-cardrive"
  | "project-shiko"
  | "project-comernova"
  | "education-uees"
  | "education-english"
  | "education-academic-projects"
  | "education-timeline"
  | "education-technologies"
  | "about-laptop"
  | "about-chess"
  | "about-map"
  | "about-suitcase"
  | "about-notebook"
  | "contact-terminal";

export type DialogueId =
  | "welcome-terminal"
  | "robot-welcome"
  | "save-point"
  | "cardrive-introduction"
  | "shiko-introduction"
  | "comernova-introduction"
  | "uees-record"
  | "english-certificate"
  | "academic-projects"
  | "academic-timeline"
  | "studied-technologies"
  | "laptop"
  | "chessboard"
  | "ecuador-map"
  | "travel-bag"
  | "ideas-notebook"
  | "contact-invitation";

export interface FloorDefinition {
  readonly id: FloorId;
  readonly level: FloorLevel;
  readonly label: string;
  readonly elevatorLabel: string;
  readonly sceneKey: string;
  readonly sectionAnchor: string;
  readonly description: string;
  readonly accentColor: string;
  readonly interactionIds: readonly InteractionId[];
}

export interface DialoguePortrait {
  readonly id: "jorge" | "robot";
  readonly alt: string;
}

export type DialogueSoundCue =
  | "terminal-key"
  | "robot-chirp"
  | "soft-type"
  | null;

export interface DialogueLine {
  readonly text: string;
  readonly speaker?: string;
  readonly portrait?: DialoguePortrait;
  readonly charactersPerSecond?: number;
  readonly soundCue?: DialogueSoundCue;
  readonly revealImmediately?: boolean;
}

export interface DialogueDefaults {
  readonly charactersPerSecond: number;
  readonly allowInstantReveal: boolean;
  readonly soundCue: DialogueSoundCue;
  readonly locksPlayer: true;
}

export type DialogueCompletion =
  | {
      readonly type: "open-project";
      readonly projectId: ProjectId;
    }
  | {
      readonly type: "open-contact";
    };

export interface DialogueSequence {
  readonly id: DialogueId;
  readonly floorId: FloorId;
  readonly interactionId: InteractionId;
  readonly defaults: DialogueDefaults;
  readonly lines: readonly DialogueLine[];
  readonly completion?: DialogueCompletion;
}

export interface AboutObject {
  readonly id: string;
  readonly label: string;
  readonly interactionId: InteractionId;
  readonly dialogueId: DialogueId;
  readonly accessibleDescription: string;
}
