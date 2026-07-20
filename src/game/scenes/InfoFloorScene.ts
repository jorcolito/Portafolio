import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import type { Locale } from "../../i18n/LocaleContext";
import type { PortfolioFloor } from "../types/contracts";
import { BasePortfolioScene } from "./BasePortfolioScene";

interface InfoFloorConfig {
  key: string;
  floor: Exclude<PortfolioFloor, 0 | -1 | -4>;
  accent: number;
}

export class InfoFloorScene extends BasePortfolioScene {
  constructor(bridge: GameBridge, locale: Locale, config: InfoFloorConfig) {
    super(config.key, config.floor, bridge, config.accent, locale);
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    if (this.floor === -2) return { x: 520, y: 420 };
    return { x: 470, y: 420 };
  }

  protected buildWorld(): void {
    if (this.floor === -2) this.buildEducation();
    if (this.floor === -3) this.buildAbout();
  }

  private buildEducation(): void {
    // Each credential outline hugs one of the three authored books. The real
    // workstation on the left is the separate technology interaction.
    this.addInteractiveOutline(
      "education-uees",
      [
        { x: 466, y: 254 },
        { x: 474, y: 248 },
        { x: 485, y: 252 },
        { x: 498, y: 247 },
        { x: 506, y: 252 },
        { x: 505, y: 273 },
        { x: 496, y: 278 },
        { x: 486, y: 273 },
        { x: 475, y: 280 },
        { x: 468, y: 274 },
      ],
      0,
    );
    this.addInteraction("education-uees", 478, 72, this.locale === "en" ? "Open the UEES record" : "Abrir expediente UEES", {
      type: "dialogue",
      dialogueId: "uees-record",
      after: { type: "library", itemId: "uees-degree-volume" },
    }, { x: 486, y: 264, width: 50, height: 44 });

    this.addInteractiveOutline(
      "education-english",
      [
        { x: 499, y: 305 },
        { x: 509, y: 274 },
        { x: 540, y: 286 },
        { x: 554, y: 277 },
        { x: 578, y: 285 },
        { x: 576, y: 318 },
        { x: 550, y: 326 },
        { x: 540, y: 321 },
        { x: 512, y: 319 },
        { x: 503, y: 315 },
      ],
      260,
    );
    this.addInteraction("education-english", 558, 78, this.locale === "en" ? "Open C1 result" : "Abrir resultado C1", {
      type: "dialogue",
      dialogueId: "english-certificate",
      after: { type: "library", itemId: "english-c1-volume" },
    }, { x: 539, y: 300, width: 88, height: 62 });

    this.addInteractiveOutline(
      "education-aws",
      [
        { x: 607, y: 319 },
        { x: 625, y: 283 },
        { x: 637, y: 267 },
        { x: 658, y: 282 },
        { x: 670, y: 285 },
        { x: 686, y: 267 },
        { x: 712, y: 276 },
        { x: 716, y: 317 },
        { x: 703, y: 331 },
        { x: 667, y: 326 },
        { x: 657, y: 331 },
        { x: 620, y: 326 },
      ],
      520,
    );
    this.addInteraction("education-aws", 684, 108, this.locale === "en" ? "Open AWS Academy badge" : "Abrir insignia AWS Academy", {
      type: "dialogue",
      dialogueId: "aws-certificate",
      after: { type: "library", itemId: "aws-certificate-volume" },
    }, { x: 662, y: 299, width: 120, height: 76 });

    this.addInteractiveOutline(
      "education-technologies",
      [
        { x: 160, y: 258 },
        { x: 343, y: 258 },
        { x: 356, y: 300 },
        { x: 349, y: 376 },
        { x: 322, y: 388 },
        { x: 188, y: 388 },
        { x: 164, y: 362 },
      ],
      780,
    );
    this.addInteraction(
      "education-technologies",
      258,
      188,
      this.locale === "en"
        ? "Explore working technologies"
        : "Explorar tecnologías de trabajo",
      { type: "dialogue", dialogueId: "studied-technologies" },
      { x: 258, y: 323, width: 196, height: 132 },
    );
  }

  private buildAbout(): void {
    this.drawProfessionalMethod();
    this.drawGuayaquilMap();
    this.drawChessboard();
  }

  private drawProfessionalMethod(): void {
    // The central planning board now explains a hiring-relevant working method.
    this.addInteractiveOutline(
      "about-method",
      [
        { x: 325, y: 49 },
        { x: 620, y: 49 },
        { x: 620, y: 247 },
        { x: 325, y: 247 },
      ],
      0,
    );
    this.addInteraction("about-method", 460, 230, this.locale === "en" ? "See how I work" : "Ver cómo trabajo", {
      type: "dialogue",
      dialogueId: "work-method",
    }, { x: 472, y: 148, width: 296, height: 200 });
  }

  private drawGuayaquilMap(): void {
    this.addInteractiveOutline(
      "about-map",
      [
        { x: 636, y: 47 },
        { x: 755, y: 47 },
        { x: 755, y: 181 },
        { x: 636, y: 181 },
      ],
      300,
    );

    // Guayaquil sits on Ecuador's south-western coast. The marker is anchored
    // to that point on the existing map rather than floating elsewhere.
    const pin = this.add.graphics().setDepth(24).setBlendMode(Phaser.BlendModes.ADD);
    pin.fillStyle(0xffffff, 0.94);
    pin.fillCircle(674, 132, 4);
    pin.lineStyle(1, 0xffffff, 0.9);
    pin.lineBetween(674, 136, 674, 143);
    const ring = this.add
      .circle(674, 132, 10, 0xffffff, 0)
      .setStrokeStyle(1, 0xffffff, 0.8)
      .setDepth(23);
    this.tweens.add({
      targets: ring,
      alpha: { from: 0.75, to: 0.08 },
      scale: { from: 0.65, to: 1.35 },
      duration: 1050,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.addInteraction("about-map", 650, 90, "Guayaquil, Ecuador", {
      type: "dialogue",
      dialogueId: "ecuador-map",
    }, { x: 696, y: 114, width: 120, height: 136 });
  }

  private drawChessboard(): void {
    // Chess data belongs to the literal board, not to the generic About copy.
    this.addInteractiveOutline(
      "about-chess",
      [
        { x: 638, y: 298 },
        { x: 786, y: 298 },
        { x: 786, y: 355 },
        { x: 638, y: 355 },
      ],
      600,
    );
    this.addInteraction("about-chess", 780, 110, this.locale === "en" ? "See my Chess.com activity" : "Ver mi actividad en Chess.com", {
      type: "chess",
    }, { x: 712, y: 327, width: 150, height: 64 });
  }

}
