import {
  CHESS_CACHE_SECONDS,
  getChessSnapshot,
  unavailableChessSnapshot,
} from "@/src/lib/chess-com";

export const revalidate = 3600;

export async function GET() {
  const headers = {
    "Cache-Control": `public, s-maxage=${CHESS_CACHE_SECONDS}, stale-while-revalidate=86400`,
  };

  try {
    return Response.json(await getChessSnapshot(), { headers });
  } catch {
    // The portfolio remains usable even if Chess.com changes or is offline.
    return Response.json(unavailableChessSnapshot(), { headers });
  }
}
