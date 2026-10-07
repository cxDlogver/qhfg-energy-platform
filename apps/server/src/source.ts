import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as XLSX from "xlsx";
import { fromArrayBuffer } from "geotiff";
import { readArchiveEntry } from "./archive.js";
import { FixtureProvider } from "./fixture.js";
import { readLocalPolygons, type PolygonFeature } from "./local-boundaries.js";
import {
  BusinessError,
  filterColumns,
  list,
  text,
  type Provider,
  type Params,
  type Node,
  type Table,
  type LineRow,
} from "./model.js";

export type SourceFile = { archive?: string; entry?: string; file?: string };
export type SourceManifest = {
  version: 1;
  createdAt: string;
  nodes: Node[];
  rasters: Record<
    string,
    SourceFile & { product: string; time: string; scale: string; layer: string }
  >;
  workbooks: Record<string, SourceFile>;
  defaults: Record<string, unknown>;
  products: string[];
  skippedLargeRasters: number;
  boundaries?: Record<string, { shp: string; dbf: string; encoding?: string }>;
};
type Feature = PolygonFeature;
type Raster = {
  data: ArrayLike<number>;
  width: number;
  height: number;
  origin: number[];
  resolution: number[];
  nodata: number | null;
  min: number;
  max: number;
};
const problem = (message: string) => new BusinessError(0, message);
const levelNames: Record<string, string> = {
  区域: "Region",
  次区域: "Subregion",
  国家: "Country",
  电网: "Grid",
  省级: "Province",
  地级: "City",
  县级: "County",
};
const palette = [
  [43, 131, 186],
  [171, 221, 164],
  [255, 255, 191],
  [253, 174, 97],
  [215, 25, 28],
];
export function color(value: number, min: number, max: number): number[] {
  const t = Math.max(0, Math.min(4, ((value - min) / (max - min || 1)) * 4)),
    i = Math.min(3, Math.floor(t)),
    f = t - i;
  return palette[i].map((v, c) => Math.round(v + (palette[i + 1][c] - v) * f));
}
function polygons(feature: Feature): number[][][] {
  return feature.geometry.type === "Polygon"
    ? (feature.geometry.coordinates as number[][][])
    : (feature.geometry.coordinates as number[][][][]).flat();
}
function insideRing(x: number, y: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > y !== b[1] > y &&
      x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}
