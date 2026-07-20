"use client";

import { useEffect } from "react";

import { useLocale } from "@/src/i18n/LocaleContext";

interface IntroSequenceProps {
  reducedMotion: boolean;
  onComplete: () => void;
}

export function IntroSequence({
  reducedMotion,
  onComplete,
}: IntroSequenceProps) {
  const { text } = useLocale();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reducedMotion ? 120 : 1100);
    return () => window.clearTimeout(timer);
  }, [onComplete, reducedMotion]);

  return (
    <main
      className="intro-screen"
      aria-label={text("Cargando portafolio", "Loading portfolio")}
    >
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-console">
        <div className="intro-elevator" aria-hidden="true">
          <span className="intro-door intro-door--left" />
          <span className="intro-door intro-door--right" />
        </div>
        <p className="intro-label" aria-live="polite">
          {text("Preparando la experiencia…", "Preparing the experience…")}
        </p>
        <div
          className="intro-progress"
          role="progressbar"
          aria-label={text("Progreso de carga", "Loading progress")}
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
          {text("Omitir", "Skip")}
        </button>
      </div>
    </main>
  );
}
