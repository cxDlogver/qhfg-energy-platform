import { createRequire } from "node:module";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { projectRoot, logStep } from "./log.mjs";
const require = createRequire(
    new URL("../apps/server/package.json", import.meta.url),
  ),
  XLSX = require("xlsx"),
  yauzl = require("yauzl");
const source = path.resolve(
  process.argv[2] ?? process.env.ORIGINAL_PROJECT_ROOT ?? "",
);
if (!process.argv[2] && !process.env.ORIGINAL_PROJECT_ROOT)
  throw new Error("Usage: pnpm data:import <original project directory>");
const destination = path.join(projectRoot, ".local/source-data");
await mkdir(destination, { recursive: true });
const dict = {
  年: "Year",
  月: "Month",
  小时: "Hour",
  多年平均: "Multi-year average",
  发电侧: "Generation Side",
  电网侧: "Grid Side",
  用户侧: "End-user Side",
};
for (const filename of ["风光资源中英文.xlsx", "数据平台汇总信息表4.xlsx"]) {
  const w = XLSX.readFile(path.join(source, "Data", filename));
  for (const name of w.SheetNames)
    for (const row of XLSX.utils.sheet_to_json(w.Sheets[name], { header: 1 })) {
      for (let i = 0; i < row.length - 1; i++)
        if (
          typeof row[i] === "string" &&
          /[\u4e00-\u9fff]/.test(row[i]) &&
          typeof row[i + 1] === "string" &&
          /^[A-Za-z]/.test(row[i + 1])
        )
          dict[row[i].trim()] = row[i + 1].trim();
      if (
        typeof row[3] === "string" &&
        /[\u4e00-\u9fff]/.test(row[3]) &&
        typeof row[2] === "string" &&
        /^[A-Za-z]/.test(row[2])
      )
        dict[row[3].trim()] = row[2].trim();
    }
}
const w = XLSX.readFile(path.join(source, "Data/数据平台汇总信息表4.xlsx")),
  sheet = w.Sheets[w.SheetNames[0]],
  rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
for (const m of sheet["!merges"] ?? [])
  for (let r = m.s.r; r <= m.e.r; r++)
    for (let c = m.s.c; c <= m.e.c; c++) {
      rows[r] ??= [];
      rows[r][c] = rows[m.s.r][m.s.c];
    }
const nodes = [
    {
      id: 1,
      name: "能源数据",
      nameEn: "Energy data",
      parentId: -1,
      type: "rnode",
      children: [],
    },
  ],
  index = new Map();
