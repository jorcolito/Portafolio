"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
import { ProjectModal } from "@/src/components/ui/ProjectModal";
import { QuickView } from "@/src/components/ui/QuickView";
import { SettingsModal } from "@/src/components/ui/SettingsModal";
import { StartScreen } from "@/src/components/ui/StartScreen";
import { EDUCATION_LIBRARY, FLOORS, PROJECTS_BY_ID } from "@/src/data";
import type {
  DialogueFollowUp,
  FloorOption,
  GameDialogue,
  GameToReactEvent,
  InteractionPrompt,
  PortfolioFloor,
  ReactToGameCommand,
} from "@/src/game/types/contracts";
import { PORTFOLIO_FLOORS } from "@/src/game/types/contracts";
import type { PortfolioProject, ProjectId } from "@/src/types";

type ExperiencePhase = "boot" | "intro" | "game";

type OverlayState =
  | { type: "none" }
  | {
      type: "dialogue";
      dialogue: GameDialogue;
      followUp?: DialogueFollowUp;
    }
  | { type: "project"; projectId: ProjectId }
  | { type: "library"; itemId: string }
  | { type: "quick-view" }
  | { type: "chess" }
  | {
      type: "elevator";
      currentFloor: PortfolioFloor;
      floors: readonly FloorOption[];
    }
  | { type: "contact" }
  | { type: "settings" };

const NO_OVERLAY: OverlayState = { type: "none" };

const MOBILE_FLOOR_SIGNALS: Readonly<
  Record<PortfolioFloor, readonly [string, string, string]>
> = {
  0: ["3 productos", "Credenciales verificables", "Contacto directo"],
  [-1]: ["CarDrive", "SHIKO", "Comernova"],
  [-2]: ["UEES", "Cambridge C1", "AWS Academy"],
  [-3]: ["Visión de producto", "Guayaquil", "Chess.com"],
  [-4]: ["GitHub", "LinkedIn", "Correo"],
};

