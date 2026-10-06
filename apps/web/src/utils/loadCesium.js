let pending;
export function loadCesium() {
  if (window.Cesium) return Promise.resolve(window.Cesium);
  if (pending) return pending;
  const base = import.meta.env.VITE_CESIUM_BASE_URL || "/cesium/";
  window.CESIUM_BASE_URL = base;
  pending = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "Widgets/widgets.css";
    document.head.append(css);
    const script = document.createElement("script");
    script.src = base + "Cesium.js";
    script.onload = () => resolve(window.Cesium);
    script.onerror = () => {
      script.remove();
      css.remove();
      pending = null;
      reject(new Error("Cesium 加载失败"));
    };
    document.head.append(script);
  });
  return pending;
}