function add(names, type, parent = 1) {
  for (const name of names) {
    const key = parent + "/" + name;
    let node = index.get(key);
    if (!node) {
      node = {
        id: nodes.length + 1,
        name,
        nameEn: dict[name] ?? name,
        parentId: parent,
        type,
        children: [],
      };
      nodes.push(node);
      index.set(key, node);
    }
    parent = node.id;
  }
  return parent;
}
function parts(value) {
  return String(value ?? "")
    .replace(/（[^）]*）|\([^)]*\)/g, "")
    .split("/")
    .map((s) => s.trim())
    .filter((s) => s && !/^[-－—]+$/.test(s));
}
for (const row of rows.slice(2)) {
  if (!["发电侧", "电网侧", "用户侧"].includes(String(row[0]))) continue;
  const resource = row.slice(0, 4).flatMap(parts);
  const id = add(resource, "rnode");
  nodes.find((n) => n.id === id).type = "resource";
  let branch = [id];
  for (let c = 4; c <= 8; c++) {
    const next = [];
    for (const parent of branch)
      for (const name of parts(row[c]))
        next.push(
          add(
            [name],
            c < 6 ? "dnode" : c === 6 ? "datatype" : c === 7 ? "space" : "time",
            parent,
          ),
        );
    if (next.length) branch = next;
  }
}
const aliases = {
  风电: "风力发电",
  "mono-Si": "单晶硅",
  mono: "单晶硅",
  CF: "容量因子",
  GP: "发电潜力",
  CP: "装机潜力",
  LCOE: "平准化度电成本",
  year: "年",
  month: "月",
  hour: "小时",
  YR: "年",
  MT: "月",
  HR: "小时",
};
function describe(filename) {
  const fields = filename.split("/").filter(Boolean),
    normalized = fields.map((s) => aliases[s] ?? s);
  const generation =
    normalized.some((s) => s.includes("发电侧") || s.includes("供给侧")) ||
    normalized.some((s) => /风力发电|光伏发电|光热发电|水力发电/.test(s));
  if (!generation) return null;
  let resource;
  if (normalized.includes("风力发电"))
    resource = [
      "发电侧",
      "风力发电",
      normalized.includes("高空风电") ? "高空风电" : "低空风电",
      ...(normalized.includes("高空风电")
        ? []
        : [normalized.includes("海上风电") ? "海上风电" : "陆上风电"]),
    ];
  else if (normalized.includes("光伏发电"))
    resource = [
      "发电侧",
      "光伏发电",
      normalized.includes("分布式光伏发电") || normalized.includes("1km")
        ? "分布式光伏发电"
        : "集中式光伏发电",
    ];
  else if (normalized.includes("光热发电")) resource = ["发电侧", "光热发电"];
  else if (normalized.includes("水力发电")) resource = ["发电侧", "水力发电"];
  else return null;
  const potential = !normalized.includes("现状数据"),
    tech =
      normalized.find((s) =>
        /^(?:\d+(?:\.\d+)?MW|陆基5MW|空基5MW)$/i.test(s),
      ) ??
      normalized.find((s) =>
        [
          "单晶硅",
          "异质结",
          "钙钛矿",
          "钙钛矿_硅叠层",
          "塔式",
          "径流式",
        ].includes(s),
      );
  let data = normalized.find((s) =>
    [
      "容量因子",
      "发电潜力",
      "装机潜力",
      "平准化度电成本",
      "装机量",
      "发电量",
    ].includes(s),
  );
  if (potential && data === "发电量") data = "发电潜力";
  if (potential && data === "装机量") data = "装机潜力";
  const space = normalized.find((s) => /^\d+(?:\.\d+)?(?:km|m)$/.test(s)),
    scale = normalized.find((s) => ["年", "月", "小时"].includes(s));
  if (!tech || !data || !space || !scale) return null;
  const product = [
    ...resource,
    potential ? "潜力数据" : "现状数据",
    tech.replace(/mw$/i, "MW"),
    data,
    space,
  ].join("/");
  const base = path.posix.basename(filename),
    date = base.match(
      /(?:^|[^0-9])((?:19|20)\d{2}(?:\d{2}){0,3})(?:[^0-9]|$)/,
    )?.[1],
    year =
      normalized.find((s) => /^(19|20)\d{2}$/.test(s)) ??
      date?.slice(0, 4) ??
      base.match(/(?:19|20)\d{2}/)?.[0] ??
      "2021";
  return { product, scale, date, year, base };
}
async function walk(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(f)));
    else if (e.name.endsWith(".zip")) files.push(f);
  }
  return files;
}
const archives = (await walk(path.join(source, "Data"))).sort(
  (a, b) =>
    Number(b.includes("最新")) - Number(a.includes("最新")) ||
    b.localeCompare(a),
);
const rasters = {},
  workbooks = {};
let skippedLargeRasters = 0,
  entries = 0;
for (const archive of archives) {
  await new Promise((resolve, reject) =>
    yauzl.open(archive, { lazyEntries: true }, (error, zip) => {
      if (error) return reject(error);
      zip.on("error", reject);
      zip.on("end", resolve);
      zip.on("entry", (entry) => {
        entries++;
        const info = describe(entry.fileName),
          ref = { archive, entry: entry.fileName };
        if (info && /\.tiff?$/i.test(entry.fileName) && info.date) {
          if (entry.uncompressedSize > 96 * 1024 * 1024) skippedLargeRasters++;
          else {
            const date = info.date,
              key =
                "/io/data/" +
                info.product +
                "/" +
                info.scale +
                "/" +
                (info.scale === "年" ? "" : info.year + "/") +
                date +
                ".qgs";
            rasters[key] ??= {
              ...ref,
              product: info.product,
              time: date,
              scale: info.scale,
              layer: date + ".tif",
            };
          }
        }
        if (info && /\.xlsx$/i.test(entry.fileName)) {
          const scope = info.base.includes("China")
            ? "China"
            : info.base.includes("Global")
              ? "Global"
              : null;
          if (scope) {
            const key = [
              info.product,
              info.scale,
              info.scale === "年" ? "" : info.year,
              scope,
            ].join("|");
            workbooks[key] ??= ref;
          }
        }
        zip.readEntry();
      });
      zip.readEntry();
    }),
  );
}
if (!Object.keys(rasters).length)
  throw new Error("No identifiable original rasters; source remains unchanged");
