"use client";

import type { FloorOption, PortfolioFloor } from "@/src/game/types/contracts";

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
  return (
    <ModalShell title="Ascensor" eyebrow="Selector de piso" onClose={onClose}>
      <div className="settings-panel">
        <p className="status-copy">
          Selecciona un destino. El ascensor conecta todas las zonas del
          portafolio y mantiene el recorrido completamente accesible.
        </p>
        <ul className="floor-list" style={{ marginTop: "1rem" }}>
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
                    {floor.floor === currentFloor ? " (piso actual)" : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ModalShell>
  );
}
