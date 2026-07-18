import * as Phaser from "phaser";

import { DIALOGUES_BY_ID } from "../../data";
import type { DialogueId, DialogueSequence } from "../../types";
import { ensureGeneratedTextures } from "../entities/createTextures";
import type { GameBridge } from "../events/GameBridge";
import {
  PORTFOLIO_FLOORS,
  type PortfolioFloor,
  type PortfolioProjectId,
  type ReactToGameCommand,
} from "../types/contracts";

type InteractionAction =
  | {
      type: "dialogue";
      dialogueId: DialogueId;
    }
  | { type: "elevator" }
  | { type: "project"; projectId: PortfolioProjectId }
  | { type: "quick-view" }
  | { type: "contact" };

interface InteractionZone {
  id: string;
  label: string;
  keyHint: string;
  area: Phaser.GameObjects.Zone;
  action: InteractionAction;
}

interface GameKeys {
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
  e: Phaser.Input.Keyboard.Key;
  enter: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
}

const FLOOR_SCENES: Record<PortfolioFloor, string> = {
  0: "LobbyScene",
  [-1]: "ProjectsScene",
  [-2]: "EducationScene",
  [-3]: "AboutScene",
  [-4]: "ContactScene",
};

const FONT = 'ui-monospace, "Cascadia Mono", "Courier New", monospace';
const CAPTURED_KEYS = [
  Phaser.Input.Keyboard.KeyCodes.LEFT,
  Phaser.Input.Keyboard.KeyCodes.RIGHT,
  Phaser.Input.Keyboard.KeyCodes.UP,
  Phaser.Input.Keyboard.KeyCodes.DOWN,
  Phaser.Input.Keyboard.KeyCodes.W,
  Phaser.Input.Keyboard.KeyCodes.A,
  Phaser.Input.Keyboard.KeyCodes.S,
  Phaser.Input.Keyboard.KeyCodes.D,
  Phaser.Input.Keyboard.KeyCodes.SPACE,
  Phaser.Input.Keyboard.KeyCodes.E,
  Phaser.Input.Keyboard.KeyCodes.ENTER,
];

export abstract class BasePortfolioScene extends Phaser.Scene {
  protected readonly bridge: GameBridge;
  protected readonly floor: PortfolioFloor;
  protected readonly accent: number;
  protected player!: Phaser.Physics.Arcade.Sprite;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: GameKeys;
  private zones: InteractionZone[] = [];
  private platforms: Phaser.GameObjects.Rectangle[] = [];
  private activeZone: InteractionZone | null = null;
  private prompt!: Phaser.GameObjects.Container;
  private promptLabel!: Phaser.GameObjects.Text;
  private unsubscribeCommands?: () => void;
  private touchLeft = false;
  private touchRight = false;
  private jumpQueued = false;
  private active = true;
  private uiBlocked = false;
  private reducedMotion = false;
  private muted = true;
  private walkFrame = 0;
  private lastStepAt = 0;

  protected constructor(
    key: string,
    floor: PortfolioFloor,
    bridge: GameBridge,
    accent: number,
  ) {
    super(key);
    this.floor = floor;
    this.bridge = bridge;
    this.accent = accent;
  }

  create(): void {
    const worldWidth = this.getWorldWidth();
    ensureGeneratedTextures(this);

    this.physics.world.setBounds(0, 0, worldWidth, 540);
    this.cameras.main.setBounds(0, 0, worldWidth, 540);
    this.cameras.main.setBackgroundColor(0x05080e);

    this.drawLabBackdrop(worldWidth);
    this.addPlatform(worldWidth / 2, 500, worldWidth, 80, 0x0b1119);
    this.buildWorld();
    this.createPlayer();
    this.createPrompt();
    this.createInput();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08, 0, 36);
    this.cameras.main.fadeIn(this.reducedMotion ? 0 : 180, 3, 7, 12);

    this.unsubscribeCommands = this.bridge.onCommand((command) =>
      this.receiveCommand(command),
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanUp, this);

