"use client";

import type { ReactToGameCommand } from "@/src/game/types/contracts";

interface TouchControlsProps {
  disabled: boolean;
  send: (command: ReactToGameCommand) => void;
  onMenu: () => void;
}

function holdCommand(
  direction: "left" | "right",
  pressed: boolean,
): ReactToGameCommand {
  return { type: "move", direction, pressed };
}

export function TouchControls({ disabled, send, onMenu }: TouchControlsProps) {
  const release = (direction: "left" | "right") =>
    send(holdCommand(direction, false));

  return (
    <div className="touch-controls" aria-label="Controles táctiles">
      <div className="touch-cluster">
        {(["left", "right"] as const).map((direction) => (
          <button
            className="touch-button"
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
          >
            {direction === "left" ? "←" : "→"}
          </button>
        ))}
      </div>
      <div className="touch-cluster">
        <button
          className="touch-button"
          type="button"
          aria-label="Abrir elevador"
          onClick={onMenu}
        >
          Q
        </button>
        <button
          className="touch-button touch-button--interact"
          type="button"
          aria-label="Interactuar"
          disabled={disabled}
          onClick={() => send({ type: "interact" })}
        >
          E
        </button>
        <button
          className="touch-button touch-button--jump"
          type="button"
          aria-label="Saltar"
          disabled={disabled}
          onClick={() => send({ type: "jump" })}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
