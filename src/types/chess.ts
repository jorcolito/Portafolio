export type ChessSnapshotStatus = "live" | "partial" | "unavailable";

export type ChessGameResult = "win" | "loss" | "draw" | "unknown";

export interface ChessRatingRecord {
  readonly wins: number;
  readonly losses: number;
  readonly draws: number;
}

export interface ChessRapidSnapshot {
  readonly rating: number;
  readonly bestRating: number | null;
  readonly record: ChessRatingRecord;
}

export interface ChessTacticsSnapshot {
  /** Chess.com exposes the highest recorded Tactics rating, not a live puzzle ELO. */
  readonly highestRating: number;
}

export interface ChessPuzzleRushSnapshot {
  /** Chess.com exposes Puzzle Rush as a score, not as a rating. */
  readonly bestScore: number;
  readonly totalAttempts: number | null;
}

export interface ChessRecentGame {
  readonly url: string;
  readonly endedAt: string;
  readonly opponent: string;
  readonly result: ChessGameResult;
  readonly color: "white" | "black";
  readonly timeClass: string;
  readonly timeControl: string;
  readonly playerRating: number | null;
  readonly opponentRating: number | null;
}

export interface ChessSnapshot {
  readonly username: string;
  readonly profileUrl: string;
  readonly status: ChessSnapshotStatus;
  readonly fetchedAt: string;
  readonly rapid: ChessRapidSnapshot | null;
  readonly tactics: ChessTacticsSnapshot | null;
  readonly puzzleRush: ChessPuzzleRushSnapshot | null;
  readonly recentGames: readonly ChessRecentGame[];
}
