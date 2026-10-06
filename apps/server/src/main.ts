import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
const envFile = fileURLToPath(new URL("../.env", import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
const app = await createApp();
await app.listen({
  host: process.env.HOST ?? "127.0.0.1",
  port: Number(process.env.PORT ?? 18080),
});
console.log(
  "Energy API ready; provider=" + (process.env.DATA_PROVIDER ?? "fixture"),
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
