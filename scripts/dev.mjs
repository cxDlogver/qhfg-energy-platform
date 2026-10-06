import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { projectRoot } from "./log.mjs";
await import("./prepare-assets.mjs");
const require = createRequire(path.join(projectRoot, "apps/web/package.json"));
const vite = path.join(
  path.dirname(require.resolve("vite/package.json")),
  "bin/vite.js",
);
const children = [
  spawn(
    process.execPath,
    ["--import", "tsx", "--watch", "apps/server/src/main.ts"],
    { cwd: projectRoot, stdio: "inherit" },
  ),
  spawn(process.execPath, [vite, "--host", "127.0.0.1", "--port", "5173"], {
    cwd: path.join(projectRoot, "apps/web"),
    stdio: "inherit",
  }),
];
const stop = () => children.forEach((p) => p.kill());
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of children)
  child.on("exit", (code) => {
    stop();
    process.exit(code ?? 0);
  });
