import type {
  ChessGameResult,
  ChessRecentGame,
  ChessSnapshot,
} from "../types";

export const CHESS_USERNAME = "jorcolito";
export const CHESS_CACHE_SECONDS = 60 * 60;

const CHESS_API_ROOT = `https://api.chess.com/pub/player/${CHESS_USERNAME}`;
const CHESS_PROFILE_URL = `https://www.chess.com/member/${CHESS_USERNAME}`;
const CHESS_USER_AGENT =
  "Jorge Colamarco interactive portfolio/1.0 (Chess.com member: jorcolito)";

interface ApiRatingBlock {
  last?: { rating?: number };
  best?: { rating?: number };
  record?: { win?: number; loss?: number; draw?: number };
}

interface ApiStats {
  chess_rapid?: ApiRatingBlock;
  tactics?: { highest?: { rating?: number } };
  puzzle_rush?: {
    best?: { score?: number; total_attempts?: number };
  };
}

interface ApiArchives {
  archives?: string[];
}

interface ApiGamePlayer {
  username?: string;
  rating?: number;
  result?: string;
}

interface ApiGame {
  url?: string;
  end_time?: number;
  time_class?: string;
  time_control?: string;
  rules?: string;
  white?: ApiGamePlayer;
  black?: ApiGamePlayer;
}

interface ApiGames {
  games?: ApiGame[];
}

const DRAW_RESULTS = new Set([
  "agreed",
  "repetition",
  "stalemate",
  "insufficient",
  "50move",
  "timevsinsufficient",
]);

const LOSS_RESULTS = new Set([
  "checkmated",
  "resigned",
  "timeout",
  "abandoned",
  "lose",
]);

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nonNegativeInteger(value: unknown): number {
  const parsed = finiteNumber(value);
  return parsed === null ? 0 : Math.max(0, Math.trunc(parsed));
}

async function fetchChessJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": CHESS_USER_AGENT,
      },
      next: { revalidate: CHESS_CACHE_SECONDS },
      signal: AbortSignal.timeout(6_000),
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function resultFor(code: string | undefined): ChessGameResult {
  if (code === "win") return "win";
  if (code && DRAW_RESULTS.has(code)) return "draw";
  if (code && LOSS_RESULTS.has(code)) return "loss";
  return "unknown";
}

function normalizeGame(game: ApiGame): ChessRecentGame | null {
  const whiteUsername = game.white?.username;
  const blackUsername = game.black?.username;
  const endedAt = finiteNumber(game.end_time);

  if (!whiteUsername || !blackUsername || endedAt === null || !game.url) {
    return null;
  }

  const playedWhite =
    whiteUsername.toLocaleLowerCase() === CHESS_USERNAME.toLocaleLowerCase();
  const playedBlack =
    blackUsername.toLocaleLowerCase() === CHESS_USERNAME.toLocaleLowerCase();
  if (!playedWhite && !playedBlack) return null;

  const player = playedWhite ? game.white : game.black;
  const opponent = playedWhite ? game.black : game.white;

  if (!player || !opponent?.username) return null;

  return {
    url: game.url,
    endedAt: new Date(endedAt * 1_000).toISOString(),
    opponent: opponent.username,
    result: resultFor(player.result),
    color: playedWhite ? "white" : "black",
    timeClass: game.time_class ?? "sin clasificar",
    timeControl: game.time_control ?? "no disponible",
    playerRating: finiteNumber(player.rating),
    opponentRating: finiteNumber(opponent.rating),
  };
}

export function unavailableChessSnapshot(): ChessSnapshot {
  return {
    username: CHESS_USERNAME,
    profileUrl: CHESS_PROFILE_URL,
    status: "unavailable",
    fetchedAt: new Date().toISOString(),
    rapid: null,
    tactics: null,
    puzzleRush: null,
    recentGames: [],
  };
}

export async function getChessSnapshot(): Promise<ChessSnapshot> {
  // Chess.com recommends serial requests to avoid PubAPI rate limiting.
  const stats = await fetchChessJson<ApiStats>(`${CHESS_API_ROOT}/stats`);
  const archives = await fetchChessJson<ApiArchives>(
    `${CHESS_API_ROOT}/games/archives`,
  );

  const latestArchive = archives?.archives?.at(-1);
  let gamesArchive: ApiGames | null = null;
  if (latestArchive?.startsWith(`${CHESS_API_ROOT}/games/`)) {
    gamesArchive = await fetchChessJson<ApiGames>(latestArchive);
  }

  const rapidRating = finiteNumber(stats?.chess_rapid?.last?.rating);
  const tacticsHighest = finiteNumber(stats?.tactics?.highest?.rating);
  const puzzleRushBest = finiteNumber(stats?.puzzle_rush?.best?.score);
  const puzzleRushAttempts = finiteNumber(
    stats?.puzzle_rush?.best?.total_attempts,
  );

  const recentGames = (gamesArchive?.games ?? [])
    .filter((game) => game.rules === undefined || game.rules === "chess")
    .sort((left, right) => (right.end_time ?? 0) - (left.end_time ?? 0))
    .map(normalizeGame)
    .filter((game): game is ChessRecentGame => game !== null)
    .slice(0, 5);

  const hasStats = stats !== null;
  const hasGames = gamesArchive !== null;

  return {
    username: CHESS_USERNAME,
    profileUrl: CHESS_PROFILE_URL,
    status: hasStats && hasGames ? "live" : hasStats || hasGames ? "partial" : "unavailable",
    fetchedAt: new Date().toISOString(),
    rapid:
      rapidRating === null
        ? null
        : {
            rating: rapidRating,
            bestRating: finiteNumber(stats?.chess_rapid?.best?.rating),
            record: {
              wins: nonNegativeInteger(stats?.chess_rapid?.record?.win),
              losses: nonNegativeInteger(stats?.chess_rapid?.record?.loss),
              draws: nonNegativeInteger(stats?.chess_rapid?.record?.draw),
            },
          },
    tactics:
      tacticsHighest === null ? null : { highestRating: tacticsHighest },
    puzzleRush:
      puzzleRushBest === null
        ? null
        : {
            bestScore: puzzleRushBest,
            totalAttempts:
              puzzleRushAttempts === null
                ? null
                : Math.max(0, Math.trunc(puzzleRushAttempts)),
          },
    recentGames,
  };
}
