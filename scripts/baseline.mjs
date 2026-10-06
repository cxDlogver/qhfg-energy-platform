import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { projectRoot, logStep } from "./log.mjs";
const root = path.join(projectRoot, ".local/baseline-web"),
  require = createRequire(path.join(root, "package.json"));
const { build } = await import(
  pathToFileURL(
    path.join(
      path.dirname(require.resolve("vite/package.json")),
      "dist/node/index.js",
    ),
  ).href
);
process.chdir(root);
await build({
  root,
  configFile: path.join(root, "vite.config.js"),
  build: { outDir: "../baseline-dist", emptyOutDir: true },
});
await logStep(
  "原版基线构建",
  "冻结原版前端，保留原始全量 UI/ECharts/Cesium 入口、字体与动画资源；仅替换本地 API/底图/天气凭据。原版静态目录由测量服务器补充挂载，不伪造构建优化。",
);