export function JorgeExeExperience() {
  const [phase, setPhase] = useState<ExperiencePhase>("boot");
  const [overlay, setOverlay] = useState<OverlayState>(NO_OVERLAY);
  const [currentFloor, setCurrentFloor] = useState<PortfolioFloor>(0);
  const [prompt, setPrompt] = useState<InteractionPrompt | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inputCooldown, setInputCooldown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const gameRef = useRef<GameCanvasHandle>(null);
  const inputCooldownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = window.localStorage.getItem("jorge-exe-reduced-motion");
    const frame = window.requestAnimationFrame(() => {
      setReducedMotion(stored === null ? media.matches : stored === "true");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "jorge-exe-reduced-motion",
      String(reducedMotion),
    );
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

  const openElevator = useCallback(() => {
    setPhase("game");
    setOverlay({
      type: "elevator",
      currentFloor,
      floors: PORTFOLIO_FLOORS,
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
          dialogue: event.dialogue,
          followUp: event.after,
        });
        break;
      case "elevator-requested":
        setOverlay({
          type: "elevator",
          currentFloor: event.currentFloor,
          floors: event.floors,
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
    FLOORS.find((floor) => floor.level === currentFloor) ?? FLOORS[0];
  const anyOverlayOpen = overlay.type !== "none";
  const gameInputBlocked = anyOverlayOpen || inputCooldown;

  return (
    <div data-reduced-motion={reducedMotion ? "true" : "false"}>
      <a className="skip-link" href="#portfolio-main">
        Saltar al contenido
      </a>

      {phase === "boot" ? (
        <StartScreen
          onStart={() => setPhase("intro")}
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
              <strong>JORGE.EXE</strong>
              <span>A Developer&apos;s Tale</span>
            </div>
            <div className="topbar-location" aria-live="polite">
              Piso {currentFloor} · {currentFloorData.label}
            </div>
            <div className="topbar-actions">
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--elevator"
                type="button"
                onClick={openElevator}
                aria-label="Abrir elevador"
              >
                <span className="topbar-action__icon keycap" aria-hidden="true">Q</span>
                <span className="topbar-action__label">Elevador</span>
              </button>
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--quick"
                type="button"
                onClick={() => setOverlay({ type: "quick-view" })}
                aria-label="Abrir Quick View"
              >
                <span className="topbar-action__icon" aria-hidden="true">QV</span>
                <span className="topbar-action__label">Vista rápida</span>
              </button>
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--sound"
                type="button"
                onClick={() => setMuted((value) => !value)}
                aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
                aria-pressed={!muted}
              >
                <span className="topbar-action__icon" aria-hidden="true">
                  {muted ? "OFF" : "ON"}
                </span>
                <span className="topbar-action__label">Sonido</span>
              </button>
              <button
                className="pixel-button pixel-button--ghost topbar-action topbar-action--settings"
                type="button"
                onClick={() => setOverlay({ type: "settings" })}
                aria-label="Abrir ajustes"
              >
                <span className="topbar-action__icon" aria-hidden="true">⚙</span>
                <span className="topbar-action__label">Ajustes</span>
              </button>
            </div>
          </header>

          <div className="game-layout">
            <section className="game-column" aria-labelledby="game-region-title">
              <h1 id="game-region-title" className="sr-only">
                Mundo interactivo de JORGE LABS
              </h1>
              <div className="game-stage" data-game-ready={gameReady ? "true" : "false"}>
                <div className="stage-label">
                  Piso {currentFloor} / {currentFloorData.label}
                </div>
                <div
                  className="stage-live-status"
                  data-state={!gameReady ? "loading" : prompt ? "action" : "ready"}
                  aria-live="polite"
                >
                  <span aria-hidden="true" />
                  {!gameReady
                    ? "Preparando escena"
                    : prompt
                      ? "Objeto disponible"
                      : "Escena activa"}
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
                  active={phase === "game"}
                  modalOpen={gameInputBlocked}
                  reducedMotion={reducedMotion}
                  muted={muted}
                  onEvent={handleGameEvent}
                  ariaLabel={`Escenario jugable: ${currentFloorData.label}. Usa A y D o flechas para moverte, E para interactuar y Q para abrir el elevador.`}
                />

                {anyOverlayOpen ? (
                  <div className="game-paused-overlay" aria-hidden="true" />
                ) : null}

                {overlay.type === "dialogue" ? (
                  <DialogueBox
                    key={overlay.dialogue.id}
                    dialogue={overlay.dialogue}
                    followUp={overlay.followUp}
                    reducedMotion={reducedMotion}
                    onFinish={finishDialogue}
                  />
                ) : null}

                <div className="stage-controls-hint" aria-hidden="true">
                  <span>A/D mover</span>
                  <span>E interactuar</span>
                  <span>Q elevador</span>
                </div>
              </div>

              <TouchControls
                disabled={gameInputBlocked}
                canInteract={Boolean(prompt) && !gameInputBlocked}
                floorLabel={currentFloorData.label}
                promptLabel={prompt?.label}
                ready={gameReady}
                send={sendGameCommand}
                onMenu={openElevator}
              />

              <aside className="mobile-briefing" aria-label="Guía del piso actual">
                <div className="mobile-briefing__heading">
                  <span>Ruta activa</span>
                  <strong>{currentFloorData.label}</strong>
                </div>
                <p>
                  {prompt
                    ? `Estás cerca de una interacción: ${prompt.label}.`
                    : currentFloorData.description}
                </p>
                <div className="mobile-briefing__signals" aria-label="Contenido destacado del piso">
                  {MOBILE_FLOOR_SIGNALS[currentFloor].map((signal, index) => (
                    <span key={signal}>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      <strong>{signal}</strong>
                    </span>
                  ))}
                </div>
                <span className="mobile-briefing__tip">
                  Los objetos interactivos se iluminan al acercarte.
                </span>
              </aside>
            </section>
          </div>
        </main>
      ) : null}

      {overlay.type === "project" ? (
        <ProjectModal
          project={PROJECTS_BY_ID[overlay.projectId]}
          onClose={closeOverlay}
          onPlaceholder={showNotice}
        />
      ) : null}

      {overlay.type === "library" ? (
        <LibraryBookModal
          item={
            EDUCATION_LIBRARY.find((item) => item.id === overlay.itemId) ??
            EDUCATION_LIBRARY[0]
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
          floors={overlay.floors}
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
          muted={muted}
          reducedMotion={reducedMotion}
          onMutedChange={setMuted}
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
