import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import type { Locale } from "../../i18n/LocaleContext";
import { BasePortfolioScene } from "./BasePortfolioScene";

/**
 * The projects room uses the objects already painted into the workshop.
 * Nothing floats in front of the plate: a quiet white silhouette is the only
 * affordance until the visitor is close enough to receive the React E prompt.
 */
export class ProjectsScene extends BasePortfolioScene {
  constructor(bridge: GameBridge, locale: Locale) {
    super("ProjectsScene", -1, bridge, 0xa76bff, locale);
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
        { x: 54, y: 315 },
        { x: 58, y: 303 },
        { x: 69, y: 296 },
        { x: 91, y: 280 },
        { x: 108, y: 266 },
        { x: 127, y: 256 },
        { x: 149, y: 249 },
        { x: 213, y: 249 },
        { x: 242, y: 256 },
        { x: 268, y: 268 },
        { x: 289, y: 282 },
        { x: 295, y: 301 },
        { x: 295, y: 327 },
        { x: 290, y: 338 },
        { x: 282, y: 347 },
        { x: 270, y: 350 },
        { x: 258, y: 348 },
        { x: 248, y: 347 },
        { x: 207, y: 349 },
        { x: 200, y: 357 },
        { x: 191, y: 363 },
        { x: 177, y: 364 },
        { x: 166, y: 359 },
        { x: 160, y: 350 },
        { x: 151, y: 346 },
        { x: 105, y: 346 },
        { x: 84, y: 343 },
        { x: 60, y: 339 },
      ],
      0,
    );
    this.addInteraction("project-cardrive", 190, 240, this.locale === "en" ? "Open CarDrive dossier" : "Abrir expediente CarDrive", {
      type: "project",
      projectId: "cardrive",
    }, { x: 175, y: 307, width: 250, height: 126 });
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
    this.addInteraction("project-shiko", 485, 210, this.locale === "en" ? "Open SHIKO dossier" : "Abrir expediente SHIKO", {
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
    this.addInteraction("project-comernova", 800, 230, this.locale === "en" ? "Open Comernova dossier" : "Abrir expediente Comernova", {
      type: "project",
      projectId: "comernova",
    }, { x: 805, y: 298, width: 270, height: 214 });
  }
}
