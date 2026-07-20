"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  GameCanvas,
  type GameCanvasHandle,
} from "@/src/components/game/GameCanvas";
import { TouchControls } from "@/src/components/game/TouchControls";
import { ChessModal } from "@/src/components/ui/ChessModal";
import { ContactModal } from "@/src/components/ui/ContactModal";
import { DialogueBox } from "@/src/components/ui/DialogueBox";
import { ElevatorModal } from "@/src/components/ui/ElevatorModal";
import { IntroSequence } from "@/src/components/ui/IntroSequence";
import { LibraryBookModal } from "@/src/components/ui/LibraryBookModal";
import { LanguageSwitcher } from "@/src/components/ui/LanguageSwitcher";
import { ProjectModal } from "@/src/components/ui/ProjectModal";
import { QuickView } from "@/src/components/ui/QuickView";
import { SettingsModal } from "@/src/components/ui/SettingsModal";
import { StartScreen } from "@/src/components/ui/StartScreen";
import {
  getLocalizedContent,
  getLocalizedDialogue,
  getLocalizedProject,
} from "@/src/data/localized";
import { useLocale, type Locale } from "@/src/i18n/LocaleContext";
import type {
  DialogueFollowUp,
  FloorOption,
  GameToReactEvent,
  InteractionPrompt,
  PortfolioFloor,
  ReactToGameCommand,
} from "@/src/game/types/contracts";
import type { DialogueId, PortfolioProject, ProjectId } from "@/src/types";

type ExperiencePhase = "boot" | "intro" | "game";

type OverlayState =
  | { type: "none" }
  | {
      type: "dialogue";
      dialogueId: DialogueId;
      followUp?: DialogueFollowUp;
    }
  | { type: "project"; projectId: ProjectId }
  | { type: "library"; itemId: string }
  | { type: "quick-view" }
  | { type: "chess" }
  | {
      type: "elevator";
      currentFloor: PortfolioFloor;
    }
  | { type: "contact" }
  | { type: "settings" };

const NO_OVERLAY: OverlayState = { type: "none" };

const MOBILE_FLOOR_SIGNALS: Readonly<
  Record<Locale, Record<PortfolioFloor, readonly [string, string, string]>>
> = {
  es: {
    0: ["3 casos de producto", "Credenciales verificables", "Contacto directo"],
    [-1]: ["CarDrive", "SHIKO", "Comernova"],
    [-2]: ["UEES", "Cambridge C1", "AWS Academy"],
    [-3]: ["Criterio de producto", "Guayaquil", "Chess.com"],
    [-4]: ["GitHub", "LinkedIn", "Correo"],
  },
  en: {
    0: ["3 products", "Verified credentials", "Direct contact"],
    [-1]: ["CarDrive", "SHIKO", "Comernova"],
    [-2]: ["UEES", "Cambridge C1", "AWS Academy"],
    [-3]: ["Product judgment", "Guayaquil", "Chess.com"],
    [-4]: ["GitHub", "LinkedIn", "Email"],
  },
};

