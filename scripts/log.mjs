import { appendFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
export async function logStep(title, detail) {
  const date = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date());
  const file = path.join(projectRoot, "docs/performance/optimization-log.md");
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(
    file,
    "\n## " + date + " — " + title + "\n\n" + detail + "\n",
    "utf8",
  );
  console.log("[process] " + title);
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await logStep(process.argv[2], process.argv[3] || "");