const keys = Object.keys(rasters),
  preferred =
    keys.find(
      (k) =>
        k.endsWith("/5MW/容量因子/25km/年/2021.qgs") &&
        workbooks[rasters[k].product + "|年||Global"],
    ) ??
    keys.find(
      (k) =>
        rasters[k].scale === "年" &&
        workbooks[rasters[k].product + "|年||Global"],
    ) ??
    keys[0],
  selected = rasters[preferred];
function timeLabel(r) {
  return r.scale === "年"
    ? r.time
    : r.scale === "月"
      ? r.time.slice(0, 4) + "-" + r.time.slice(4, 6)
      : r.time.slice(0, 4) +
        "-" +
        r.time.slice(4, 6) +
        "-" +
        r.time.slice(6, 8) +
        " " +
        r.time.slice(8, 10) +
        ":00";
}
const segment = selected.product.split("/"),
  dataType = segment.at(-2),
  technology = segment.at(-3),
  resource = segment.find((s) =>
    [
      "陆上风电",
      "海上风电",
      "高空风电",
      "集中式光伏发电",
      "分布式光伏发电",
      "光热发电",
      "水力发电",
    ].includes(s),
  ),
  label = timeLabel(selected);
const unit =
  {
    容量因子: "",
    发电潜力: "GWh/km<sup>2</sup>",
    装机潜力: "MW/km<sup>2</sup>",
    平准化度电成本: "",
  }[dataType] ?? "";
const defaults = Object.fromEntries(
  ["chinese", "english"].map((lang) => [
    lang,
    {
      filterResultList: [
        (lang === "chinese" ? resource : (dict[resource] ?? resource)) +
          " " +
          (lang === "chinese" ? dataType : (dict[dataType] ?? dataType)) +
          "(" +
          technology +
          "," +
          segment.at(-1) +
          "," +
          label +
          ")",
      ],
      selectedResults: [true],
      timeResult: [label],
      mapPathUrlList: [selected.product + "/" + selected.scale],
      dataUnlitList: [unit],
      dataTypeThreeList: [
        lang === "chinese" ? dataType : (dict[dataType] ?? dataType),
      ],
    },
  ]),
);
const boundaries = {};
for (const [level, label] of [
  ["省级", "省"],
  ["地级", "市"],
  ["县级", "县"],
]) {
  const base = path.join(source, "Map/china/中国_" + label + "_面_CGCS2000");
  try {
    await readFile(base + ".shp");
    boundaries[level] = {
      shp: base + ".shp",
      dbf: base + ".dbf",
      encoding: "utf-8",
    };
  } catch (_) {}
}
const manifest = {
  version: 1,
  boundaries,
  createdAt: new Date().toISOString(),
  nodes,
  rasters,
  workbooks,
  defaults,
  products: [...new Set(Object.values(rasters).map((r) => r.product))],
  skippedLargeRasters,
};
const manifestFile = path.join(destination, "manifest.json");
await writeFile(manifestFile, JSON.stringify(manifest, null, 2));
const envFile = path.join(projectRoot, "apps/server/.env"),
  old = await readFile(envFile, "utf8").catch(() => "");
let env = old
  .replace(/^DATA_PROVIDER=.*(?:\r?\n|$)/m, "")
  .replace(/^SOURCE_MANIFEST=.*(?:\r?\n|$)/m, "");
env +=
  "\nDATA_PROVIDER=source\nSOURCE_MANIFEST=" +
  manifestFile.replaceAll("\\", "/") +
  "\n";
await writeFile(envFile, env);
const summary = {
  nodes: nodes.length,
  resources: nodes.filter((n) => n.type === "resource").map((n) => n.name),
  products: manifest.products.length,
  rasters: keys.length,
  workbooks: Object.keys(workbooks).length,
  skippedLargeRasters,
  archiveEntries: entries,
  defaultMap: preferred,
  originalFilesCopied: false,
};
await writeFile(
  path.join(destination, "import-summary.json"),
  JSON.stringify(summary, null, 2),
);
await logStep(
  "本地真实数据登记完成",
  JSON.stringify(summary) +
    "；原始ZIP只读、按需解码，私有索引和.env不提交，不把未提供的日期伪装为有效图层。",
);
console.log(JSON.stringify(summary, null, 2));
