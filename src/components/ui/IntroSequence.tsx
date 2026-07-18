"use client";

import { useEffect } from "react";

interface IntroSequenceProps {
  reducedMotion: boolean;
  onComplete: () => void;
}

export function IntroSequence({
  reducedMotion,
  onComplete,
}: IntroSequenceProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, reducedMotion ? 180 : 2550);
    return () => window.clearTimeout(timer);
  }, [onComplete, reducedMotion]);

  return (
    <main className="intro-screen" aria-label="Cargando JORGE LABS">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-console">
        <div className="intro-elevator" aria-hidden="true">
          <span className="intro-door intro-door--left" />
          <span className="intro-door intro-door--right" />
        </div>
        <p className="intro-label" aria-live="polite">
          Cargando espacio de trabajo…
        </p>
        <div
          className="intro-progress"
          role="progressbar"
          aria-label="Progreso de carga"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span />
        </div>
        <button
          className="pixel-button pixel-button--ghost intro-skip"
          type="button"
          onClick={onComplete}
        >
          Omitir
        </button>
      </div>
    </main>
  );
}
