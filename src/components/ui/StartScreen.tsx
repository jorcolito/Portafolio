"use client";

import { useEffect } from "react";

import { useLocale } from "@/src/i18n/LocaleContext";

import { LanguageSwitcher } from "./LanguageSwitcher";

const INTERACTIVE_TARGETS = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "summary",
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="slider"]',
].join(",");

function belongsToInteractiveControl(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_TARGETS));
}

function hasActiveModal() {
  return Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
}

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
  const { text } = useLocale();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        belongsToInteractiveControl(event.target) ||
        hasActiveModal()
      ) {
        return;
      }

      event.preventDefault();
      onStart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onStart]);

  return (
    <main className="boot-screen" aria-labelledby="boot-title">
      <div className="boot-card">
        <p className="eyebrow">
          {text("Portafolio interactivo", "Interactive portfolio")}
        </p>
        <h1 className="boot-brand" id="boot-title">
          Jorge Colamarco
        </h1>
        <p className="boot-subtitle">
          {text(
            "Software, producto y criterio en movimiento",
            "Software, product thinking and craft in motion",
          )}
        </p>
        <LanguageSwitcher />
        <button className="boot-prompt" type="button" onClick={onStart}>
          {text("Entrar al portafolio", "Enter portfolio")}
        </button>
        <div className="boot-actions">
          <button className="pixel-button pixel-button--ghost" type="button" onClick={onSkipIntro}>
            {text("Omitir introducción", "Skip introduction")}
          </button>
          <button className="pixel-button pixel-button--ghost" type="button" onClick={onQuickView}>
            {text("Vista rápida", "Quick view")}
          </button>
          <button className="pixel-button pixel-button--ghost" type="button" onClick={onSettings}>
            {text("Preferencias", "Preferences")}
          </button>
        </div>
        <p className="boot-status">
          {text(
            "Guayaquil, Ecuador · Audio desactivado",
            "Guayaquil, Ecuador · Audio off",
          )}
        </p>
      </div>
    </main>
  );
}
