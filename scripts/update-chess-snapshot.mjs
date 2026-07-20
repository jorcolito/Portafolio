import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const USERNAME = "jorcolito";
const API_ROOT = `https://api.chess.com/pub/player/${USERNAME}`;
const PROFILE_URL = `https://www.chess.com/member/${USERNAME}`;
const USER_AGENT =
  "Jorge Colamarco portfolio snapshot updater/1.0 (Chess.com member: jorcolito)";
const DEFAULT_OUTPUT = "public/data/chess-snapshot.json";

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

function outputPathFromArgs() {
  const outputIndex = process.argv.indexOf("--output");
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : DEFAULT_OUTPUT;
  return path.resolve(output || DEFAULT_OUTPUT);
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nonNegativeInteger(value) {
  const number = finiteNumber(value);
  return number === null ? 0 : Math.max(0, Math.trunc(number));
}

async function fetchJson(url) {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function readFallback(outputPath) {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return null;
  }
}

function resultFor(code) {
  if (code === "win") return "win";
  if (DRAW_RESULTS.has(code)) return "draw";
  if (LOSS_RESULTS.has(code)) return "loss";
  return "unknown";
}

function normalizeGame(game) {
  const whiteUsername = game?.white?.username;
  const blackUsername = game?.black?.username;
  const endedAt = finiteNumber(game?.end_time);
  if (!whiteUsername || !blackUsername || endedAt === null || !game?.url) {
    return null;
  }

  const normalizedUsername = USERNAME.toLocaleLowerCase();
  const playedWhite = whiteUsername.toLocaleLowerCase() === normalizedUsername;
  const playedBlack = blackUsername.toLocaleLowerCase() === normalizedUsername;
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

function normalizeGames(games) {
  return (Array.isArray(games) ? games : [])
    .filter((game) => game?.rules === undefined || game.rules === "chess")
    .sort((left, right) => (right?.end_time ?? 0) - (left?.end_time ?? 0))
    .map(normalizeGame)
    .filter(Boolean)
    .slice(0, 5);
}

function statsSnapshot(stats, fallback) {
  if (!stats) {
    return {
      rapid: fallback?.rapid ?? null,
      tactics: fallback?.tactics ?? null,
      puzzleRush: fallback?.puzzleRush ?? null,
    };
  }

  const rapidRating = finiteNumber(stats.chess_rapid?.last?.rating);
  const tacticsHighest = finiteNumber(stats.tactics?.highest?.rating);
  const puzzleRushBest = finiteNumber(stats.puzzle_rush?.best?.score);
  const puzzleRushAttempts = finiteNumber(
    stats.puzzle_rush?.best?.total_attempts,
  );

  return {
    rapid:
      rapidRating === null
        ? null
        : {
            rating: rapidRating,
            bestRating: finiteNumber(stats.chess_rapid?.best?.rating),
            record: {
              wins: nonNegativeInteger(stats.chess_rapid?.record?.win),
              losses: nonNegativeInteger(stats.chess_rapid?.record?.loss),
              draws: nonNegativeInteger(stats.chess_rapid?.record?.draw),
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
  };
}

export async function updateChessSnapshot({
  outputPath = path.resolve(DEFAULT_OUTPUT),
  offline = false,
} = {}) {
  outputPath = path.resolve(outputPath);
  const fallback = await readFallback(outputPath);
  const stats = offline ? null : await fetchJson(`${API_ROOT}/stats`);
  const archives = offline
    ? null
    : await fetchJson(`${API_ROOT}/games/archives`);

  const latestArchive = Array.isArray(archives?.archives)
    ? archives.archives.at(-1)
    : null;
  const archive = latestArchive?.startsWith(`${API_ROOT}/games/`)
    ? await fetchJson(latestArchive)
    : null;

  if (!stats && !archive) {
    console.warn(
      `Chess.com unavailable; keeping bundled snapshot at ${path.relative(process.cwd(), outputPath)}`,
    );
    return null;
  }

  const metrics = statsSnapshot(stats, fallback);
  const snapshot = {
    username: USERNAME,
    profileUrl: PROFILE_URL,
    status: stats && archive ? "live" : "partial",
    fetchedAt: new Date().toISOString(),
    ...metrics,
    recentGames: archive
      ? normalizeGames(archive.games)
      : Array.isArray(fallback?.recentGames)
        ? fallback.recentGames.slice(0, 5)
        : [],
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(
    `Chess.com snapshot updated: ${path.relative(process.cwd(), outputPath)} (${snapshot.status}, ${snapshot.recentGames.length} games)`,
  );
  return snapshot;
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  await updateChessSnapshot({
    outputPath: outputPathFromArgs(),
    offline: process.argv.includes("--offline"),
  });
}
