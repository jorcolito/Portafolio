"use client";

import { ModalShell } from "./ModalShell";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "@/src/i18n/LocaleContext";

interface SettingsModalProps {
  reducedMotion: boolean;
  onReducedMotionChange: (reduced: boolean) => void;
  onClose: () => void;
}

export function SettingsModal({
  reducedMotion,
  onReducedMotionChange,
  onClose,
}: SettingsModalProps) {
  const { text } = useLocale();

  return (
    <ModalShell
      title={text("Ajustes", "Settings")}
      eyebrow={text("Preferencias", "Preferences")}
      onClose={onClose}
    >
      <div className="settings-panel">
        <div className="settings-row">
          <div className="settings-copy">
            <strong>{text("Idioma", "Language")}</strong>
            <span>
              {text(
                "Cambia todo el portafolio entre español e inglés.",
                "Switch the entire portfolio between English and Spanish.",
              )}
            </span>
          </div>
          <LanguageSwitcher variant="settings" />
        </div>
        <div className="settings-row">
          <div className="settings-copy">
            <strong>{text("Reducir animaciones", "Reduce motion")}</strong>
            <span>
              {text(
                "Simplifica transiciones, desactiva el efecto de escritura y respeta la preferencia del sistema.",
                "Simplifies transitions, disables the typing effect and respects your system preference.",
              )}
            </span>
          </div>
          <button
            className="toggle"
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            aria-label={text("Reducir animaciones", "Reduce motion")}
            onClick={() => onReducedMotionChange(!reducedMotion)}
          >
            <span className="sr-only">
              {reducedMotion
                ? text("Activado", "On")
                : text("Desactivado", "Off")}
            </span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
