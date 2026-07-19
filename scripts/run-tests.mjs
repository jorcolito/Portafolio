// Importing the suites into one Node process keeps the test command compatible
// with Node 22 in GitHub Actions and with restricted Windows environments that
// do not allow the test runner to spawn one child process per file.
await import("../tests/rendered-html.test.mjs");
await import("../tests/github-pages-chess.test.mjs");
