import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicRoots = [
  "/assets/",
  "/scenes/",
  "/portraits/",
  "/credentials/",
  "/data/",
  "/favicon.svg",
  "/og.png",
  "/api/chess",
];
const textExtensions = new Set([".html", ".js", ".css", ".json", ".svg"]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(entryPath)));
    else if (textExtensions.has(path.extname(entry.name))) files.push(entryPath);
  }

  return files;
}

export async function prepareGitHubPages(
  siteDirectoryInput = "_site",
  repository = process.env.GITHUB_REPOSITORY ?? "",
) {
  const siteDirectory = path.resolve(siteDirectoryInput);
  const repositoryName = repository.split("/").pop() ?? "";
  const basePath = repositoryName.endsWith(".github.io")
    ? ""
    : `/${repositoryName}`;
  const files = await collectFiles(siteDirectory);
  let changedFiles = 0;

  for (const filePath of files) {
    const original = await readFile(filePath, "utf8");
    let updated = original;

    if (basePath) {
      for (const root of publicRoots) {
        const rootPattern = new RegExp(
          `(?<!${escapeRegExp(basePath)})${escapeRegExp(root)}`,
          "g",
        );
        updated = updated.replace(rootPattern, `${basePath}${root}`);
      }
    }

    if (updated !== original) {
      await writeFile(filePath, updated, "utf8");
      changedFiles += 1;
    }
  }

  console.log(
    `GitHub Pages base path: ${basePath || "/"} · rewritten files: ${changedFiles}`,
  );
  return { basePath, changedFiles };
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  await prepareGitHubPages(process.argv[2], process.argv[3]);
}
