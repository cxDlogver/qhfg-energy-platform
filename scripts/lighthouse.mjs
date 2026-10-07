import {randomUUID} from "node:crypto";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "playwright";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { projectRoot, logStep } from "./log.mjs";
import { login, dataPage, chromePath, chromeFlags } from "./browser.mjs";
const variant = process.argv[2] ?? "optimized",
  runs = Number(process.env.LH_RUNS ?? 3);
const base =
  process.env.PERF_BASE_URL ??
  "http://127.0.0.1:" + (variant === "baseline" ? 4174 : 4173);
const destination = path.join(projectRoot, "docs/performance/reports", variant);
await mkdir(destination, { recursive: true });
const metrics = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
  "total-byte-weight",
];
const results = await readFile(path.join(destination, "summary.json"), "utf8")
  .then(JSON.parse)
  .catch(() => []);
await logStep(
  "Lighthouse 开始：" + variant,
  "本地 Lighthouse Node API；实际本地表单登录后再审计数据页（provider 以本轮记录为准），disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。" +
    runs +
    " 次/设备/页面。",
);
for (const device of ["desktop", "mobile"])
  for (const route of (process.env.LH_ROUTES ?? "home,data").split(","))
    for (let run = 1; run <= runs; run++) {
      if (
        results.some(
          (r) => r.device === device && r.route === route && r.run === run,
        )
      )
        continue;
      const profile = path.join(
        projectRoot,
        ".local/lighthouse",
        variant + "-" + device + "-" + route + "-" + run + "-" + randomUUID(),
      );
      await mkdir(profile, { recursive: true });
      const chrome = await launch({
        chromePath,
        chromeFlags,
        userDataDir: profile,
      });
      let browser;
      try {
        browser = await chromium.connectOverCDP(
          "http://127.0.0.1:" + chrome.port,
        );
        const context = browser.contexts()[0],
          page = await context.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });
        await login(page, base);
        if (route === "data") await dataPage(page, base);
        const url = base + "/#/home" + (route === "data" ? "/dataService" : "");
        const config = {
          extends: "lighthouse:default",
          settings: {
            onlyCategories: ["performance"],
            disableStorageReset: true,
            throttlingMethod: "simulate",
            ...(device === "desktop"
              ? {
                  formFactor: "desktop",
                  screenEmulation: {
                    mobile: false,
                    width: 1920,
                    height: 1080,
                    deviceScaleFactor: 1,
                    disabled: false,
                  },
                  throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                  },
                }
              : { formFactor: "mobile" }),
          },
        };
        const result = await lighthouse(
          url,
          {
            port: chrome.port,
            output: ["json", "html"],
            logLevel: "error",
            disableStorageReset: true,
          },
          config,
        );
        if (result.lhr.runtimeError)
          throw new Error(result.lhr.runtimeError.message);
        if (
          route === "data" &&
          !result.lhr.finalDisplayedUrl.includes("dataService")
        )
          throw new Error("Audit redirected away from authenticated data page");
        const row = {
          variant,
          device,
          route,
          run,
          fetchTime: result.lhr.fetchTime,
          lighthouseVersion: result.lhr.lighthouseVersion,
          browserVersion: result.lhr.environment.hostUserAgent,
          performance: result.lhr.categories.performance.score * 100,
          ...Object.fromEntries(
            metrics.map((id) => [
              id,
              result.lhr.audits[id]?.numericValue ?? null,
            ]),
          ),
          warnings: result.lhr.runWarnings,
        };
        const id = device + "-" + route + "-" + run;
        await writeFile(
          path.join(destination, id + ".json"),
          JSON.stringify(result.lhr, null, 2),
        );
        await writeFile(path.join(destination, id + ".html"), result.report[1]);
        results.push(row);
        await writeFile(
          path.join(destination, "summary.json"),
          JSON.stringify(results, null, 2),
        );
        await logStep(
          "Lighthouse 完成 " + variant + "/" + id,
          JSON.stringify(row),
        );
        console.log(JSON.stringify(row));
      } finally {
        await browser?.close().catch(() => {});
        await chrome.kill();
      }
    }
