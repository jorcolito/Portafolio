import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const vinextCli = join(
  process.cwd(),
  "node_modules",
  "vinext",
  "dist",
  "cli.js",
);

const child = spawn(process.execPath, [vinextCli, "build"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

let transcript = "";

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  transcript += text;
  process.stdout.write(text);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  transcript += text;
  process.stderr.write(text);
});

child.on("error", (error) => {
  console.error("Unable to start the vinext build:", error);
  process.exitCode = 1;
});

child.on("close", (code) => {
  if (code === 0) {
    process.exitCode = 0;
    return;
  }

  const isKnownWindowsShutdownAssertion =
    process.platform === "win32" &&
    transcript.includes("Build complete.") &&
    transcript.includes("UV_HANDLE_CLOSING") &&
    existsSync(join(process.cwd(), "dist", "client", "index.html"));

  if (isKnownWindowsShutdownAssertion) {
    console.warn(
      "[build] vinext completed successfully; ignored its Windows-only libuv shutdown assertion.",
    );
    process.exitCode = 0;
    return;
  }

  process.exitCode = code ?? 1;
});
