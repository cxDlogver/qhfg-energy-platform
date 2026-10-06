import { Pool } from "pg";
import { Redis } from "ioredis";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import {
  BusinessError,
  filterColumns,
  list,
  text,
  type Provider,
  type Params,
  type Node,
  type User,
  type LineRow,
} from "./model.js";

type Registry = Record<
  string,
  { tables: Record<string, string>; maps?: Record<string, string[]> }
>;
export const SEGMENTS: Record<string, string> = Object.fromEntries([
  ["发电侧", "pg"],
  ["电网侧", "grid"],
  ["用户侧", "cus"],
  ["风力发电", "wind"],
  ["光伏发电", "pv"],
  ["光热发电", "csp"],
  ["水力发电", "hydp"],
  ["低空风电", "low"],
  ["高空风电", "high"],
  ["海上风电", "off"],
  ["陆上风电", "on"],
  ["集中式光伏发电", ""],
  ["分布式光伏发电", ""],
  ["潜力数据", "pot"],
  ["现状数据", "curr"],
  ["2.5MW", "2_5mw"],
  ["5MW", "5mw"],
  ["6.5MW", "6_5mw"],
  ["15MW", "15mw"],
  ["6MW", "6mw"],
  ["8MW", "8mw"],
  ["陆基5MW", "lb5mw"],
  ["空基5MW", "ab5mw"],
  ["单晶硅", "mono"],
  ["异质结", "hjt"],
  ["钙钛矿", "psc"],
  ["钙钛矿_硅叠层", "pcS"],
  ["塔式", "tow"],
  ["径流式", "ror"],
  ["容量因子", "cf"],
  ["发电潜力", "gp"],
  ["装机潜力", "cp"],
  ["平准化度电成本", "lcoe"],
  ["发电量", "eg"],
  ["发电厂", "pploc"],
  ["装机量", "ic"],
  ["输配电线路", "tdl"],
  ["全社会用电量", "tec"],
  ["人均社会用电量", "pcec"],
  ["小时", "hr"],
  ["年", "yr"],
  ["月", "mo"],
  ["区域", "reg"],
  ["次区域", "subreg"],
  ["国家", "cntry"],
  ["电网", "grid"],
  ["省级", "prov"],
  ["地级", "city"],
  ["县级", "county"],
]);
export function logicalTable(map: string, scale: string, level: string) {
  return (
    map
      .split("/")
      .map((s) => SEGMENTS[s] ?? s)
      .join("_") +
    "_" +
    scale +
    "_" +
    (SEGMENTS[level] ?? level)
  );
}
const columns: Record<string, string> = {
  区域: "区域1",
  次区域: "区域2",
  国家: "国家",
  地区: "国家_1",
  电网: "电网_0",
  省级: "省级",
  地级: "地级",
  县级: "县级",
};
const fail = (msg: string) => new BusinessError(0, msg);
export function boundedPosix(root: string, filename: string) {
  const resolved = path.posix.resolve(root, filename);
  if (resolved !== root && !resolved.startsWith(root.replace(/\/$/, "") + "/"))
    throw fail("工程路径越界");
  return resolved;
}
export class RealProvider implements Provider {
  private db: Pool;
  private redis: Redis;
  private smtp: ReturnType<typeof nodemailer.createTransport>;
  private registry: Registry = {};
  constructor(private env: NodeJS.ProcessEnv) {
    if (
      !env.DATABASE_URL ||
      !env.REDIS_URL ||
      !env.QGIS_URL ||
      !env.EXCEL_ROOT ||
      !env.ENERGY_REGISTRY_FILE
    )
      throw new Error(
        "Real mode requires DATABASE_URL, REDIS_URL, QGIS_URL, EXCEL_ROOT, ENERGY_REGISTRY_FILE",
      );
    this.db = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
    });
    this.redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
    });
    this.smtp = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT ?? 587),
      secure: Number(env.SMTP_PORT) === 465,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    });
  }
  async init() {
    this.registry = JSON.parse(
      await readFile(this.env.ENERGY_REGISTRY_FILE!, "utf8"),
    );
    await this.db.query("select 1");
    await this.redis.ping();
  }
  async user(field: "username" | "email" | "phone", value: string) {
    const row = (
      await this.db.query(
        'select id,username,password,role,email,phone,company,region,full_name as "fullName" from sys_user where ' +
          field +
          "=$1 and is_deleted=false limit 1",
        [value],
      )
    ).rows[0];
    return (row as User) ?? null;
  }
  async permissions(role: string) {
    return (
      await this.db.query(
        "select permission from sys_role_permission where role=$1",
        [role],
      )
    ).rows.map((r) => r.permission);
  }
  async register(p: Params, hash: string) {
    await this.db.query(
      "insert into sys_user(username,password,full_name,phone,email,company,region,role,is_deleted,create_date) values($1,$2,$3,$4,$5,$6,$7,$8,false,now())",
      [
        p.username,
        hash,
        p.fullName,
        p.phone,
        p.email,
        p.company,
        p.region,
        "normalUser",
      ],
    );
  }
  async reset(email: string, hash: string) {
    return (
      (
        await this.db.query(
          "update sys_user set password=$1 where email=$2 and is_deleted=false",
          [hash, email],
        )
      ).rowCount! > 0
    );
  }
  async get(key: string) {
    return this.redis.get(key);
  }
  async set(key: string, value: string, seconds: number) {
    await this.redis.set(key, value, "EX", seconds);
  }
  async delete(key: string) {
    await this.redis.del(key);
  }
  async mail(email: string, code: string, reset: boolean) {
    await this.smtp.sendMail({
      from: this.env.SMTP_FROM,
      to: email,
      subject: reset ? "修改密码验证码" : "注册验证码",
      text: "验证码：" + code + "，5分钟内有效。",
    });
  }
  async nodes() {
    return (
      await this.db.query(
        'select condition_id as id,name,name_en as "nameEn",parent_id as "parentId",type,del_flag as deleted from data_select_conditions_tree order by condition_id',
      )
    ).rows.map((r) => ({ ...r, children: [] })) as Node[];
  }
  async editNode(op: string, p: Params) {
    if (op === "updatecondition")
      return (
        (
          await this.db.query(
            "update data_select_conditions_tree set name=$1 where condition_id=$2",
            [p.name, p.conditionId],
          )
        ).rowCount! > 0
      );
    if (op === "delcondition")
      return (
        (
          await this.db.query(
            "update data_select_conditions_tree set del_flag=true where condition_id=$1",
            [p.conditionId],
          )
        ).rowCount! > 0
      );
    const client = await this.db.connect();
    try {
      await client.query("begin");
      const parent = (
        await client.query(
          "select type from data_select_conditions_tree where condition_id=$1 for update",
          [p.parentId],
        )
      ).rows[0];
      if (!parent) throw fail("父节点不存在");
      await client.query(
        "insert into data_select_conditions_tree(name,name_en,parent_id,type,del_flag) values($1,$2,$3,$4,false)",
        [p.name, p.nameEn, p.parentId, p.type],
      );
      if (
        p.type === "resource" ||
        (p.type === "datatype" && parent.type !== "resource")
      )
        await client.query(
          "update data_select_conditions_tree set type=$1 where condition_id=$2",
          [p.type === "resource" ? "rnode" : "dnode", p.parentId],
        );
      await client.query("commit");
      return true;
    } catch (e) {
      await client.query("rollback");
      throw e;
    } finally {
      client.release();
    }
  }
  private async qgis(p: Params, json = false) {
    const url = new URL(this.env.QGIS_URL!);
    for (const [key, v] of Object.entries(p))
      if (v !== undefined) url.searchParams.set(key.toUpperCase(), String(v));
    const map = url.searchParams.get("MAP");
    if (!map) throw fail("工程路径缺失");
    const normalized = boundedPosix(
      this.env.QGIS_PROJECT_ROOT ?? "/io/data",
      map,
    );
    url.searchParams.set("MAP", normalized);
    const layers = (
      url.searchParams.get("LAYERS") ??
      url.searchParams.get("LAYER") ??
      url.searchParams.get("QUERY_LAYERS") ??
      ""
    ).split(",");
    const boundary =
        this.env.QGIS_BOUNDARY_PROJECT ?? "/io/data/boundary/boundary.qgs",
      china =
        this.env.QGIS_CHINA_BOUNDARY_PROJECT ??
        "/io/data/boundary/china_boundary.qgs";
    const allowed =
      normalized === boundary
        ? ["Global_boundary", "Global_ocean"]
        : normalized === china
          ? ["china_boundary"]
          : Object.values(this.registry).flatMap(
              (entry) => entry.maps?.[normalized] ?? [],
            );
    if (!layers.length || layers.some((layer) => !allowed.includes(layer)))
      throw fail("工程或图层未注册");
    if (
      !["GetMap", "GetLegendGraphic", "GetFeatureInfo"].includes(
        url.searchParams.get("REQUEST") ?? "",
      )
    )
      throw fail("WMS操作不允许");
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw fail("地图服务请求失败");
    if (json) return response.json();
    const mime = response.headers.get("content-type") ?? "";
    if (!mime.startsWith("image/")) throw fail("地图服务未返回图片");
    return Buffer.from(await response.arrayBuffer());
  }
  async image(p: Params, boundary = false): Promise<Buffer> {
    const allowedKeys = new Set([
      "MAP",
      "LAYERS",
      "BBOX",
      "WIDTH",
      "HEIGHT",
      "CRS",
      "SRS",
      "VERSION",
      "TRANSPARENT",
      "STYLES",
      "DPI",
    ]);
    const incoming = Object.fromEntries(
      Object.entries(p)
        .map(([k, v]) => [k.toUpperCase(), v])
        .filter(([k]) => allowedKeys.has(String(k))),
    );
    let q: Params = {
      VERSION: "1.1.0",
      CRS: "EPSG:4326",
      ...incoming,
      SERVICE: "WMS",
      REQUEST: "GetMap",
      FORMAT: "image/png",
    };
    for (const key of ["WIDTH", "HEIGHT"])
      if (
        q[key] !== undefined &&
        (!Number.isInteger(Number(q[key])) ||
          Number(q[key]) < 1 ||
          Number(q[key]) > 2048)
      )
        throw fail("地图尺寸不正确");
    if (boundary) {
      const level = text(p, "level"),
        col = columns[level],
        kind = text(p, "class");
      if (!col || !["boundary", "ocean"].includes(kind))
        throw fail("边界参数不正确");
      const layer = "Global_" + kind;
      q = {
        ...q,
        MAP: this.env.QGIS_BOUNDARY_PROJECT ?? "/io/data/boundary/boundary.qgs",
        LAYERS: layer,
        FILTER:
          layer +
          ":" +
          list(p, "area")
            .map((a) => '"' + col + "\" = '" + a.replaceAll("'", "''") + "\'")
            .join(" OR "),
      };
      delete q.level;
      delete q.area;
      delete q.class;
    }
    delete q.language;
    delete q.FILTER_OVERRIDE;
    return (await this.qgis(q)) as Buffer;
  }
  async legend(p: Params): Promise<Buffer> {
    const shp = text(p, "MAP").includes("现状数据");
    const q = {
      MAP: p.MAP,
      LAYER: p.LAYER,
      SERVICE: "WMS",
      VERSION: "1.1.1",
      REQUEST: "GetLegendGraphic",
      FORMAT: "image/png",
      TRANSPARENT: "TRUE",
      LAYERTITLE: "FALSE",
      SRCWIDTH: shp ? 300 : 200,
      SRCHEIGHT: shp ? 400 : 600,
      BOXSPACE: shp ? 5 : 2,
      LAYERSPACE: shp ? 3 : 0,
      SYMBOLSPACE: shp ? 2 : 0,
      ICONLABELSPACE: shp ? 4 : 2,
      SYMBOLWIDTH: shp ? 12 : 10,
      SYMBOLHEIGHT: shp ? 12 : 35,
      LAYERFONTSIZE: shp ? 8 : 10,
      ITEMFONTSIZE: shp ? 18 : 15,
      ...(shp ? {} : { RULELABEL: "FALSE" }),
    };
    return (await this.qgis(q)) as Buffer;
  }
  private async feature(
    map: string,
    layer: string,
    lon: number,
    lat: number,
    version = "1.1.0",
  ) {
    const data = (await this.qgis(
      {
        MAP: map,
        LAYERS: layer,
        QUERY_LAYERS: layer,
        SERVICE: "WMS",
        VERSION: version,
        REQUEST: "GetFeatureInfo",
        INFO_FORMAT: "application/json",
        WIDTH: 1,
        HEIGHT: 1,
        X: 0,
        Y: 0,
        CRS: "EPSG:4326",
        BBOX: [lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01].join(","),
      },
      true,
    )) as { features?: { id: string; properties: Record<string, unknown> }[] };
    return data.features?.[0];
  }
  async point(p: Params) {
    const lon = Number(p.LONGITUDE),
      lat = Number(p.LATITUDE),
      map = text(p, "MAP");
    const feature = await this.feature(
      map,
      text(p, "LAYERS"),
      lon,
      lat,
      "1.1.1",
    );
    const raw =
      feature?.properties[
        map.includes("现状数据") ? "Y" + feature.id.split(".")[0] : "Band 1"
      ];
    const parsed = Number(raw);
    const value =
      raw == null || String(raw) === "nan" || !Number.isFinite(parsed)
        ? null
        : parsed;
    const bp =
      this.env.QGIS_BOUNDARY_PROJECT ?? "/io/data/boundary/boundary.qgs";
    let region = await this.feature(bp, "Global_boundary", lon, lat);
    region ??= await this.feature(bp, "Global_ocean", lon, lat);
    const properties = { ...region?.properties };
    if (properties.国家 === "中国")
      Object.assign(
        properties,
        (
          await this.feature(
            this.env.QGIS_CHINA_BOUNDARY_PROJECT ??
              "/io/data/boundary/china_boundary.qgs",
            "china_boundary",
            lon,
            lat,
          )
        )?.properties,
      );
    const area: Record<string, string> = {};
    for (const [key, col] of Object.entries(columns))
      if (properties[col] != null) area[key] = String(properties[col]);
    return { value, area };
  }
  private product(map: string) {
    const entry = this.registry[map];
    if (!entry) throw fail("未注册的能源产品路径");
    return entry;
  }
  async lines(p: Params): Promise<LineRow[]> {
    const map = text(p, "map"),
      scale = text(p, "timescale"),
      level = text(p, "level"),
      places = list(p, "places"),
      span = list(p, "timespan");
    const logical = logicalTable(map, scale, level),
      registered = this.product(map).tables[scale + "/" + level];
    if (
      !registered ||
      registered.toLowerCase() !== logical.toLowerCase() ||
      !/^[a-zA-Z0-9_]+$/.test(registered)
    )
      throw fail("统计表未注册或表名不匹配");
    const args: unknown[] = [places];
    let where = "place_china = ANY($1::text[])";
    if (scale.startsWith("hr") && span.length) {
      if (span.length !== 2) throw fail("小时范围需起止时间");
      args.push(span[0], span[1]);
      where += " and time between $2::timestamp and $3::timestamp";
    } else if (span.length) {
      args.push(span);
      where += " and time::text = ANY($2::text[])";
    }
    const projection = scale.startsWith("hr")
      ? "to_char(time,'YYYY-MM-DD HH24')"
      : "time::text";
    return (
      await this.db.query(
        "select place_china,place_english," +
          projection +
          ' as time,value from "' +
          registered.toLowerCase() +
          '" where ' +
          where +
          " order by time asc",
        args,
      )
    ).rows;
  }
  async table(p: Params) {
    const map = text(p, "map");
    this.product(map);
    const scale = text(p, "timeScale"),
      level = text(p, "level");
    if (!["年", "月", "小时"].includes(scale)) throw fail("时间尺度不正确");
    const scope = ["国家", "区域", "次区域"].includes(level)
      ? "Global"
      : ["县级", "地级", "省级", "电网"].includes(level)
        ? "China"
        : null;
    if (!scope) throw fail("区域层级不正确");
    const root = await realpath(this.env.EXCEL_ROOT!);
    const file = path.resolve(
      root,
      map,
      scale,
      ...(scale === "年" ? [] : [text(p, "year")]),
      scope + ".xlsx",
    );
    const resolved = await realpath(file);
    if (!resolved.startsWith(root + path.sep)) throw fail("Excel 路径越界");
    const workbook = XLSX.read(await readFile(resolved), {
      type: "buffer",
      cellDates: true,
    });
    const name = workbook.SheetNames.find((n) => n.startsWith(level));
    if (!name) throw fail("没有匹配工作表");
    const sheet = workbook.Sheets[name],
      range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
    const columns = Array.from({ length: range.e.c + 1 }, (_, c) =>
      String(
        sheet[XLSX.utils.encode_cell({ r: 0, c })]?.v ?? "Column" + (c + 1),
      ),
    );
    const data: Record<string, unknown>[] = [];
    for (let r = 1; r <= range.e.r; r++) {
      if (
        !Array.from(
          { length: columns.length },
          (_, c) => sheet[XLSX.utils.encode_cell({ r, c })],
        ).some(Boolean)
      )
        continue;
      const row: Record<string, unknown> = {};
      for (let c = 0; c < columns.length; c++) {
        const cell = sheet[XLSX.utils.encode_cell({ r, c })];
        row[columns[c]] = cell?.f ?? cell?.v ?? "";
      }
      data.push(row);
    }
    return filterColumns({ columns, data }, text(p, "language"));
  }
  async regions(map: string) {
    return (
      (
        await this.db.query(
          'select regions_zn as "regionsZn",regions_en as "regionsEn" from data_statistic_region where map=$1',
          [map],
        )
      ).rows[0] ?? null
    );
  }
  async description(map: string, lang: string) {
    if (!["chinese", "english"].includes(lang)) return {};
    const col = lang === "chinese" ? "description_zn" : "description_en",
      alias = lang === "chinese" ? "descriptionZn" : "descriptionEn";
    return (
      (
        await this.db.query(
          "select " +
            col +
            ' as "' +
            alias +
            '" from data_description where map=$1',
          [map],
        )
      ).rows[0] ?? null
    );
  }
  async tile(p: Params) {
    if (!this.env.TIANDITU_KEY) throw fail("底图密钥未配置");
    const layer = p.T ? text(p, "T") : text(p, "LAYER") + "_w";
    if (!/^(img|vec|cia|cva|ibo)_w$/.test(layer)) throw fail("底图类型不正确");
    const x = String(p.x ?? p.TILECOL ?? ""),
      y = String(p.y ?? p.TILEROW ?? ""),
      l = String(p.l ?? p.TILEMATRIX ?? "");
    if (![x, y, l].every((v) => /^\d+$/.test(v))) throw fail("瓦片坐标不正确");
    const u = new URL("https://t0.tianditu.gov.cn/DataServer");
    for (const [k, v] of Object.entries({
      T: layer,
      x,
      y,
      l,
      tk: this.env.TIANDITU_KEY,
    }))
      u.searchParams.set(k, v);
    const response = await fetch(u, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw fail("底图服务请求失败");
    return Buffer.from(await response.arrayBuffer());
  }
  async weather(p: Params) {
    if (!this.env.QWEATHER_KEY || !this.env.QWEATHER_BASE_URL)
      throw fail("天气未配置");
    const u = new URL("/v7/weather/now", this.env.QWEATHER_BASE_URL);
    u.searchParams.set(
      "location",
      text(p, "longitude") + "," + text(p, "latitude"),
    );
    u.searchParams.set("key", this.env.QWEATHER_KEY);
    const response = await fetch(u, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw fail("天气请求失败");
    return response.json();
  }
  async close() {
    await this.db.end();
    this.redis.disconnect();
    this.smtp.close();
  }
}