    const floorLabel =
      PORTFOLIO_FLOORS.find((option) => option.floor === this.floor)?.label ??
      "Lobby";
    this.bridge.emit({
      type: "floor-changed",
      floor: this.floor,
      label: floorLabel,
    });
  }

  update(time: number): void {
    if (!this.active || this.uiBlocked) return;

    this.updateNearbyZone();

    const left = Boolean(this.cursors.left?.isDown || this.keys.a.isDown || this.touchLeft);
    const right = Boolean(
      this.cursors.right?.isDown || this.keys.d.isDown || this.touchRight,
    );
    const speed = 178;

    if (left === right) {
      this.player.setVelocityX(0);
      this.player.setTexture("jorge-idle");
    } else {
      const direction = left ? -1 : 1;
      this.player.setVelocityX(direction * speed);
      this.player.setFlipX(direction < 0);
      this.walkFrame = Math.floor(time / 145) % 2;
      this.player.setTexture(this.walkFrame ? "jorge-walk-2" : "jorge-walk-1");

      if (this.isGrounded() && time - this.lastStepAt > 310) {
        this.lastStepAt = time;
        if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "step" });
      }
    }

    const keyboardJump =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w) ||
      Phaser.Input.Keyboard.JustDown(this.keys.space);
    if ((keyboardJump || this.jumpQueued) && this.isGrounded()) {
      this.player.setVelocityY(-360);
      if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "jump" });
    }
    this.jumpQueued = false;

    const keyboardInteract =
      Phaser.Input.Keyboard.JustDown(this.keys.e) ||
      Phaser.Input.Keyboard.JustDown(this.keys.enter) ||
      (this.activeZone?.action.type === "elevator" &&
        (Phaser.Input.Keyboard.JustDown(this.keys.s) ||
          Phaser.Input.Keyboard.JustDown(this.cursors.down)));
    if (keyboardInteract) this.interact();

    if (this.player.y > 535) this.resetPlayer();
  }

  protected abstract buildWorld(): void;

  protected getWorldWidth(): number {
    return 1440;
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    return { x: 210, y: 430 };
  }

  protected addInteraction(
    id: string,
    x: number,
    width: number,
    label: string,
    action: InteractionAction,
    keyHint = "E / ENTER",
  ): void {
    const area = this.add.zone(x, 392, width, 170).setOrigin(0.5, 0.5);
    this.zones.push({ id, label, keyHint, area, action });
  }

  protected addPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0x111a24,
  ): Phaser.GameObjects.Rectangle {
    const platform = this.add.rectangle(x, y, width, height, color);
    platform.setStrokeStyle(2, 0x263949);
    this.physics.add.existing(platform, true);
    this.platforms.push(platform);
    if (this.player) this.physics.add.collider(this.player, platform);
    return platform;
  }

  protected addElevator(x = 104): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x071116);
    graphics.fillRect(x - 68, 285, 136, 176);
    graphics.lineStyle(3, this.accent, 0.8);
    graphics.strokeRect(x - 68, 285, 136, 176);
    graphics.fillStyle(0x111c24);
    graphics.fillRect(x - 55, 304, 52, 150);
    graphics.fillRect(x + 3, 304, 52, 150);
    graphics.lineStyle(1, 0x48606c, 0.8);
    graphics.lineBetween(x, 304, x, 454);
    graphics.fillStyle(this.accent, 0.8);
    graphics.fillRect(x + 47, 364, 4, 18);

    this.addNeonLabel(x, 267, "ASCENSOR", 0xf5b942, 13);
    this.addInteraction("elevator", x, 150, "Elegir piso", { type: "elevator" });
  }

  protected addNeonLabel(
    x: number,
    y: number,
    text: string,
    color = this.accent,
    size = 16,
  ): Phaser.GameObjects.Text {
    const label = this.add
      .text(x, y, text, {
        fontFamily: FONT,
        fontSize: `${size}px`,
        color: `#${color.toString(16).padStart(6, "0")}`,
        stroke: "#020409",
        strokeThickness: 5,
      })
      .setOrigin(0.5);
    label.setShadow(0, 0, `#${color.toString(16).padStart(6, "0")}`, 7, true, true);
    return label;
  }

  protected drawTerminal(
    x: number,
    y: number,
    color = this.accent,
    scale = 1,
  ): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x111924);
    graphics.fillRoundedRect(x - 35 * scale, y - 44 * scale, 70 * scale, 50 * scale, 4);
    graphics.lineStyle(2, 0x3e5362);
    graphics.strokeRoundedRect(x - 35 * scale, y - 44 * scale, 70 * scale, 50 * scale, 4);
    graphics.fillStyle(0x031116);
    graphics.fillRect(x - 28 * scale, y - 37 * scale, 56 * scale, 35 * scale);
    graphics.fillStyle(color, 0.75);
    graphics.fillRect(x - 21 * scale, y - 29 * scale, 28 * scale, 3 * scale);
    graphics.fillRect(x - 21 * scale, y - 20 * scale, 40 * scale, 2 * scale);
    graphics.fillRect(x - 21 * scale, y - 13 * scale, 33 * scale, 2 * scale);
    graphics.fillStyle(0x18232f);
    graphics.fillRect(x - 5 * scale, y + 6 * scale, 10 * scale, 22 * scale);
    graphics.fillRect(x - 25 * scale, y + 28 * scale, 50 * scale, 7 * scale);
  }

  protected drawCrate(x: number, y: number, color = 0x9e6730): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x241b18);
    graphics.fillRect(x - 27, y - 22, 54, 44);
    graphics.lineStyle(3, color);
    graphics.strokeRect(x - 27, y - 22, 54, 44);
    graphics.lineBetween(x - 24, y - 19, x + 24, y + 19);
    graphics.lineBetween(x + 24, y - 19, x - 24, y + 19);
  }

  protected drawLabBackdrop(width: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x05080e);
    graphics.fillRect(0, 0, width, 540);
    graphics.fillStyle(0x080d15);
    graphics.fillRect(0, 82, width, 382);

    for (let x = 0; x < width; x += 96) {
      graphics.lineStyle(1, 0x16222f, 0.7);
      graphics.strokeRect(x, 92, 92, 105);
      graphics.strokeRect(x, 201, 92, 105);
      graphics.strokeRect(x, 310, 92, 105);
      graphics.fillStyle(0x243342, 0.7);
      graphics.fillCircle(x + 8, 100, 2);
      graphics.fillCircle(x + 84, 188, 2);
    }

    graphics.lineStyle(5, 0x111b25);
    graphics.lineBetween(0, 118, width, 118);
    graphics.lineStyle(1, this.accent, 0.18);
    graphics.lineBetween(0, 121, width, 121);

    for (let x = 45; x < width; x += 230) {
      graphics.fillStyle(0x101722);
      graphics.fillRect(x, 44, 120, 27);
      graphics.lineStyle(1, 0x344555);
      graphics.strokeRect(x, 44, 120, 27);
      graphics.fillStyle(this.accent, 0.32);
      graphics.fillRect(x + 10, 55, 58, 4);
    }
  }

  protected addRoomTitle(title: string, subtitle: string): void {
    this.add
      .text(30, 23, title, {
        fontFamily: FONT,
        fontSize: "22px",
        color: "#edf9ff",
        stroke: "#020409",
        strokeThickness: 5,
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.add
      .text(31, 53, subtitle, {
        fontFamily: FONT,
        fontSize: "10px",
        color: "#91a3af",
        letterSpacing: 2,
      })
      .setScrollFactor(0)
      .setDepth(50);
  }

  private createPlayer(): void {
    const spawn = this.getPlayerSpawn();
    this.player = this.physics.add.sprite(spawn.x ?? 210, spawn.y ?? 430, "jorge-idle");
    this.player.setDepth(20).setCollideWorldBounds(true);
    this.player.setDragX(900).setMaxVelocity(220, 500);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(16, 33).setOffset(4, 5);

    for (const platform of this.platforms) this.physics.add.collider(this.player, platform);
  }

  private createPrompt(): void {
    const background = this.add
      .rectangle(0, 0, 312, 42, 0x03060b, 0.96)
      .setStrokeStyle(1, this.accent, 0.9);
    this.promptLabel = this.add
      .text(0, 0, "", {
        fontFamily: FONT,
        fontSize: "13px",
        color: "#f4fbff",
      })
      .setOrigin(0.5);
    this.prompt = this.add
      .container(480, 479, [background, this.promptLabel])
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);
  }

  private createInput(): void {
    if (!this.input.keyboard) return;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as GameKeys;
    this.input.keyboard.addCapture(CAPTURED_KEYS);
    this.input.keyboard.enableGlobalCapture();

    this.input.on("pointerdown", () => {
      if (this.activeZone && !this.uiBlocked && this.active) this.interact();
    });
  }

  private updateNearbyZone(): void {
    const next =
      this.zones.find((zone) => zone.area.getBounds().contains(this.player.x, this.player.y)) ??
      null;
    if (next === this.activeZone) return;

    this.activeZone = next;
    this.prompt.setVisible(Boolean(next));
    if (next) this.promptLabel.setText(`[ ${next.keyHint} ]  ${next.label}`);
    this.bridge.emit({
      type: "prompt-changed",
      prompt: next
        ? { id: next.id, label: next.label, keyHint: next.keyHint }
        : null,
    });
  }

  private interact(): void {
    const zone = this.activeZone;
    if (!zone || !this.active || this.uiBlocked) return;

    this.setUiBlocked(true);
    if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "interact" });

    switch (zone.action.type) {
      case "dialogue": {
        const dialogue: DialogueSequence = DIALOGUES_BY_ID[zone.action.dialogueId];
        const after = dialogue.completion
          ? dialogue.completion.type === "open-project"
            ? {
                type: "project" as const,
                projectId: dialogue.completion.projectId,
              }
            : { type: "contact" as const }
          : undefined;
        this.bridge.emit({
          type: "dialogue-requested",
          dialogue: {
            ...dialogue,
            speed: this.reducedMotion
              ? 0
              : Math.round(1000 / dialogue.defaults.charactersPerSecond),
          },
          after,
        });
        break;
      }
      case "elevator":
        this.bridge.emit({
          type: "elevator-requested",
          currentFloor: this.floor,
          floors: PORTFOLIO_FLOORS,
        });
        break;
      case "project":
        this.bridge.emit({ type: "project-requested", projectId: zone.action.projectId });
        break;
      case "quick-view":
        this.bridge.emit({ type: "quick-view-requested" });
        break;
      case "contact":
        this.bridge.emit({ type: "contact-requested" });
        break;
    }
  }

  private receiveCommand(command: ReactToGameCommand): void {
    switch (command.type) {
      case "set-active":
        this.active = command.active;
        this.applyPauseState();
        break;
      case "set-ui-blocked":
        this.setUiBlocked(command.blocked);
        break;
      case "set-reduced-motion":
        this.reducedMotion = command.reduced;
        break;
      case "set-muted":
        this.muted = command.muted;
        break;
      case "move":
        if (command.direction === "left") this.touchLeft = command.pressed;
        else this.touchRight = command.pressed;
        break;
      case "jump":
        if (!this.uiBlocked && this.active) this.jumpQueued = true;
        break;
      case "interact":
        this.interact();
        break;
      case "select-floor":
        this.changeFloor(command.floor);
        break;
      case "reset-player":
        this.resetPlayer();
        break;
    }
  }

  private changeFloor(floor: PortfolioFloor): void {
    if (floor === this.floor) {
      this.setUiBlocked(false);
      return;
    }

    this.touchLeft = false;
    this.touchRight = false;
    this.bridge.emit({ type: "prompt-changed", prompt: null });
    const startFloor = () => {
      // Scene instances are reused by Phaser; do not carry a modal lock to a future visit.
      this.uiBlocked = false;
      this.scene.start(FLOOR_SCENES[floor]);
    };

    if (this.reducedMotion) {
      startFloor();
      return;
    }

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, startFloor);
    this.cameras.main.fadeOut(170, 2, 8, 14);
  }

  private setUiBlocked(blocked: boolean): void {
    this.uiBlocked = blocked;
    this.applyPauseState();
  }

  private applyPauseState(): void {
    const paused = !this.active || this.uiBlocked;
    this.touchLeft = paused ? false : this.touchLeft;
    this.touchRight = paused ? false : this.touchRight;
    this.jumpQueued = false;

    if (paused) {
      this.physics.world.pause();
      this.tweens.pauseAll();
      this.player?.setTexture("jorge-idle");
      this.input.enabled = false;
      this.input.keyboard?.resetKeys();
      this.input.keyboard?.removeCapture(CAPTURED_KEYS);
    } else {
      this.physics.world.resume();
      this.tweens.resumeAll();
      this.input.enabled = true;
      this.input.keyboard?.addCapture(CAPTURED_KEYS);
      this.input.keyboard?.enableGlobalCapture();
    }
  }

  private isGrounded(): boolean {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    return body.blocked.down || body.touching.down;
  }

  private resetPlayer(): void {
    const spawn = this.getPlayerSpawn();
    this.player.setPosition(spawn.x ?? 210, spawn.y ?? 430);
    this.player.setVelocity(0, 0);
  }

  private cleanUp(): void {
    this.unsubscribeCommands?.();
    this.unsubscribeCommands = undefined;
    this.input?.removeAllListeners();
    this.input.keyboard?.removeCapture(CAPTURED_KEYS);
    this.bridge.emit({ type: "prompt-changed", prompt: null });
    this.activeZone = null;
    this.zones = [];
    this.platforms = [];
  }
}
