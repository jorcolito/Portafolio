import assert from "node:assert/strict";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { prepareGitHubPages } from "../scripts/prepare-github-pages.mjs";
import { updateChessSnapshot } from "../scripts/update-chess-snapshot.mjs";
import { verifyPagesArtifact } from "../scripts/verify-pages-artifact.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const snapshotPath = path.join(
  projectRoot,
  "public",
  "data",
  "chess-snapshot.json",
);

test("empaqueta un snapshot público de Chess.com verificable", async () => {
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));

  assert.equal(snapshot.username, "jorcolito");
  assert.equal(
    snapshot.profileUrl,
    "https://www.chess.com/member/jorcolito",
  );
  assert.ok(["live", "partial"].includes(snapshot.status));
  assert.ok(!Number.isNaN(Date.parse(snapshot.fetchedAt)));
  assert.ok(snapshot.rapid?.rating > 0);
  assert.ok(Array.isArray(snapshot.recentGames));
  assert.ok(snapshot.recentGames.length > 0);
  assert.ok(snapshot.recentGames.length <= 5);

  for (const game of snapshot.recentGames) {
    assert.match(game.url, /^https:\/\/www\.chess\.com\/game\//);
    assert.ok(!Number.isNaN(Date.parse(game.endedAt)));
    assert.ok(["win", "loss", "draw", "unknown"].includes(game.result));
  }
});

test("el actualizador offline conserva el fallback empaquetado", async (t) => {
  const temporaryDirectory = await mkdtemp(
    path.join(os.tmpdir(), "jorge-exe-chess-offline-"),
  );
  t.after(() => rm(temporaryDirectory, { recursive: true, force: true }));

  const temporarySnapshot = path.join(temporaryDirectory, "snapshot.json");
  await copyFile(snapshotPath, temporarySnapshot);
  const before = await readFile(temporarySnapshot, "utf8");

  await updateChessSnapshot({ outputPath: temporarySnapshot, offline: true });

  assert.equal(await readFile(temporarySnapshot, "utf8"), before);
});

test("prepara y verifica la ruta /Portafolio del artefacto", async (t) => {
  const temporaryDirectory = await mkdtemp(
    path.join(os.tmpdir(), "jorge-exe-pages-artifact-"),
  );
  t.after(() => rm(temporaryDirectory, { recursive: true, force: true }));

  await mkdir(path.join(temporaryDirectory, "assets"), { recursive: true });
  await mkdir(path.join(temporaryDirectory, "data"), { recursive: true });
  await writeFile(
    path.join(temporaryDirectory, "assets", "app.js"),
    'fetch("/data/chess-snapshot.json");fetch("/api/chess");',
    "utf8",
  );
  await copyFile(
    snapshotPath,
    path.join(temporaryDirectory, "data", "chess-snapshot.json"),
  );

  await prepareGitHubPages(temporaryDirectory, "jorcolito/Portafolio");
  await verifyPagesArtifact(temporaryDirectory, "jorcolito/Portafolio");

  const bundle = await readFile(
    path.join(temporaryDirectory, "assets", "app.js"),
    "utf8",
  );
  assert.match(bundle, /\/Portafolio\/data\/chess-snapshot\.json/);
  assert.match(bundle, /\/Portafolio\/api\/chess/);
});
