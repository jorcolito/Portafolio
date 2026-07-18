import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import type { PortfolioFloor } from "../types/contracts";
import { BasePortfolioScene } from "./BasePortfolioScene";

interface InfoFloorConfig {
  key: string;
  floor: Exclude<PortfolioFloor, 0 | -1>;
  accent: number;
}

export class InfoFloorScene extends BasePortfolioScene {
  constructor(bridge: GameBridge, config: InfoFloorConfig) {
    super(config.key, config.floor, bridge, config.accent);
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    if (this.floor === -2) return { x: 520, y: 420 };
    if (this.floor === -4) return { x: 610, y: 420 };
    return { x: 470, y: 420 };
  }

  protected buildWorld(): void {
    if (this.floor === -2) this.buildEducation();
    if (this.floor === -3) this.buildAbout();
    if (this.floor === -4) this.buildContact();
  }

  private buildEducation(): void {
    // The books are already part of the authored library plate. They no longer
    // receive duplicate Phaser books or slow levitation tweens.
    this.addInteractiveOutline(
      [
        { x: 177, y: 277 },
        { x: 351, y: 277 },
        { x: 351, y: 364 },
        { x: 177, y: 364 },
      ],
      0,
    );
    this.addInteraction("education-uees", 270, 190, "Abrir libro de la UEES", {
      type: "dialogue",
      dialogueId: "uees-record",
      after: { type: "library", itemId: "uees-degree-volume" },
    }, { x: 264, y: 321, width: 176, height: 90 });

    this.addInteractiveOutline(
      [
        { x: 462, y: 245 },
        { x: 532, y: 263 },
        { x: 553, y: 320 },
        { x: 505, y: 335 },
        { x: 470, y: 310 },
      ],
      260,
    );
    this.addInteraction("education-english", 515, 170, "Abrir certificado C1", {
      type: "dialogue",
      dialogueId: "english-certificate",
      after: { type: "library", itemId: "english-c1-volume" },
    }, { x: 508, y: 289, width: 102, height: 94 });

    this.addInteractiveOutline(
      [
        { x: 617, y: 268 },
        { x: 684, y: 275 },
        { x: 714, y: 322 },
        { x: 691, y: 385 },
        { x: 621, y: 385 },
        { x: 603, y: 327 },
      ],
      520,
    );
    this.addInteraction("education-aws", 675, 190, "Abrir certificado AWS", {
      type: "dialogue",
      dialogueId: "academic-projects",
      after: { type: "library", itemId: "aws-certificate-volume" },
    }, { x: 660, y: 326, width: 118, height: 122 });
  }

  private buildAbout(): void {
    this.drawProfessionalMethod();
    this.drawGuayaquilMap();
    this.drawChessboard();
  }

  private drawProfessionalMethod(): void {
    // The central planning board now explains a hiring-relevant working method.
    this.addInteractiveOutline(
      [
        { x: 325, y: 49 },
        { x: 620, y: 49 },
        { x: 620, y: 247 },
        { x: 325, y: 247 },
      ],
      0,
    );
    this.addInteraction("about-method", 460, 230, "Ver método de trabajo", {
      type: "dialogue",
      dialogueId: "ideas-notebook",
    }, { x: 472, y: 148, width: 296, height: 200 });
  }

  private drawGuayaquilMap(): void {
    this.addInteractiveOutline(
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

    this.addInteraction("about-map", 650, 110, "Guayaquil, Ecuador", {
      type: "dialogue",
      dialogueId: "ecuador-map",
    }, { x: 696, y: 114, width: 120, height: 136 });
  }

  private drawChessboard(): void {
    // Chess data belongs to the literal board, not to the generic About copy.
    this.addInteractiveOutline(
      [
        { x: 641, y: 311 },
        { x: 780, y: 311 },
        { x: 780, y: 370 },
        { x: 641, y: 370 },
      ],
      600,
    );
    this.addInteraction("about-chess", 780, 120, "Abrir perfil de Chess.com", {
      type: "chess",
    }, { x: 710, y: 340, width: 210, height: 112 });
  }

  private buildContact(): void {
    this.drawAnimatedRain();
    this.drawFutureAvatarAnchor();
  }

  private drawAnimatedRain(): void {
    // Rain is restricted to the window; unlike the old particles it belongs to
    // an object in the scene and reinforces the after-hours atmosphere.
    for (let index = 0; index < 14; index += 1) {
      const x = 472 + ((index * 43) % 365);
      const y = 92 + ((index * 47) % 245);
      const rain = this.add
        .rectangle(x, y, 1, 14, 0x91e6f3, 0.26)
        .setAngle(11)
        .setDepth(7);
      this.tweens.add({
        targets: rain,
        y: y + 64,
        x: x + 11,
        alpha: { from: 0.3, to: 0 },
        duration: 760 + (index % 5) * 140,
        delay: index * 80,
        repeat: -1,
      });
    }
  }

  private drawFutureAvatarAnchor(): void {
    // This chair/desk is the stable anchor for Jorge's future portrait sprite.
    // Until that asset arrives, no substitute person or status beacon is drawn.
    this.addInteractiveOutline(
      [
        { x: 292, y: 260 },
        { x: 477, y: 260 },
        { x: 477, y: 302 },
        { x: 465, y: 302 },
        { x: 465, y: 409 },
        { x: 362, y: 409 },
        { x: 362, y: 305 },
        { x: 292, y: 305 },
      ],
      120,
    );
    this.addInteraction("contact-terminal", 430, 270, "¿Listo para trabajar?", {
      type: "dialogue",
      dialogueId: "contact-invitation",
    }, { x: 384, y: 334, width: 190, height: 152 });
  }
}
