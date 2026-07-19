import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import { BasePortfolioScene } from "./BasePortfolioScene";

/**
 * The projects room uses the objects already painted into the workshop.
 * Nothing floats in front of the plate: a quiet white silhouette is the only
 * affordance until the visitor is close enough to receive the React E prompt.
 */
export class ProjectsScene extends BasePortfolioScene {
  constructor(bridge: GameBridge) {
    super("ProjectsScene", -1, bridge, 0xa76bff);
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    return { x: 505, y: 420 };
  }

  protected buildWorld(): void {
    this.drawCarDriveInteraction();
    this.drawShikoInteraction();
    this.drawComernovaInteraction();
  }

  private drawCarDriveInteraction(): void {
    // Follows the bonnet, roof, cabin and rear of the real car.
    this.addInteractiveOutline(
      "project-cardrive",
      [
        { x: 57, y: 367 },
        { x: 64, y: 326 },
        { x: 96, y: 294 },
        { x: 144, y: 272 },
        { x: 229, y: 271 },
        { x: 276, y: 292 },
        { x: 306, y: 331 },
        { x: 311, y: 367 },
        { x: 292, y: 388 },
        { x: 252, y: 397 },
        { x: 96, y: 397 },
        { x: 62, y: 383 },
      ],
      0,
    );
    this.addInteraction("project-cardrive", 190, 240, "Abrir expediente CarDrive", {
      type: "project",
      projectId: "cardrive",
    }, { x: 176, y: 326, width: 250, height: 118 });
  }

  private drawShikoInteraction(): void {
    // The analytics wall and its desk are SHIKO's real visual anchor.
    this.addInteractiveOutline(
      "project-shiko",
      [
        { x: 321, y: 164 },
        { x: 525, y: 164 },
        { x: 525, y: 301 },
        { x: 501, y: 301 },
        { x: 501, y: 335 },
        { x: 334, y: 335 },
        { x: 334, y: 301 },
        { x: 321, y: 301 },
      ],
      260,
    );
    this.addInteraction("project-shiko", 485, 210, "Abrir expediente SHIKO", {
      type: "project",
      projectId: "shiko",
    }, { x: 423, y: 247, width: 216, height: 174 });
  }

  private drawComernovaInteraction(): void {
    // Wraps the stocked home-organisation shelves rather than inventing nodes.
    this.addInteractiveOutline(
      "project-comernova",
      [
        { x: 676, y: 193 },
        { x: 936, y: 193 },
        { x: 936, y: 385 },
        { x: 887, y: 385 },
        { x: 887, y: 402 },
        { x: 700, y: 402 },
        { x: 700, y: 384 },
        { x: 676, y: 384 },
      ],
      520,
    );
    this.addInteraction("project-comernova", 800, 230, "Abrir expediente Comernova", {
      type: "project",
      projectId: "comernova",
    }, { x: 805, y: 298, width: 270, height: 214 });
  }
}
