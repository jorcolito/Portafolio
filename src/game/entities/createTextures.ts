import * as Phaser from "phaser";

const PLAYER_TEXTURES = ["jorge-idle", "jorge-walk-1", "jorge-walk-2"];
const SEATED_TEXTURE = "jorge-seated";
const ROBOT_TEXTURE = "byte-robot";

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

function drawSeatedJorge(graphics: Phaser.GameObjects.Graphics): void {
  graphics.clear();
  graphics.fillStyle(0x000000, 0);
  graphics.fillRect(0, 0, 38, 50);

  // Hair and face, turned slightly toward the desk on the left.
  graphics.fillStyle(0x111118);
  graphics.fillRect(13, 2, 16, 4);
  graphics.fillRect(10, 6, 20, 9);
  graphics.fillRect(8, 9, 5, 8);
  graphics.fillStyle(0xc9875c);
  graphics.fillRect(12, 13, 14, 10);
  graphics.fillStyle(0x10151d);
  graphics.fillRect(13, 16, 2, 2);
  graphics.fillStyle(0xd59a70);
  graphics.fillRect(10, 20, 5, 3);

  // Jacket, cyan badge and typing arms.
  graphics.fillStyle(0x172e35);
  graphics.fillRect(11, 23, 17, 15);
  graphics.fillStyle(0x24505a);
  graphics.fillRect(8, 27, 7, 8);
  graphics.fillRect(24, 27, 8, 8);
  graphics.fillStyle(0x22e5b3);
  graphics.fillRect(14, 26, 3, 7);
  graphics.fillStyle(0xc9875c);
  graphics.fillRect(3, 34, 10, 4);
  graphics.fillRect(25, 34, 10, 4);
  graphics.fillStyle(0xe7faff);
  graphics.fillRect(27, 27, 3, 3);

  // Bent legs read clearly as seated even at the small source resolution.
  graphics.fillStyle(0x111722);
  graphics.fillRect(13, 38, 8, 8);
  graphics.fillRect(21, 39, 8, 6);
  graphics.fillRect(7, 43, 14, 5);
  graphics.fillRect(23, 44, 12, 5);
  graphics.fillStyle(0x05080d);
  graphics.fillRect(5, 47, 16, 3);
  graphics.fillRect(23, 47, 14, 3);

  graphics.generateTexture(SEATED_TEXTURE, 38, 50);
}

export function ensureGeneratedTextures(scene: Phaser.Scene): void {
  const hasPlayers = PLAYER_TEXTURES.every((texture) => scene.textures.exists(texture));
  const hasRobot = scene.textures.exists(ROBOT_TEXTURE);
  const hasSeatedJorge = scene.textures.exists(SEATED_TEXTURE);
  if (hasPlayers && hasRobot && hasSeatedJorge) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 }, false);

  if (!hasPlayers) {
    drawPlayer(graphics, PLAYER_TEXTURES[0], 0);
    drawPlayer(graphics, PLAYER_TEXTURES[1], -1);
    drawPlayer(graphics, PLAYER_TEXTURES[2], 1);
  }

  if (!hasRobot) {
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
    graphics.generateTexture(ROBOT_TEXTURE, 30, 28);
  }

  if (!hasSeatedJorge) drawSeatedJorge(graphics);

  graphics.destroy();
}
