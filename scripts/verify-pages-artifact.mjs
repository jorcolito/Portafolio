import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function collectJavascript(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectJavascript(entryPath)));
    else if (entry.name.endsWith(".js")) files.push(entryPath);
  }

  return files;
}

export async function verifyPagesArtifact(
  siteDirectoryInput = "_site",
  repository = process.env.GITHUB_REPOSITORY ?? "",
) {
  const siteDirectory = path.resolve(siteDirectoryInput);
  const repositoryName = repository.split("/").pop() ?? "";
  const basePath = repositoryName.endsWith(".github.io")
    ? ""
    : `/${repositoryName}`;
  const publicSnapshotUrl = `${basePath}/data/chess-snapshot.json`;
  const snapshotPath = path.join(siteDirectory, "data", "chess-snapshot.json");
  await access(snapshotPath);
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));

  assert(snapshot.username === "jorcolito", "Chess snapshot username is invalid");
  assert(
    snapshot.profileUrl === "https://www.chess.com/member/jorcolito",
    "Chess snapshot profile URL is invalid",
  );
  assert(
    ["live", "partial", "unavailable"].includes(snapshot.status),
    "Chess snapshot status is invalid",
  );
  assert(
    !Number.isNaN(Date.parse(snapshot.fetchedAt)),
    "Chess snapshot date is invalid",
  );
  assert(Array.isArray(snapshot.recentGames), "Chess recent games must be an array");

  const javascriptFiles = await collectJavascript(siteDirectory);
  let clientBundle = "";
  for (const file of javascriptFiles) {
    const source = await readFile(file, "utf8");
    if (source.includes("chess-snapshot.json")) clientBundle += source;
  }

  assert(clientBundle, "Chess snapshot loader is missing from the client artifact");
  assert(
    clientBundle.includes(publicSnapshotUrl),
    `Client artifact does not use Pages-safe URL ${publicSnapshotUrl}`,
  );
  if (basePath) {
    assert(
      !clientBundle.includes('"/data/chess-snapshot.json"'),
      "Client artifact still contains a root-relative Chess snapshot URL",
    );
  }

  console.log(
    `Pages artifact verified: ${publicSnapshotUrl} · ${snapshot.recentGames.length} recent games`,
  );
  return { basePath, publicSnapshotUrl, snapshot };
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  await verifyPagesArtifact(process.argv[2], process.argv[3]);
}
