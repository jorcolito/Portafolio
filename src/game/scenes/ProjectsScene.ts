import * as Phaser from "phaser";

import type { GameBridge } from "../events/GameBridge";
import { BasePortfolioScene } from "./BasePortfolioScene";

export class ProjectsScene extends BasePortfolioScene {
  constructor(bridge: GameBridge) {
    super("ProjectsScene", -1, bridge, 0xa76bff);
  }

  protected getWorldWidth(): number {
    return 1760;
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    return { x: 190, y: 430 };
  }

  protected buildWorld(): void {
    this.addRoomTitle("LABORATORIO DE PROTOTIPOS", "PISO -1  •  TRES SISTEMAS EN CONSTRUCCION");
    this.addElevator(100);
    this.drawCarDriveBay();
    this.drawShikoBay();
    this.drawComernovaBay();

    // Small elevated service platforms make jumping useful without obstructing the route.
    this.addPlatform(650, 415, 120, 15, 0x161d2a);
    this.addPlatform(1100, 386, 110, 15, 0x161d2a);
  }

  private drawCarDriveBay(): void {
    const x = 420;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x07151a);
    graphics.fillRect(x - 190, 218, 380, 243);
    graphics.lineStyle(2, 0x21e4b0, 0.65);
    graphics.strokeRect(x - 190, 218, 380, 243);
    graphics.lineStyle(1, 0x21e4b0, 0.18);
    for (let gx = x - 170; gx < x + 180; gx += 45) {
      graphics.lineBetween(gx, 220, gx, 460);
    }

    // Original compact car silhouette.
    graphics.fillStyle(0x193c47);
    graphics.fillRoundedRect(x - 86, 384, 172, 50, 10);
    graphics.fillStyle(0x205a68);
    graphics.fillPoints(
      [
        new Phaser.Geom.Point(x - 55, 384),
        new Phaser.Geom.Point(x - 27, 352),
        new Phaser.Geom.Point(x + 46, 352),
        new Phaser.Geom.Point(x + 72, 384),
      ],
      true,
    );
    graphics.fillStyle(0x07151d);
    graphics.fillPoints(
      [
        new Phaser.Geom.Point(x - 42, 380),
        new Phaser.Geom.Point(x - 21, 359),
        new Phaser.Geom.Point(x + 7, 359),
        new Phaser.Geom.Point(x + 7, 380),
      ],
      true,
    );
    graphics.fillPoints(
      [
        new Phaser.Geom.Point(x + 14, 359),
        new Phaser.Geom.Point(x + 41, 359),
        new Phaser.Geom.Point(x + 58, 380),
        new Phaser.Geom.Point(x + 14, 380),
      ],
      true,
    );
    graphics.fillStyle(0x05070b);
    graphics.fillCircle(x - 55, 433, 19);
    graphics.fillCircle(x + 56, 433, 19);
    graphics.lineStyle(4, 0x476473);
    graphics.strokeCircle(x - 55, 433, 11);
    graphics.strokeCircle(x + 56, 433, 11);
    graphics.fillStyle(0x38dcff);
    graphics.fillRect(x - 87, 399, 11, 8);
    graphics.fillRect(x + 76, 399, 11, 8);

    this.drawTerminal(x + 140, 419, 0x21e4b0, 0.82);
    this.addNeonLabel(x, 192, "CARDRIVE / GARAGE 01", 0x21e4b0, 17);
    this.addInteraction("project-cardrive", x, 330, "Inspeccionar CarDrive", {
      type: "dialogue",
      dialogueId: "cardrive-introduction",
    });
  }

  private drawShikoBay(): void {
    const x = 930;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x140d20);
    graphics.fillRect(x - 185, 218, 370, 243);
    graphics.lineStyle(2, 0xa76bff, 0.7);
    graphics.strokeRect(x - 185, 218, 370, 243);

    // Analytics wall.
    graphics.fillStyle(0x080712);
    graphics.fillRoundedRect(x - 108, 252, 216, 92, 5);
    graphics.lineStyle(2, 0x433059);
    graphics.strokeRoundedRect(x - 108, 252, 216, 92, 5);
    const bars = [30, 49, 22, 61, 43, 70];
    bars.forEach((height, index) => {
      graphics.fillStyle(index % 2 ? 0xffca5c : 0xa76bff, 0.78);
      graphics.fillRect(x - 82 + index * 30, 328 - height, 14, height);
    });
    graphics.lineStyle(2, 0x25e6b2, 0.8);
    graphics.beginPath();
    graphics.moveTo(x - 88, 316);
    graphics.lineTo(x - 46, 291);
    graphics.lineTo(x - 5, 305);
    graphics.lineTo(x + 36, 270);
    graphics.lineTo(x + 86, 283);
    graphics.strokePath();

    this.drawCrate(x - 92, 432, 0xffca5c);
    this.drawCrate(x - 34, 432, 0xa76bff);
    this.drawCrate(x + 70, 432, 0xffca5c);
    this.addNeonLabel(x, 192, "SHIKO / SIGNAL LAB", 0xa76bff, 17);
    this.addInteraction("project-shiko", x, 340, "Analizar SHIKO", {
      type: "dialogue",
      dialogueId: "shiko-introduction",
    });
  }

  private drawComernovaBay(): void {
    const x = 1435;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x07141b);
    graphics.fillRect(x - 185, 218, 370, 243);
    graphics.lineStyle(2, 0x28cce8, 0.68);
    graphics.strokeRect(x - 185, 218, 370, 243);

    // A deliberately tidy storage wall.
    for (let row = 0; row < 3; row += 1) {
      graphics.fillStyle(0x17242c);
      graphics.fillRect(x - 145, 266 + row * 57, 290, 7);
      for (let column = 0; column < 4; column += 1) {
        const boxX = x - 127 + column * 72;
        const boxY = 229 + row * 57;
        graphics.fillStyle((row + column) % 2 ? 0x233743 : 0x19302f);
        graphics.fillRoundedRect(boxX, boxY, 52, 36, 3);
        graphics.lineStyle(1, (row + column) % 2 ? 0x28cce8 : 0x44e0b1, 0.55);
        graphics.strokeRoundedRect(boxX, boxY, 52, 36, 3);
        graphics.fillStyle(0xc8f8ff, 0.55);
        graphics.fillRect(boxX + 14, boxY + 14, 24, 4);
      }
    }
    this.drawTerminal(x + 115, 440, 0x28cce8, 0.75);
    this.addNeonLabel(x, 192, "COMERNOVA / ORDER ROOM", 0x28cce8, 17);
    this.addInteraction("project-comernova", x, 340, "Abrir Comernova", {
      type: "dialogue",
      dialogueId: "comernova-introduction",
    });
  }
}
