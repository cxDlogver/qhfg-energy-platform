import { readFile } from "node:fs/promises";
export type PolygonFeature = {
  properties: Record<string, string>;
  geometry: { type: string; coordinates: number[][][] | number[][][][] };
  bbox?: number[];
};
export async function readLocalPolygons(
  shpFile: string,
  dbfFile: string,
  encoding = "utf-8",
): Promise<PolygonFeature[]> {
  const [shp, dbf] = await Promise.all([readFile(shpFile), readFile(dbfFile)]);
  if (shp.readInt32BE(0) !== 9994) throw new Error("Invalid Shapefile");
  const count = dbf.readUInt32LE(4),
    header = dbf.readUInt16LE(8),
    size = dbf.readUInt16LE(10),
    decode = new TextDecoder(encoding);
  const fields: { name: string; size: number }[] = [];
  for (
    let offset = 32;
    offset + 32 <= header && dbf[offset] !== 13;
    offset += 32
  ) {
    const name = decode
      .decode(dbf.subarray(offset, offset + 11))
      .replace(/\0.*$/, "")
      .trim();
    fields.push({ name, size: dbf[offset + 16] });
  }
  const records: Record<string, string>[] = [];
  for (let i = 0; i < count; i++) {
    let offset = header + i * size + 1;
    const record: Record<string, string> = {};
    for (const field of fields) {
      record[field.name] = decode
        .decode(dbf.subarray(offset, offset + field.size))
        .trim();
      offset += field.size;
    }
    records.push(record);
  }
  const features: PolygonFeature[] = [];
  for (let offset = 100, index = 0; offset + 8 <= shp.length; index++) {
    const length = shp.readInt32BE(offset + 4) * 2,
      body = offset + 8;
    offset = body + length;
    if (offset > shp.length || length < 4)
      throw new Error("Truncated Shapefile");
    const type = shp.readInt32LE(body);
    if (type === 0) continue;
    if (![5, 15, 25].includes(type))
      throw new Error("Only geographic polygon layers are supported");
    const bbox = Array.from({ length: 4 }, (_, i) =>
      shp.readDoubleLE(body + 4 + i * 8),
    );
    if (
      bbox.some((v) => !Number.isFinite(v)) ||
      Math.abs(bbox[0]) > 180 ||
      Math.abs(bbox[2]) > 180 ||
      Math.abs(bbox[1]) > 90 ||
      Math.abs(bbox[3]) > 90
    )
      throw new Error("Boundary CRS is not geographic");
    const parts = shp.readInt32LE(body + 36),
      points = shp.readInt32LE(body + 40),
      start = body + 44 + parts * 4;
    if (parts < 1 || points < 3 || start + points * 16 > offset)
      throw new Error("Invalid polygon geometry");
    const rings: number[][][] = [];
    for (let p = 0; p < parts; p++) {
      const first = shp.readInt32LE(body + 44 + p * 4),
        last = p + 1 < parts ? shp.readInt32LE(body + 48 + p * 4) : points,
        ring: number[][] = [];
      for (let i = first; i < last; i++)
        ring.push([
          shp.readDoubleLE(start + i * 16),
          shp.readDoubleLE(start + i * 16 + 8),
        ]);
      rings.push(ring);
    }
    // Each Shapefile part is kept as an individual ring; even-odd fill handles holes.
    features.push({
      properties: records[index] ?? {},
      geometry: { type: "Polygon", coordinates: rings },
      bbox,
    });
  }
  return features;
}
