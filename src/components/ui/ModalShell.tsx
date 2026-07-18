"use client";

import {
  type PropsWithChildren,
  type RefObject,
  useEffect,
  useId,
  useRef,
} from "react";

interface ModalShellProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  wide?: boolean;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalShell({
  title,
  eyebrow,
  wide = false,
  onClose,
  initialFocusRef,
  children,
}: ModalShellProps) {
  const titleId = useId();
  const windowRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const target = initialFocusRef?.current ?? closeRef.current;
    target?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !windowRef.current) return;
      const focusable = Array.from(
        windowRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => !element.hasAttribute("aria-hidden"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [initialFocusRef, onClose]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={windowRef}
        className={`modal-window${wide ? " modal-window--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-titlebar">
          <h2 id={titleId}>{eyebrow ? `${eyebrow} / ${title}` : title}</h2>
          <button
            ref={closeRef}
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label={`Cerrar ${title}`}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
