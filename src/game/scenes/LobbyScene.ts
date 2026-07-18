import type { GameBridge } from "../events/GameBridge";
import { BasePortfolioScene } from "./BasePortfolioScene";

export class LobbyScene extends BasePortfolioScene {
  constructor(bridge: GameBridge) {
    super("LobbyScene", 0, bridge, 0x23e6b1);
  }

  protected getWorldWidth(): number {
    return 1360;
  }

  protected buildWorld(): void {
    this.addRoomTitle("JORGE LABS / LOBBY", "PISO 0  •  ESPACIO DE TRABAJO EN LINEA");
    this.addElevator(108);
    this.drawWelcomeTerminal();
    this.drawRobotStation();
    this.drawQuickViewTerminal();
    this.drawSavePoint();
    this.drawAmbientDetails();
  }

  private drawWelcomeTerminal(): void {
    const x = 390;
    this.addNeonLabel(x, 293, "BUILD / DEBUG / REPEAT", 0x39d9ff, 13);
    this.drawTerminal(x, 424, 0x39d9ff, 1.15);
    this.addInteraction("lobby-welcome-terminal", x, 150, "Leer terminal", {
      type: "dialogue",
      dialogueId: "welcome-terminal",
    });
  }

  private drawRobotStation(): void {
    const x = 675;
    const halo = this.add.circle(x, 426, 54, 0x23e6b1, 0.035);
    const robot = this.add.image(x, 434, "byte-robot").setOrigin(0.5, 1).setDepth(8);
    this.tweens.add({
      targets: [robot, halo],
      y: "-=4",
      duration: 1050,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
    this.addNeonLabel(x, 365, "BYTE", 0x23e6b1, 12);
    this.addInteraction("lobby-robot", x, 135, "Hablar con BYTE", {
      type: "dialogue",
      dialogueId: "robot-welcome",
    });
  }

  private drawQuickViewTerminal(): void {
    const x = 1010;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x08141d);
    graphics.fillRoundedRect(x - 90, 327, 180, 126, 8);
    graphics.lineStyle(2, 0x29d7f2, 0.65);
    graphics.strokeRoundedRect(x - 90, 327, 180, 126, 8);
    graphics.fillStyle(0x041019);
    graphics.fillRect(x - 74, 345, 148, 75);
    graphics.fillStyle(0x29d7f2, 0.7);
    for (let row = 0; row < 5; row += 1) {
      graphics.fillRect(x - 60, 355 + row * 12, 46 + row * 12, 2);
    }
    this.addNeonLabel(x, 301, "QUICK VIEW", 0x29d7f2, 15);
    this.addInteraction("quick-view", x, 205, "Abrir vista rapida", { type: "quick-view" });
  }

  private drawSavePoint(): void {
    const x = 1230;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x131222);
    graphics.fillRect(x - 42, 364, 84, 92);
    graphics.lineStyle(2, 0x8f6cff, 0.8);
    graphics.strokeRect(x - 42, 364, 84, 92);
    graphics.fillStyle(0x261f43);
    graphics.fillRect(x - 27, 379, 54, 42);
    graphics.fillStyle(0xd976ff, 0.7);
    graphics.fillCircle(x, 400, 10);
    graphics.fillStyle(0x8f6cff, 0.35);
    graphics.fillCircle(x, 400, 24);
    this.addNeonLabel(x, 340, "CHECKPOINT", 0x8f6cff, 11);
    this.addInteraction("lobby-save-point", x, 120, "Examinar punto de guardado", {
      type: "dialogue",
      dialogueId: "save-point",
    });
  }

  private drawAmbientDetails(): void {
    const graphics = this.add.graphics();
    for (let x = 236; x < 1320; x += 184) {
      graphics.lineStyle(2, 0x243748, 0.8);
      graphics.lineBetween(x, 121, x + 32, 154);
      graphics.lineBetween(x + 32, 154, x + 84, 154);
      graphics.fillStyle(x % 368 === 0 ? 0x8f6cff : 0x23e6b1, 0.65);
      graphics.fillCircle(x + 84, 154, 3);
    }

    this.add
      .text(760, 212, "PROYECTOS  ↓ -1     EDUCACION  ↓ -2     PERFIL  ↓ -3", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#7f929e",
        backgroundColor: "#060a10",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5);
  }
}
