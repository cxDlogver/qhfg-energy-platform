import sharp from "sharp";
import { writeFile, stat, readFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";
import { projectRoot, logStep } from "./log.mjs";
const folder = path.join(projectRoot, "apps/web/src/assets");
const originals = process.env.ORIGINAL_ASSETS_DIR ?? path.join(projectRoot, ".local/original-assets");
const gif = path.join(originals, "img/background.gif"),
  webp = path.join(projectRoot, ".local/asset-candidates/background.webp");
await mkdir(path.dirname(webp), {recursive:true});
await logStep(
  "阶段 3：等价资源压缩开始",
  "保持全部动画帧、像素、每帧时长和循环次数；字体转完整 WOFF2，不进行中文字符裁剪。验证失败不替换页面引用。",
);
const before = await sharp(gif, { animated: true }).metadata();
await sharp(gif, { animated: true })
  .webp({ lossless: true, effort: 4, loop: before.loop, delay: before.delay })
  .toFile(webp);
const after = await sharp(webp, { animated: true }).metadata();
if (
  before.pages !== after.pages ||
  before.loop !== after.loop ||
  JSON.stringify(before.delay) !== JSON.stringify(after.delay)
)
  throw new Error("Animation frame/timing mismatch");
async function hash(file) {
  const metadata = await sharp(file, { animated: true }).metadata();
  const { data, info } = await sharp(file, { animated: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const frameBytes = info.width * metadata.pageHeight * info.channels;
  if (data.length !== frameBytes * metadata.pages)
    throw new Error("Decoded frame byte count mismatch");
  const result = [];
  for (let p = 0; p < metadata.pages; p++)
    result.push(
      createHash("sha256")
        .update(data.subarray(p * frameBytes, (p + 1) * frameBytes))
        .digest("hex"),
    );
  return {
    hashes: result,
    width: info.width,
    pageHeight: metadata.pageHeight,
    channels: info.channels,
  };
}
const decodedBefore = await hash(gif),
  decodedAfter = await hash(webp);
if (JSON.stringify(decodedBefore) !== JSON.stringify(decodedAfter))
  throw new Error("Decoded animation pixels mismatch");
const proof = {
  original: {
    bytes: (await stat(gif)).size,
    frames: before.pages,
    width: before.width,
    height: before.pageHeight,
    delay: before.delay,
    loop: before.loop,
  },
  optimized: {
    bytes: (await stat(webp)).size,
    frames: after.pages,
    width: after.width,
    height: after.pageHeight,
    delay: after.delay,
    loop: after.loop,
  },
  decodedRGBA: decodedAfter,
};
await writeFile(
  path.join(projectRoot, "docs/performance/asset-equivalence.json"),
  JSON.stringify(proof, null, 2),
);
const python = process.env.FONT_PYTHON ?? "python";
await new Promise((resolve, reject) => {
  const p = spawn(
    python,
    [path.join(projectRoot, "scripts/fonts.py"), originals, folder, path.join(projectRoot, "docs/performance/font-equivalence.json")],
    { stdio: "inherit" },
  );
  p.on("error", reject);
  p.on("exit", (c) =>
    c ? reject(new Error("Font conversion/verification failed")) : resolve(),
  );
});
const css = path.join(folder, "base.scss");
let contents = await readFile(css, "utf8");
for (const file of [
  "YouSheBiaoTiHei-2.ttf",
  "SourceHanSansOLD-Light-2.otf",
  "液晶数字字体.TTF",
])
  contents = contents.replace(file, file.replace(/\.(ttf|otf)$/i, ".woff2"));
await writeFile(css, contents);
await logStep(
  "阶段 3：等价资源压缩验证通过",
  "动画 " +
    proof.original.bytes +
    " → " +
    proof.optimized.bytes +
    " 字节；所有 " +
    before.pages +
    " 帧解码 RGBA SHA256 相等，duration/loop 相等；完整字体 cmap/glyphOrder 验证通过，证据保存 asset-equivalence.json、font-equivalence.json。只输出 WebP 候选，不替换页面 GIF；移动解码退化候选未选用。字体使用完整WOFF2。",
);
