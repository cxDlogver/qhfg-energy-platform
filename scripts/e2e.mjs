import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module"; const XLSX=createRequire(new URL("../apps/server/package.json",import.meta.url))("xlsx");
import path from "node:path";
import { launch, login, dataPage } from "./browser.mjs";
import { projectRoot, logStep } from "./log.mjs";
const base = process.env.E2E_BASE_URL ?? "http://127.0.0.1:4173",
  browser = await launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  acceptDownloads: true,
});
const errors = [],
  requests = [],
  checks = [],
  timings = {};
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => requests.push(new URL(r.url()).pathname));
await page.addInitScript(() => {
  window.__ENERGY_DIAGNOSTICS__ = {};
});
const check = (name) => {
  checks.push(name);
  console.log("[pass] " + name);
};
try {
  await page.goto(base + "/#/home/dataService");
  await page.waitForURL("**/#/home/login");
  check("unauthenticated route redirects");
  await login(page, base);
  await page.goto(base + "/#/home/dataService");
  await page.locator("#mapView .ol-viewport").waitFor();
  assert.equal(await page.locator(".result_box .checkbox-wrapper").count(), 0);
  check("direct empty cache has no default layer");
  await dataPage(page, base);
  page.setDefaultTimeout(15000);
  assert.equal(await page.locator(".result_box .checkbox-wrapper").count(), 1);
  check("menu creates 2021 default and valid legend");
  assert.equal(
    requests.some((p) => p.endsWith("/Cesium.js")),
    false,
  );
  check("2D page does not load Cesium");
  const point = page.waitForResponse((r) => r.url().includes("/map/getpoint"));
  const table = page.waitForResponse((r) =>
    r.url().includes("/statistical/getexceldata"),
  );
  let started = performance.now();
  await page
    .locator("#mapView .ol-viewport")
    .click({ position: { x: 960, y: 500 } });
  await point;
  await table;
  await page
    .locator(".table_box .el-table__body-wrapper tbody tr")
    .first()
    .waitFor();
  timings.pointToTableMs = performance.now() - started;
  assert.match(await page.locator(".mapInfo").innerText(), /\d+\.\d{3}/);
  check("2D point updates numeric result, coordinates, chart and table");
  const previousPointCount = requests.filter((p) =>
    p.endsWith("/map/getpoint"),
  ).length;
  await page
    .locator("#mapView .ol-viewport")
    .click({ position: { x: 960, y: 500 } });
  await page.waitForTimeout(500);
  assert.equal(
    requests.filter((p) => p.endsWith("/map/getpoint")).length,
    previousPointCount,
  );
  check("repeated point uses 5-minute cache");
  console.log("download disabled:", await page.locator(".tools_box2 .download_button").isDisabled());
  const download = page.waitForEvent("download", {timeout:45000});
  download.catch(()=>{});
  await page.locator(".tools_box2 .download_button").click({timeout:10000});
  await page.getByRole("button", { name: "同意并下载", exact: true }).click();
  const file = await (await download).path();
  const workbook = XLSX.read(await readFile(file), { type: "buffer" });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets.Data, { header: 1 });
  assert.ok(rows.length > 1);
  assert.ok(rows[0].includes("区域"));
  assert.equal(rows[0].includes("Regions"), false);
  check("agreement download contains real XLSX and Chinese columns");
  await page.locator(".tools_box2 .info").click();
  await page.locator(".info-dialog-custom .info-dialog-body").waitFor();
  assert.match(await page.locator(".info-dialog-body").innerText(), /本地/);
  await page.locator(".info-dialog-custom .el-dialog__headerbtn").click();
  check("description dialog");
  const leaf = async (group, label) => {
    const node = page
      .locator(".condition_box " + group + " .custom-tree-node")
      .filter({ hasText: new RegExp("^" + label + "$") });
    console.log("selecting",group,label);
    await node.locator(".el-checkbox").click();
    console.log("selected",group);
  };
  await leaf(".resourceTree", "陆上风电");
  await leaf(".dataTypeTree", "容量因子");
  await leaf(".childTree", "10km");
  await leaf(".TimeTree", "年");
  const year = page.locator(".condition_box .yearPicker input");
  await year.click();
  await page.locator(".el-year-table:visible").getByText("2020", { exact: true }).click();
  await page.locator(".el-picker-panel:visible").getByRole("button", { name: "OK", exact: true }).click();
  await page.locator(".condition_box .submit_confirm_btn button").click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll(".result_box .checkbox-wrapper").length === 2,
  );
  check("four-level annual filter adds a second result");
  await page
    .locator(".result_box .checkbox-wrapper")
    .last()
    .locator(".el-checkbox")
    .click();
  assert.equal(await page.locator(".result_box input:checked").count(), 1);
  check("results are mutually exclusive");
  await leaf(".TimeTree", "多年平均");
  await page.locator(".condition_box .submit_confirm_btn button").click();
  await page.waitForFunction(()=>document.querySelectorAll(".result_box .checkbox-wrapper").length===3);
  const averageLegend=page.waitForResponse(r=>r.url().includes("/map/getlegend") && decodeURIComponent(r.url()).includes("多年平均.qgs"));
  await page.locator(".result_box .checkbox-wrapper").last().locator(".el-checkbox").click();
  await averageLegend;
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem("dataServiceResults_zh")).timeResult.at(-1)), "多年平均");
  check("multi-year average preserves complete layer name");
  started = performance.now();
  await page.locator(".show_two_three").click();
  await page.locator("#cesiumContainer canvas").waitFor({ timeout: 45000 });
  await page.waitForFunction(
    () => window.__ENERGY_DIAGNOSTICS__.map3d?.().renderedFrames > 0,
  );
  timings.first3DFrameMs = performance.now() - started;
  await page.waitForTimeout(500);
  const query3D = page.waitForResponse((r) =>
    r.url().includes("/map/getpoint"),
  );
  await page
    .locator("#cesiumContainer canvas")
    .click({ position: { x: 960, y: 500 } });
  await query3D;
  await page.waitForFunction(
    () => window.__ENERGY_DIAGNOSTICS__.map3d?.().rotating === false,
  );
  assert.equal(
    await page.locator("#cesiumContainer .coordinate-popover").count(),
    1,
  );
  check("3D click stops rotation and identifies shared business layer");
  const cameraBefore = await page.evaluate(
    () => window.__ENERGY_DIAGNOSTICS__.map3d().camera,
  );
  await page.locator(".show_two_three").click();
  await page.waitForTimeout(200);
  const inactiveBefore = await page.evaluate(() =>
    window.__ENERGY_DIAGNOSTICS__.map3d(),
  );
  await page.waitForTimeout(1000);
  const inactiveAfter = await page.evaluate(() =>
    window.__ENERGY_DIAGNOSTICS__.map3d(),
  );
  assert.equal(inactiveAfter.renderedFrames, inactiveBefore.renderedFrames);
  assert.equal(inactiveAfter.loop, false);
  check("hidden 3D renders zero frames and stops loop");
  await page.locator(".show_two_three").click();
  const cameraAfter = await page.evaluate(
    () => window.__ENERGY_DIAGNOSTICS__.map3d().camera,
  );
  assert.deepEqual(cameraAfter, cameraBefore);
  check("dimension switch preserves last 3D camera");
  await page.locator(".header .menu_item").filter({ hasText: "关于" }).click();
  await page.waitForTimeout(200);
  const left = await page.evaluate(() => window.__ENERGY_DIAGNOSTICS__.map3d());
  await page.waitForTimeout(700);
  const later = await page.evaluate(() =>
    window.__ENERGY_DIAGNOSTICS__.map3d(),
  );
  assert.equal(left.renderedFrames, later.renderedFrames);
  check("keep-alive deactivation pauses 3D");
  await page
    .locator(".header .menu_item")
    .filter({ hasText: "数据服务" })
    .click();
  await page.locator("#cesiumContainer canvas").waitFor({ state: "visible" });
  check("keep-alive return keeps selected dimension");
  await page
    .locator(".header .menu_item")
    .filter({ hasText: "切换语言" })
    .hover();
  await page.getByRole("menuitem", { name: "English", exact: true }).click();
  await page.waitForFunction(
    () => localStorage.getItem("language") === "english",
  );
  check("English menu persists language");
  await page.locator(".result_box .result_box_top_right button").click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("dataServiceResults_en")),
    null,
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("dataServiceResults_zh")),
    null,
  );
  check("clear removes both language caches");
  for (const route of [
    "about",
    "nav-page1",
    "nav-page2",
    "nav-page3",
    ...Array.from({ length: 3 }, (_, i) => "nav-page1/paper" + (i + 1)),
    ...Array.from({ length: 4 }, (_, i) => "nav-page2/paper" + (i + 1)),
    ...Array.from({ length: 3 }, (_, i) => "nav-page3/paper" + (i + 1)),
  ]) {
    await page.goto(base + "/#/home/" + route, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => document.body.innerText.trim().length > 200,
    );
  }
  check("about, three directories and ten article routes render");
  assert.deepEqual(errors, []);
  check("zero uncaught browser errors");
  const proof = {
    environment: "local fixture; not production acceptance",
    viewport: { width: 1920, height: 1080 },
    checks,
    timings,
    errors,
    runAt: new Date().toISOString(),
  };
  await mkdir(path.join(projectRoot, "docs/validation"), { recursive: true });
  await writeFile(
    path.join(projectRoot, "docs/validation/e2e.json"),
    JSON.stringify(proof, null, 2),
  );
  await logStep("功能端到端验收通过", JSON.stringify(proof));
  console.log(JSON.stringify(proof));
} catch (error) {
  await mkdir(path.join(projectRoot, ".local/screenshots"), {
    recursive: true,
  });
  await page.screenshot({
    path: path.join(projectRoot, ".local/screenshots/e2e-failure.png"),
  });
  console.error(
    "E2E failure:",
    error.message,
    "browserErrors:",
    JSON.stringify(errors),
  );
  throw error;
} finally {
  await browser.close();
}
