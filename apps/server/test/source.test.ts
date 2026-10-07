import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeArrayBuffer } from "geotiff";
import sharp from "sharp";
import * as XLSX from "xlsx";
import { SourceProvider, type SourceManifest } from "../src/source.js";
import { createApp } from "../src/app.js";
test("source data: 0–360 raster coordinates, actual cells, Y-prefixed Excel years and missing layers", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "qhfg-source-"));
  let app: Awaited<ReturnType<typeof createApp>> | undefined;
  try {
    const tif = path.join(dir, "known.tif");
    await writeFile(
      tif,
      Buffer.from(
        await writeArrayBuffer([1, 2, 3, 4], {
          width: 2,
          height: 2,
          GeographicTypeGeoKey: 4326,
          ModelPixelScale: [180, 90, 0],
          ModelTiepoint: [0, 0, 0, 0, 90, 0],
        }),
      ),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ["国家", "Country", "Y2021", "Y2022"],
        ["中国", "China", 0.1, 0.2],
        ["英国", "United Kingdom", 0.3, 0.4],
      ]),
      "国家",
    );
    const excel = path.join(dir, "source.xlsx");
    await writeFile(
      excel,
      XLSX.write(wb, { type: "buffer", bookType: "xlsx" }),
    );
    const map = "/io/data/known/年/2021.qgs";
    const manifest: SourceManifest = {
      version: 1,
      createdAt: "test",
      nodes: [
        {
          id: 1,
          name: "root",
          nameEn: "root",
          parentId: -1,
          type: "rnode",
          children: [],
        },
      ],
      rasters: {
        [map]: {
          file: tif,
          product: "known",
          time: "2021",
          scale: "年",
          layer: "2021.tif",
        },
      },
      workbooks: { "known|年||Global": { file: excel } },
      defaults: {},
      products: ["known"],
      skippedLargeRasters: 0,
    };
    const file = path.join(dir, "manifest.json");
    await writeFile(file, JSON.stringify(manifest));
    const provider = await SourceProvider.create({ SOURCE_MANIFEST: file });
    app = await createApp({ env: { DATA_PROVIDER: "source" }, provider });
    const login = (
      await app.inject({
        method: "POST",
        url: "/login",
        payload: { username: "demo_download", password: "Energy-demo-2026" },
      })
    ).json();
    const headers = { token: login.data.token };
    const point = async (lon: number, lat: number) =>
      (
        await app!.inject({
          url:
            "/map/getpoint?" +
            new URLSearchParams({
              MAP: map,
              LAYERS: "2021.tif",
              LONGITUDE: String(lon),
              LATITUDE: String(lat),
            }),
          headers,
        })
      ).json().data.value;
    assert.equal(await point(90, 45), 1);
    assert.equal(await point(-90, 45), 2);
    assert.equal(await point(90, -45), 3);
    assert.equal(await point(-90, -45), 4);
    const image = await app.inject({
      url:
        "/map/getmap?" +
        new URLSearchParams({
          MAP: map,
          LAYERS: "2021.tif",
          BBOX: "-180,-90,180,90",
          WIDTH: "4",
          HEIGHT: "2",
          SRS: "EPSG:4326",
        }),
      headers,
    });
    assert.equal(image.headers["content-type"], "image/png");
    const pixels = await sharp(image.rawPayload).raw().toBuffer();
    assert.equal(pixels[3], 220);
    assert.notDeepEqual(pixels.subarray(0, 3), pixels.subarray(8, 11));
    const line = (
      await app.inject({
        url: "/statistical/getlinedata?map=known&timescale=yr&timespan=&level=国家&places=中国",
        headers,
      })
    ).json().data;
    assert.deepEqual(line.xAxisData, ["2021", "2022"]);
    assert.deepEqual(line.SeriesData, [
      { name: ["中国", "China"], data: [0.1, 0.2] },
    ]);
    const missing = (
      await app.inject({ url: "/map/getmap?MAP=/io/data/missing.qgs", headers })
    ).json();
    assert.equal(missing.code, 0);
    assert.match(missing.msg, /未在本地/);
    assert.equal((await app.inject("/health")).json().provider, "source");
  } finally {
    await app?.close();
    if (
      path.dirname(path.resolve(dir)) !== path.resolve(tmpdir()) ||
      !path.basename(dir).startsWith("qhfg-source-")
    )
      throw new Error("Unsafe test cleanup path");
    await rm(dir, { recursive: true, force: true });
  }
});
