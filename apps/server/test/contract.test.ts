import { test } from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { createApp } from "../src/app.js";
import { DEMO_PASSWORD, FixtureProvider } from "../src/fixture.js";
import { alignLines, filterColumns } from "../src/model.js";
import { logicalTable, boundedPosix } from "../src/real.js";

test("20 API contract: authentication, tree, GIS, statistics, download permission, isolated editing", async () => {
  const app = await createApp({ env: { DATA_PROVIDER: "fixture" } });
  try {
    assert.equal((await app.inject("/list/getresourcelist")).statusCode, 401);
    assert.equal(
      (
        await app.inject({
          method: "POST",
          url: "/login",
          payload: { username: "demo_download", password: "bad" },
        })
      ).json().code,
      401,
    );
    const auth = async (username: string) =>
      (
        await app.inject({
          method: "POST",
          url: "/login",
          payload: { username, password: DEMO_PASSWORD },
        })
      ).json().data.token as string;
    const token = await auth("demo_download"),
      headers = { token };
    const resource = (
      await app.inject({ url: "/list/getresourcelist", headers })
    ).json().data;
    assert.equal(resource.name, "发电侧");
    assert.equal(resource.children[0].children[0].children[0].id, 4);
    const types = (
      await app.inject({ url: "/list/getdatatypelist?conditionId=4", headers })
    ).json().data;
    assert.equal(types.name, "");
    assert.equal(types.children[0].children[0].children[0].id, 7);
    assert.equal(
      (
        await app.inject({ url: "/list/getchild?conditionId=7", headers })
      ).json().data.children[0].name,
      "10km",
    );
    const q =
      "MAP=%2Fio%2Fdata%2Ftest.qgs&LAYERS=2021.tif&LONGITUDE=105&LATITUDE=35";
    const point = (
      await app.inject({ url: "/map/getpoint?" + q, headers })
    ).json().data;
    assert.equal(typeof point.value, "number");
    assert.equal(point.area.国家, "中国");
    assert.equal(
      (
        await app.inject({
          url: "/map/getpoint?MAP=a&LAYERS=b&LONGITUDE=NaN&LATITUDE=35",
          headers,
        })
      ).json().code,
      0,
    );
    const legend = (
      await app.inject({ url: "/map/getlegend?MAP=a&LAYER=b", headers })
    ).json().data;
    assert.equal(
      Buffer.from(legend, "base64").subarray(1, 4).toString(),
      "PNG",
    );
    for (const url of [
      "/map/getmap?Map=a",
      "/map/getboundary?level=区域&class=boundary&area=亚洲",
    ]) {
      const image = await app.inject({ url, headers });
      assert.equal(image.headers["content-type"], "image/png");
      assert.equal(image.rawPayload.subarray(1, 4).toString(), "PNG");
    }
    const line = (
      await app.inject({
        url: "/statistical/getlinedata?map=test&timescale=yr&timespan=&level=区域&places=亚洲",
        headers,
      })
    ).json().data;
    assert.deepEqual(line.SeriesData[0].name, ["亚洲", "Asia"]);
    assert.equal(line.SeriesData[0].data.length, line.xAxisData.length);
    const tableQuery =
      "map=test&timeScale=年&year=&level=国家&language=chinese";
    const table = (
      await app.inject({
        url: "/statistical/getexceldata?" + tableQuery,
        headers,
      })
    ).json().data;
    assert.equal(table.columns.includes("Regions"), false);
    assert.ok(table.columns.includes("区域"));
    const dl = await app.inject({
      url: "/statistical/download?" + tableQuery,
      headers,
    });
    assert.equal(dl.statusCode, 200);
    const wb = XLSX.read(dl.rawPayload, { type: "buffer" });
    assert.deepEqual(
      XLSX.utils.sheet_to_json(wb.Sheets.Data, { header: 1 })[0],
      table.columns,
    );
    const normal = await auth("demo_normal");
    assert.equal(
      (
        await app.inject({
          url: "/statistical/download?" + tableQuery,
          headers: { token: normal },
        })
      ).statusCode,
      403,
    );
    assert.equal(
      (await app.inject({ url: "/region/getregions?map=test", headers }))
        .json()
        .data.regionsZn.split("/").length,
      7,
    );
    assert.match(
      (
        await app.inject({
          url: "/i/getdescription?map=test&language=english",
          headers,
        })
      ).json().data.descriptionEn,
      /fixture/,
    );
    for (const [op, payload] of [
      [
        "addChild",
        { parentId: 1, name: "test", nameEn: "test", type: "resource" },
      ],
      ["updatecondition", { conditionId: 13, name: "test changed" }],
      ["delcondition", { conditionId: 13 }],
    ] as const) {
      assert.equal(
        (
          await app.inject({
            url: "/list/" + op,
            method: "POST",
            headers,
            payload,
          })
        ).json().code,
        200,
      );
    }
    assert.equal(
      (await app.inject({ url: "/list/getresourcelist", headers })).json().data
        .children.length,
      1,
    );
  } finally {
    await app.close();
  }
});
test("registration/reset codes, single-use, validation and new password", async () => {
  const app = await createApp({ env: { DATA_PROVIDER: "fixture" } });
  try {
    const email = "new_user@example.test";
    const post = async (url: string, payload: Record<string, unknown>) =>
      (await app.inject({ url, method: "POST", payload })).json();
    assert.equal(
      (await app.inject("/sendcode?email=invalid")).json().code,
      415,
    );
    assert.equal(
      (await app.inject("/user/sendmodcode?email=missing@example.test")).json()
        .code,
      412,
    );
    await app.inject("/sendcode?email=" + email);
    const p = {
      username: "new_user",
      email,
      phone: "13900000000",
      password: "original-password",
      fullName: "Test",
      company: "Test",
      region: "中国",
      code: "bad",
    };
    assert.equal((await post("/register", p)).code, 411);
    p.code = "123456";
    assert.equal((await post("/register", p)).code, 200);
    assert.equal((await post("/register", p)).code, 411);
    await app.inject("/user/sendmodcode?email=" + email);
    assert.equal(
      (
        await post("/user/modifypwd", {
          email,
          code: "123456",
          password: "new-password",
        })
      ).code,
      200,
    );
    assert.equal(
      (await post("/login", { username: p.username, password: p.password }))
        .code,
      401,
    );
    assert.equal(
      (await post("/login", { username: p.username, password: "new-password" }))
        .code,
      200,
    );
  } finally {
    await app.close();
  }
});
test("alignment keeps missing years null, Excel ASCII/Han rule, actual table dictionary, traversal denied", () => {
  assert.deepEqual(
    alignLines([
      { place_china: "甲", place_english: "A", time: "2020", value: 1 },
      { place_china: "乙", place_english: "B", time: "2021", value: 2 },
    ]).SeriesData.map((s) => s.data),
    [
      [1, null],
      [null, 2],
    ],
  );
  const table = {
    columns: ["Regions", "Regions 1", "Year2021", "中文English", "2021"],
    data: [],
  };
  assert.deepEqual(filterColumns(table, "chinese").columns, [
    "Regions 1",
    "Year2021",
    "中文English",
    "2021",
  ]);
  assert.deepEqual(filterColumns(table, "english").columns, [
    "Regions",
    "Regions 1",
    "Year2021",
    "2021",
  ]);
  assert.equal(
    logicalTable(
      "发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km",
      "mo_2021",
      "国家",
    ),
    "pg_wind_low_on_pot_2_5mw_cf_10km_mo_2021_cntry",
  );
  assert.throws(() => boundedPosix("/io/data", "/etc/passwd"));
  assert.equal(
    boundedPosix("/io/data", "/io/data/test.qgs"),
    "/io/data/test.qgs",
  );
});

test("natural month ordering and bilingual series identities remain distinct", () => {
  const result=alignLines([{place_china:"同名",place_english:"A",time:"10",value:10},{place_china:"同名",place_english:"B",time:"2",value:2},{place_china:"同名",place_english:"A",time:"1",value:1}]);
  assert.deepEqual(result.xAxisData,["1","2","10"]);
  assert.deepEqual(result.SeriesData,[{name:["同名","A"],data:[1,null,10]},{name:["同名","B"],data:[null,2,null]}]);
});
