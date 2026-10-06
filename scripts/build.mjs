import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { projectRoot, logStep } from "./log.mjs";
await import("./prepare-assets.mjs");
await new Promise((resolve, reject) => {
  const child = spawn(
    process.execPath,
    ["node_modules/typescript/bin/tsc", "-p", "apps/server/tsconfig.json"],
    { cwd: projectRoot, stdio: "inherit" },
  );
  child.on("exit", (c) =>
    c ? reject(new Error("Backend compile failed")) : resolve(),
  );
});
const require = createRequire(path.join(projectRoot, "apps/web/package.json"));
const { build } = await import(
  pathToFileURL(
    path.join(
      path.dirname(require.resolve("vite/package.json")),
      "dist/node/index.js",
    ),
  ).href
);
process.chdir(path.join(projectRoot, "apps/web"));
await build({
  root: path.join(projectRoot, "apps/web"),
  configFile: path.join(projectRoot, "apps/web/vite.config.js"),
});
await logStep(
  "构建通过",
  "TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。",
);
