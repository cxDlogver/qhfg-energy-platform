import { getlayerListResourceData } from "@/request";
export function applySourceDefaults(runtime, language, force = false) {
  if (runtime?.provider !== "source") return;
  const lang =
    language === "english" || language === "en" ? "english" : "chinese";
  const key = "dataServiceResults_" + (lang === "english" ? "en" : "zh");
  if (
    force ||
    localStorage.getItem("dataServiceProvider") !== "source" ||
    !localStorage.getItem(key)
  ) {
    if (localStorage.getItem("dataServiceProvider") !== "source") {
      localStorage.removeItem("dataServiceResults_zh");
      localStorage.removeItem("dataServiceResults_en");
    }
    localStorage.setItem(key, JSON.stringify(runtime.defaults[lang]));
  }
  localStorage.setItem("dataServiceProvider", "source");
}
export async function initializeSourceDefaults(language, force = false) {
  const response = await getlayerListResourceData(language);
  applySourceDefaults(response.data?.runtime, language, force);
}
