import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import type { PortfolioFloor } from "../types/contracts";
import { BasePortfolioScene } from "./BasePortfolioScene";

interface LobbyDoor {
  floor: Exclude<PortfolioFloor, 0>;
  interactionId: string;
  prompt: string;
  sign: string;
  color: number;
  zoneX: number;
  zoneWidth: number;
  clickBounds: { x: number; y: number; width: number; height: number };
  outline: readonly Phaser.Types.Math.Vector2Like[];
  signX: number;
  signY: number;
  delay: number;
}

export class LobbyScene extends BasePortfolioScene {
  constructor(bridge: GameBridge) {
    super("LobbyScene", 0, bridge, 0x23e6b1);
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    return { x: 520, y: 420 };
  }

  protected buildWorld(): void {
    this.drawRouteDoor({
      floor: -1,
      interactionId: "lobby-door-projects",
      prompt: "Entrar a Proyectos",
      sign: "−1  PROYECTOS",
      color: 0x8c74ff,
      zoneX: 162,
      zoneWidth: 132,
      clickBounds: { x: 163, y: 268, width: 136, height: 238 },
      outline: [
        { x: 96, y: 150 },
        { x: 231, y: 150 },
        { x: 231, y: 386 },
        { x: 96, y: 386 },
      ],
      signX: 163,
      signY: 158,
      delay: 0,
    });
    this.drawRouteDoor({
      floor: -2,
      interactionId: "lobby-door-education",
      prompt: "Entrar a Educación",
      sign: "−2  EDUCACIÓN",
      color: 0x61dce8,
      zoneX: 354,
      zoneWidth: 112,
      clickBounds: { x: 361, y: 321, width: 94, height: 168 },
      outline: [
        { x: 316, y: 237 },
        { x: 407, y: 237 },
        { x: 407, y: 404 },
        { x: 316, y: 404 },
      ],
      signX: 361,
      signY: 244,
      delay: 220,
    });
    this.drawRouteDoor({
      floor: -3,
      interactionId: "lobby-door-about",
      prompt: "Entrar a Sobre mí",
      sign: "−3  SOBRE MÍ",
      color: 0xc582ff,
      zoneX: 685,
      zoneWidth: 112,
      clickBounds: { x: 677, y: 279, width: 92, height: 214 },
      outline: [
        { x: 633, y: 173 },
        { x: 722, y: 173 },
        { x: 722, y: 386 },
        { x: 633, y: 386 },
      ],
      signX: 677,
      signY: 181,
      delay: 440,
    });
    this.drawRouteDoor({
      floor: -4,
      interactionId: "lobby-door-contact",
      prompt: "Entrar a Contacto",
      sign: "−4  CONTACTO",
      color: 0x59dff1,
      zoneX: 816,
      zoneWidth: 104,
      clickBounds: { x: 830, y: 253, width: 132, height: 276 },
      outline: [
        { x: 766, y: 116 },
        { x: 894, y: 116 },
        { x: 894, y: 389 },
        { x: 766, y: 389 },
      ],
      signX: 830,
      signY: 125,
      delay: 660,
    });

    this.drawLogbook();
    this.drawQuickViewConsole();
  }

  private drawRouteDoor(config: LobbyDoor): void {
    this.addInteractiveOutline(config.outline, config.delay);
    const signWidth = config.sign.length * 6.2 + 16;
    this.add
      .rectangle(config.signX, config.signY, signWidth, 22, 0x03070b, 0.88)
      .setStrokeStyle(1, config.color, 0.72)
      .setDepth(23);
    this.add
      .text(config.signX, config.signY, config.sign, {
        fontFamily: 'ui-monospace, "Cascadia Mono", monospace',
        fontSize: "9px",
        color: "#f3f7f8",
        letterSpacing: 1,
      })
      .setOrigin(0.5)
      .setDepth(24);
    this.addInteraction(config.interactionId, config.zoneX, config.zoneWidth, config.prompt, {
      type: "floor",
      floor: config.floor,
    }, config.clickBounds);
  }

  private drawLogbook(): void {
    this.addInteractiveOutline(
      [
        { x: 480, y: 243 },
        { x: 613, y: 243 },
        { x: 613, y: 352 },
        { x: 480, y: 352 },
      ],
      180,
    );
    this.addInteraction("lobby-welcome-terminal", 548, 138, "Abrir bitácora", {
      type: "dialogue",
      dialogueId: "welcome-terminal",
    }, { x: 548, y: 298, width: 136, height: 112 });
  }

  private drawQuickViewConsole(): void {
    this.addInteractiveOutline(
      [
        { x: 885, y: 278 },
        { x: 953, y: 278 },
        { x: 953, y: 407 },
        { x: 885, y: 407 },
      ],
      360,
    );
    this.addInteraction("quick-view", 920, 70, "Abrir Quick View", {
      type: "quick-view",
    }, { x: 920, y: 343, width: 70, height: 130 });
  }
}
