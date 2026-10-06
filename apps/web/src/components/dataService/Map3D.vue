<template>
  <div class="home_page" id="cesiumContainer">
    <div class="tdt-toolbar">
      <div class="tdt-btn" @click="zoomIn">
        <i class="iconfont icon-fangda"></i>
      </div>
      <div class="tdt-btn" @click="zoomOut">
        <i class="iconfont icon-suoxiao"></i>
      </div>
      <div class="tdt-btn" @click="rotate">
        <i class="iconfont icon-refresh-1-copy"></i>
      </div>
    </div>
    <!-- 3D地图点击弹窗 -->
    <div v-if="showPopover" class="coordinate-popover" :style="popoverStyle">
      <button class="close-btn" @click.stop="closePopover">×</button>
      <div class="popover-content">
        <div class="coordinates">
          <div class="coord-item">
            <span>{{ dataTypeThree }}</span>
            <span class="label">
              <span v-html="dataUnit ? `(${dataUnit})` : ''"></span>:
            </span>
            <span class="value">
              <span v-if="isLoading" class="loading-text">{{
                $t("result.loading")
              }}</span>
              <span v-else>{{ identifyNumResult }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="popover-arrow"></div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  onBeforeUnmount,
  nextTick,
  ref,
  reactive,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import bus from "@/utils/bus";
import { getPointData } from "@/request";
import { loadCesium } from "@/utils/loadCesium";
const props = defineProps({
  qgsMapPath: String,
  tifMapPath: String,
  selectMapPath: String,
  dataUnit: String,
  dataTypeThree: String,
  active: { type: Boolean, default: true },
});
const { t, locale } = useI18n();
const showPopover = ref(false),
  identifyNumResult = ref(null),
  isLoading = ref(false);
const popoverStyle = reactive({ top: "0px", left: "0px" });
let C,
  viewer,
  handler,
  overlay,
  annotations,
  countries,
  marker,
  timer,
  controller;
let renderedFrames = 0;
let destroyed = false,
  rotating = true,
  sequence = 0,
  languageSequence = 0;
function stopRotation() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function syncActivity() {
  stopRotation();
  if (!viewer || destroyed) return;
  viewer.useDefaultRenderLoop = props.active;
  viewer.clock.shouldAnimate = false;
  if (props.active) {
    nextTick(() => {
      if (!destroyed) {
        viewer.resize();
        viewer.scene.requestRender();
      }
    });
    if (rotating)
      timer = setInterval(() => {
        if (!destroyed && props.active) {
          viewer.camera.rotateRight(0.002);
          viewer.scene.requestRender();
        }
      }, 16);
  } else {
    controller?.abort();
    isLoading.value = false;
    sequence++;
  }
}
function closePopover() {
  showPopover.value = false;
  identifyNumResult.value = null;
  if (marker && viewer && !destroyed) viewer.entities.remove(marker);
  marker = null;
  if (props.active)
    bus.emit("clickedCoordinate3D", { longitude: null, latitude: null });
}
function refreshOverlay() {
  if (!viewer || destroyed) return;
  controller?.abort();
  sequence++;
  closePopover();
  if (overlay) {
    viewer.imageryLayers.remove(overlay, true);
    overlay = null;
  }
  if (props.qgsMapPath && props.tifMapPath) {
    const user = JSON.parse(localStorage.getItem("leiyangUser") || "{}");
    overlay = viewer.imageryLayers.addImageryProvider(
      new C.WebMapServiceImageryProvider({
        url: new C.Resource({
          url: (import.meta.env.VITE_API_BASE_URL || "/api") + "/map/getmap",
          headers: { token: user.token || "" },
        }),
        layers: props.tifMapPath,
        parameters: {
          MAP: props.qgsMapPath,
          transparent: true,
          format: "image/png",
          VERSION: "1.1.0",
          language: locale.value,
        },
        tilingScheme: new C.GeographicTilingScheme(),
        enablePickFeatures: false,
      }),
      1,
    );
    overlay.alpha = 0.8;
  }
  viewer.scene.requestRender();
}
async function setLanguage() {
  if (!viewer || destroyed) return;
  const id = ++languageSequence;
  if (annotations) annotations.show = locale.value !== "english";
  if (countries) {
    viewer.dataSources.remove(countries, true);
    countries = null;
  }
  if (locale.value === "english") {
    const source = await C.GeoJsonDataSource.load("/map/国家点.json", {
      clampToGround: true,
    }).catch(() => null);
    if (!source) return;
    if (destroyed || id !== languageSequence) {
      source.destroy?.();
      return;
    }
    for (const entity of source.entities.values) {
      const label =
        entity.properties?.NAME?.getValue() ??
        entity.properties?.name_en?.getValue() ??
        entity.properties?.name?.getValue();
      entity.billboard = undefined;
      entity.point = undefined;
      if (label)
        entity.label = {
          text: String(label),
          font: "14px Arial, sans-serif",
          fillColor: C.Color.fromCssColorString("#222222"),
          outlineColor: C.Color.WHITE,
          outlineWidth: 2,
          style: C.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new C.Cartesian2(0, -18),
          scale: 0.85,
          distanceDisplayCondition: new C.DistanceDisplayCondition(
            0,
            100000000,
          ),
          heightReference: C.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: 500000,
        };
    }
    countries = await viewer.dataSources.add(source);
    viewer.scene.requestRender();
  }
}
async function identify(movement) {
  rotating = false;
  syncActivity();
  if (!props.active || !props.qgsMapPath || !props.tifMapPath) return;
  const cartesian = viewer.camera.pickEllipsoid(
    movement.position,
    viewer.scene.globe.ellipsoid,
  );
  if (!cartesian) return;
  const geo = C.Cartographic.fromCartesian(cartesian),
    longitude = C.Math.toDegrees(geo.longitude),
    latitude = C.Math.toDegrees(geo.latitude);
  closePopover();
  controller?.abort();
  controller = new AbortController();
  const id = ++sequence;
  marker = viewer.entities.add({
    position: cartesian,
    point: {
      pixelSize: 12,
      color: C.Color.RED,
      outlineColor: C.Color.WHITE,
      outlineWidth: 2,
      disableDepthTestDistance: Infinity,
    },
  });
  const box = viewer.container.getBoundingClientRect();
  Object.assign(popoverStyle, {
    position: "fixed",
    left:
      Math.max(
        10,
        Math.min(box.left + movement.position.x - 100, window.innerWidth - 210),
      ) + "px",
    top: Math.max(80, box.top + movement.position.y - 100) + "px",
    zIndex: 10000,
  });
  showPopover.value = true;
  isLoading.value = true;
  bus.emit("clickedCoordinate3D", {
    longitude: longitude.toFixed(3),
    latitude: latitude.toFixed(3),
  });
  viewer.scene.requestRender();
  try {
    const result = await getPointData(
      props.qgsMapPath,
      props.tifMapPath,
      longitude,
      latitude,
      locale.value,
      controller.signal,
    );
    if (destroyed || id !== sequence) return;
    identifyNumResult.value =
      result?.value == null
        ? t("message.noData")
        : Number(result.value).toFixed(2);
    const area = result?.area ?? {},
      height = viewer.camera.positionCartographic.height;
    const levels = [
      ["县级", 1e6],
      ["地级", 2e6],
      ["省级", 4e6],
      ["电网", 7e6],
      ["国家", 1e7],
      ["次区域", 1.5e7],
      ["区域", Infinity],
    ];
    const level = levels.find(([key, max]) => height <= max && area[key])?.[0];
    if (level)
      bus.emit("mapPointSelected", {
        level,
        places: [area[level]],
        map: props.selectMapPath,
        language: locale.value,
        area,
      });
  } catch (e) {
    if (
      e.name !== "CanceledError" &&
      e.name !== "AbortError" &&
      id === sequence
    )
      ElMessage.error(t("message.noData"));
  } finally {
    if (id === sequence) isLoading.value = false;
  }
}
function zoomIn() {
  if (viewer) {
    viewer.camera.zoomIn(viewer.camera.positionCartographic.height * 0.2);
    viewer.scene.requestRender();
  }
}
function zoomOut() {
  if (viewer) {
    viewer.camera.zoomOut(viewer.camera.positionCartographic.height * 0.2);
    viewer.scene.requestRender();
  }
}
function rotate() {
  if (!viewer) return;
  closePopover();
  rotating = false;
  syncActivity();
  viewer.camera.flyTo({
    destination: C.Cartesian3.fromDegrees(105, 35, 23652516),
    duration: 2,
    complete: () => {
      rotating = true;
      syncActivity();
    },
  });
}
watch(() => props.active, syncActivity);
watch(() => [props.qgsMapPath, props.tifMapPath], refreshOverlay);
watch(locale, () => {
  refreshOverlay();
  setLanguage();
});
onMounted(async () => {
  try {
    C = await loadCesium();
    if (destroyed) return;
    C.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || "";
    viewer = new C.Viewer("cesiumContainer", {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      selectionIndicator: false,
      infoBox: false,
      imageryProvider: false,
      terrainProvider: new C.EllipsoidTerrainProvider(),
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      shouldAnimate: false,
    });
    viewer.imageryLayers.addImageryProvider(
      new C.UrlTemplateImageryProvider({
        url: "/api/tiles?T=img_w&x={x}&y={y}&l={z}",
        maximumLevel: 18,
      }),
    );
    annotations = viewer.imageryLayers.addImageryProvider(
      new C.UrlTemplateImageryProvider({
        url: "/api/tiles?T=cva_w&x={x}&y={y}&l={z}",
        maximumLevel: 18,
      }),
    );
    viewer.scene.postRender.addEventListener(() => {
      renderedFrames++;
    });
    if (window.__ENERGY_DIAGNOSTICS__)
      window.__ENERGY_DIAGNOSTICS__.map3d = () => ({
        renderedFrames,
        active: props.active,
        loop: viewer.useDefaultRenderLoop,
        rotating,
        camera: [
          viewer.camera.position.x,
          viewer.camera.position.y,
          viewer.camera.position.z,
        ],
      });
    viewer.camera.setView({
      destination: C.Cartesian3.fromDegrees(105, 35, 23652516),
    });
    handler = new C.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(identify, C.ScreenSpaceEventType.LEFT_CLICK);
    refreshOverlay();
    await setLanguage();
    syncActivity();
  } catch (e) {
    if (!destroyed) { console.error("三维地图初始化失败", e); ElMessage.error("三维地图加载失败"); }
  }
});
onBeforeUnmount(() => {
  destroyed = true;
  sequence++;
  languageSequence++;
  controller?.abort();
  stopRotation();
  handler?.destroy();
  if (viewer && !viewer.isDestroyed()) viewer.destroy();
  viewer = null;
});
</script>

<style lang="scss" scoped>
.home_page {
  position: relative;
  width: 100%;
  height: 100%;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
.tdt-toolbar {
  position: fixed;
  top: 162px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}
.tdt-btn {
  width: 25px;
  height: 25px;
  background: #4ba0fd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: background 0.2s;
}
.tdt-btn:hover {
  background: #3772ff;
}
.tdt-btn.active {
  background: #ff6b35;
  animation: pulse 2s infinite;
}
.tdt-btn .iconfont {
  color: #fff;
  font-size: 18px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 107, 53, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
  }
}

.coordinate-popover {
  position: fixed;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #409eff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px;
  min-width: 170px;
  font-family: Arial, sans-serif;

  .close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
    background: none;
    background-color: rgb(216, 213, 213);
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;

    &:hover {
      color: white;
      background-color: red;
    }
  }

  .popover-content {
    position: relative;
    margin: 5px;
    margin-top: 10px;

    .coordinates {
      .coord-item {
        margin: 8px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        font-weight: 500;

        .label {
          min-width: 10px;
        }

        .value {
          min-width: 10px;
          .loading-text {
            color: black;
          }
        }
      }
    }
  }
}
</style>
