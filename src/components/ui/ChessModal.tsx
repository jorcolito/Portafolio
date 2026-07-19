"use client";

import { useEffect, useState } from "react";

import type { ChessGameResult, ChessSnapshot } from "@/src/types";

import { ModalShell } from "./ModalShell";

type ChessLoadState = "loading" | "ready" | "error";

const GAME_RESULT_LABELS: Record<
  ChessGameResult,
  { short: string; long: string }
> = {
  win: { short: "V", long: "Victoria" },
  loss: { short: "D", long: "Derrota" },
  draw: { short: "T", long: "Tablas" },
  unknown: { short: "—", long: "Resultado no disponible" },
};

interface ChessModalProps {
  onClose: () => void;
}

export function ChessModal({ onClose }: ChessModalProps) {
  const [state, setState] = useState<ChessLoadState>("loading");
  const [snapshot, setSnapshot] = useState<ChessSnapshot | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/chess", {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Chess snapshot unavailable");
        return (await response.json()) as ChessSnapshot;
      })
      .then((nextSnapshot) => {
        setSnapshot(nextSnapshot);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState("error");
      });

    return () => controller.abort();
  }, []);

  return (
    <ModalShell
      title="Chess.com · @jorcolito"
      eyebrow="Tablero de ajedrez"
      onClose={onClose}
      wide
    >
      <div className="chess-modal-content">
        {state === "loading" ? (
          <div className="quick-chess-status" role="status" aria-live="polite">
            <span className="quick-chess-status__pulse" aria-hidden="true" />
            Sincronizando la actividad pública de Chess.com…
          </div>
        ) : null}

        {state === "error" || (state === "ready" && !snapshot) ? (
          <div className="quick-chess-status" role="status">
            <p>Chess.com no está disponible en este momento.</p>
            <a
              className="quick-inline-link"
              href="https://www.chess.com/member/jorcolito"
              target="_blank"
              rel="noreferrer"
            >
              Ver perfil público de @jorcolito ↗
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

function ChessSnapshotView({ snapshot }: { snapshot: ChessSnapshot }) {
  const hasMetrics = snapshot.rapid || snapshot.tactics || snapshot.puzzleRush;
  const updatedAt = new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(snapshot.fetchedAt));

  return (
    <section className="quick-chess" aria-labelledby="chess-profile-title">
      <header className="quick-chess__header">
        <div>
          <p className="eyebrow">Actividad pública sincronizada</p>
          <h3 id="chess-profile-title">Chess.com · @{snapshot.username}</h3>
        </div>
        <a
          className="quick-inline-link"
          href={snapshot.profileUrl}
          target="_blank"
          rel="noreferrer"
        >
          Ver perfil ↗
        </a>
      </header>

      <p className="quick-chess__intro">
        Cuando no estoy programando, normalmente estoy estudiando ajedrez. Me
        gusta porque exige la misma mezcla de paciencia, análisis y revisión de
        errores que aplico al construir software.
      </p>

      {snapshot.status === "unavailable" ? (
        <p className="quick-chess-status" role="status">
          Chess.com no respondió. El perfil público sigue disponible y los datos se
          reintentarán la próxima vez que se abra el tablero.
        </p>
      ) : (
        <>
          {hasMetrics ? (
            <div className="quick-metric-grid" aria-label="Estadísticas de ajedrez">
              {snapshot.rapid ? (
                <article className="quick-metric-card quick-metric-card--rapid">
                  <span className="quick-metric-card__label">Rapid actual</span>
                  <strong>{snapshot.rapid.rating}</strong>
                  <small>
                    {snapshot.rapid.record.wins} V · {snapshot.rapid.record.losses} D ·{" "}
                    {snapshot.rapid.record.draws} T
                  </small>
                </article>
              ) : null}
              {snapshot.tactics ? (
                <article className="quick-metric-card">
                  <span className="quick-metric-card__label">Mejor Tactics</span>
                  <strong>{snapshot.tactics.highestRating}</strong>
                  <small>Máximo histórico publicado por Chess.com</small>
                </article>
              ) : null}
              {snapshot.puzzleRush ? (
                <article className="quick-metric-card">
                  <span className="quick-metric-card__label">Mejor Puzzle Rush</span>
                  <strong>{snapshot.puzzleRush.bestScore}</strong>
                  <small>Puntuación, no rating</small>
                </article>
              ) : null}
            </div>
          ) : null}

          <div className="quick-chess__games">
            <div className="quick-subheading">
              <h4>Partidas recientes</h4>
              <span>Actualizado {updatedAt}</span>
            </div>
            {snapshot.recentGames.length > 0 ? (
              <ol className="quick-game-list">
                {snapshot.recentGames.map((game) => {
                  const result = GAME_RESULT_LABELS[game.result];
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
                          {game.color === "white" ? "blancas" : "negras"}
                        </span>
                      </div>
                      <div className="quick-game-item__rating">
                        <span>{game.playerRating ?? "—"}</span>
                        <time dateTime={game.endedAt}>
                          {new Intl.DateTimeFormat("es-EC", {
                            day: "2-digit",
                            month: "short",
                          }).format(new Date(game.endedAt))}
                        </time>
                      </div>
                      <a
                        href={game.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Abrir partida contra ${game.opponent} en Chess.com`}
                      >
                        Abrir ↗
                      </a>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="quick-chess-status">
                No hay partidas recientes disponibles desde la API.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
