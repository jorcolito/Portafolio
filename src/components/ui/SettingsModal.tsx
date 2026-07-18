"use client";

import { ModalShell } from "./ModalShell";

interface SettingsModalProps {
  muted: boolean;
  reducedMotion: boolean;
  onMutedChange: (muted: boolean) => void;
  onReducedMotionChange: (reduced: boolean) => void;
  onClose: () => void;
}

export function SettingsModal({
  muted,
  reducedMotion,
  onMutedChange,
  onReducedMotionChange,
  onClose,
}: SettingsModalProps) {
  return (
    <ModalShell title="Ajustes" eyebrow="Sistema" onClose={onClose}>
      <div className="settings-panel">
        <div className="settings-row">
          <div className="settings-copy">
            <strong>Sonido</strong>
            <span>
              El MVP inicia silenciado. La infraestructura queda preparada para
              efectos originales sin reproducción automática.
            </span>
          </div>
          <button
            className="toggle"
            type="button"
            role="switch"
            aria-checked={!muted}
            aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
            onClick={() => onMutedChange(!muted)}
          >
            <span className="sr-only">{muted ? "Desactivado" : "Activado"}</span>
          </button>
        </div>
        <div className="settings-row">
          <div className="settings-copy">
            <strong>Reducir animaciones</strong>
            <span>
              Simplifica transiciones, desactiva el efecto de escritura y
              respeta la preferencia del sistema.
            </span>
          </div>
          <button
            className="toggle"
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            aria-label="Reducir animaciones"
            onClick={() => onReducedMotionChange(!reducedMotion)}
          >
            <span className="sr-only">
              {reducedMotion ? "Activado" : "Desactivado"}
            </span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
