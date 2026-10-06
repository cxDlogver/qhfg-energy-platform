import { cp, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { projectRoot } from "./log.mjs";
const require = createRequire(path.join(projectRoot, "apps/web/package.json"));
const cesiumPackage = path.dirname(require.resolve("cesium/package.json"));
const publicRoot = path.join(projectRoot, "apps/web/public");
await mkdir(publicRoot, { recursive: true });
await cp(
  path.join(cesiumPackage, "Build/Cesium"),
  path.join(publicRoot, "cesium"),
  { recursive: true, force: true },
);
try {
  await access(path.join(projectRoot, "apps/web/static"));
  await cp(
    path.join(projectRoot, "apps/web/static"),
    path.join(publicRoot, "static"),
    { recursive: true, force: true },
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
console.log("[assets] Cesium and original static resources prepared");
