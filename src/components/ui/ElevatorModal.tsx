"use client";

import type { FloorOption, PortfolioFloor } from "@/src/game/types/contracts";
import { useLocale } from "@/src/i18n/LocaleContext";

import { ModalShell } from "./ModalShell";

interface ElevatorModalProps {
  currentFloor: PortfolioFloor;
  floors: readonly FloorOption[];
  onSelect: (floor: PortfolioFloor) => void;
  onClose: () => void;
}

export function ElevatorModal({
  currentFloor,
  floors,
  onSelect,
  onClose,
}: ElevatorModalProps) {
  const { text } = useLocale();

  return (
    <ModalShell
      title={text("Elevador", "Elevator")}
      eyebrow={text("Acceso directo · Q", "Direct access · Q")}
      variant="elevator"
      onClose={onClose}
    >
      <div className="elevator-console">
        <div className="elevator-arrival" aria-hidden="true">
          <span className="elevator-arrival__door elevator-arrival__door--left" />
          <span className="elevator-arrival__door elevator-arrival__door--right" />
          <span className="elevator-arrival__indicator">
            {String(currentFloor).padStart(2, "0")}
          </span>
          <span className="elevator-arrival__light" />
        </div>

        <div className="elevator-console__destinations">
          <p className="eyebrow">
            {text("¿A dónde quieres ir?", "Where would you like to go?")}
          </p>
          <p className="elevator-console__copy">
            {text(
              "Elige un piso o abre Contacto directamente.",
              "Choose a floor or open Contact directly.",
            )}
          </p>
          <ul className="floor-list elevator-floor-list">
          {floors.map((floor) => (
            <li key={floor.floor}>
              <button
                className="floor-button"
                type="button"
                aria-current={floor.floor === currentFloor}
                onClick={() => onSelect(floor.floor)}
              >
                <span className="floor-number">{floor.floor}</span>
                <span className="floor-name">
                  {floor.label}
                  <span className="sr-only">
                    {floor.floor === currentFloor
                      ? text(" (piso actual)", " (current floor)")
                      : ""}
                  </span>
                </span>
                <span className="elevator-floor-state" aria-hidden="true">
                  {floor.floor === currentFloor
                    ? text("AHORA", "NOW")
                    : floor.floor === -4
                      ? text("ABRIR →", "OPEN →")
                      : text("IR →", "GO →")}
                </span>
              </button>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </ModalShell>
  );
}
