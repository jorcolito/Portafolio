"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from "react";

import type {
  GameToReactEvent,
  PortfolioFloor,
  PortfolioGameController,
  ReactToGameCommand,
} from "../../game/types/contracts";
import type { Locale } from "../../i18n/LocaleContext";

export interface GameCanvasHandle {
  /** Generic typed escape hatch for future controls. */
  dispatch(command: ReactToGameCommand): void;
  /** Start/stop a touch or pointer movement button. Always release on pointer-up. */
  move(direction: "left" | "right", pressed: boolean): void;
  jump(): void;
  interact(): void;
  selectFloor(floor: PortfolioFloor): void;
  resetPlayer(): void;
  focus(): void;
}

export interface GameCanvasProps {
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  initialFloor?: PortfolioFloor;
  locale?: Locale;
  /** False suspends movement/physics while keeping the already-created canvas. */
  active?: boolean;
  /** True whenever React is showing a dialogue, project, elevator or other modal. */
  modalOpen?: boolean;
  reducedMotion?: boolean;
  muted?: boolean;
  onEvent?: (event: GameToReactEvent) => void;
  onLoadError?: () => void;
}

/**
 * Client-only Phaser host. It never recreates the game for UI prop changes:
 * props become commands and events flow back through onEvent.
 */
export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  function GameCanvas(
    {
      className,
      style,
      ariaLabel = "Portafolio interactivo de Jorge Colamarco",
      initialFloor = 0,
      locale = "es",
      active = true,
      modalOpen = false,
      reducedMotion = false,
      muted = true,
      onEvent,
      onLoadError,
    },
    forwardedRef,
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<PortfolioGameController | null>(null);
    const eventHandlerRef = useRef(onEvent);
    const loadErrorHandlerRef = useRef(onLoadError);
    const initialOptionsRef = useRef({
      initialFloor,
      locale,
      reducedMotion,
      muted,
    });
    const runtimePropsRef = useRef({ active, modalOpen, reducedMotion, muted });

    eventHandlerRef.current = onEvent;
    loadErrorHandlerRef.current = onLoadError;
    runtimePropsRef.current = { active, modalOpen, reducedMotion, muted };
    initialOptionsRef.current = { initialFloor, locale, reducedMotion, muted };

    useImperativeHandle(
      forwardedRef,
      () => ({
        dispatch(command) {
          controllerRef.current?.send(command);
        },
        move(direction, pressed) {
          controllerRef.current?.send({ type: "move", direction, pressed });
        },
        jump() {
          controllerRef.current?.send({ type: "jump" });
        },
        interact() {
          controllerRef.current?.send({ type: "interact" });
        },
        selectFloor(floor) {
          controllerRef.current?.send({ type: "select-floor", floor });
        },
        resetPlayer() {
          controllerRef.current?.send({ type: "reset-player" });
        },
        focus() {
          controllerRef.current?.focus();
        },
      }),
      [],
    );

    useEffect(() => {
      const parent = hostRef.current;
      if (!parent) return;

      let cancelled = false;
      let instance: PortfolioGameController | null = null;
      let removeKeyboardGuard: (() => void) | undefined;
      let focusFrame: number | undefined;
      const initial = initialOptionsRef.current;

      void import("../../game")
        .then(({ createPortfolioGame }) => {
          if (cancelled) return;
          instance = createPortfolioGame({
          parent,
          ...initial,
          onEvent: (event) => {
            eventHandlerRef.current?.(event);
            if (event.type === "floor-changed") {
              queueMicrotask(() => {
                const game = controllerRef.current;
                if (!game) return;
                const current = runtimePropsRef.current;
                game.send({ type: "set-active", active: current.active });
                game.send({ type: "set-ui-blocked", blocked: current.modalOpen });
                game.send({
                  type: "set-reduced-motion",
                  reduced: current.reducedMotion,
                });
                game.send({ type: "set-muted", muted: current.muted });
              });
            }
          },
          });
          controllerRef.current = instance;
          const current = runtimePropsRef.current;
          instance.send({ type: "set-active", active: current.active });
          instance.send({ type: "set-ui-blocked", blocked: current.modalOpen });
          instance.send({
            type: "set-reduced-motion",
            reduced: current.reducedMotion,
          });
          instance.send({ type: "set-muted", muted: current.muted });

        // Phaser owns the key handling. This late listener is only a scroll guard:
        // it runs after Phaser's window listener and only while focus is in the game.
        const gameplayCodes = new Set([
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "Space",
          "KeyE",
          "KeyQ",
          "Enter",
        ]);
        const preventGameplayScroll = (event: KeyboardEvent) => {
          const runtime = runtimePropsRef.current;
          if (!runtime.active || runtime.modalOpen || !gameplayCodes.has(event.code)) {
            return;
          }
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

          const target = event.target;
          if (
            target instanceof HTMLElement &&
            (target.isContentEditable ||
              ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
                target.tagName,
              ))
          ) {
            return;
          }
          if (!parent.contains(document.activeElement)) return;
          event.preventDefault();
        };
          window.addEventListener("keydown", preventGameplayScroll);
          removeKeyboardGuard = () =>
            window.removeEventListener("keydown", preventGameplayScroll);

          focusFrame = window.requestAnimationFrame(() => {
            const runtime = runtimePropsRef.current;
            if (!cancelled && runtime.active && !runtime.modalOpen) instance?.focus();
          });
        })
        .catch(() => {
          if (!cancelled) loadErrorHandlerRef.current?.();
        });

      return () => {
        cancelled = true;
        removeKeyboardGuard?.();
        if (focusFrame !== undefined) window.cancelAnimationFrame(focusFrame);
        if (controllerRef.current === instance) controllerRef.current = null;
        instance?.destroy();
      };
    }, [locale]);

    useEffect(() => {
      controllerRef.current?.send({ type: "set-active", active });
    }, [active]);

    useEffect(() => {
      controllerRef.current?.send({ type: "set-ui-blocked", blocked: modalOpen });
    }, [modalOpen]);

    useEffect(() => {
      controllerRef.current?.send({ type: "set-reduced-motion", reduced: reducedMotion });
    }, [reducedMotion]);

    useEffect(() => {
      controllerRef.current?.send({ type: "set-muted", muted });
    }, [muted]);

    return (
      <div
        ref={hostRef}
        className={className}
        role="group"
        aria-label={ariaLabel}
        aria-disabled={!active || modalOpen}
        tabIndex={active && !modalOpen ? 0 : -1}
        data-game-active={active ? "true" : "false"}
        onPointerDown={() => controllerRef.current?.focus()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          background: "#05080e",
          imageRendering: "pixelated",
          ...style,
        }}
      />
    );
  },
);

GameCanvas.displayName = "GameCanvas";

export type {
  GameToReactEvent,
  PortfolioFloor,
  ReactToGameCommand,
} from "../../game/types/contracts";
