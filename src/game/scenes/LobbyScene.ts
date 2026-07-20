import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import type { Locale } from "../../i18n/LocaleContext";
import { BasePortfolioScene } from "./BasePortfolioScene";

const FONT = 'ui-monospace, "Cascadia Mono", monospace';

export class LobbyScene extends BasePortfolioScene {
  constructor(bridge: GameBridge, locale: Locale) {
    super("LobbyScene", 0, bridge, 0x23e6b1, locale);
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    return { x: 520, y: 420 };
  }

  protected buildWorld(): void {
    this.drawElevatorInteraction();
    this.drawElevatorInstructions();
  }

  private drawElevatorInteraction(): void {
    // The large physical doors on the left are the lobby's only destination.
    this.addInteractiveOutline(
      "lobby-elevator",
      [
        { x: 111, y: 171 },
        { x: 278, y: 171 },
        { x: 278, y: 396 },
        { x: 111, y: 396 },
      ],
      0,
    );
    this.addInteraction(
      "lobby-elevator",
      194,
      174,
      this.locale === "en" ? "Open elevator" : "Abrir elevador",
      { type: "elevator" },
      { x: 194, y: 284, width: 170, height: 228 },
      "E",
    );
  }

  private drawElevatorInstructions(): void {
    this.add
      .rectangle(515, 122, 356, 66, 0x03070b, 0.88)
      .setStrokeStyle(1, 0x58f59b, 0.46)
      .setDepth(22);
    this.add
      .text(
        515,
        105,
        this.locale === "en" ? "ELEVATOR · NAVIGATION" : "ELEVADOR · NAVEGACIÓN",
        {
        fontFamily: FONT,
        fontSize: "10px",
        color: "#58f59b",
        letterSpacing: 1.5,
        },
      )
      .setOrigin(0.5)
      .setDepth(23);
    this.add
      .text(
        515,
        126,
        this.locale === "en"
          ? "Approach the doors and press E"
          : "Acércate a las puertas y presiona E",
        {
        fontFamily: FONT,
        fontSize: "10px",
        color: "#f3f7f8",
        },
      )
      .setOrigin(0.5)
      .setDepth(23);
    this.add
      .text(
        515,
        145,
        this.locale === "en"
          ? "or press Q from anywhere"
          : "o presiona Q desde cualquier punto",
        {
        fontFamily: FONT,
        fontSize: "9px",
        color: "#a9bbc1",
        },
      )
      .setOrigin(0.5)
      .setDepth(23);
  }
}
