import * as Phaser from "phaser";

import { GameBridge } from "../events/GameBridge";
import { InfoFloorScene } from "../scenes/InfoFloorScene";
import { LobbyScene } from "../scenes/LobbyScene";
import { ProjectsScene } from "../scenes/ProjectsScene";
import type {
  CreatePortfolioGameOptions,
  PortfolioFloor,
  PortfolioGameController,
} from "../types/contracts";
import type { Locale } from "../../i18n/LocaleContext";

type PlayableFloor = Exclude<PortfolioFloor, -4>;

function createScenes(
  bridge: GameBridge,
  initialFloor: PlayableFloor,
  locale: Locale,
): Phaser.Scene[] {
  const scenes: Array<{ floor: PlayableFloor; scene: Phaser.Scene }> = [
    { floor: 0, scene: new LobbyScene(bridge, locale) },
    { floor: -1, scene: new ProjectsScene(bridge, locale) },
    {
      floor: -2,
      scene: new InfoFloorScene(bridge, locale, {
        key: "EducationScene",
        floor: -2,
        accent: 0x8b9aff,
      }),
    },
    {
      floor: -3,
      scene: new InfoFloorScene(bridge, locale, {
        key: "AboutScene",
        floor: -3,
        accent: 0xb96cff,
      }),
    },
  ];

  // Phaser auto-starts the first scene in this array.
  return [
    ...scenes.filter((entry) => entry.floor === initialFloor),
    ...scenes.filter((entry) => entry.floor !== initialFloor),
  ].map((entry) => entry.scene);
}

export function createPortfolioGame(
  options: CreatePortfolioGameOptions,
): PortfolioGameController {
  const requestedFloor = options.initialFloor ?? 0;
  const initialFloor: PlayableFloor = requestedFloor === -4 ? 0 : requestedFloor;
  const locale = options.locale ?? "es";
  const bridge = new GameBridge((event) => options.onEvent?.(event));

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: options.parent,
    width: 960,
    height: 540,
    backgroundColor: "#05080e",
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    banner: false,
    audio: { noAudio: true },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 900 },
        debug: false,
      },
    },
    input: {
      keyboard: true,
      mouse: { preventDefaultWheel: false },
      touch: true,
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 540,
    },
    scene: createScenes(bridge, initialFloor, locale),
    callbacks: {
      postBoot: (bootedGame) => {
        bootedGame.canvas.style.imageRendering = "pixelated";
        bootedGame.canvas.style.display = "block";
        bootedGame.canvas.tabIndex = -1;
        bootedGame.canvas.setAttribute("aria-hidden", "true");
        bridge.send({
          type: "set-reduced-motion",
          reduced: Boolean(options.reducedMotion),
        });
        bridge.send({ type: "set-muted", muted: options.muted ?? true });
      },
    },
  });

  let destroyed = false;
  return {
    send(command) {
      if (!destroyed) bridge.send(command);
    },
    focus() {
      if (!destroyed) game.canvas.focus({ preventScroll: true });
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      game.destroy(true);
      bridge.destroy();
    },
  };
}
