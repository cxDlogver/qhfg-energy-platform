import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import {
  alignLines,
  BusinessError,
  filterColumns,
  list,
  text,
  type Params,
  type Provider,
  type User,
  type Node,
} from "./model.js";

export const DEMO_PASSWORD = "Energy-demo-2026";
export const DEMO_CODE = "123456"; // Only enabled in the isolated fixture; never used in real mode.
export class FixtureProvider implements Provider {
  private users: User[] = [];
  private cache = new Map<string, { value: string; until: number }>();
  private conditions: Node[] = [
    {
      id: 1,
      name: "发电侧",
      nameEn: "Generation",
      parentId: -1,
      type: "rnode",
      children: [],
    },
    {
      id: 2,
      name: "风力发电",
      nameEn: "Wind power",
      parentId: 1,
      type: "rnode",
      children: [],
    },
    {
      id: 3,
      name: "低空风电",
      nameEn: "Low altitude wind",
      parentId: 2,
      type: "rnode",
      children: [],
    },
    {
      id: 4,
      name: "陆上风电",
      nameEn: "Onshore wind",
      parentId: 3,
      type: "resource",
      children: [],
    },
    {
      id: 5,
      name: "潜力数据",
      nameEn: "Potential data",
      parentId: 4,
      type: "dnode",
      children: [],
    },
    {
      id: 6,
      name: "2.5MW",
      nameEn: "2.5MW",
      parentId: 5,
      type: "dnode",
      children: [],
    },
    {
      id: 7,
      name: "容量因子",
      nameEn: "Capacity factor",
      parentId: 6,
      type: "datatype",
      children: [],
    },
    {
      id: 8,
      name: "10km",
      nameEn: "10km",
      parentId: 7,
      type: "space",
      children: [],
    },
    ...["年", "月", "小时", "多年平均"].map((name, i) => ({
      id: 9 + i,
      name,
      nameEn: ["Year", "Month", "Hour", "Multi-year average"][i],
      parentId: 8,
      type: "time",
      children: [],
    })),
  ];
  private raster = new Map<string, Buffer>();
  static async create() {
    const p = new FixtureProvider();
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
    p.users = ["demo_download", "demo_normal"].map((username, i) => ({
      id: i + 1,
      username,
      password: hash,
      role: i === 0 ? "downloadUser" : "normalUser",
      email: username + "@example.test",
      phone: "1380000000" + i,
      company: "Local fixture",
      region: "中国",
    }));
    return p;
  }
  async user(field: "username" | "email" | "phone", value: string) {
    return this.users.find((u) => u[field] === value) ?? null;
  }
  async permissions(role: string) {
    return role === "downloadUser" || role === "admin"
      ? ["normal", "download"]
      : ["normal"];
  }
  async register(data: Params, hash: string) {
    this.users.push({
      id: Math.max(...this.users.map((u) => u.id)) + 1,
      username: text(data, "username"),
      password: hash,
      role: "normalUser",
      email: text(data, "email"),
      phone: text(data, "phone"),
      company: text(data, "company", false),
      region: text(data, "region", false),
    });
  }
  async reset(email: string, hash: string) {
    const u = await this.user("email", email);
    if (!u) return false;
    u.password = hash;
    return true;
  }
  async get(key: string) {
    const v = this.cache.get(key);
    if (!v || Date.now() >= v.until) {
      this.cache.delete(key);
      return null;
    }
    return v.value;
  }
  async set(key: string, value: string, seconds: number) {
    this.cache.set(key, { value, until: Date.now() + seconds * 1000 });
  }
  async delete(key: string) {
    this.cache.delete(key);
  }
  async mail(_email: string, _code: string, _reset: boolean) {}
  async nodes() {
    return structuredClone(this.conditions);
  }
  async editNode(op: string, data: Params) {
    const id = Number(data.conditionId),
      n = this.conditions.find((n) => n.id === id);
    if (op === "addChild") {
      const parent = this.conditions.find(
        (n) => n.id === Number(data.parentId),
      );
      if (!parent) return false;
      const type = text(data, "type");
      this.conditions.push({
        id: Math.max(...this.conditions.map((n) => n.id)) + 1,
        name: text(data, "name"),
        nameEn: text(data, "nameEn", false),
        parentId: parent.id,
        type,
        children: [],
      });
      if (type === "resource") parent.type = "rnode";
      if (type === "datatype" && parent.type !== "resource")
        parent.type = "dnode";
      return true;
    }
    if (!n) return false;
    if (op === "updatecondition") n.name = text(data, "name");
    else n.deleted = true;
    return true;
  }
  private async png(kind: string, w = 256, h = 256) {
    w = Math.min(2048, Math.max(1, w));
    h = Math.min(2048, Math.max(1, h));
    const key = kind + ":" + w + ":" + h;
    if (this.raster.has(key)) return this.raster.get(key)!;
    // Deterministic local cartographic stand-in, identical for baseline and optimized runs.
    const background =
      kind === "overlay" ? "none" : kind === "legend" ? "#fff" : "#d7e5eb";
    const shapes =
      kind === "overlay"
        ? '<path fill="#43bc9b" fill-opacity=".35" d="M0 0H256V256H0Z"/>'
        : kind === "legend"
          ? '<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#f6ed68"/><stop offset="1" stop-color="#1b8975"/></linearGradient></defs><rect x="22" y="12" width="25" height="230" fill="url(#g)"/><text x="60" y="25">0.6</text><text x="60" y="235">0.0</text>'
          : kind === "boundary"
            ? ""
            : '<path fill="#dde3c1" stroke="#95a5a0" d="M14 60L78 15 151 39 240 23 244 145 194 205 119 193 95 240 53 171 9 142Z"/><path fill="none" stroke="#a9bec7" d="M0 128H256M128 0V256"/>';
    const png = await sharp(
      Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
          w +
          '" height="' +
          h +
          '" viewBox="0 0 256 256"><rect width="256" height="256" fill="' +
          background +
          '"/>' +
          shapes +
          "</svg>",
      ),
    )
      .png()
      .toBuffer();
    if (this.raster.size < 40) this.raster.set(key, png);
    return png;
  }
  async image(p: Params, boundary = false) {
    return this.png(
      boundary ? "boundary" : "overlay",
      Number(p.WIDTH ?? p.width ?? 256),
      Number(p.HEIGHT ?? p.height ?? 256),
    );
  }
  async legend(_p: Params) {
    return this.png("legend", 150, 256);
  }
  async point(p: Params) {
    const lon = Number(p.LONGITUDE),
      lat = Number(p.LATITUDE);
    return {
      value: Number(
        (0.25 + (Math.sin(lon) * Math.cos(lat) + 1) * 0.1).toFixed(4),
      ),
      area: {
        区域: "亚洲",
        次区域: "东亚",
        国家: "中国",
        地区: "中国",
        电网: "华北",
        省级: "北京市",
        地级: "北京市",
        县级: "海淀区",
      },
    };
  }
  async lines(p: Params) {
    const places = list(p, "places");
    const scale = text(p, "timescale");
    const span = list(p, "timespan");
    const times =
      span.length && !scale.startsWith("hr")
        ? span
        : scale.startsWith("mo")
          ? Array.from(
              { length: 12 },
              (_, i) => scale.split("_")[1] + String(i + 1).padStart(2, "0"),
            )
          : scale.startsWith("hr")
            ? Array.from(
                { length: 24 },
                (_, i) => "2021-01-01 " + String(i).padStart(2, "0"),
              )
            : ["2019", "2020", "2021", "2022", "2023"];
    return (places.length ? places : ["亚洲"]).flatMap((place, pi) =>
      times.map((time, i) => ({
        place_china: place,
        place_english:
          (
            { 亚洲: "Asia", 东亚: "East Asia", 中国: "China" } as Record<
              string,
              string
            >
          )[place] ?? place,
        time,
        value: Number((0.28 + pi * 0.01 + i * 0.015).toFixed(4)),
      })),
    );
  }
  async table(p: Params) {
    return filterColumns(
      {
        columns: ["区域", "Regions", "2019", "2020", "2021"],
        data: [
          {
            区域: "亚洲",
            Regions: "Asia",
            "2019": 0.28,
            "2020": 0.3,
            "2021": 0.34,
          },
          {
            区域: "中国",
            Regions: "China",
            "2019": 0.32,
            "2020": 0.35,
            "2021": 0.38,
          },
        ],
      },
      text(p, "language"),
    );
  }
  async regions(_map: string) {
    return {
      regionsZn: "区域/次区域/国家/电网/省级/地级/县级",
      regionsEn: "Region/Subregion/Country/Grid/Province/City/County",
    };
  }
  async description(_map: string, lang: string) {
    return lang === "english"
      ? {
          descriptionEn:
            "<p>Local deterministic fixture. Capacity factor is dimensionless. This is not production energy data.</p>",
        }
      : {
          descriptionZn:
            "<p>本地可重复测试数据。容量因子为无量纲数值。本示例不代表真实能源数据。</p>",
        };
  }
  async tile(_p: Params) {
    return this.png("base");
  }
  async weather(_p: Params) {
    return {
      code: "200",
      now: {
        temp: "20",
        feelsLike: "20",
        text: "晴",
        icon: "100",
        windDir: "北风",
        windScale: "2",
        humidity: "50",
        obsTime: "2026-10-07T08:00:00+08:00",
      },
    };
  }
  async close() {
    this.cache.clear();
  }
}
