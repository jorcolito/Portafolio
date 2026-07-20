"use client";

import { useEffect, useState } from "react";

import type { ChessGameResult, ChessSnapshot } from "@/src/types";
import { useLocale, type Locale } from "@/src/i18n/LocaleContext";

import { ModalShell } from "./ModalShell";

type ChessLoadState = "loading" | "ready" | "error";

const CHESS_ENDPOINTS = [
  { url: "/data/chess-snapshot.json", priority: 1 },
  { url: "/api/chess", priority: 2 },
] as const;

const GAME_RESULT_LABELS: Record<
  ChessGameResult,
  { es: { short: string; long: string }; en: { short: string; long: string } }
> = {
  win: {
    es: { short: "V", long: "Victoria" },
    en: { short: "W", long: "Win" },
  },
  loss: {
    es: { short: "D", long: "Derrota" },
    en: { short: "L", long: "Loss" },
  },
  draw: {
    es: { short: "T", long: "Tablas" },
    en: { short: "D", long: "Draw" },
  },
  unknown: {
    es: { short: "—", long: "Resultado no disponible" },
    en: { short: "—", long: "Result unavailable" },
  },
};

function gameResult(
  labels: (typeof GAME_RESULT_LABELS)[ChessGameResult],
  locale: Locale,
) {
  return labels[locale];
}

interface ChessModalProps {
  onClose: () => void;
}

export function ChessModal({ onClose }: ChessModalProps) {
  const { text } = useLocale();
  const [state, setState] = useState<ChessLoadState>("loading");
  const [snapshot, setSnapshot] = useState<ChessSnapshot | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let acceptedPriority = -1;
    let completedRequests = 0;

    const loadSnapshot = async ({
      url,
      priority,
    }: (typeof CHESS_ENDPOINTS)[number]) => {
      try {
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Chess snapshot unavailable");

        const candidate: unknown = await response.json();
        if (!isChessSnapshot(candidate)) {
          throw new Error("Invalid Chess snapshot");
        }

        // A fresh server response wins when it contains useful data. An empty
        // API fallback never erases the public snapshot bundled for static hosts.
        const candidatePriority = hasChessData(candidate) ? priority : 0;
        if (acceptedPriority < 0 || candidatePriority > acceptedPriority) {
          acceptedPriority = candidatePriority;
          setSnapshot(candidate);
          setState("ready");
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      } finally {
        completedRequests += 1;
        if (completedRequests === CHESS_ENDPOINTS.length && acceptedPriority < 0) {
          setState("error");
        }
      }
    };

    for (const endpoint of CHESS_ENDPOINTS) void loadSnapshot(endpoint);

    return () => controller.abort();
  }, []);

  return (
    <ModalShell
      title="Chess.com · @jorcolito"
      eyebrow={text("Tablero de ajedrez", "Chessboard")}
      onClose={onClose}
      wide
    >
      <div className="chess-modal-content">
        {state === "loading" ? (
          <div className="quick-chess-status" role="status" aria-live="polite">
            <span className="quick-chess-status__pulse" aria-hidden="true" />
            {text(
              "Sincronizando la actividad pública de Chess.com…",
              "Syncing public Chess.com activity…",
            )}
          </div>
        ) : null}

        {state === "error" || (state === "ready" && !snapshot) ? (
          <div className="quick-chess-status" role="status">
            <p>
              {text(
                "Chess.com no está disponible en este momento.",
                "Chess.com is unavailable right now.",
              )}
            </p>
            <a
              className="quick-inline-link"
              href="https://www.chess.com/member/jorcolito"
              target="_blank"
              rel="noreferrer"
            >
              {text(
                "Ver perfil público de @jorcolito ↗",
                "View @jorcolito's public profile ↗",
              )}
            </a>
          </div>
        ) : null}

        {state === "ready" && snapshot ? (
          <ChessSnapshotView snapshot={snapshot} />
        ) : null}
      </div>
    </ModalShell>
  );
}

function hasChessData(snapshot: ChessSnapshot): boolean {
  return Boolean(
    snapshot.rapid ||
      snapshot.tactics ||
      snapshot.puzzleRush ||
      snapshot.recentGames.length,
  );
}

function isChessSnapshot(value: unknown): value is ChessSnapshot {
  if (!value || typeof value !== "object") return false;

  const snapshot = value as Record<string, unknown>;
  if (
    typeof snapshot.username !== "string" ||
    typeof snapshot.profileUrl !== "string" ||
    !["live", "partial", "unavailable"].includes(String(snapshot.status)) ||
    typeof snapshot.fetchedAt !== "string" ||
    Number.isNaN(Date.parse(snapshot.fetchedAt)) ||
    !Array.isArray(snapshot.recentGames)
  ) {
    return false;
  }

  const rapid = snapshot.rapid as Record<string, unknown> | null;
  if (
    rapid !== null &&
    (!rapid ||
      typeof rapid !== "object" ||
      typeof rapid.rating !== "number" ||
      !rapid.record ||
      typeof rapid.record !== "object")
  ) {
    return false;
  }

  const tactics = snapshot.tactics as Record<string, unknown> | null;
  if (
    tactics !== null &&
    (!tactics ||
      typeof tactics !== "object" ||
      typeof tactics.highestRating !== "number")
  ) {
    return false;
  }

  const puzzleRush = snapshot.puzzleRush as Record<string, unknown> | null;
  if (
    puzzleRush !== null &&
    (!puzzleRush ||
      typeof puzzleRush !== "object" ||
      typeof puzzleRush.bestScore !== "number")
  ) {
    return false;
  }

  return snapshot.recentGames.every((game) => {
    if (!game || typeof game !== "object") return false;
    const entry = game as Record<string, unknown>;
    return (
      typeof entry.url === "string" &&
      typeof entry.endedAt === "string" &&
      typeof entry.opponent === "string" &&
      ["win", "loss", "draw", "unknown"].includes(String(entry.result)) &&
      ["white", "black"].includes(String(entry.color)) &&
      typeof entry.timeClass === "string"
    );
  });
}

