"use client";

import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  DialogueFollowUp,
  GameDialogue,
} from "@/src/game/types/contracts";
import { useLocale } from "@/src/i18n/LocaleContext";

interface DialogueBoxProps {
  dialogue: GameDialogue;
  followUp?: DialogueFollowUp;
  reducedMotion: boolean;
  onFinish: (followUp?: DialogueFollowUp) => void;
}

type DialoguePhase = "typing" | "ready" | "closing";
type DialogueCompletion = "follow-up" | "dismiss" | null;

interface DialogueState {
  lineIndex: number;
  visibleCharacters: number;
  phase: DialoguePhase;
  completion: DialogueCompletion;
  closeRevision: number;
}

const ADVANCE_CODES = new Set(["Enter", "KeyE", "Space"]);
const INTERACTIVE_TARGETS =
  "button, a, input, textarea, select, [role='button'], [contenteditable='true']";

export function DialogueBox({
  dialogue,
  followUp,
  reducedMotion,
  onFinish,
}: DialogueBoxProps) {
  const { text } = useLocale();
  const titleId = useId();
  const descriptionId = useId();
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const pressedKeysRef = useRef(new Set<string>());
  const finishedRef = useRef(false);

  const revealsImmediately = useCallback(
    (lineIndex: number) =>
      reducedMotion ||
      dialogue.speed === 0 ||
      Boolean(dialogue.lines[lineIndex]?.revealImmediately),
    [dialogue.lines, dialogue.speed, reducedMotion],
  );

  const [state, setState] = useState<DialogueState>(() => {
    const firstLineLength = dialogue.lines[0]?.text.length ?? 0;
    const instant =
      reducedMotion ||
      dialogue.speed === 0 ||
      Boolean(dialogue.lines[0]?.revealImmediately);

    return {
      lineIndex: 0,
      visibleCharacters: instant ? firstLineLength : 0,
      phase: instant ? "ready" : "typing",
      completion: null,
      closeRevision: 0,
    };
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const line = dialogue.lines[state.lineIndex];
  const fullText = line?.text ?? "";
  const isLastLine = state.lineIndex === dialogue.lines.length - 1;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nextButtonRef.current?.focus();

    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      nextButtonRef.current?.focus();
    };
    document.addEventListener("keydown", keepFocusInside);

    return () => {
      document.removeEventListener("keydown", keepFocusInside);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    if (!line || state.phase !== "typing") return;

    const charactersPerSecond =
      line.charactersPerSecond ?? dialogue.defaults.charactersPerSecond;
    const delay = Math.max(
      12,
      dialogue.speed ?? Math.round(1000 / charactersPerSecond),
    );
    const timer = window.setTimeout(() => {
      setState((current) => {
        if (
          current.phase !== "typing" ||
          current.lineIndex !== state.lineIndex
        ) {
          return current;
        }

        const nextVisible = Math.min(
          fullText.length,
          current.visibleCharacters + 1,
        );

        return {
          ...current,
          visibleCharacters: nextVisible,
          phase: nextVisible >= fullText.length ? "ready" : "typing",
        };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    dialogue.defaults.charactersPerSecond,
    dialogue.speed,
    fullText.length,
    line,
    state.lineIndex,
    state.phase,
    state.visibleCharacters,
  ]);

  const advance = useCallback(() => {
    setState((current) => {
      if (current.phase === "closing") {
        return { ...current, closeRevision: current.closeRevision + 1 };
      }

      const currentText = dialogue.lines[current.lineIndex]?.text ?? "";
      if (current.phase === "typing") {
        return {
          ...current,
          visibleCharacters: currentText.length,
          phase: "ready",
        };
      }

      if (current.lineIndex >= dialogue.lines.length - 1) {
        return {
          ...current,
          phase: "closing",
          completion: "follow-up",
          closeRevision: current.closeRevision + 1,
        };
      }

      const nextIndex = current.lineIndex + 1;
      const nextLineLength = dialogue.lines[nextIndex]?.text.length ?? 0;
      const instant = revealsImmediately(nextIndex);

      return {
        ...current,
        lineIndex: nextIndex,
        visibleCharacters: instant ? nextLineLength : 0,
        phase: instant ? "ready" : "typing",
      };
    });
  }, [dialogue.lines, revealsImmediately]);

  const dismiss = useCallback(() => {
    setState((current) => ({
      ...current,
      phase: "closing",
      completion: "dismiss",
      closeRevision: current.closeRevision + 1,
    }));
  }, []);

  const absorbClosingInput = useCallback(() => {
    setState((current) =>
      current.phase === "closing"
        ? { ...current, closeRevision: current.closeRevision + 1 }
        : current,
    );
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isAdvanceKey = ADVANCE_CODES.has(event.code);
      if (!isAdvanceKey && event.code !== "Escape") return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      // Capture before Phaser's global listener so a dialogue keystroke can
      // never remain queued and reopen the same interaction after closing.
      event.preventDefault();
      event.stopImmediatePropagation();

      if (stateRef.current.phase === "closing") {
        if (!event.repeat) pressedKeysRef.current.add(event.code);
        absorbClosingInput();
        return;
      }

      if (event.repeat || pressedKeysRef.current.has(event.code)) return;
      pressedKeysRef.current.add(event.code);

      if (event.code === "Escape") dismiss();
      else advance();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      pressedKeysRef.current.delete(event.code);
      if (stateRef.current.phase === "closing") absorbClosingInput();
    };

    const clearPressedKeys = () => pressedKeysRef.current.clear();

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearPressedKeys);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearPressedKeys);
    };
  }, [absorbClosingInput, advance, dismiss]);

  useEffect(() => {
    if (state.phase !== "closing") return;
    if (pressedKeysRef.current.size > 0) return;

    // The quiet window absorbs an Enter-spam burst before Phaser is unblocked.
    const timer = window.setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinish(state.completion === "follow-up" ? followUp : undefined);
    }, 100);

    return () => window.clearTimeout(timer);
  }, [
    followUp,
    onFinish,
    state.closeRevision,
    state.completion,
    state.phase,
  ]);

  const progress = useMemo(
    () =>
      text(
        `${state.lineIndex + 1} de ${dialogue.lines.length}`,
        `${state.lineIndex + 1} of ${dialogue.lines.length}`,
      ),
    [dialogue.lines.length, state.lineIndex, text],
  );

  const handlePanelClick = (event: ReactMouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest(INTERACTIVE_TARGETS)) return;
    advance();
  };

  if (!line) return null;

  const actionLabel =
    state.phase === "closing"
      ? text("Cerrando…", "Closing…")
      : state.phase === "typing"
        ? text("Mostrar texto", "Show text")
        : isLastLine
          ? text("Cerrar", "Close")
          : text("Continuar", "Continue");

  return (
    <div className="dialogue-overlay" data-dialogue-phase={state.phase}>
      <section
        className="dialogue-box dialogue-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={state.phase === "typing"}
        onClick={handlePanelClick}
      >
        <div className="dialogue-ornament dialogue-ornament--top" aria-hidden="true" />

        <header className="dialogue-header">
          <div
            className={`dialogue-portrait dialogue-portrait--${line.portrait?.id ?? "system"}`}
            role={line.portrait ? "img" : undefined}
            aria-label={line.portrait?.alt}
            aria-hidden={line.portrait ? undefined : true}
          >
            <span aria-hidden="true">
              {line.portrait?.id === "robot" ? "BOT" : "JC"}
            </span>
          </div>
          <div className="dialogue-identity">
            <span className="dialogue-kicker">
              {text("Conversación activa", "Active conversation")}
            </span>
            <h2 id={titleId} className="dialogue-speaker">
              {line.speaker ?? "Jorge Colamarco"}
            </h2>
          </div>
          <span
            className="dialogue-progress"
            aria-label={text(`Mensaje ${progress}`, `Message ${progress}`)}
          >
            {progress}
          </span>
        </header>

        <div className="dialogue-content">
          <p className="dialogue-text" aria-hidden="true">
            <span className="dialogue-bullet" aria-hidden="true">✦</span>
            {fullText.slice(0, state.visibleCharacters)}
            {state.phase === "typing" ? (
              <span className="dialogue-cursor" aria-hidden="true">▌</span>
            ) : null}
          </p>
          <p id={descriptionId} className="sr-only" aria-live="polite">
            {fullText}
          </p>
        </div>

        <footer className="dialogue-footer">
          <div className="dialogue-stepper" aria-hidden="true">
            {dialogue.lines.map((_, index) => (
              <span
                key={index}
                data-active={index === state.lineIndex ? "true" : "false"}
                data-complete={index < state.lineIndex ? "true" : "false"}
              />
            ))}
          </div>
          <p className="dialogue-hint">
            <span className="keycap">ENTER</span>
            <span>
              {state.phase === "typing"
                ? text("revelar", "reveal")
                : text("avanzar", "advance")}
            </span>
          </p>
          <button
            ref={nextButtonRef}
            className="dialogue-next"
            type="button"
            disabled={state.phase === "closing"}
            onClick={(event) => {
              event.stopPropagation();
              advance();
            }}
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </button>
        </footer>

        <div className="dialogue-ornament dialogue-ornament--bottom" aria-hidden="true" />
      </section>
    </div>
  );
}