function contains(feature: Feature, lon: number, lat: number) {
  const box = feature.bbox;
  if (box && (lon < box[0] || lon > box[2] || lat < box[1] || lat > box[3]))
    return false;
  const groups =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates as number[][][]]
      : (feature.geometry.coordinates as number[][][][]);
  return groups.some((poly) =>
    poly.reduce(
      (inside, ring) => (insideRing(lon, lat, ring) ? !inside : inside),
      false,
    ),
  );
}
export class SourceProvider implements Provider {
  private cache = new Map<string, Promise<Raster>>();
  private images = new Map<string, Buffer>();
  private workbooks = new Map<string, Promise<XLSX.WorkBook>>();
  private shapes: Feature[] = [];
  private adminShapes: Record<string, Feature[]> = {};
  private constructor(
    private manifest: SourceManifest,
    private accounts: FixtureProvider,
  ) {}
  static async create(env: NodeJS.ProcessEnv) {
    if (!env.SOURCE_MANIFEST)
      throw new Error(
        "Source mode requires SOURCE_MANIFEST; run data:import first",
      );
    const manifest = JSON.parse(
      await readFile(env.SOURCE_MANIFEST, "utf8"),
    ) as SourceManifest;
    if (manifest.version !== 1 || !Object.keys(manifest.rasters).length)
      throw new Error("No registered source rasters");
    const provider = new SourceProvider(
      manifest,
      await FixtureProvider.create(),
    );
    const world = JSON.parse(
      await readFile(
        fileURLToPath(
          new URL("../data/world-boundaries.geojson", import.meta.url),
        ),
        "utf8",
      ),
    );
    provider.shapes = world.features;
    for (const [level, ref] of Object.entries(manifest.boundaries ?? {}))
      provider.adminShapes[level] = await readLocalPolygons(
        ref.shp,
        ref.dbf,
        ref.encoding,
      );
    return provider;
  }
  user: Provider["user"] = (field, value) => this.accounts.user(field, value);
  permissions: Provider["permissions"] = (role) =>
    this.accounts.permissions(role);
  register: Provider["register"] = (data, hash) =>
    this.accounts.register(data, hash);
  reset: Provider["reset"] = (email, hash) => this.accounts.reset(email, hash);
  get: Provider["get"] = (key) => this.accounts.get(key);
  set: Provider["set"] = (key, value, seconds) =>
    this.accounts.set(key, value, seconds);
  delete: Provider["delete"] = (key) => this.accounts.delete(key);
  mail: Provider["mail"] = (email, code, reset) =>
    this.accounts.mail(email, code, reset);
  weather: Provider["weather"] = (p) => this.accounts.weather(p);
  runtime() {
    return {
      provider: "source",
      basemap: "natural-earth",
      rasters: Object.keys(this.manifest.rasters).length,
      products: this.manifest.products.length,
      defaults: this.manifest.defaults,
    };
  }
  async nodes() {
    return structuredClone(this.manifest.nodes);
  }
  async editNode(op: string, p: Params) {
    const nodes = this.manifest.nodes,
      n = nodes.find((n) => n.id === Number(p.conditionId));
    if (op === "addChild") {
      const parent = nodes.find((n) => n.id === Number(p.parentId));
      if (!parent) return false;
      nodes.push({
        id: Math.max(...nodes.map((n) => n.id)) + 1,
        parentId: parent.id,
        name: text(p, "name"),
        nameEn: text(p, "nameEn", false),
        type: text(p, "type"),
        children: [],
      });
      if (p.type === "resource") parent.type = "rnode";
      if (p.type === "datatype" && parent.type !== "resource")
        parent.type = "dnode";
    } else {
      if (!n) return false;
      if (op === "updatecondition") n.name = text(p, "name");
      else n.deleted = true;
    }
    return true;
  }
  private entry(p: Params) {
    const map = String(p.MAP ?? p.Map ?? p.map ?? ""),
      entry = this.manifest.rasters[map];
    if (!entry)
      throw problem("此筛选组合的原始图层未在本地数据包中提供，请选择已有数据");
    const layer = String(p.LAYERS ?? p.LAYER ?? entry.layer);
    if (layer !== entry.layer) throw problem("图层名称与已登记原始数据不一致");
    return [map, entry] as const;
  }
  private async buffer(source: SourceFile) {
    if (source.archive && source.entry)
      return readArchiveEntry(source.archive, source.entry);
    if (source.file) return readFile(source.file);
    throw problem("数据文件未登记");
  }
  private raster(key: string, entry: SourceFile): Promise<Raster> {
    const cached = this.cache.get(key);
    if (cached) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached;
    }
    const task = (async () => {
      const b = await this.buffer(entry),
        tiff = await fromArrayBuffer(
          b.buffer.slice(
            b.byteOffset,
            b.byteOffset + b.byteLength,
          ) as ArrayBuffer,
        ),
        image = await tiff.getImage();
      const keys = image.getGeoKeys();
      if (
        !keys ||
        (keys.GeographicTypeGeoKey !== 4326 &&
          keys.GeographicTypeGeoKey !== 4490)
      )
        throw problem("本地图层坐标系尚不支持");
      if (image.getWidth() * image.getHeight() > 24_000_000)
        throw problem("本地图层过大，需要配置 QGIS 或预先生成金字塔");
      const data = (await image.readRasters({
        samples: [0],
        interleave: true,
      })) as ArrayLike<number>;
      const nodata = image.getGDALNoData();
      let min = Infinity,
        max = -Infinity;
      for (let i = 0; i < data.length; i++) {
        const v = Number(data[i]);
        if (Number.isFinite(v) && v !== nodata && Math.abs(v) < 1e30) {
          min = Math.min(min, v);
          max = Math.max(max, v);
        }
      }
      return {
        data,
        width: image.getWidth(),
        height: image.getHeight(),
        origin: image.getOrigin(),
        resolution: image.getResolution(),
        nodata,
        min: Number.isFinite(min) ? min : 0,
        max: Number.isFinite(max) ? max : 1,
      };
    })();
    this.cache.set(key, task);
    while (this.cache.size > 2)
      this.cache.delete(this.cache.keys().next().value!);
    task.catch(() => this.cache.delete(key));
    return task;
  }
  private value(r: Raster, lon: number, lat: number) {
    if (r.origin[0] >= 0 && lon < 0) lon += 360;
    else if (r.origin[0] < 0 && lon > 180) lon -= 360;
    const x = Math.floor((lon - r.origin[0]) / r.resolution[0]),
      y = Math.floor((lat - r.origin[1]) / r.resolution[1]);
    if (x < 0 || y < 0 || x >= r.width || y >= r.height) return null;
    const v = Number(r.data[y * r.width + x]);
    return !Number.isFinite(v) || v === r.nodata || Math.abs(v) >= 1e30
      ? null
      : v;
  }
  async image(p: Params, boundary = false): Promise<Buffer> {
    if (boundary) return this.boundary(p);
    const [key, entry] = this.entry(p),
      normalized = Object.fromEntries(
        Object.entries(p).map(([k, v]) => [k.toUpperCase(), v]),
      );
    const width = Number(normalized.WIDTH ?? 256),
      height = Number(normalized.HEIGHT ?? 256),
      bbox = String(normalized.BBOX ?? "-180,-90,180,90")
        .split(",")
        .map(Number);
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      height < 1 ||
      width > 2048 ||
      height > 2048 ||
      bbox.length !== 4 ||
      bbox.some((v) => !Number.isFinite(v))
    )
      throw problem("地图范围或尺寸无效");
    const cacheKey =
      key +
      ":" +
      width +
      ":" +
      height +
      ":" +
      bbox.join(",") +
      ":" +
      String(normalized.SRS ?? normalized.CRS);
    if (this.images.has(cacheKey)) return this.images.get(cacheKey)!;
    const r = await this.raster(key, entry),
      rgba = Buffer.alloc(width * height * 4);
    const mercator = String(normalized.SRS ?? normalized.CRS).includes("3857");
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        let lon = bbox[0] + ((x + 0.5) / width) * (bbox[2] - bbox[0]),
          lat = bbox[3] - ((y + 0.5) / height) * (bbox[3] - bbox[1]);
        if (mercator) {
          lon = (lon / 20037508.342789244) * 180;
          lat =
            ((2 * Math.atan(Math.exp(lat / 6378137)) - Math.PI / 2) * 180) /
            Math.PI;
        }
        lon = ((((lon + 180) % 360) + 360) % 360) - 180;
        if (lat < -90 || lat > 90) continue;
        const v = this.value(r, lon, lat);
        if (v === null) continue;
        const c = color(v, r.min, r.max),
          i = (y * width + x) * 4;
        rgba[i] = c[0];
        rgba[i + 1] = c[1];
        rgba[i + 2] = c[2];
        rgba[i + 3] = 220;
      }
    const png = await sharp(rgba, { raw: { width, height, channels: 4 } })
      .png()
      .toBuffer();
    this.images.set(cacheKey, png);
    while (this.images.size > 24)
      this.images.delete(this.images.keys().next().value!);
    return png;
  }
  async legend(p: Params) {
    const [key, entry] = this.entry(p),
      r = await this.raster(key, entry);
    const stops = palette
      .map(
        (c, i) =>
          '<stop offset="' +
          i * 25 +
          '%" stop-color="rgb(' +
          c.join(",") +
          ')"/>',
      )
      .join("");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="256"><rect width="150" height="256" fill="white"/><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">' +
      stops +
      '</linearGradient></defs><rect x="22" y="12" width="25" height="230" fill="url(#g)"/><text x="54" y="25" font-size="13">' +
      r.max.toPrecision(3) +
      '</text><text x="54" y="240" font-size="13">' +
      r.min.toPrecision(3) +
      "</text></svg>";
    return sharp(Buffer.from(svg)).png().toBuffer();
  }
  async point(p: Params) {
    const [key, entry] = this.entry(p),
      lon = Number(p.LONGITUDE),
      lat = Number(p.LATITUDE),
      r = await this.raster(key, entry);
    const country = this.shapes.find((f) => contains(f, lon, lat)),
      area: Record<string, string> = {};
    if (country) {
      area.国家 =
        country.properties.ADM0_A3 === "CHN" ||
        country.properties.ISO_A3 === "CHN"
          ? "中国"
          : (country.properties.NAME_ZH ?? country.properties.NAME);
      try {
        const table = this.sheet(
          await this.workbook(entry.product, "年", "", "国家"),
          "国家",
        );
        const zh = table.columns.find((c) => /\p{Script=Han}/u.test(c)),
          en = table.columns.find((c) => /^[A-Za-z]+$/.test(c) && c !== "ID");
        const names = [
          country.properties.NAME_EN,
          country.properties.NAME,
          country.properties.ADMIN,
        ]
          .filter(Boolean)
          .map((n) => n.toLowerCase());
        const row =
          en && zh
            ? table.data.find((row) =>
                names.includes(String(row[en]).toLowerCase()),
              )
            : undefined;
        if (row && zh) area.国家 = String(row[zh]);
      } catch (error) {
        if (!(error instanceof BusinessError)) throw error;
      }
      area.地区 = area.国家;
      if (area.国家 === "中国")
        for (const [level, features] of Object.entries(this.adminShapes)) {
          const region = features.find((f) => contains(f, lon, lat));
          if (region) area[level] = region.properties.name;
        }
      area.区域 =
        (
          {
            Asia: "亚洲",
            Europe: "欧洲",
            Africa: "非洲",
            "North America": "北美洲",
            "South America": "南美洲",
            Oceania: "大洋洲",
            Antarctica: "南极洲",
          } as Record<string, string>
        )[country.properties.CONTINENT] ?? country.properties.CONTINENT;
    }
    return { value: this.value(r, lon, lat), area };
  }
  private async workbook(
    product: string,
    scale: string,
    year: string,
    level: string,
  ) {
    const scope = ["国家", "区域", "次区域"].includes(level)
        ? "Global"
        : "China",
      key = [product, scale, scale === "年" ? "" : year, scope].join("|"),
      source = this.manifest.workbooks[key];
    if (!source) throw problem("原数据包中没有此时间尺度和区域的统计 Excel");
    if (!this.workbooks.has(key))
      this.workbooks.set(
        key,
        this.buffer(source).then((b) =>
          XLSX.read(b, { type: "buffer", cellDates: false }),
        ),
      );
    return this.workbooks.get(key)!;
  }
  private sheet(w: XLSX.WorkBook, level: string): Table {
    const name = w.SheetNames.find(
      (n) =>
        n === level ||
        n.startsWith(level) ||
        n.toLowerCase().startsWith((levelNames[level] ?? level).toLowerCase()),
    );
    if (!name) throw problem("原统计 Excel 没有此区域层级");
    const rows = XLSX.utils.sheet_to_json<unknown[]>(w.Sheets[name], {
      header: 1,
      defval: null,
      raw: true,
    });
    const headerIndex = rows.findIndex(
      (row) =>
        row.some((v) => /^(?:Y)?(19|20)\d{2}/i.test(String(v))) &&
        row.some(
          (v) =>
            String(v).includes(level) ||
            String(v)
              .toLowerCase()
              .includes((levelNames[level] ?? "").toLowerCase()),
        ),
    );
    const columns = (rows[headerIndex < 0 ? 0 : headerIndex] ?? []).map(String);
    return {
      columns,
      data: rows
        .slice((headerIndex < 0 ? 0 : headerIndex) + 1)
        .filter((row) => row.some((v) => v !== null))
        .map((row) =>
          Object.fromEntries(columns.map((c, i) => [c, row[i] ?? ""])),
        ),
    };
  }
  async table(p: Params) {
    const w = await this.workbook(
      text(p, "map"),
      text(p, "timeScale"),
      text(p, "year", false),
      text(p, "level"),
    );
    return filterColumns(this.sheet(w, text(p, "level")), text(p, "language"));
  }
  async lines(p: Params): Promise<LineRow[]> {
    const scale = text(p, "timescale"),
      year = scale.split("_")[1] ?? "",
      level = text(p, "level"),
      table = this.sheet(
        await this.workbook(
          text(p, "map"),
          scale.startsWith("yr")
            ? "年"
            : scale.startsWith("mo")
              ? "月"
              : "小时",
          year,
          level,
        ),
        level,
      );
    const chinese = table.columns.find((c) => /\p{Script=Han}/u.test(c)),
      english = table.columns.find((c) => /^[A-Za-z]+$/.test(c) && c !== "ID"),
      places = list(p, "places"),
      span = list(p, "timespan"),
      result: LineRow[] = [];
    for (const row of table.data) {
      const place = String(row[chinese ?? ""] ?? ""),
        placeEn = String(row[english ?? ""] ?? place);
      if (places.length && !places.includes(place) && !places.includes(placeEn))
        continue;
      for (const column of table.columns.filter((c) =>
        /^(?:Y)?(19|20)\d{2}/i.test(c),
      )) {
        let time = column
          .replace(/^Y/i, "")
          .replace(/[-/]/g, "")
          .replace(/:00.*$/, "")
          .replace(" ", "");
        if (span.length && !scale.startsWith("hr") && !span.includes(time))
          continue;
        if (
          scale.startsWith("hr") &&
          span.length === 2 &&
          (time < span[0].replace(/[- :]/g, "").slice(0, 10) ||
            time > span[1].replace(/[- :]/g, "").slice(0, 10))
        )
          continue;
        if (scale.startsWith("hr"))
          time =
            time.slice(0, 4) +
            "-" +
            time.slice(4, 6) +
            "-" +
            time.slice(6, 8) +
            " " +
            time.slice(8, 10);
        const value = Number(row[column]);
        result.push({
          place_china: place,
          place_english: placeEn,
          time,
          value: row[column] === "" || !Number.isFinite(value) ? null : value,
        });
      }
    }
    return result;
  }
  async regions(map: string) {
    const prefix = map + "|",
      available = [
        "区域",
        "次区域",
        "国家",
        "电网",
        "省级",
        "地级",
        "县级",
      ].filter((level) =>
        Object.keys(this.manifest.workbooks).some(
          (k) =>
            k.startsWith(prefix) &&
            k.endsWith(
              ["区域", "次区域", "国家"].includes(level) ? "Global" : "China",
            ),
        ),
      );
    return {
      regionsZn: available.join("/"),
      regionsEn: available.map((l) => levelNames[l]).join("/"),
    };
  }
  async description(map: string, lang: string) {
    const message =
      lang === "english"
        ? "Original local energy files; missing dates and products are reported explicitly. Map values are raw GeoTIFF samples."
        : "读取原目录的真实能源栅格和统计 Excel；未提供的日期或产品会明确报错。点值取自原始 GeoTIFF。";
    return lang === "english"
      ? { descriptionEn: "<p>" + message + "</p>" }
      : { descriptionZn: "<p>" + message + "</p>" };
  }
  private async boundary(p: Params) {
    const width = Math.min(
        2048,
        Math.max(1, Number(p.WIDTH ?? p.width ?? 256)),
      ),
      height = Math.min(2048, Math.max(1, Number(p.HEIGHT ?? p.height ?? 256)));
    const bbox = String(p.BBOX ?? p.bbox ?? "-180,-90,180,90")
        .split(",")
        .map(Number),
      areas = list(p, "area");
    const level = String(p.level ?? "国家");
    const shapes = (this.adminShapes[level] ?? this.shapes).filter((f) =>
      areas.some((a) =>
        [
          f.properties.name,
          f.properties.NAME_ZH,
          f.properties.NAME,
          f.properties.CONTINENT,
          f.properties.ADM0_A3 === "CHN" ? "中国" : "",
        ].includes(a),
      ),
    );
    return this.vector(shapes, bbox, width, height, "transparent");
  }
  private async vector(
    features: Feature[],
    bbox: number[],
    width: number,
    height: number,
    background: string,
  ) {
    const paths = features.map((f) =>
      polygons(f)
        .map(
          (ring) =>
            ring
              .map(
                (p, i) =>
                  (i ? "L" : "M") +
                  (((p[0] - bbox[0]) / (bbox[2] - bbox[0])) * width).toFixed(
                    2,
                  ) +
                  " " +
                  (((bbox[3] - p[1]) / (bbox[3] - bbox[1])) * height).toFixed(
                    2,
                  ),
              )
              .join("") + "Z",
        )
        .join(""),
    );
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '"><rect width="100%" height="100%" fill="' +
      background +
      '"/>' +
      paths
        .map(
          (d) =>
            '<path d="' +
            d +
            '" fill="#ecebe5" stroke="#c2c9c9" stroke-width=".7" fill-rule="evenodd"/>',
        )
        .join("") +
      "</svg>";
    return sharp(Buffer.from(svg)).png().toBuffer();
  }
  async tile(p: Params) {
    const kind = String(p.T ?? p.LAYER ?? "vec_w"),
      x = Number(p.x ?? p.TILECOL),
      y = Number(p.y ?? p.TILEROW),
      z = Number(p.l ?? p.TILEMATRIX);
    if (
      ![x, y, z].every(Number.isInteger) ||
      z < 0 ||
      z > 19 ||
      y < 0 ||
      y >= 2 ** z
    )
      throw problem("瓦片坐标无效");
    const key = "base:" + kind + ":" + x + ":" + y + ":" + z;
    if (this.images.has(key)) return this.images.get(key)!;
    let png: Buffer;
    if (!kind.startsWith("vec") && !kind.startsWith("img"))
      png = await sharp({
        create: {
          width: 256,
          height: 256,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toBuffer();
    else {
      const n = 2 ** z,
        wrap = ((x % n) + n) % n,
        latitude = (v: number) =>
          (Math.atan(Math.sinh(Math.PI * (1 - (2 * v) / n))) * 180) / Math.PI;
      const bbox = [
        (wrap / n) * 360 - 180,
        latitude(y + 1),
        ((wrap + 1) / n) * 360 - 180,
        latitude(y),
      ];
      // Project vector vertices into the Web Mercator tile plane before rasterization.
      const projectLat = (lat: number) =>
        (Math.log(
          Math.tan(
            Math.PI / 4 +
              (Math.max(-85.05112878, Math.min(85.05112878, lat)) * Math.PI) /
                360,
          ),
        ) *
          180) /
        Math.PI;
      const projectRing = (ring: number[][]) =>
        ring.map((p) => [p[0], projectLat(p[1])]);
      const projected = this.shapes.map((f) => {
        const coordinates =
          f.geometry.type === "Polygon"
            ? (f.geometry.coordinates as number[][][]).map(projectRing)
            : (f.geometry.coordinates as number[][][][]).map((poly) =>
                poly.map(projectRing),
              );
        return { ...f, geometry: { ...f.geometry, coordinates } };
      });
      png = await this.vector(
        projected,
        [bbox[0], projectLat(bbox[1]), bbox[2], projectLat(bbox[3])],
        256,
        256,
        "#c9e3ee",
      );
    }
    this.images.set(key, png);
    while (this.images.size > 24)
      this.images.delete(this.images.keys().next().value!);
    return png;
  }
  async close() {
    this.cache.clear();
    this.images.clear();
    this.workbooks.clear();
    await this.accounts.close();
  }
}