function ChessSnapshotView({ snapshot }: { snapshot: ChessSnapshot }) {
  const { locale, text } = useLocale();
  const hasMetrics = snapshot.rapid || snapshot.tactics || snapshot.puzzleRush;
  const dateLocale = locale === "en" ? "en-US" : "es-EC";
  const updatedAt = new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(snapshot.fetchedAt));

  return (
    <section className="quick-chess" aria-labelledby="chess-profile-title">
      <header className="quick-chess__header">
        <div>
          <p className="eyebrow">
            {text("Actividad pública sincronizada", "Synced public activity")}
          </p>
          <h3 id="chess-profile-title">Chess.com · @{snapshot.username}</h3>
        </div>
        <a
          className="quick-inline-link"
          href={snapshot.profileUrl}
          target="_blank"
          rel="noreferrer"
        >
          {text("Ver perfil ↗", "View profile ↗")}
        </a>
      </header>

      <p className="quick-chess__intro">
        {text(
          "Cuando no estoy programando, normalmente estoy estudiando ajedrez. Me gusta porque exige la misma mezcla de paciencia, análisis y revisión de errores que aplico al construir software.",
          "When I am not programming, I am usually studying chess. I enjoy the same mix of patience, analysis and error review that I apply when building software.",
        )}
      </p>

      {snapshot.status === "unavailable" ? (
        <p className="quick-chess-status" role="status">
          {text(
            "Chess.com no respondió. El perfil público sigue disponible y los datos se reintentarán la próxima vez que se abra el tablero.",
            "Chess.com did not respond. The public profile remains available and the data will be retried next time the board opens.",
          )}
        </p>
      ) : (
        <>
          {hasMetrics ? (
            <div
              className="quick-metric-grid"
              aria-label={text("Estadísticas de ajedrez", "Chess statistics")}
            >
              {snapshot.rapid ? (
                <article className="quick-metric-card quick-metric-card--rapid">
                  <span className="quick-metric-card__label">
                    {text("Rapid actual", "Current rapid")}
                  </span>
                  <strong>{snapshot.rapid.rating}</strong>
                  <small>
                    {snapshot.rapid.record.wins} {locale === "en" ? "W" : "V"} ·{" "}
                    {snapshot.rapid.record.losses} {locale === "en" ? "L" : "D"} ·{" "}
                    {snapshot.rapid.record.draws} {locale === "en" ? "D" : "T"}
                  </small>
                </article>
              ) : null}
              {snapshot.tactics ? (
                <article className="quick-metric-card">
                  <span className="quick-metric-card__label">
                    {text("Mejor puntuación en táctica", "Peak tactics rating")}
                  </span>
                  <strong>{snapshot.tactics.highestRating}</strong>
                  <small>
                    {text(
                      "Máximo histórico publicado por Chess.com",
                      "All-time peak published by Chess.com",
                    )}
                  </small>
                </article>
              ) : null}
              {snapshot.puzzleRush ? (
                <article className="quick-metric-card">
                  <span className="quick-metric-card__label">
                    {text("Mejor Puzzle Rush", "Best Puzzle Rush")}
                  </span>
                  <strong>{snapshot.puzzleRush.bestScore}</strong>
                  <small>{text("Puntuación, no rating", "Score, not rating")}</small>
                </article>
              ) : null}
            </div>
          ) : null}

          <div className="quick-chess__games">
            <div className="quick-subheading">
              <h4>{text("Partidas recientes", "Recent games")}</h4>
              <span>{text(`Actualizado ${updatedAt}`, `Updated ${updatedAt}`)}</span>
            </div>
            {snapshot.recentGames.length > 0 ? (
              <ol className="quick-game-list">
                {snapshot.recentGames.map((game) => {
                  const result = gameResult(GAME_RESULT_LABELS[game.result], locale);
                  return (
                    <li
                      className="quick-game-item"
                      key={`${game.url}-${game.endedAt}`}
                    >
                      <span
                        className={`quick-game-result quick-game-result--${game.result}`}
                        aria-label={result.long}
                        title={result.long}
                      >
                        {result.short}
                      </span>
                      <div className="quick-game-item__opponent">
                        <strong>vs. {game.opponent}</strong>
                        <span>
                          {game.timeClass} ·{" "}
                          {game.color === "white"
                            ? text("blancas", "white")
                            : text("negras", "black")}
                        </span>
                      </div>
                      <div className="quick-game-item__rating">
                        <span>{game.playerRating ?? "—"}</span>
                        <time dateTime={game.endedAt}>
                          {new Intl.DateTimeFormat(dateLocale, {
                            day: "2-digit",
                            month: "short",
                          }).format(new Date(game.endedAt))}
                        </time>
                      </div>
                      <a
                        href={game.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={text(
                          `Abrir partida contra ${game.opponent} en Chess.com`,
                          `Open game against ${game.opponent} on Chess.com`,
                        )}
                      >
                        {text("Abrir ↗", "Open ↗")}
                      </a>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="quick-chess-status">
                {text(
                  "No hay partidas recientes disponibles desde la API.",
                  "No recent games are available from the API.",
                )}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
