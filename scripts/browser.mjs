import { chromium } from "playwright";
export const chromePath =
  process.env.CHROME_PATH ??
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
export const chromeFlags = [
  "--headless=new",
  "--no-first-run",
  "--disable-background-networking",
  "--enable-unsafe-swiftshader",
];
export async function login(page, base, user = "demo_download") {
  page.setDefaultTimeout(120000);
  await page.addInitScript(() => {
    localStorage.setItem("language", "chinese");
    localStorage.setItem("user-locale", "chinese");
    localStorage.setItem(
      "userLocation",
      JSON.stringify({ longitude: 116.4, latitude: 39.9 }),
    );
  });
  await page.goto(base + "/#/home/login", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.locator('.login input[name="username"]').fill(user);
  await page.locator('.login input[name="password"]').fill("Energy-demo-2026");
  const response = page.waitForResponse(
    (r) => r.url().includes("/api/login") && r.request().method() === "POST",
  );
  await page.locator(".login .login_btn").click();
  const auth = await (await response).json();
  if (auth.code !== 200) throw new Error("Actual local fixture login failed");
  await page.waitForURL("**/#/home");
  return auth;
}
export async function dataPage(page, base) {
  await page.goto(base + "/#/home", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page
    .locator(".header .system_menu > .menu_item")
    .filter({ hasText: "数据服务" })
    .click();
  await page.waitForURL("**/#/home/dataService");
  await page.locator("#mapView .ol-viewport").waitFor({ state: "visible" });
  await page.waitForFunction(
    () => document.querySelector(".result_img img")?.naturalWidth > 0,
  );
}
export async function launch() {
  return chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--enable-unsafe-swiftshader"],
  });
}
