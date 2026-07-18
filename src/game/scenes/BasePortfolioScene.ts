import * as Phaser from "phaser";

import { DIALOGUES_BY_ID } from "../../data";
import type { DialogueId, DialogueSequence } from "../../types";
import { ensureGeneratedTextures } from "../entities/createTextures";
import type { GameBridge } from "../events/GameBridge";
import {
  PORTFOLIO_FLOORS,
  type DialogueFollowUp,
  type PortfolioFloor,
  type PortfolioProjectId,
  type ReactToGameCommand,
} from "../types/contracts";

type InteractionAction =
  | { type: "dialogue"; dialogueId: DialogueId; after?: DialogueFollowUp }
  | { type: "project"; projectId: PortfolioProjectId }
  | { type: "floor"; floor: PortfolioFloor }
  | { type: "quick-view" }
  | { type: "chess" }
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
  q: Phaser.Input.Keyboard.Key;
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

const FLOOR_BACKGROUNDS: Record<
  PortfolioFloor,
  { key: string; url: string }
> = {
  0: { key: "room-lobby-v2", url: "/scenes/lobby-v2.png" },
  [-1]: { key: "room-projects-v2", url: "/scenes/projects-v2.png" },
  [-2]: { key: "room-education-v2", url: "/scenes/education-v2.png" },
  [-3]: { key: "room-about-v2", url: "/scenes/about-v2.png" },
  [-4]: { key: "room-contact-v2", url: "/scenes/contact-v2.png" },
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
  Phaser.Input.Keyboard.KeyCodes.Q,
  Phaser.Input.Keyboard.KeyCodes.ENTER,
];

