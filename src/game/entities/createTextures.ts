import * as Phaser from "phaser";

const PLAYER_TEXTURES = ["jorge-idle", "jorge-walk-1", "jorge-walk-2"];

function drawPlayer(
  graphics: Phaser.GameObjects.Graphics,
  texture: string,
  step: -1 | 0 | 1,
): void {
  graphics.clear();
  graphics.fillStyle(0x000000, 0);
  graphics.fillRect(0, 0, 24, 38);

  // Hair and face.
  graphics.fillStyle(0x15141b);
  graphics.fillRect(5, 2, 14, 4);
  graphics.fillRect(3, 6, 18, 8);
  graphics.fillStyle(0xc9875c);
  graphics.fillRect(6, 11, 12, 9);
  graphics.fillStyle(0x10151d);
  graphics.fillRect(7, 14, 2, 2);
  graphics.fillRect(15, 14, 2, 2);

  // Jacket, lab badge and hands.
  graphics.fillStyle(0x172e35);
  graphics.fillRect(5, 20, 14, 11);
  graphics.fillStyle(0x19e6b3);
  graphics.fillRect(7, 22, 2, 5);
  graphics.fillStyle(0xd6fff5);
  graphics.fillRect(15, 22, 2, 2);
  graphics.fillStyle(0xc9875c);
  graphics.fillRect(2, 22, 3, 7);
  graphics.fillRect(19, 22, 3, 7);

  // Alternating feet make a tiny code-generated walk cycle.
  graphics.fillStyle(0x111722);
  graphics.fillRect(step === 1 ? 6 : 5, 31, 5, step === -1 ? 5 : 7);
  graphics.fillRect(step === -1 ? 13 : 14, 31, 5, step === 1 ? 5 : 7);
  graphics.generateTexture(texture, 24, 38);
}

export function ensureGeneratedTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists(PLAYER_TEXTURES[0])) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 }, false);
  drawPlayer(graphics, PLAYER_TEXTURES[0], 0);
  drawPlayer(graphics, PLAYER_TEXTURES[1], -1);
  drawPlayer(graphics, PLAYER_TEXTURES[2], 1);

  graphics.clear();
  graphics.fillStyle(0x000000, 0);
  graphics.fillRect(0, 0, 30, 28);
  graphics.fillStyle(0x0b1720);
  graphics.fillRoundedRect(3, 5, 24, 19, 4);
  graphics.lineStyle(2, 0x25e7d4);
  graphics.strokeRoundedRect(3, 5, 24, 19, 4);
  graphics.fillStyle(0x25e7d4);
  graphics.fillRect(8, 11, 4, 4);
  graphics.fillRect(18, 11, 4, 4);
  graphics.fillStyle(0xb7fff8);
  graphics.fillRect(9, 12, 2, 2);
  graphics.fillRect(19, 12, 2, 2);
  graphics.lineStyle(2, 0x25e7d4);
  graphics.lineBetween(15, 5, 18, 1);
  graphics.strokeCircle(19, 1, 1);
  graphics.generateTexture("byte-robot", 30, 28);

  graphics.destroy();
}
