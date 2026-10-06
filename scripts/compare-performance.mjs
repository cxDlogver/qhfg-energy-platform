import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { projectRoot, logStep } from "./log.mjs";
const before = JSON.parse(
    await readFile(
      path.join(projectRoot, "docs/performance/reports/baseline/summary.json"),
      "utf8",
    ),
  ),
  after = JSON.parse(
    await readFile(
      path.join(projectRoot, "docs/performance/reports/optimized/summary.json"),
      "utf8",
    ),
  );
const median = (values) => {
  const a = values.sort((a, b) => a - b);
  return a.length % 2
    ? a[Math.floor(a.length / 2)]
    : (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
};
const keys = [
  "performance",
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
  "total-byte-weight",
];
const groups = [];
for (const device of ["desktop", "mobile"])
  for (const route of ["home", "data"]) {
    const rows = (key) => ({
      before: before
        .filter((r) => r.device === device && r.route === route)
        .map((r) => r[key]),
      after: after
        .filter((r) => r.device === device && r.route === route)
        .map((r) => r[key]),
    });
    const result = { device, route, metrics: {} };
    for (const key of keys) {
      const values = rows(key);
      if (values.before.length !== 3 || values.after.length !== 3)
        throw new Error("Each group requires three complete runs");
      const b = median(values.before),
        a = median(values.after);
      result.metrics[key] = {
        beforeMedian: b,
        afterMedian: a,
        beforeRange: [Math.min(...values.before), Math.max(...values.before)],
        afterRange: [Math.min(...values.after), Math.max(...values.after)],
        changePercent: b === 0 ? null : ((a - b) / b) * 100,
      };
    }
    groups.push(result);
  }
await writeFile(
  path.join(projectRoot, "docs/performance/comparison.json"),
  JSON.stringify(groups, null, 2),
);
let doc =
  "# 页面性能指标与优化结果\n\n本地 Lighthouse Node API 的 24 次生产构建审计：原版与优化版各 12 次，每组 3 次取中位数。数据源为隔离 fixture，真实登录；不代表公网、真实 QGIS/数据库/天气服务性能。\n\n";
doc +=
  "## 测量设置\n\nLighthouse 13.5.0、Chrome 154、Node 24；桌面 1920×1080，模拟网络 RTT 40ms、10Mbps、CPU 1×；移动端 Lighthouse 默认移动模拟网络/CPU配置。浏览器缓存冷启动，disableStorageReset保留经过表单验证的登录和2021默认筛选。原版/新版共用同一fixture API、同一启动预压缩 Brotli quality 4/gzip 预览服务器。导航审计的TBT不是线上INP。LCP移动数据为模拟值，不是实际等待数分钟的墙钟时间。\n\n";
doc +=
  "## 三次中位数\n\n|设备/页面|性能分 前→后|FCP ms 前→后|LCP ms 前→后|SI ms 前→后|TBT ms 前→后|CLS 前→后|传输 MB 前→后|\n|---|---|---|---|---|---|---|---|\n";
for (const g of groups) {
  const v = (k) => g.metrics[k];
  const n = (k, d = 1) =>
    v(k).beforeMedian.toFixed(d) + " → " + v(k).afterMedian.toFixed(d);
  doc +=
    "|" +
    g.device +
    "/" +
    g.route +
    "|" +
    n("performance", 0) +
    "|" +
    n("first-contentful-paint") +
    "|" +
    n("largest-contentful-paint") +
    "|" +
    n("speed-index") +
    "|" +
    n("total-blocking-time") +
    "|" +
    n("cumulative-layout-shift", 4) +
    "|" +
    (v("total-byte-weight").beforeMedian / 1e6).toFixed(2) +
    " → " +
    (v("total-byte-weight").afterMedian / 1e6).toFixed(2) +
    "|\n";
}
doc +=
  "\n完整波动区间：[comparison.json](comparison.json)；每轮原始JSON和可打开HTML位于[reports](reports/)，具体编号为device-page-run。三维在旧实际路由没有入口，因此没有捏造“旧3D分数”；首次3D加载、点位到表格及隐藏零帧由[端到端记录](../validation/e2e.json)单独报告。\n\n";
doc +=
  "## 优化与边界\n\n1. 完整原GIF保留；WebP候选通过像素/时序验证，但移动端退化后未选用。候选证据：[asset-equivalence.json](asset-equivalence.json)。\n2. 三个字体完整WOFF2，保留所有cmap、glyph顺序、metrics和轮廓：[font-equivalence.json](font-equivalence.json)。\n3. 首页移除无用Antd/VChart/全量UI注册，保留完整CSS/reset；目录、图表、OpenLayers与Cesium按页面需要加载。\n4. Cesium首次三维激活才请求；keep-alive停用、二维切换和页签隐藏停止循环。Chart与地图事件清理、取消迟到请求，点缓存保持5分钟并限制200项；OpenLayers实例用shallowRef避免深代理。页面壳体flow-root阻止边距折叠，最终七页像素相同。\n5. 完整实时过程、失败修复和证据边界：[optimization-log.md](optimization-log.md)。\n\n页面沿用原桌面固定面板布局；移动审计衡量加载性能，并不证明小屏交互布局已改进。字体/动画无损验证和冻结截图验证覆盖本地fixture画面；生产底图有效类型、全部能源项目和外部邮件仍需使用受控真实配置验证。\n\n参考：[Lighthouse Node API](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md)、[性能计分](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)、[Cesium Viewer](https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html)、[Sharp WebP](https://sharp.pixelplumbing.com/api-output/#webp)。\n";
await writeFile(path.join(projectRoot, "docs/performance/results.md"), doc);
await logStep(
  "阶段 4：前后性能对比完成",
  groups
    .map(
      (g) =>
        g.device +
        "/" +
        g.route +
        ": performance " +
        g.metrics.performance.beforeMedian +
        " → " +
        g.metrics.performance.afterMedian +
        "; LCP " +
        g.metrics["largest-contentful-paint"].beforeMedian.toFixed(1) +
        " → " +
        g.metrics["largest-contentful-paint"].afterMedian.toFixed(1) +
        "ms",
    )
    .join("\n\n"),
);
console.log(JSON.stringify(groups));
