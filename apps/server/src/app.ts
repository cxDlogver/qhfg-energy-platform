import Fastify from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes, randomInt } from "node:crypto";
import * as XLSX from "xlsx";
import {
  alignLines,
  BusinessError,
  message,
  success,
  text,
  tree,
  type Params,
  type Provider,
  type User,
} from "./model.js";
import { DEMO_CODE, FixtureProvider } from "./fixture.js";
import { RealProvider } from "./real.js";

const openPaths = new Set([
  "/login",
  "/register",
  "/sendcode",
  "/user/sendmodcode",
  "/user/modifypwd",
  "/tiles",
  "/weather",
  "/health",
]);
const labels: Record<string, string> = {
  admin: "管理员",
  normalUser: "普通用户",
  downloadUser: "可下载用户",
};
export async function createApp(
  options: {
    env?: NodeJS.ProcessEnv;
    provider?: Provider;
    now?: () => number;
  } = {},
) {
  const env = options.env ?? process.env,
    fixture = (env.DATA_PROVIDER ?? "fixture") === "fixture";
  const provider =
    options.provider ??
    (fixture ? await FixtureProvider.create() : new RealProvider(env));
  if (provider instanceof RealProvider) await provider.init();
  if (!fixture && (!env.JWT_SECRET || env.JWT_SECRET.length < 32))
    throw new Error(
      "Real mode requires a new JWT_SECRET with at least 32 characters",
    );
  const key = new TextEncoder().encode(
    env.JWT_SECRET ?? randomBytes(48).toString("hex"),
  );
  const ttl = Number(env.JWT_TTL_SECONDS ?? 86400);
  const app = Fastify({ logger: false, bodyLimit: 32768 });
  await app.register(cors, { origin: false });
  const principal = new WeakMap<
    object,
    { user: User; permissions: string[] }
  >();
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof BusinessError)
      return reply
        .code(error.status)
        .send({ code: error.code, msg: error.message, data: null });
    return reply
      .code(500)
      .send({
        code: 500,
        msg: "服务处理失败，请检查服务配置或数据",
        data: null,
      });
  });
  app.addHook("onRequest", async (req, reply) => {
    const route = req.url.split("?")[0];
    if (openPaths.has(route)) return;
    const token = req.headers.token;
    try {
      if (typeof token !== "string") throw new Error("missing");
      const { payload } = await jwtVerify(token, key, {
        issuer: "clj",
        algorithms: ["HS256"],
      });
      const session = await provider.get("login:" + payload.jti);
      if (!session) throw new Error("revoked");
      const data = JSON.parse(session);
      principal.set(req, data);
      const needed =
        route === "/statistical/download"
          ? "download"
          : route.startsWith("/list/") ||
              route.startsWith("/map/") ||
              route.startsWith("/statistical/")
            ? "normal"
            : null;
      if (needed && !data.permissions.includes(needed))
        throw new BusinessError(403, "权限不足", 403);
    } catch (e) {
      if (e instanceof BusinessError) throw e;
      throw new BusinessError(401, "用户未登录或登录已过期", 401);
    }
  });
  app.get("/health", async () => ({
    status: "ok",
    provider: fixture ? "fixture" : "real",
  }));
  app.post("/login", async (req) => {
    const p = req.body as Params;
    const user = await provider.user("username", text(p, "username"));
    if (!user || !(await bcrypt.compare(text(p, "password"), user.password)))
      throw new BusinessError(401, "登录失败，请检查用户名和密码");
    const permissions = await provider.permissions(user.role);
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(String(user.id))
      .setSubject(user.username)
      .setIssuer("clj")
      .setIssuedAt()
      .setExpirationTime(ttl + "s")
      .sign(key);
    await provider.set(
      "login:" + user.id,
      JSON.stringify({
        user: { id: user.id, username: user.username, role: user.role },
        permissions,
      }),
      ttl,
    );
    return success({
      role: labels[user.role] ?? "未知",
      username: user.username,
      email: user.email ?? "",
      phone: user.phone ?? "",
      company: user.company ?? "",
      region: user.region ?? "",
      token,
    });
  });
  const codeKey = (email: string) => "verify_code:" + email;
  for (const route of ["/sendcode", "/user/sendmodcode"])
    app.get(route, async (req) => {
      const email = text(req.query as Params, "email");
      if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email))
        throw new BusinessError(415, "邮箱格式不正确");
      if (route.includes("mod") && !(await provider.user("email", email)))
        throw new BusinessError(412, "用户邮箱不存在");
      const code = fixture ? DEMO_CODE : String(randomInt(100000, 1000000));
      try {
        await provider.mail(email, code, route.includes("mod"));
        await provider.set(codeKey(email), code, 300);
      } catch {
        throw new BusinessError(500, "发送失败：邮件服务不可用");
      }
      return message("验证码发送成功");
    });
  const verifyCode = async (p: Params) => {
    const cached = await provider.get(codeKey(text(p, "email")));
    if (!cached || cached !== text(p, "code"))
      throw new BusinessError(411, "验证码错误");
  };
  app.post("/register", async (req) => {
    const p = req.body as Params;
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(text(p, "username")))
      throw new BusinessError(
        416,
        "用户名长度需在 4 - 20 个字符，只能包含字母、数字和下划线",
      );
    await verifyCode(p);
    for (const [field, code, msg] of [
      ["username", 412, "用户名已存在"],
      ["email", 413, "邮箱已被注册"],
      ["phone", 414, "电话已被注册"],
    ] as const)
      if (await provider.user(field, text(p, field)))
        throw new BusinessError(code, msg);
    await provider.register(p, await bcrypt.hash(text(p, "password"), 10));
    await provider.delete(codeKey(text(p, "email")));
    return message("注册成功");
  });
  app.post("/user/modifypwd", async (req) => {
    const p = req.body as Params;
    await verifyCode(p);
    if (
      !(await provider.reset(
        text(p, "email"),
        await bcrypt.hash(text(p, "password"), 10),
      ))
    )
      throw new BusinessError(419, "修改失败");
    await provider.delete(codeKey(text(p, "email")));
    return message("修改成功！");
  });
  app.get("/list/getresourcelist", async () =>
    success(
      tree(
        (await provider.nodes()).filter((n) =>
          ["rnode", "resource"].includes(n.type),
        ),
      ),
    ),
  );
  for (const route of ["getdatatypelist", "getchild"])
    app.get("/list/" + route, async (req) => {
      const id = Number(text(req.query as Params, "conditionId"));
      if (!Number.isInteger(id))
        throw new BusinessError(0, "conditionId 不正确");
      const nodes = await provider.nodes();
      const children = nodes.filter((n) => n.parentId === id && !n.deleted);
      const chosen = [...children];
      if (route === "getdatatypelist") {
        chosen.splice(
          0,
          chosen.length,
          ...children.filter((n) => ["dnode", "datatype"].includes(n.type)),
        );
        for (let i = 0; i < chosen.length; i++)
          chosen.push(
            ...nodes.filter(
              (n) =>
                n.parentId === chosen[i].id &&
                !n.deleted &&
                ["dnode", "datatype"].includes(n.type),
            ),
          );
      }
      return success(tree(chosen, id));
    });
  for (const [op, msg] of [
    ["updatecondition", "修改"],
    ["addChild", "添加"],
    ["delcondition", "删除"],
  ])
    app.post("/list/" + op, async (req) => {
      const p = req.body as Params;
      op === "addChild"
        ? (text(p, "name"), text(p, "parentId"), text(p, "type"))
        : text(p, "conditionId");
      if (!(await provider.editNode(op, p)))
        throw new BusinessError(0, msg + "失败！");
      return message(msg + "成功！");
    });
  app.get("/map/getmap", async (req, reply) =>
    reply.type("image/png").send(await provider.image(req.query as Params)),
  );
  app.get("/map/getboundary", async (req, reply) =>
    reply
      .type("image/png")
      .send(await provider.image(req.query as Params, true)),
  );
  app.get("/map/getlegend", async (req) => {
    const p = req.query as Params;
    text(p, "MAP");
    text(p, "LAYER");
    return success((await provider.legend(p)).toString("base64"));
  });
  app.get("/map/getpoint", async (req) => {
    const p = req.query as Params;
    for (const key of ["MAP", "LAYERS", "LONGITUDE", "LATITUDE"]) text(p, key);
    if (
      !Number.isFinite(Number(p.LONGITUDE)) ||
      !Number.isFinite(Number(p.LATITUDE))
    )
      throw new BusinessError(
        0,
        "参数格式错误，LONGITUDE 和 LATITUDE 必须为有效的数字",
      );
    if (
      Math.abs(Number(p.LONGITUDE)) > 180 ||
      Math.abs(Number(p.LATITUDE)) > 90
    )
      throw new BusinessError(0, "经纬度超出范围");
    return success(await provider.point(p));
  });
  app.get("/statistical/getlinedata", async (req) => {
    const p = req.query as Params;
    for (const key of ["map", "timescale", "level"]) text(p, key);
    for (const key of ["timespan", "places"])
      if (p[key] === undefined) throw new BusinessError(0, "缺少参数：" + key);
    return success(alignLines(await provider.lines(p)));
  });
  const table = async (p: Params) => {
    for (const key of ["map", "timeScale", "year", "level", "language"])
      text(p, key);
    return provider.table(p);
  };
  app.get("/statistical/getexceldata", async (req) =>
    success(await table(req.query as Params)),
  );
  app.get("/statistical/download", async (req, reply) => {
    const t = await table(req.query as Params);
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      t.columns,
      ...t.data.map((r) =>
        t.columns.map((c) => (r[c] instanceof Date ? null : r[c])),
      ),
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Data");
    return reply
      .header("Content-Disposition", 'attachment; filename="data.xlsx"')
      .type("application/octet-stream")
      .send(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
  });
  app.get("/region/getregions", async (req) => {
    const map = text(req.query as Params, "map");
    if (!map) throw new BusinessError(0, "参数值缺失，请提供map参数值");
    const data = await provider.regions(map);
    if (!data) throw new BusinessError(0, "无数据,请提供正确的map路径");
    return success(data);
  });
  app.get("/i/getdescription", async (req) => {
    const p = req.query as Params;
    const data = await provider.description(
      text(p, "map"),
      text(p, "language"),
    );
    if (!data) throw new BusinessError(0, "无数据");
    return success(data);
  });
  app.get("/tiles", async (req, reply) =>
    reply
      .type("image/png")
      .header("Cache-Control", "public,max-age=3600")
      .send(await provider.tile(req.query as Params)),
  );
  app.get("/weather", async (req) => provider.weather(req.query as Params));
  app.addHook("onClose", async () => provider.close());
  return app;
}
