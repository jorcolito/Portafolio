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

  protected getWorldWidth(): number {
    return 1360;
  }

  protected buildWorld(): void {
    this.addElevator(106);
    if (this.floor === -2) this.buildEducation();
    if (this.floor === -3) this.buildAbout();
    if (this.floor === -4) this.buildContact();
  }

  private buildEducation(): void {
    this.addRoomTitle("ARCHIVO ACADEMICO", "PISO -2  •  APRENDER TAMBIEN ES CONSTRUIR");
    const graphics = this.add.graphics();
    for (let shelf = 0; shelf < 4; shelf += 1) {
      const x = 285 + shelf * 235;
      graphics.fillStyle(0x151826);
      graphics.fillRect(x, 240, 172, 216);
      graphics.lineStyle(2, 0x6574e7, 0.35);
      graphics.strokeRect(x, 240, 172, 216);
      for (let row = 0; row < 3; row += 1) {
        graphics.fillStyle(0x273044);
        graphics.fillRect(x + 10, 300 + row * 51, 152, 5);
        for (let book = 0; book < 6; book += 1) {
          graphics.fillStyle([0x6574e7, 0x25c5db, 0xb65cff][(book + row) % 3], 0.65);
          graphics.fillRect(x + 16 + book * 23, 267 + row * 51, 15, 32);
        }
      }
    }
    this.drawTerminal(1190, 425, 0x6574e7, 1.05);
    this.addNeonLabel(595, 210, "UEES / COMPUTER SCIENCE", 0x8b9aff, 17);
    this.addInteraction("education-uees", 520, 390, "Consultar expediente UEES", {
      type: "dialogue",
      dialogueId: "uees-record",
    });
    this.addInteraction("education-english", 960, 260, "Revisar certificado de ingles", {
      type: "dialogue",
      dialogueId: "english-certificate",
    });
  }

  private buildAbout(): void {
    this.addRoomTitle("ESTUDIO PERSONAL", "PISO -3  •  IDEAS, VIAJES Y DEMASIADAS PESTANAS");
    const graphics = this.add.graphics();
    graphics.fillStyle(0x191429);
    graphics.fillRoundedRect(286, 342, 260, 113, 7);
    graphics.fillStyle(0x28213a);
    graphics.fillRect(306, 318, 220, 31);
    this.drawTerminal(408, 339, 0xb96cff, 1.15);

    // Chess board.
    for (let row = 0; row < 6; row += 1) {
      for (let column = 0; column < 6; column += 1) {
        graphics.fillStyle((row + column) % 2 ? 0x5c5471 : 0xd4c4b8);
        graphics.fillRect(685 + column * 15, 370 + row * 15, 15, 15);
      }
    }
    graphics.fillStyle(0x2b2238);
    graphics.fillRoundedRect(998, 336, 170, 120, 7);
    graphics.lineStyle(3, 0x42d8bf);
    graphics.strokeRoundedRect(998, 336, 170, 120, 7);
    graphics.fillStyle(0x42d8bf, 0.5);
    graphics.fillCircle(1055, 385, 21);
    graphics.fillStyle(0xffd46b, 0.7);
    graphics.fillCircle(1107, 405, 14);

    this.addNeonLabel(408, 286, "WORKSTATION", 0xb96cff, 14);
    this.addNeonLabel(729, 342, "CHESS.EXE", 0xffd46b, 12);
    this.addNeonLabel(1084, 309, "GUAYAQUIL → CALIFORNIA", 0x42d8bf, 12);
    this.addInteraction("about-laptop", 410, 270, "Revisar laptop", {
      type: "dialogue",
      dialogueId: "laptop",
    });
    this.addInteraction("about-chess", 730, 220, "Examinar tablero", {
      type: "dialogue",
      dialogueId: "chessboard",
    });
    this.addInteraction("about-suitcase", 1080, 280, "Abrir recuerdos de viaje", {
      type: "dialogue",
      dialogueId: "travel-bag",
    });
  }

  private buildContact(): void {
    this.addRoomTitle("NODO DE COMUNICACION", "PISO -4  •  CANAL EXTERNO DISPONIBLE");
    const x = 720;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x07171c);
    graphics.fillRoundedRect(x - 235, 231, 470, 225, 12);
    graphics.lineStyle(3, 0x27d6ef, 0.6);
    graphics.strokeRoundedRect(x - 235, 231, 470, 225, 12);
    graphics.fillStyle(0x02080d);
    graphics.fillRoundedRect(x - 167, 267, 334, 115, 5);
    graphics.fillStyle(0x27d6ef, 0.6);
    graphics.fillRect(x - 136, 294, 194, 4);
    graphics.fillRect(x - 136, 314, 263, 3);
    graphics.fillRect(x - 136, 334, 221, 3);
    graphics.fillStyle(0x14242b);
    graphics.fillRect(x - 41, 382, 82, 38);
    graphics.fillRect(x - 131, 418, 262, 18);
    this.addNeonLabel(x, 199, "UPLINK / JORGE COLAMARCO", 0x27d6ef, 18);
    this.addInteraction("contact-terminal", x, 520, "Iniciar contacto", {
      type: "dialogue",
      dialogueId: "contact-invitation",
    });
  }
}
