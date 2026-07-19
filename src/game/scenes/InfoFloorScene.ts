import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import type { PortfolioFloor } from "../types/contracts";
import { BasePortfolioScene } from "./BasePortfolioScene";

interface InfoFloorConfig {
  key: string;
  floor: Exclude<PortfolioFloor, 0 | -1>;
  accent: number;
}

const CONTACT_SEATED_TEXTURE = "jorge-contact-seated-v1";
const CONTACT_SEATED_SPRITE_URL = "/portraits/jorge-seated-sprite-v1.png";

export class InfoFloorScene extends BasePortfolioScene {
  constructor(bridge: GameBridge, config: InfoFloorConfig) {
    super(config.key, config.floor, bridge, config.accent);
  }

  preload(): void {
    super.preload();
    if (
      this.floor === -4 &&
      !this.textures.exists(CONTACT_SEATED_TEXTURE)
    ) {
      this.load.image(CONTACT_SEATED_TEXTURE, CONTACT_SEATED_SPRITE_URL);
    }
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    if (this.floor === -2) return { x: 520, y: 420 };
    if (this.floor === -4) return { x: 430, y: 420 };
    return { x: 470, y: 420 };
  }

  protected shouldShowWalkingPlayer(): boolean {
    return this.floor !== -4;
  }

  protected buildWorld(): void {
    if (this.floor === -2) this.buildEducation();
    if (this.floor === -3) this.buildAbout();
    if (this.floor === -4) this.buildContact();
  }

  private buildEducation(): void {
    // Each outline hugs one of the three authored books. The workstations and
    // shelves remain atmosphere instead of pretending to be credentials.
    this.addInteractiveOutline(
      "education-uees",
      [
        { x: 465, y: 257 },
        { x: 474, y: 244 },
        { x: 495, y: 248 },
        { x: 511, y: 243 },
        { x: 520, y: 253 },
        { x: 518, y: 287 },
        { x: 492, y: 281 },
        { x: 469, y: 291 },
      ],
      0,
    );
    this.addInteraction("education-uees", 478, 72, "Abrir libro de la UEES", {
      type: "dialogue",
      dialogueId: "uees-record",
      after: { type: "library", itemId: "uees-degree-volume" },
    }, { x: 492, y: 268, width: 62, height: 54 });

    this.addInteractiveOutline(
      "education-english",
      [
        { x: 500, y: 309 },
        { x: 516, y: 288 },
        { x: 548, y: 299 },
        { x: 577, y: 289 },
        { x: 586, y: 314 },
        { x: 576, y: 347 },
        { x: 542, y: 340 },
        { x: 512, y: 351 },
      ],
      260,
    );
    this.addInteraction("education-english", 558, 78, "Abrir certificado C1", {
      type: "dialogue",
      dialogueId: "english-certificate",
      after: { type: "library", itemId: "english-c1-volume" },
    }, { x: 544, y: 320, width: 88, height: 68 });

    this.addInteractiveOutline(
      "education-aws",
      [
        { x: 625, y: 321 },
        { x: 646, y: 283 },
        { x: 687, y: 296 },
        { x: 728, y: 281 },
        { x: 746, y: 326 },
        { x: 731, y: 367 },
        { x: 695, y: 383 },
        { x: 647, y: 374 },
      ],
      520,
    );
    this.addInteraction("education-aws", 684, 108, "Abrir insignia AWS Academy", {
      type: "dialogue",
      dialogueId: "academic-projects",
      after: { type: "library", itemId: "aws-certificate-volume" },
    }, { x: 686, y: 333, width: 124, height: 108 });
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
    this.addInteraction("about-method", 460, 230, "Ver método de trabajo", {
      type: "dialogue",
      dialogueId: "ideas-notebook",
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
    this.addInteraction("about-chess", 780, 110, "Ver mi tiempo libre en Chess.com", {
      type: "chess",
    }, { x: 712, y: 327, width: 150, height: 64 });
  }

  private buildContact(): void {
    this.drawAnimatedRain();
    this.drawContactWorkspace();
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

  private drawContactWorkspace(): void {
    this.drawSeatedJorgeAtDesk();
    this.addInteractiveOutline(
      "contact-terminal",
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

  private drawSeatedJorgeAtDesk(): void {
    // If the asset is still being generated, keep the workspace clean instead
    // of rendering Phaser's missing-texture placeholder or a generic person.
    if (!this.textures.exists(CONTACT_SEATED_TEXTURE)) return;

    const source = this.textures
      .get(CONTACT_SEATED_TEXTURE)
      .getSourceImage() as { width: number; height: number };
    const baseScale = Math.min(104 / source.height, 88 / source.width);
    const screenLight = this.add
      .ellipse(364, 333, 118, 94, 0x65dff2, 0.035)
      .setDepth(19)
      .setBlendMode(Phaser.BlendModes.ADD);
    const seatedJorge = this.add
      .image(422, 420, CONTACT_SEATED_TEXTURE)
      .setOrigin(0.5, 1)
      .setScale(baseScale)
      .setDepth(21);

    // Breathing changes the silhouette by barely one percent while the laptop
    // light responds independently. Neither tween moves the avatar in space.
    this.tweens.add({
      targets: seatedJorge,
      scaleX: { from: baseScale * 0.996, to: baseScale * 1.004 },
      scaleY: { from: baseScale * 1.004, to: baseScale * 0.996 },
      duration: 1450,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
    this.tweens.add({
      targets: screenLight,
      alpha: { from: 0.02, to: 0.075 },
      duration: 1850,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }
}
