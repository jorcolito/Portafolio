"use client";

import {
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useLocale } from "@/src/i18n/LocaleContext";

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
  const { text } = useLocale();
  const titleId = useId();
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollStatusRef = useRef<HTMLDivElement>(null);
  const closeRequestedRef = useRef(false);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    atEnd: false,
  });

  const requestClose = useCallback(() => {
    if (closeRequestedRef.current) return;
    closeRequestedRef.current = true;
    onClose();
  }, [onClose]);

  const updateScrollState = useCallback(() => {
    const region = scrollRegionRef.current;
    if (!region) return;

    const scrollRange = Math.max(0, region.scrollHeight - region.clientHeight);
    const canScroll = scrollRange > 2;
    const progress = canScroll
      ? Math.min(1, Math.max(0, region.scrollTop / scrollRange))
      : 0;

    scrollStatusRef.current?.style.setProperty(
      "--modal-scroll-progress",
      String(progress),
    );

    const atEnd = canScroll && progress > 0.96;
    setScrollState((current) =>
      current.canScroll === canScroll && current.atEnd === atEnd
        ? current
        : { canScroll, atEnd },
    );
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      right: document.body.style.right,
      left: document.body.style.left,
      width: document.body.style.width,
    };
    const previousOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.right = "0";
    document.body.style.left = "0";
    document.body.style.width = "100%";
    document.documentElement.style.overscrollBehavior = "none";
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
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.width = previousBodyStyles.width;
      document.documentElement.style.overscrollBehavior = previousOverscroll;
      window.scrollTo(0, scrollY);
      previouslyFocused?.focus();
    };
  }, [initialFocusRef, requestClose]);

  useEffect(() => {
    const region = scrollRegionRef.current;
    if (!region) return;

    const frame = window.requestAnimationFrame(updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(region);
    Array.from(region.children).forEach((child) => resizeObserver.observe(child));

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [children, updateScrollState]);

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
            aria-label={text(`Cerrar ${title}`, `Close ${title}`)}
          >
            ×
          </button>
        </div>
        <div
          ref={scrollStatusRef}
          className="modal-scroll-status"
          data-scrollable={scrollState.canScroll ? "true" : "false"}
          aria-hidden="true"
        >
          <span className="modal-scroll-status__track">
            <span className="modal-scroll-status__bar" />
          </span>
          <span className="modal-scroll-status__copy">
            {scrollState.atEnd
              ? text("Final del contenido", "End of content")
              : text("Desliza para explorar", "Scroll to explore")}
          </span>
        </div>
        <div
          ref={scrollRegionRef}
          className="modal-scroll-region"
          onScroll={updateScrollState}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
