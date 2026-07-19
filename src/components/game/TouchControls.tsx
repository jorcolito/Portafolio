"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ReactToGameCommand } from "@/src/game/types/contracts";

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
  const [interactionPending, setInteractionPending] = useState(false);
  const feedbackTimerRef = useRef<number | null>(null);

  const release = useCallback(
    (direction: "left" | "right") => send(holdCommand(direction, false)),
    [send],
  );

  useEffect(() => {
    if (!disabled) return;
    release("left");
    release("right");
  }, [disabled, release]);

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
    ? "Preparando escenario"
    : interactionPending
      ? "Procesando acción"
      : canInteract
        ? "Interactuable detectado"
        : `Piso activo · ${floorLabel}`;
  const statusLabel = !ready
    ? "Cargando el laboratorio…"
    : interactionPending
      ? "Abriendo contenido…"
      : promptLabel ?? "Explora y acércate a un objeto resaltado";

  return (
    <div
      className="touch-controls"
      data-status={statusMode}
      aria-label="Controles táctiles"
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
            Usa E
          </span>
        ) : null}
      </div>

      <div className="touch-controls__pad">
        <div className="touch-cluster touch-cluster--move" role="group" aria-label="Movimiento">
        {(["left", "right"] as const).map((direction) => (
          <button
            className="touch-button touch-button--direction"
            type="button"
            key={direction}
            aria-label={direction === "left" ? "Mover a la izquierda" : "Mover a la derecha"}
            disabled={disabled}
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
              {direction === "left" ? "Izquierda" : "Derecha"}
            </span>
          </button>
        ))}
        </div>

        <div className="touch-cluster touch-cluster--actions" role="group" aria-label="Acciones">
        <button
          className="touch-button touch-button--elevator"
          type="button"
          aria-label="Abrir elevador"
          onClick={onMenu}
        >
          <span className="touch-button__glyph" aria-hidden="true">Q</span>
          <span className="touch-button__label">Elevador</span>
        </button>
        <button
          className="touch-button touch-button--interact"
          type="button"
          aria-label={promptLabel ? `Interactuar: ${promptLabel}` : "Interactuar"}
          disabled={disabled || !canInteract}
          data-ready={canInteract ? "true" : "false"}
          onClick={interact}
        >
          <span className="touch-button__glyph" aria-hidden="true">E</span>
          <span className="touch-button__label">
            {interactionPending ? "Abriendo" : "Usar"}
          </span>
        </button>
        <button
          className="touch-button touch-button--jump"
          type="button"
          aria-label="Saltar"
          disabled={disabled}
          onClick={() => send({ type: "jump" })}
        >
          <span className="touch-button__glyph" aria-hidden="true">↑</span>
          <span className="touch-button__label">Saltar</span>
        </button>
        </div>
      </div>
    </div>
  );
}
