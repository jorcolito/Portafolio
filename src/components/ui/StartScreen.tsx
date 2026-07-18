"use client";

import { useEffect } from "react";

interface StartScreenProps {
  onStart: () => void;
  onSkipIntro: () => void;
  onQuickView: () => void;
  onSettings: () => void;
}

export function StartScreen({
  onStart,
  onSkipIntro,
  onQuickView,
  onSettings,
}: StartScreenProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onStart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onStart]);

  return (
    <main className="boot-screen" aria-labelledby="boot-title">
      <div className="boot-card">
        <p className="eyebrow">Sistema de portafolio interactivo</p>
        <h1 className="boot-brand" id="boot-title">
          JORGE.EXE
        </h1>
        <p className="boot-subtitle">A Developer&apos;s Tale</p>
        <button className="boot-prompt" type="button" onClick={onStart}>
          Press Enter
        </button>
        <div className="boot-actions">
          <button className="pixel-button pixel-button--ghost" type="button" onClick={onSkipIntro}>
            Omitir introducción
          </button>
          <button className="pixel-button pixel-button--ghost" type="button" onClick={onQuickView}>
            Quick View
          </button>
          <button className="pixel-button pixel-button--ghost" type="button" onClick={onSettings}>
            Accesibilidad
          </button>
        </div>
        <p className="boot-status">Build 0.1 · Guayaquil, Ecuador · Audio desactivado</p>
      </div>
    </main>
  );
}
