import { spawn } from "node:child_process";
import { projectRoot } from "./log.mjs";
for (const args of [
  [
    "node_modules/typescript/bin/tsc",
    "--noEmit",
    "-p",
    "apps/server/tsconfig.json",
  ],
  ["--import", "tsx", "--test", "apps/server/test/contract.test.ts", "apps/server/test/source.test.ts"],
]) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      stdio: "inherit",
    });
    child.on("exit", (c) =>
      c ? reject(new Error("Check failed")) : resolve(),
    );
  });
}
await import("./build.mjs");