export function JorgeExeExperience() {
  const { locale, text } = useLocale();
  const content = getLocalizedContent(locale);
  const portfolioFloors = useMemo<readonly FloorOption[]>(
    () =>
      content.floors.map((floor) => ({
        floor: floor.level,
        label: floor.label,
        shortLabel: floor.elevatorLabel,
      })),
    [content],
  );
  const [phase, setPhase] = useState<ExperiencePhase>("boot");
  const [overlay, setOverlay] = useState<OverlayState>(NO_OVERLAY);
  const [currentFloor, setCurrentFloor] = useState<PortfolioFloor>(0);
  const [prompt, setPrompt] = useState<InteractionPrompt | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const [gameLoadError, setGameLoadError] = useState(false);
  const muted = true;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inputCooldown, setInputCooldown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const gameRef = useRef<GameCanvasHandle>(null);
  const inputCooldownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem("jorge-colamarco.motion.v1");
    } catch {
      // Fall back to the system preference when storage is unavailable.
    }
    const frame = window.requestAnimationFrame(() => {
      setReducedMotion(stored === null ? media.matches : stored === "true");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "jorge-colamarco.motion.v1",
        String(reducedMotion),
      );
    } catch {
      // The preference remains active for this visit.
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(
    () => () => {
      if (inputCooldownTimerRef.current !== null) {
        window.clearTimeout(inputCooldownTimerRef.current);
      }
    },
    [],
  );

  const armInputCooldown = useCallback(() => {
    if (inputCooldownTimerRef.current !== null) {
      window.clearTimeout(inputCooldownTimerRef.current);
    }
    setInputCooldown(true);
    inputCooldownTimerRef.current = window.setTimeout(() => {
      inputCooldownTimerRef.current = null;
      setInputCooldown(false);
      gameRef.current?.focus();
    }, 120);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay(NO_OVERLAY);
    armInputCooldown();
  }, [armInputCooldown]);

  const showNotice = useCallback((message: string) => {
    setToast(message);
  }, []);

  const startExperience = useCallback(() => {
    // Use the intro animation to warm the deferred game chunk instead of
    // making visitors wait for it after the transition.
    void import("@/src/game");
    setPhase("intro");
  }, []);

  const openElevator = useCallback(() => {
    setPhase("game");
    setOverlay({
      type: "elevator",
      currentFloor,
    });
  }, [currentFloor]);

  const openProject = useCallback((project: PortfolioProject) => {
    setOverlay({ type: "project", projectId: project.id });
  }, []);

  const handleGameEvent = useCallback((event: GameToReactEvent) => {
    switch (event.type) {
      case "ready":
        setGameReady(true);
        setCurrentFloor(event.floor);
        break;
      case "floor-changed":
        setCurrentFloor(event.floor);
        setPrompt(null);
        break;
      case "prompt-changed":
        setPrompt(event.prompt);
        break;
      case "dialogue-requested":
        if (event.after?.type === "project") {
          setOverlay({ type: "project", projectId: event.after.projectId });
          break;
        }
        if (event.after?.type === "library") {
          setOverlay({ type: "library", itemId: event.after.itemId });
          break;
        }
        setOverlay({
          type: "dialogue",
          dialogueId: event.dialogue.id,
          followUp: event.after,
        });
        break;
      case "elevator-requested":
        setOverlay({
          type: "elevator",
          currentFloor: event.currentFloor,
        });
        break;
      case "project-requested":
        setOverlay({ type: "project", projectId: event.projectId });
        break;
      case "quick-view-requested":
        setOverlay({ type: "quick-view" });
        break;
      case "chess-requested":
        setOverlay({ type: "chess" });
        break;
      case "contact-requested":
        setOverlay({ type: "contact" });
        break;
      case "sound-requested":
        break;
    }
  }, []);

  const finishDialogue = useCallback((followUp?: DialogueFollowUp) => {
    if (!followUp) {
      setOverlay(NO_OVERLAY);
      armInputCooldown();
      return;
    }

    if (followUp.type === "project") {
      setOverlay({ type: "project", projectId: followUp.projectId });
    } else if (followUp.type === "library") {
      setOverlay({ type: "library", itemId: followUp.itemId });
    } else if (followUp.type === "quick-view") {
      setOverlay({ type: "quick-view" });
    } else {
      setOverlay({ type: "contact" });
    }
  }, [armInputCooldown]);

  const selectFloor = useCallback((floor: PortfolioFloor) => {
    if (floor === -4) {
      setPrompt(null);
      setOverlay({ type: "contact" });
      return;
    }

    setOverlay(NO_OVERLAY);
    setPrompt(null);
    gameRef.current?.selectFloor(floor);
    window.setTimeout(() => gameRef.current?.focus(), 80);
  }, []);

  const sendGameCommand = useCallback((command: ReactToGameCommand) => {
    gameRef.current?.dispatch(command);
  }, []);

  const currentFloorData =
    content.floors.find((floor) => floor.level === currentFloor) ??
    content.floors[0];
  const anyOverlayOpen = overlay.type !== "none";
  const gameInputBlocked = anyOverlayOpen || inputCooldown;

  return (
    <div data-reduced-motion={reducedMotion ? "true" : "false"}>
      <a className="skip-link" href="#portfolio-main">
        {text("Saltar al contenido", "Skip to content")}
      </a>

      {phase === "boot" ? (
        <StartScreen
          onStart={startExperience}
          onSkipIntro={() => setPhase("game")}
          onQuickView={() => setOverlay({ type: "quick-view" })}
          onSettings={() => setOverlay({ type: "settings" })}
        />
      ) : null}

      {phase === "intro" ? (
        <IntroSequence
          reducedMotion={reducedMotion}
          onComplete={() => setPhase("game")}
        />
      ) : null}

      {phase === "game" ? (
        <main className="experience-shell" id="portfolio-main">
          <header className="topbar">
            <div className="topbar-brand">
              <strong>Jorge Colamarco</strong>
              <span>{text("Portafolio interactivo", "Interactive portfolio")}</span>
            </div>
            <div className="topbar-location" aria-live="polite">
              {text("Piso", "Floor")} {currentFloor} · {currentFloorData.label}
            </div>
            <div className="topbar-actions">
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--elevator"
                type="button"
                onClick={openElevator}
                aria-label={text("Abrir elevador", "Open elevator")}
              >
                <span className="topbar-action__icon keycap" aria-hidden="true">Q</span>
                <span className="topbar-action__label">
                  {text("Elevador", "Elevator")}
                </span>
              </button>
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--quick"
                type="button"
                onClick={() => setOverlay({ type: "quick-view" })}
                aria-label={text("Abrir vista rápida", "Open quick view")}
              >
                <span className="topbar-action__icon" aria-hidden="true">QV</span>
                <span className="topbar-action__label">
                  {text("Vista rápida", "Quick view")}
                </span>
              </button>
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--settings"
                type="button"
                onClick={() => setOverlay({ type: "settings" })}
                aria-label={text("Abrir ajustes", "Open settings")}
              >
                <span className="topbar-action__icon" aria-hidden="true">⚙</span>
                <span className="topbar-action__label">
                  {text("Ajustes", "Settings")}
                </span>
              </button>
              <LanguageSwitcher variant="topbar" />
            </div>
          </header>

          <div className="game-layout">
            <section className="game-column" aria-labelledby="game-region-title">
              <h1 id="game-region-title" className="sr-only">
                {text(
                  "Portafolio interactivo de Jorge Colamarco",
                  "Jorge Colamarco's interactive portfolio",
                )}
              </h1>
              <div className="game-stage" data-game-ready={gameReady ? "true" : "false"}>
                <div className="stage-label">
                  {text("Piso", "Floor")} {currentFloor} / {currentFloorData.label}
                </div>
                <div
                  className="stage-live-status"
                  data-state={
                    gameLoadError
                      ? "error"
                      : !gameReady
                        ? "loading"
                        : prompt
                          ? "action"
                          : "ready"
                  }
                  aria-live="polite"
                >
                  <span aria-hidden="true" />
                  {gameLoadError
                    ? text("Error de carga", "Loading error")
                    : !gameReady
                    ? text("Preparando escena", "Preparing scene")
                    : prompt
                      ? text("Objeto disponible", "Object available")
                      : text("Escena activa", "Scene active")}
                </div>
                {prompt && overlay.type === "none" && !inputCooldown ? (
                  <div className="interaction-prompt" aria-live="polite">
                    <span className="keycap">E</span>
                    <span>{prompt.label}</span>
                  </div>
                ) : null}

                <GameCanvas
                  ref={gameRef}
                  className="game-canvas-host"
                  initialFloor={currentFloor}
                  active={phase === "game"}
                  modalOpen={gameInputBlocked}
                  reducedMotion={reducedMotion}
                  muted={muted}
                  locale={locale}
                  onEvent={handleGameEvent}
                  onLoadError={() => {
                    setGameLoadError(true);
                    setToast(
                      text(
                        "No se pudo cargar la escena. Recarga la página para intentarlo de nuevo.",
                        "The scene could not load. Reload the page to try again.",
                      ),
                    );
                  }}
                  ariaLabel={text(
                    `Escenario jugable: ${currentFloorData.label}. Usa A y D o flechas para moverte, E para interactuar y Q para abrir el elevador.`,
                    `Playable scene: ${currentFloorData.label}. Use A and D or the arrow keys to move, E to interact and Q to open the elevator.`,
                  )}
                />

                {anyOverlayOpen && overlay.type !== "dialogue" ? (
                  <div className="game-paused-overlay" aria-hidden="true" />
                ) : null}

                <div className="stage-controls-hint" aria-hidden="true">
                  <span>{text("A/D mover", "A/D move")}</span>
                  <span>{text("E interactuar", "E interact")}</span>
                  <span>{text("Q elevador", "Q elevator")}</span>
                </div>
              </div>

              <TouchControls
                disabled={gameInputBlocked || gameLoadError}
                canInteract={Boolean(prompt) && !gameInputBlocked}
                floorLabel={currentFloorData.label}
                promptLabel={prompt?.label}
                ready={gameReady}
                send={sendGameCommand}
                onMenu={openElevator}
              />

              <aside
                className="mobile-briefing"
                aria-label={text("Guía del piso actual", "Current floor guide")}
              >
                <div className="mobile-briefing__heading">
                  <span>{text("Ruta activa", "Active route")}</span>
                  <strong>{currentFloorData.label}</strong>
                </div>
                <p>
                  {prompt
                    ? text(
                        `Estás cerca de una interacción: ${prompt.label}.`,
                        `You are near an interaction: ${prompt.label}.`,
                      )
                    : currentFloorData.description}
                </p>
                <div
                  className="mobile-briefing__signals"
                  aria-label={text(
                    "Contenido destacado del piso",
                    "Featured floor content",
                  )}
                >
                  {MOBILE_FLOOR_SIGNALS[locale][currentFloor].map((signal, index) => (
                    <span key={signal}>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <strong>{signal}</strong>
                    </span>
                  ))}
                </div>
                <span className="mobile-briefing__tip">
                  {text(
                    "Los objetos interactivos se iluminan al acercarte.",
                    "Interactive objects light up as you approach.",
                  )}
                </span>
              </aside>
            </section>
          </div>
        </main>
      ) : null}

      {overlay.type === "dialogue" ? (
        <DialogueBox
          key={`${locale}-${overlay.dialogueId}`}
          dialogue={getLocalizedDialogue(locale, overlay.dialogueId)}
          followUp={overlay.followUp}
          reducedMotion={reducedMotion}
          onFinish={finishDialogue}
        />
      ) : null}

      {overlay.type === "project" ? (
        <ProjectModal
          project={getLocalizedProject(locale, overlay.projectId)}
          onClose={closeOverlay}
        />
      ) : null}

      {overlay.type === "library" ? (
        <LibraryBookModal
          item={
            content.educationLibrary.find((item) => item.id === overlay.itemId) ??
            content.educationLibrary[0]
          }
          onClose={closeOverlay}
          onPlaceholder={showNotice}
        />
      ) : null}

      {overlay.type === "quick-view" ? (
        <QuickView
          onClose={closeOverlay}
          onProject={openProject}
          onContact={() => setOverlay({ type: "contact" })}
          onPlaceholder={showNotice}
        />
      ) : null}

      {overlay.type === "chess" ? (
        <ChessModal onClose={closeOverlay} />
      ) : null}

      {overlay.type === "elevator" ? (
        <ElevatorModal
          currentFloor={overlay.currentFloor}
          floors={portfolioFloors}
          onSelect={selectFloor}
          onClose={closeOverlay}
        />
      ) : null}

      {overlay.type === "contact" ? (
        <ContactModal
          onClose={closeOverlay}
          onElevator={openElevator}
          onNotice={showNotice}
        />
      ) : null}

      {overlay.type === "settings" ? (
        <SettingsModal
          reducedMotion={reducedMotion}
          onReducedMotionChange={setReducedMotion}
          onClose={closeOverlay}
        />
      ) : null}

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
