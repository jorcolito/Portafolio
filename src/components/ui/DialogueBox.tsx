"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  DialogueFollowUp,
  GameDialogue,
} from "@/src/game/types/contracts";

interface DialogueBoxProps {
  dialogue: GameDialogue;
  followUp?: DialogueFollowUp;
  reducedMotion: boolean;
  onFinish: (followUp?: DialogueFollowUp) => void;
}

export function DialogueBox({
  dialogue,
  followUp,
  reducedMotion,
  onFinish,
}: DialogueBoxProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(() =>
    reducedMotion || dialogue.speed === 0
      ? dialogue.lines[0]?.text.length ?? 0
      : 0,
  );
  const line = dialogue.lines[lineIndex];
  const fullText = line?.text ?? "";
  const instant = reducedMotion || dialogue.speed === 0;

  useEffect(() => {
    if (!line || instant || visibleCharacters >= fullText.length) return;
    const speed = Math.max(12, dialogue.speed ?? 22);
    const timer = window.setTimeout(
      () => setVisibleCharacters((current) => current + 1),
      speed,
    );
    return () => window.clearTimeout(timer);
  }, [dialogue.speed, fullText.length, instant, line, visibleCharacters]);

  const isRevealed = visibleCharacters >= fullText.length;
  const isLastLine = lineIndex === dialogue.lines.length - 1;

  const advance = useCallback(() => {
    if (!isRevealed) {
      setVisibleCharacters(fullText.length);
      return;
    }

    if (isLastLine) {
      onFinish(followUp);
      return;
    }

    const nextIndex = lineIndex + 1;
    setLineIndex(nextIndex);
    setVisibleCharacters(
      instant ? dialogue.lines[nextIndex]?.text.length ?? 0 : 0,
    );
  }, [
    dialogue.lines,
    followUp,
    fullText.length,
    instant,
    isLastLine,
    isRevealed,
    lineIndex,
    onFinish,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["Enter", "e", "E", " "].includes(event.key)) {
        event.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance]);

  const progress = useMemo(
    () => `${lineIndex + 1} / ${dialogue.lines.length}`,
    [dialogue.lines.length, lineIndex],
  );

  if (!line) return null;

  return (
    <section
      className="dialogue-box"
      aria-label="Diálogo"
      onClick={advance}
    >
      {line.speaker ? <p className="dialogue-speaker">{line.speaker}</p> : null}
      <p className="dialogue-text" aria-hidden="true">
        {fullText.slice(0, visibleCharacters)}
        {!isRevealed ? "▌" : ""}
      </p>
      <p className="sr-only" aria-live="polite">
        {fullText}
      </p>
      <div className="dialogue-footer">
        <span>{progress}</span>
        <button className="dialogue-next" type="button" onClick={advance}>
          {!isRevealed ? "Mostrar texto" : isLastLine ? "Cerrar" : "Continuar"} →
        </button>
      </div>
    </section>
  );
}
