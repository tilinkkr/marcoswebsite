import { once } from "node:events";
import { spawn } from "node:child_process";
import { join } from "node:path";

const projectRoot = process.cwd();
const port = 3177;
const baseUrl = `http://127.0.0.1:${port}`;
const nextBin = join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const playwrightBin = join(
  projectRoot,
  "node_modules",
  "@playwright",
  "test",
  "cli.js",
);

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function isMarcosReady() {
  try {
    const response = await fetch(baseUrl);
    const html = await response.text();
    return response.ok && html.includes('data-testid="vision-reveal"');
  } catch {
    return false;
  }
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(
        `MARCOS test server exited with code ${server.exitCode}.`,
      );
    }
    if (await isMarcosReady()) return;
    await delay(250);
  }

  throw new Error(`MARCOS test server did not become ready at ${baseUrl}.`);
}

async function stopServer(server) {
  if (!server || server.exitCode !== null) return;

  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), delay(2_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

let server;

try {
  if (!(await isMarcosReady())) {
    server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
    });
    await waitForServer(server);
  }

  const runner = spawn(
    process.execPath,
    [playwrightBin, "test", ...process.argv.slice(2)],
    {
      cwd: projectRoot,
      env: process.env,
      stdio: "inherit",
    },
  );
  const [exitCode] = await once(runner, "exit");
  process.exitCode = exitCode ?? 1;
} finally {
  await stopServer(server);
}
