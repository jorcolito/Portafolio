import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza la entrada bilingüe de Jorge Colamarco", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Jorge Colamarco[^<]*Portafolio interactivo/);
  assert.match(html, /Jorge Colamarco/);
  assert.match(html, /Portafolio interactivo/);
  assert.match(html, /Entrar al portafolio/);
  assert.match(html, /Español/);
  assert.match(html, /English/);
  assert.match(html, /viewport-fit=cover/);
  assert.doesNotMatch(html, /JORGE\.EXE|Developer(?:&apos;|')s Tale|JORGE LABS|Press Enter|Build 0\.1/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("conserva datos tipados y Phaser desacoplado de React", async () => {
  const [packageJson, projects, gameCanvas, contracts, localized] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../src/data/projects.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../src/components/game/GameCanvas.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../src/game/types/contracts.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/data/localized.ts", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /"phaser": "\^3\.90\.0"/);
  assert.match(projects, /id: "cardrive"/);
  assert.match(projects, /id: "shiko"/);
  assert.match(projects, /id: "comernova"/);
  assert.match(projects, /availability: "placeholder"/);
  assert.match(gameCanvas, /import\("\.\.\/\.\.\/game"\)/);
  assert.match(contracts, /GameToReactEvent/);
  assert.match(contracts, /ReactToGameCommand/);
  assert.match(localized, /Product-minded software developer/);
  assert.match(localized, /getLocalizedDialogue/);
  assert.doesNotMatch(gameCanvas, /new Phaser\.Game/);
});
