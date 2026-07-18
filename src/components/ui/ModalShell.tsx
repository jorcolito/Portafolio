"use client";

import {
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";

interface ModalShellProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  wide?: boolean;
  variant?: "default" | "project" | "contact" | "library" | "elevator";
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalShell({
  title,
  eyebrow,
  wide = false,
  variant = "default",
  onClose,
  initialFocusRef,
  children,
}: ModalShellProps) {
  const titleId = useId();
  const windowRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeRequestedRef = useRef(false);

  const requestClose = useCallback(() => {
    if (closeRequestedRef.current) return;
    closeRequestedRef.current = true;
    onClose();
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const target = initialFocusRef?.current ?? closeRef.current;
    target?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!event.repeat) requestClose();
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
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [initialFocusRef, requestClose]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      data-modal-variant={variant}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={windowRef}
        className={`modal-window modal-window--${variant}${wide ? " modal-window--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-titlebar">
          <div className="modal-heading">
            {eyebrow ? <span className="modal-eyebrow">{eyebrow}</span> : null}
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            ref={closeRef}
            className="modal-close"
            type="button"
            onClick={requestClose}
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
