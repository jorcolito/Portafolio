"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ReactToGameCommand } from "@/src/game/types/contracts";
import { useLocale } from "@/src/i18n/LocaleContext";

interface TouchControlsProps {
  disabled: boolean;
  canInteract: boolean;
  floorLabel: string;
  promptLabel?: string;
  ready: boolean;
  send: (command: ReactToGameCommand) => void;
  onMenu: () => void;
}

function holdCommand(
  direction: "left" | "right",
  pressed: boolean,
): ReactToGameCommand {
  return { type: "move", direction, pressed };
}

export function TouchControls({
  disabled,
  canInteract,
  floorLabel,
  promptLabel,
  ready,
  send,
  onMenu,
}: TouchControlsProps) {
  const { text } = useLocale();
  const [interactionPending, setInteractionPending] = useState(false);
  const feedbackTimerRef = useRef<number | null>(null);
  const controlsDisabled = disabled || !ready;

  const release = useCallback(
    (direction: "left" | "right") => send(holdCommand(direction, false)),
    [send],
  );

  useEffect(() => {
    if (!controlsDisabled) return;
    release("left");
    release("right");
  }, [controlsDisabled, release]);

  useEffect(
    () => () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
      release("left");
      release("right");
    },
    [release],
  );

  useEffect(() => {
    const releaseMovement = () => {
      release("left");
      release("right");
    };
    const releaseWhenHidden = () => {
      if (document.visibilityState === "hidden") releaseMovement();
    };

    window.addEventListener("blur", releaseMovement);
    document.addEventListener("visibilitychange", releaseWhenHidden);
    return () => {
      window.removeEventListener("blur", releaseMovement);
      document.removeEventListener("visibilitychange", releaseWhenHidden);
    };
  }, [release]);

  const interact = () => {
    if (!canInteract || disabled) return;
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setInteractionPending(true);
    send({ type: "interact" });
    feedbackTimerRef.current = window.setTimeout(() => {
      feedbackTimerRef.current = null;
      setInteractionPending(false);
    }, 700);
  };

  const statusMode = !ready
    ? "loading"
    : interactionPending
      ? "working"
      : canInteract
        ? "action"
        : "explore";
  const statusKicker = !ready
    ? text("Preparando escenario", "Preparing scene")
    : interactionPending
      ? text("Procesando acción", "Processing action")
      : canInteract
        ? text("Interacción disponible", "Interaction available")
        : text(`Piso activo · ${floorLabel}`, `Active floor · ${floorLabel}`);
  const statusLabel = !ready
    ? text("Cargando el portafolio…", "Loading portfolio…")
    : interactionPending
      ? text("Abriendo contenido…", "Opening content…")
      : promptLabel ??
        text(
          "Explora y acércate a un objeto resaltado",
          "Explore and approach a highlighted object",
        );

  return (
    <div
      className="touch-controls"
      data-status={statusMode}
      aria-label={text("Controles táctiles", "Touch controls")}
    >
      <div
        className="touch-status"
        role="status"
        aria-live="polite"
        aria-busy={statusMode === "loading" || statusMode === "working"}
      >
        <span className="touch-status__signal" aria-hidden="true" />
        <span className="touch-status__copy">
          <small>{statusKicker}</small>
          <strong>{statusLabel}</strong>
        </span>
        {canInteract && !interactionPending ? (
          <span className="touch-status__hint" aria-hidden="true">
            {text("Usa E", "Press E")}
          </span>
        ) : null}
      </div>

      <div className="touch-controls__pad">
        <div
          className="touch-cluster touch-cluster--move"
          role="group"
          aria-label={text("Movimiento", "Movement")}
        >
        {(["left", "right"] as const).map((direction) => (
          <button
            className="touch-button touch-button--direction"
            type="button"
            key={direction}
            aria-label={
              direction === "left"
                ? text("Mover a la izquierda", "Move left")
                : text("Mover a la derecha", "Move right")
            }
            disabled={controlsDisabled}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              send(holdCommand(direction, true));
            }}
            onPointerUp={() => release(direction)}
            onPointerCancel={() => release(direction)}
            onPointerLeave={() => release(direction)}
            onLostPointerCapture={() => release(direction)}
          >
            <span className="touch-button__glyph" aria-hidden="true">
              {direction === "left" ? "←" : "→"}
            </span>
            <span className="touch-button__label">
              {direction === "left"
                ? text("Izquierda", "Left")
                : text("Derecha", "Right")}
            </span>
          </button>
        ))}
        </div>

        <div
          className="touch-cluster touch-cluster--actions"
          role="group"
          aria-label={text("Acciones", "Actions")}
        >
        <button
          className="touch-button touch-button--elevator"
          type="button"
          aria-label={text("Abrir elevador", "Open elevator")}
          disabled={controlsDisabled}
          onClick={onMenu}
        >
          <span className="touch-button__glyph" aria-hidden="true">Q</span>
          <span className="touch-button__label">
            {text("Elevador", "Elevator")}
          </span>
        </button>
        <button
          className="touch-button touch-button--interact"
          type="button"
          aria-label={
            promptLabel
              ? text(
                  `Interactuar: ${promptLabel}`,
                  `Interact: ${promptLabel}`,
                )
              : text("Interactuar", "Interact")
          }
          disabled={controlsDisabled || !canInteract}
          data-ready={canInteract ? "true" : "false"}
          onClick={interact}
        >
          <span className="touch-button__glyph" aria-hidden="true">E</span>
          <span className="touch-button__label">
            {interactionPending
              ? text("Abriendo", "Opening")
              : text("Usar", "Use")}
          </span>
        </button>
        <button
          className="touch-button touch-button--jump"
          type="button"
          aria-label={text("Saltar", "Jump")}
          disabled={controlsDisabled}
          onClick={() => send({ type: "jump" })}
        >
          <span className="touch-button__glyph" aria-hidden="true">↑</span>
          <span className="touch-button__label">{text("Saltar", "Jump")}</span>
        </button>
        </div>
      </div>
    </div>
  );
}
