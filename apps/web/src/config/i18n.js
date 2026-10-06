import { createI18n } from "vue-i18n";
import english from "@/assets/json/locales/en.json";
import chinese from "@/assets/json/locales/zh.json";
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("user-locale") || "chinese",
  fallbackLocale: "english",
  messages: { english, chinese },
});
