import { performance } from "node:perf_hooks";

const base = (process.env.STRESS_TARGET_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const path = process.env.STRESS_PATH ?? "/insights";
const total = Math.max(1, Number(process.env.STRESS_REQUESTS ?? 200));
const concurrency = Math.max(1, Number(process.env.STRESS_CONCURRENCY ?? 20));
const cookie = process.env.STRESS_ADMIN_COOKIE;
const timings = [];
let failures = 0;
let cursor = 0;

async function worker() {
  while (cursor < total) {
    cursor += 1;
    const started = performance.now();
    try {
      const response = await fetch(`${base}${path}`, {
        headers: cookie ? { cookie } : undefined,
        redirect: "manual",
      });
      if (
        response.status >= 400 ||
        response.status === 307 ||
        response.status === 308
      )
        failures += 1;
      await response.arrayBuffer();
    } catch {
      failures += 1;
    } finally {
      timings.push(performance.now() - started);
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(concurrency, total) }, () => worker()),
);
timings.sort((a, b) => a - b);
const percentile = (value) =>
  timings[
    Math.min(timings.length - 1, Math.ceil(timings.length * value) - 1)
  ] ?? 0;
const result = {
  target: `${base}${path}`,
  requests: total,
  concurrency,
  failures,
  p50_ms: Math.round(percentile(0.5)),
  p95_ms: Math.round(percentile(0.95)),
  p99_ms: Math.round(percentile(0.99)),
};
console.log(JSON.stringify(result, null, 2));
if (
  failures > 0 ||
  result.p95_ms > Number(process.env.STRESS_P95_LIMIT_MS ?? 750)
)
  process.exitCode = 1;