/**
 * Shared stage for the five compact dioramas.
 *
 * The world is deliberately the same size as the camera. Every room presents
 * its meaningful objects immediately instead of asking the visitor to cross a
 * long corridor before finding an interaction.
 */
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
  private unsubscribeCommands?: () => void;
  private touchLeft = false;
  private touchRight = false;
  private jumpQueued = false;
  private active = true;
  private uiBlocked = false;
  private reducedMotion = false;
  private muted = true;
  private transitioning = false;
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

  preload(): void {
    const background = FLOOR_BACKGROUNDS[this.floor];
    if (!this.textures.exists(background.key)) {
      this.load.image(background.key, background.url);
    }
  }

  create(): void {
    const worldWidth = this.getWorldWidth();
    this.zones = [];
    this.platforms = [];
    this.activeZone = null;
    this.uiBlocked = false;
    this.transitioning = false;
    ensureGeneratedTextures(this);

    this.physics.world.setBounds(0, 0, worldWidth, 540);
    this.cameras.main.setBounds(0, 0, worldWidth, 540);
    this.cameras.main.setBackgroundColor(0x03050a);

    this.add
      .image(worldWidth / 2, 270, FLOOR_BACKGROUNDS[this.floor].key)
      .setDisplaySize(worldWidth, 540)
      .setDepth(-100);
    this.drawDioramaBackdrop(worldWidth);
    // The collider follows the floor already painted into each room. It stays
    // completely invisible so the visitor never appears to walk on a UI line.
    this.addPlatform(worldWidth / 2, 500, worldWidth, 80).setVisible(false);
    this.buildWorld();
    this.createPlayer();
    this.createInput();
    this.drawElevatorShortcutHint();

    // At 960px there is no horizontal dead space to reveal. Following only
    // adds a small living-camera ease when the player moves inside the frame.
    this.cameras.main.startFollow(this.player, true, 0.045, 0.045, 0, 30);
    this.playElevatorArrival();

    this.unsubscribeCommands = this.bridge.onCommand((command) =>
      this.receiveCommand(command),
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanUp, this);

    const floorLabel =
      PORTFOLIO_FLOORS.find((option) => option.floor === this.floor)?.label ??
      "Lobby";
    this.bridge.emit({ type: "floor-changed", floor: this.floor, label: floorLabel });
  }

  update(time: number): void {
    if (!this.active || this.uiBlocked || this.transitioning) return;

    this.updateNearbyZone();

    const left = Boolean(
      this.cursors.left?.isDown || this.keys.a.isDown || this.touchLeft,
    );
    const right = Boolean(
      this.cursors.right?.isDown || this.keys.d.isDown || this.touchRight,
    );
    const speed = 158;

    if (left === right) {
      this.player.setVelocityX(0);
      this.player.setTexture("jorge-idle");
    } else {
      const direction = left ? -1 : 1;
      this.player.setVelocityX(direction * speed);
      this.player.setFlipX(direction < 0);
      this.walkFrame = Math.floor(time / 145) % 2;
      this.player.setTexture(this.walkFrame ? "jorge-walk-2" : "jorge-walk-1");

      if (this.isGrounded() && time - this.lastStepAt > 330) {
        this.lastStepAt = time;
        if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "step" });
      }
    }

    const keyboardJump =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w) ||
      Phaser.Input.Keyboard.JustDown(this.keys.space);
    if ((keyboardJump || this.jumpQueued) && this.isGrounded()) {
      this.player.setVelocityY(-330);
      if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "jump" });
    }
    this.jumpQueued = false;

    if (Phaser.Input.Keyboard.JustDown(this.keys.q)) {
      this.requestElevator();
      return;
    }

    const keyboardInteract =
      Phaser.Input.Keyboard.JustDown(this.keys.e) ||
      Phaser.Input.Keyboard.JustDown(this.keys.enter);
    if (keyboardInteract) this.interact();

    if (this.player.y > 535) this.resetPlayer();
  }

  protected abstract buildWorld(): void;

  protected getWorldWidth(): number {
    return 960;
  }

  protected getPlayerSpawn(): Phaser.Types.Math.Vector2Like {
    return { x: 430, y: 420 };
  }

  protected addInteraction(
    id: string,
    x: number,
    width: number,
    label: string,
    action: InteractionAction,
    clickBounds?: { x: number; y: number; width: number; height: number },
    keyHint = "E / ENTER",
  ): void {
    const area = this.add.zone(x, 388, width, 166).setOrigin(0.5);
    const zone = { id, label, keyHint, area, action } satisfies InteractionZone;
    const pointerArea = clickBounds
      ? this.add.zone(
          clickBounds.x,
          clickBounds.y,
          clickBounds.width,
          clickBounds.height,
        )
      : area;
    pointerArea
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => this.interact(zone));
    this.zones.push(zone);
  }

  protected addPlatform(
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0x111a24,
  ): Phaser.GameObjects.Rectangle {
    const platform = this.add
      .rectangle(x, y, width, height, color)
      .setStrokeStyle(1, 0x263949)
      .setDepth(3);
    this.physics.add.existing(platform, true);
    this.platforms.push(platform);
    if (this.player) this.physics.add.collider(this.player, platform);
    return platform;
  }

  /**
   * Gives a real object in the background plate a restrained white pulse.
   * Points use absolute scene coordinates, so outlines can follow silhouettes
   * instead of adding unrelated icons on top of the art.
   */
  protected addInteractiveOutline(
    points: readonly Phaser.Types.Math.Vector2Like[],
    delay = 0,
  ): Phaser.GameObjects.Graphics {
    const outline = this.add.graphics().setDepth(22);
    outline.lineStyle(2, 0xffffff, 0.85);
    outline.strokePoints(
      points.map(
        (point) => new Phaser.Geom.Point(point.x ?? 0, point.y ?? 0),
      ),
      true,
    );
    outline
      .setAlpha(0.14)
      .setBlendMode(Phaser.BlendModes.ADD);

    if (!this.reducedMotion) {
      this.tweens.add({
        targets: outline,
        alpha: { from: 0.12, to: 0.82 },
        duration: 760,
        delay,
        hold: 180,
        yoyo: true,
        repeat: -1,
        repeatDelay: 620,
        ease: "Sine.InOut",
      });
    }

    return outline;
  }

  private drawDioramaBackdrop(width: number): void {
    const atmosphere = this.add.graphics().setDepth(-20);
    // Gentle letterbox and edge falloff make the generated plate read like a
    // diorama while leaving its detailed centre almost completely untouched.
    atmosphere.fillStyle(0x010205, 0.34);
    atmosphere.fillRect(0, 0, width, 58);
    atmosphere.fillRect(0, 506, width, 34);
    atmosphere.fillStyle(0x010205, 0.2);
    atmosphere.fillRect(0, 58, 24, 448);
    atmosphere.fillRect(width - 24, 58, 24, 448);
  }

  private drawElevatorShortcutHint(): void {
    const plate = this.add
      .rectangle(850, 82, 190, 30, 0x03070b, 0.84)
      .setStrokeStyle(1, 0xffffff, 0.25)
      .setScrollFactor(0)
      .setDepth(92);
    const keycap = this.add
      .rectangle(776, 82, 22, 20, 0x101820, 1)
      .setStrokeStyle(1, 0xffffff, 0.62)
      .setScrollFactor(0)
      .setDepth(93);
    this.add
      .text(776, 82, "Q", {
        fontFamily: FONT,
        fontSize: "11px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(94);
    this.add
      .text(798, 82, "LLAMAR ASCENSOR", {
        fontFamily: FONT,
        fontSize: "9px",
        color: "#dce7ec",
        letterSpacing: 1,
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(94);

    // Keep the variables intentional: the shapes form one fixed HUD affordance.
    plate.setData("control", "elevator-shortcut");
    keycap.setData("key", "Q");
  }

  private requestElevator(): void {
    if (!this.active || this.uiBlocked || this.transitioning) return;
    this.player.setVelocityX(0).setTexture("jorge-idle");
    this.setUiBlocked(true);
    if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "interact" });
    this.bridge.emit({
      type: "elevator-requested",
      currentFloor: this.floor,
      floors: PORTFOLIO_FLOORS,
    });
  }

  private createElevatorDoor(side: "left" | "right", closed: boolean): Phaser.GameObjects.Container {
    const panelWidth = 480;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x05090e, 0.99);
    graphics.fillRect(0, 0, panelWidth, 540);
    graphics.fillStyle(0x0d1821, 1);
    graphics.fillRect(side === "left" ? 452 : 0, 0, 28, 540);
    graphics.lineStyle(1, 0x38515d, 0.72);
    for (let y = 54; y < 540; y += 72) graphics.lineBetween(20, y, 460, y);
    graphics.lineStyle(2, this.accent, 0.54);
    graphics.lineBetween(side === "left" ? 477 : 3, 0, side === "left" ? 477 : 3, 540);
    graphics.lineStyle(1, 0xffffff, 0.1);
    graphics.strokeRect(18, 18, 444, 504);

    const closedX = side === "left" ? 0 : 480;
    const openX = side === "left" ? -480 : 960;
    return this.add
      .container(closed ? closedX : openX, 0, [graphics])
      .setScrollFactor(0)
      .setDepth(240);
  }

  private playElevatorArrival(): void {
    if (this.reducedMotion) return;
    this.transitioning = true;
    this.player.setVelocity(0, 0).setTexture("jorge-idle");
    const left = this.createElevatorDoor("left", true);
    const right = this.createElevatorDoor("right", true);
    const duration = 480;

    this.tweens.add({
      targets: left,
      x: -480,
      duration,
      delay: 110,
      ease: "Cubic.InOut",
    });
    this.tweens.add({
      targets: right,
      x: 960,
      duration,
      delay: 110,
      ease: "Cubic.InOut",
      onComplete: () => {
        left.destroy(true);
        right.destroy(true);
        this.transitioning = false;
      },
    });
  }

  private closeElevatorDoors(onComplete: () => void): void {
    if (this.reducedMotion) {
      onComplete();
      return;
    }

    const left = this.createElevatorDoor("left", false);
    const right = this.createElevatorDoor("right", false);
    const duration = 430;
    this.tweens.add({
      targets: left,
      x: 0,
      duration,
      ease: "Cubic.InOut",
    });
    this.tweens.add({
      targets: right,
      x: 480,
      duration,
      ease: "Cubic.InOut",
      onComplete,
    });
  }

  private createPlayer(): void {
    const spawn = this.getPlayerSpawn();
    this.player = this.physics.add.sprite(
      spawn.x ?? 430,
      spawn.y ?? 420,
      "jorge-idle",
    );
    this.player.setDepth(40).setScale(2).setCollideWorldBounds(true);
    this.player.setDragX(900).setMaxVelocity(190, 500);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(13, 31).setOffset(5.5, 6);

    for (const platform of this.platforms) this.physics.add.collider(this.player, platform);
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
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as GameKeys;
    this.input.keyboard.addCapture(CAPTURED_KEYS);
    this.input.keyboard.enableGlobalCapture();

  }

  private updateNearbyZone(): void {
    const next =
      this.zones.find((zone) => zone.area.getBounds().contains(this.player.x, this.player.y)) ??
      null;
    if (next === this.activeZone) return;

    this.activeZone = next;
    this.bridge.emit({
      type: "prompt-changed",
      prompt: next
        ? { id: next.id, label: next.label, keyHint: next.keyHint }
        : null,
    });
  }

  private interact(requestedZone: InteractionZone | null = this.activeZone): void {
    const zone = requestedZone;
    if (!zone || !this.active || this.uiBlocked || this.transitioning) return;

    if (zone.action.type === "floor") {
      if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "interact" });
      this.changeFloor(zone.action.floor);
      return;
    }

    this.setUiBlocked(true);
    if (!this.muted) this.bridge.emit({ type: "sound-requested", sound: "interact" });

    switch (zone.action.type) {
      case "dialogue": {
        const dialogue: DialogueSequence = DIALOGUES_BY_ID[zone.action.dialogueId];
        const after =
          zone.action.after ??
          (dialogue.completion
            ? dialogue.completion.type === "open-project"
              ? { type: "project" as const, projectId: dialogue.completion.projectId }
              : { type: "contact" as const }
            : undefined);
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
      case "project":
        this.bridge.emit({ type: "project-requested", projectId: zone.action.projectId });
        break;
      case "quick-view":
        this.bridge.emit({ type: "quick-view-requested" });
        break;
      case "chess":
        this.bridge.emit({ type: "chess-requested" });
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
    // A direct lobby door does not open React UI, so scene transitions must
    // use their own lock instead of relying on the modal pause state.
    this.setUiBlocked(false);
    this.transitioning = true;
    this.player.setVelocity(0, 0).setTexture("jorge-idle");
    this.bridge.emit({ type: "prompt-changed", prompt: null });
    const startFloor = () => {
      this.transitioning = false;
      this.scene.start(FLOOR_SCENES[floor]);
    };

    if (this.reducedMotion) {
      startFloor();
      return;
    }

    this.closeElevatorDoors(startFloor);
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
    this.player.setPosition(spawn.x ?? 430, spawn.y ?? 420);
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
