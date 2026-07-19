import type { ProjectId } from "./projects";

export type FloorId =
  | "lobby"
  | "projects"
  | "education"
  | "about"
  | "contact";

export type FloorLevel = 0 | -1 | -2 | -3 | -4;

export type InteractionId =
  | "lobby-elevator"
  | "project-cardrive"
  | "project-shiko"
  | "project-comernova"
  | "education-uees"
  | "education-english"
  | "education-aws"
  | "education-technologies"
  | "about-method"
  | "about-chess"
  | "about-map";

export type DialogueId =
  | "cardrive-introduction"
  | "shiko-introduction"
  | "comernova-introduction"
  | "uees-record"
  | "english-certificate"
  | "aws-certificate"
  | "studied-technologies"
  | "work-method"
  | "ecuador-map";

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

interface AboutObjectBase {
  readonly id: string;
  readonly label: string;
  readonly interactionId: InteractionId;
  readonly accessibleDescription: string;
}

export type AboutObject =
  | (AboutObjectBase & {
      readonly action: {
        readonly type: "dialogue";
        readonly dialogueId: DialogueId;
      };
    })
  | (AboutObjectBase & {
      readonly action: { readonly type: "chess" };
    });
