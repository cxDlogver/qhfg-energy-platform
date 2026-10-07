<template>
  <!-- 地图容器：整个组件的根元素 -->
  <div class="map-container">
    <!-- 地图视图容器：OpenLayers 地图将挂载在此 DOM 元素上 -->
    <div class="mapView" id="mapView"></div>

    <!-- 数据弹窗：点击地图后显示该点的数据信息 -->
    <div v-if="showPopover" class="coordinate-popover" :style="popoverStyle">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click.stop="closePopover">×</button>

      <!-- 弹窗内容区 -->
      <div class="popover-content">
        <div class="coordinates">
          <div class="coord-item">
            <!-- 数据类型名称 -->
            <span>{{ dataTypeThree }}</span>
            <!-- 数据单位 -->
            <span class="label">
              <span v-html="dataUnit ? `(${dataUnit})` : ''"></span>:
            </span>
            <!-- 数据值：加载中显示"加载中"，否则显示具体数值 -->
            <span class="value">
              <span v-if="isLoading" class="loading-text">{{
                $t("result.loading")
              }}</span>
              <span v-else>{{ identifyNumResult.value }}</span>
            </span>
          </div>
        </div>
      </div>
      <!-- 弹窗箭头 -->
      <div class="popover-arrow"></div>
    </div>
  </div>
</template>

<script setup>
/* ============================================================================
 * OpenLayers 2D 地图组件
 *
 * 功能概述：
 * 1. 基于 OpenLayers 实现的 2D 地图可视化组件
 * 2. 支持加载天地图底图（矢量、边界、注记）
 * 3. 通过 WMS 服务加载 GeoServer/QGIS 渲染的业务数据图层
 * 4. 支持地图点击交互，获取点位数据并显示弹窗
 * 5. 支持中英文语言切换
 * 6. 支持标记点显示和世界地图环绕显示
 *
 * OpenLayers 从0到1的绘制流程：
 * Step 1: 创建各种图层对象（底图、边界、WMS业务图层等）
 * Step 2: 在 onMounted 钩子中创建 Map 实例，配置视图和图层
 * Step 3: 监听 props 变化，动态更新图层
 * Step 4: 绑定地图事件（点击、视图变化）
 * Step 5: 用户交互触发事件处理函数
 * ============================================================================ */
// ==================== Vue 核心依赖 ====================
import {
  ref, // 响应式引用
  shallowRef, // 外部地图实例保留对象身份
  onMounted, // 组件挂载生命周期钩子
  onBeforeUnmount, // 组件卸载前生命周期钩子
  onUnmounted, // 组件卸载后生命周期钩子
  watchEffect, // 响应式副作用
  reactive, // 响应式对象
  watch, // 侦听器
} from "vue";

// ==================== OpenLayers 核心依赖 ====================
// 图层相关
import { Vector as VectorLayer } from "ol/layer"; // 矢量图层
import Tile from "ol/layer/Tile"; // 瓦片图层

// 地图核心
import Map from "ol/Map.js"; // 地图对象
import View from "ol/View.js"; // 视图对象（控制中心、缩放等）

// 数据源相关
import { Vector as VectorSource } from "ol/source"; // 矢量数据源
import XYZ from "ol/source/XYZ"; // XYZ 瓦片数据源
import { TileWMS } from "ol/source"; // WMS 瓦片数据源

// 样式相关
import { Fill, Stroke, Style, Circle, Text } from "ol/style.js"; // 填充、描边、样式、圆形、文本样式

// 几何图形和要素
import Feature from "ol/Feature"; // 地理要素对象
import Point from "ol/geom/Point"; // 点几何对象

// 数据格式
import GeoJSON from "ol/format/GeoJSON"; // GeoJSON 格式解析器

// 瓦片网格（当前未使用但已导入）
import TileGrid from "ol/tilegrid/TileGrid";

// ==================== 项目内部依赖 ====================
import bus from "@/utils/bus";
import { ElMessage } from "element-plus";
import TileState from "ol/TileState";
import { getPointData } from "@/request/index"; // 获取点位数据的 API 接口
import request from "@/request/axios"; // Axios 请求实例

// ==================== 第三方库 ====================
import _ from "lodash"; // Lodash 工具库（用于防抖等）
import { useI18n } from "vue-i18n"; // 国际化插件

// ==================== 组件级配置常量 ====================
const { t, locale } = useI18n(); // 国际化翻译函数和当前语言
const baseURL = "/api"; // 后端服务基础 URL

// ==================== 核心响应式变量 ====================
const map = shallowRef(null); // OpenLayers 地图实例

// 【性能优化】ObjectURL 管理器：记录通过 URL.createObjectURL 创建的所有 blob URL，
// 以便在不需要时统一撤销，防止内存泄漏
const objectURLs = new Set();

// ==================== 【性能优化】请求缓存与管理 ====================
// 注意：当前文件已导入 OpenLayers 的 Map，因此这里必须显式使用 globalThis.Map
// 否则 new Map() 会错误地创建 OpenLayers 地图实例，而不是原生 Map。
const requestCache = new globalThis.Map(); // { cacheKey: { data, timestamp } }
const pendingRequests = new globalThis.Map(); // 进行中的请求，用于去重
const abortControllers = new globalThis.Map(); // AbortController 管理器
const CACHE_EXPIRE_TIME = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 200;
let pointSequence = 0;
let lastPointKey = ""; // 5 分钟

const cachedRequest = async (cacheKey, requestFn) => {
  for (const [key,value] of requestCache) if(Date.now()-value.timestamp >= CACHE_EXPIRE_TIME) requestCache.delete(key);
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRE_TIME) {
    
    requestCache.delete(cacheKey);requestCache.set(cacheKey,cached);
    return cached.data;
  }
  

  if(pendingRequests.has(cacheKey)) return pendingRequests.get(cacheKey);

  const requestPromise = Promise.resolve()
    .then(() => requestFn())
    .then((data) => {
      if(requestCache.size >= MAX_CACHE_ENTRIES) requestCache.delete(requestCache.keys().next().value);
      requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      return data;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

/* ============================================================================
 * 【OpenLayers 绘制流程 Step 1】创建图层对象
 *
 * 在这一步骤中，我们预先创建好所有需要的图层对象，这些图层将在后续步骤中
 * 被添加到地图实例中。每个图层都有其特定的用途和配置。
 * ============================================================================ */

// -------------------- 1.1 天地图矢量底图图层 --------------------
// 用途：提供基础的地理底图，显示道路、地名等矢量信息
// 数据源：天地图 XYZ 瓦片服务
const tiandituMapSource = new XYZ({
  url: "/api/tiles?T=vec_w&tk=local-config&x={x}&y={y}&l={z}",
});
const tiandiMapLayer = new Tile({
  zindex: 1, // 图层层级：最底层
  title: "矢量底图", // 图层标题
  source: tiandituMapSource, // 数据源
});

// 引用：用于存储动态创建的 WMS 业务数据图层
const qgjZoomLayer1 = shallowRef(null);

/**
 * -------------------- 1.2 动态创建 WMS 业务数据图层 --------------------
 * 函数：createQgjZoomLayer1
 * 功能：根据 props 传入的业务路径，动态创建 WMS 图层
 *
 * 技术要点：
 * 1. 使用 TileWMS 数据源连接后端 GeoServer/QGIS 服务
 * 2. 自定义 tileLoadFunction 以支持在请求头中添加 Token
 * 3. 支持语言参数传递，实现多语言地图数据
 * 4. 设置 minZoom 和 maxZoom 以控制图层在不同缩放级别的显示
 *
 * @returns {Tile} OpenLayers 瓦片图层对象
 */
// 【性能优化】
// 瓦片太小，通常问题表现为 请求数过多、并发排队、补图碎片化、拖动时一块块加载
// 瓦片太大，通常问题表现为 单请求耗时长、单图解码慢、内存压力大、缩放时重绘卡顿
// 多数情况下，1024x1024 的瓦片大小在性能和加载速度之间提供了较好的平衡，尤其适用于需要显示较大范围数据的地图应用。
// 多分辨率瓦片网格：根据实际地图坐标系和服务端配置，调整 origin 和 resolutions 参数，以确保瓦片正确对齐和显示。
// 【性能优化】动态创建 WMS 业务数据图层
const createQgjZoomLayer1 = () => {
  let layerErrorShown = false;
  const customTileGrid = new TileGrid({
    tileSize: 1024, // 修改瓦片大小
    // 以下参数需根据实际坐标系和服务端配置调整
    origin: [-180, 90], // 瓦片网格原点（示例为 EPSG:4326 常用值）
    resolutions: [
      // 分辨率数组（需与服务端支持的缩放级别匹配）
      0.703125, // 缩放级别 0
      0.3515625, // 缩放级别 1
      0.17578125, // 缩放级别 2（根据实际情况扩展）
    ],
  });
  const token = JSON.parse(localStorage.getItem("leiyangUser"))?.token;

  const qgjMapSource = new TileWMS({
    url: `${baseURL}/map/getmap`,
    params: {
      SERVICE: "WMS",
      VERSION: "1.1.0",
      REQUEST: "GetMap",
      Map: props.qgsMapPath,
      LAYERS: props.tifMapPath,
      FORMAT: "image/png",
      CRS: "EPSG:4326",
      language: locale.value,
    },
    tileGrid: customTileGrid,
    serverType: "geoserver",

    // 自定义 tile 加载函数
    tileLoadFunction: function (imageTile, src) {
      fetch(src, {
        headers: {
          Token: `${token}`,
        },
      })
        .then(async (response) => {
          if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
            if (props.active && !layerErrorShown) {
              layerErrorShown = true;
              const body = await response.json().catch(() => ({}));
              ElMessage.error(body.msg || "图层加载失败，请检查原始数据");
            }
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          // 记录 objectUrl 以便后续清理
          objectURLs.add(objectUrl);

          // 尝试安全地获取 image 元素并设置 src；image 可能尚未就绪
          const tryAssign = (attemptsLeft) => {
            const img = imageTile.getImage();
            if (img) {
              // 记录并释放旧的 blob URL（如果存在）
              const oldSrc = img.src;
              if (
                oldSrc &&
                typeof oldSrc === "string" &&
                oldSrc.startsWith("blob:")
              ) {
                try {
                  img.onload = img.onerror = () => {
                    try {
                      URL.revokeObjectURL(oldSrc);
                      objectURLs.delete(oldSrc);
                    } catch (e) {
                      console.warn("Failed to revoke old tile objectURL", e);
                    }
                  };
                } catch (e) {
                  // 忽略不能绑定事件的情况
                }
              }

              try {
                img.src = objectUrl;
              } catch (e) {
                // 如果赋值失败，撤销刚创建的 objectUrl
                try {
                  URL.revokeObjectURL(objectUrl);
                } catch (re) {}
                objectURLs.delete(objectUrl);
                console.error("Failed to set tile image src:", e);
              }
              return;
            }

            if (attemptsLeft > 0) {
              // 延迟重试，给 OpenLayers 创建 image 的机会
              setTimeout(() => tryAssign(attemptsLeft - 1), 50);
            } else {
              // 超时仍未获取到 image，撤销 objectUrl 防止泄漏
              try {
                URL.revokeObjectURL(objectUrl);
              } catch (e) {}
              objectURLs.delete(objectUrl);
            }
          };

          tryAssign(10);
        })
        .catch((err) => {
          imageTile.setState(TileState.ERROR);
          console.error("Tile loading error:", err);
        });
    },
  });
  return new Tile({
    zindex: 2,
    title: "渲染地图",
    source: qgjMapSource,
    minZoom: 0,
    maxZoom: 12,
  });
};

// -------------------- 1.3 天地图全球境界图层 --------------------
// 用途：显示国家、省份等行政边界
const tiandituBoundarySource = new XYZ({
  url:
    "/api/tiles?" +
    "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0" +
    "&LAYER=ibo&STYLE=default&TILEMATRIXSET=w" +
    "&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}" +
    "&tk=local-config",
});
const tiandituBoundaryLayer = new Tile({
  zindex: 3, // 图层层级
  title: "全球境界", // 图层标题
  source: tiandituBoundarySource,
});

// -------------------- 1.4 天地图矢量注记图层（中文） --------------------
// 用途：显示地名、道路名称等文字标注（仅中文模式下使用）
// 技术要点：设置 tilePixelRatio 为 2 以获得更高清晰度
const tiandituMessageSource = new XYZ({
  url: "/api/tiles?T=cia_w&x={x}&y={y}&l={z}&tk=local-config",
  tilePixelRatio: 2, // 瓦片像素比例：2 倍清晰度
  crossOrigin: "anonymous", // 跨域支持
});

const tiandituMessageLayer = new Tile({
  zindex: 100, // 图层层级：较高层级以显示在其他图层之上
  title: "矢量注记地图", // 图层标题
  source: tiandituMessageSource,
  zoom: 12,
  minZoom: 1,
  maxZoom: 18,
  preload: Infinity, // 预加载所有瓦片
  updateWhileAnimating: true, // 动画时更新瓦片
  updateWhileInteracting: true, // 交互时更新瓦片
  renderMode: "vector", // 矢量渲染模式
  renderBuffer: 200, // 渲染缓冲区大小
});

// -------------------- 1.5 标记点图层 --------------------
// 用途：显示用户点击地图后的标记点（红色圆点）
// 数据源：VectorSource（矢量数据源，可动态添加/移除要素）
const markerSource = new VectorSource();
const markerLayer = new VectorLayer({
  zIndex: 100, // 图层层级
  source: markerSource,
  style: new Style({
    image: new Circle({
      radius: 6, // 圆点半径
      fill: new Fill({ color: "red" }), // 填充颜色：红色
      stroke: new Stroke({ color: "white", width: 2 }), // 描边：白色，宽度 2
    }),
  }),
});

// -------------------- 1.6 国家点图层（英文模式） --------------------
// 用途：在英文模式下显示国家名称标注（不显示蓝色圆点）
// 数据源：GeoJSON 文件
const countryPointLayer = new VectorLayer({
  zIndex: 10, // 图层层级
  title: "国家点",
  visible: true,
  source: new VectorSource({
    url: "/map/国家点.json", // GeoJSON 文件路径
    format: new GeoJSON(), // 使用 GeoJSON 格式解析器
  }),
  style: function (feature) {
    return new Style({
      // 注：原代码中注释掉了蓝色圆点的显示，只显示文本标注
      /*
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: '#00b6ff' }),
        stroke: new Stroke({ color: '#fff', width: 2 })
      }),
      */
      text: new Text({
        font: "normal 14px 微软雅黑", // 字体样式
        text: feature.get("NAME") || "", // 从 GeoJSON 属性中获取名称
        fill: new Fill({ color: "#222" }), // 文字颜色
        stroke: new Stroke({ color: "#fff", width: 2 }), // 文字描边
        offsetY: -12, // 垂直偏移量
      }),
    });
  },
});

// -------------------- 1.7 地图边界高亮图层 --------------------
// 用途：根据图表选择的区域，在地图上高亮显示该区域的边界
// 数据源：WMS 服务（动态获取边界数据）
// 注：当前代码中此图层未被使用，但保留以备后续功能扩展
const boundaryParams = ref({
  level: "国家", // 层级：国家、省级、地级等
  area: "中国,美国", // 区域：多个区域用逗号分隔
  class: "boundary", // 类型：边界
  CRS: "EPSG:4326", // 坐标参考系统
});

const highLightSource = new TileWMS({
  url: `${baseURL}/map/getboundary`, // WMS 服务地址
  params: boundaryParams.value, // 请求参数
});

const highLightLayer = new Tile({
  zindex: 7, // 图层层级
  title: "地图边界",
  source: highLightSource,
  minZoom: 0,
  maxZoom: 12,
});

// 组件卸载时清理所有通过 createObjectURL 创建的 URL，防止内存泄漏
onBeforeUnmount(() => {
  try {
    objectURLs.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // 忽略单个撤销失败
      }
    });
  } catch (e) {
    // 防御性捕获，避免卸载期间抛出错误
  } finally {
    objectURLs.clear();
  }
});

/* ============================================================================
 * 【工具函数】坐标处理相关
 *
 * 这一部分包含处理地图坐标的工具函数，主要用于解决世界地图环绕显示时
 * 的坐标标准化问题。
 * ============================================================================ */

/**
 * 坐标标准化函数
 * 功能：将任意经度值标准化到 [-180, 180) 区间
 *
 * 背景：在 OpenLayers 中，当开启世界地图环绕显示时，用户可以无限向左或向右
 * 平移地图，此时点击的坐标可能超出 [-180, 180] 的标准经度范围。例如，用户
 * 向右平移一圈后点击中国，经度可能是 475 度（115 + 360）。
 *
 * 解决方案：通过取模运算将经度标准化到 [-180, 180) 区间。
 *
 * @param {Array} coordinate - [经度, 纬度] 坐标数组
 * @returns {Array} 标准化后的 [经度, 纬度] 坐标数组
 */
const normalizeCoordinate = (coordinate) => {
  let lon = coordinate[0];
  // 保持经度在 [-180, 180) 范围内
  // 算法说明：(((lon % 360) + 540) % 360) - 180
  // 1. lon % 360: 取模，将经度归到 [-360, 360] 范围
  // 2. + 540: 加540，确保结果为正数
  // 3. % 360: 再次取模，归到 [0, 360) 范围
  // 4. - 180: 减180，最终归到 [-180, 180) 范围
  lon = (((lon % 360) + 540) % 360) - 180;

  return [
    parseFloat(lon.toFixed(6)), // 保留6位小数
    parseFloat(coordinate[1].toFixed(6)), // 保留6位小数
  ];
};

/* ============================================================================
 * 【UI 交互】弹窗相关变量和函数
 *
 * 这一部分负责处理点击地图后显示的数据弹窗，包括弹窗的显示/隐藏、位置计算等。
 * ============================================================================ */

// 弹窗显示状态
const showPopover = ref(false);

// 弹窗样式（响应式对象）
const popoverStyle = reactive({
  top: "0px", // 距离视口顶部的距离
  left: "0px", // 距离视口左侧的距离
});

/**
 * 关闭弹窗函数
 * 功能：
 * 1. 隐藏弹窗
 * 2. 清除地图上的标记点
 * 3. 重置点击坐标并通过事件总线通知其他组件
 */
const closePopover = () => {
  showPopover.value = false; // 隐藏弹窗
  markerSource.clear(); // 清除标记点图层的所有要素

  // 重置点击坐标对象
  clickedCoordinate2D = {
    longitude: null,
    latitude: null,
  };

  // 通过事件总线广播坐标变化事件（通知其他组件）
  bus.emit("clickedCoordinate2D", clickedCoordinate2D);
};

/* ============================================================================
 * 【组件属性】接收父组件传入的参数
 *
 * 这些 props 决定了要显示哪些业务数据图层。
 * ============================================================================ */
const props = defineProps({
  qgsMapPath: String, // QGIS 项目文件路径（.qgz 或 .qgs 文件）
  tifMapPath: String, // TIF 栅格图层路径（业务数据图层）
  dataUnit: String, // 数据单位（如：kWh、MW 等）
  dataTypeThree: String, // 数据类型名称（如：发电量、装机容量等）
  active: {type:Boolean, default:true},
  selectMapPath: String, // 业务路径（用于区分不同的业务场景）
});

/* ============================================================================
 * 【标记点】相关变量和函数
 *
 * 负责在地图上添加和管理用户点击后的标记点。
 * ============================================================================ */

// 点击坐标对象（用于跨组件通信）
let clickedCoordinate2D = {
  longitude: null, // 经度
  latitude: null, // 纬度
};

// 经纬度响应式变量（当前未在模板中使用）
const longitude = ref(null);
const latitude = ref(null);

// 标记点要素对象
var marker = null;

// 标记点的原始坐标（未经标准化）
// 为什么需要保存原始坐标？
// 因为在世界地图环绕显示时，需要根据原始坐标计算所有可能的副本位置
let rawMarkerCoordinate = null;

/**
 * 添加标记点函数
 * 功能：在地图上添加一个红色圆点标记，并更新点击坐标信息
 *
 * @param {Array} coordinate - [经度, 纬度] 坐标数组
 */
const addMarker = (coordinate) => {
  markerSource.clear(); // 清除之前的标记（确保只有一个标记点）
  rawMarkerCoordinate = coordinate; // 保存原始坐标（用于后续的副本计算）

  // 标准化坐标（处理环绕世界的情况）
  const normalizeCoord = normalizeCoordinate(coordinate);

  // 创建点要素
  marker = new Feature({
    geometry: new Point(coordinate), // 使用标准化后的坐标创建点几何对象
  });

  markerSource.addFeature(marker); // 将要素添加到矢量数据源

  // 更新点击坐标对象（保留3位小数）
  clickedCoordinate2D = {
    longitude: normalizeCoord[0].toFixed(3),
    latitude: normalizeCoord[1].toFixed(3),
  };

  // 通过事件总线广播坐标变化事件
  bus.emit("clickedCoordinate2D", clickedCoordinate2D);

  // 更新响应式变量
  longitude.value = clickedCoordinate2D.longitude;
  latitude.value = clickedCoordinate2D.latitude;
};

/* ============================================================================
 * 【工具函数】坐标可见性判断
 *
 * 用于判断某个坐标是否在当前地图视图范围内（支持世界环绕）。
 * ============================================================================ */

/**
 * 判断坐标是否在视图范围内
 * 功能：检查给定坐标是否在地图的可见范围（extent）内
 *
 * 技术要点：支持世界地图环绕显示，即坐标可能出现在多个"世界副本"中
 *
 * @param {Array} extent - 地图可见范围 [minX, minY, maxX, maxY]
 * @param {Array} coordinate - [经度, 纬度] 坐标数组
 * @returns {Boolean} 是否在可见范围内
 */
const containsCoordinate = (extent, coordinate) => {
  const x = coordinate[0]; // 经度
  const y = coordinate[1]; // 纬度

  // 扩展判断逻辑以支持多世界
  // 1. y 轴（纬度）必须在范围内
  // 2. x 轴（经度）可以在当前世界或下一个世界副本中
  return (
    y >= extent[1] && y <= extent[3] && (x >= extent[0] || x + 360 <= extent[2]) // 支持跨世界判断
  );
};

/* ============================================================================
 * 【弹窗位置计算】
 *
 * 负责计算弹窗在屏幕上的显示位置，确保弹窗始终跟随标记点并在视口内可见。
 * ============================================================================ */

// 弹窗与标记点的固定像素偏移量
// [水平偏移, 垂直偏移]，单位：像素
// 垂直偏移 -30 表示弹窗显示在标记点上方 30 像素处
const POPOVER_OFFSET = [0, -30];

/**
 * 更新弹窗位置函数
 * 功能：根据标记点的屏幕像素坐标，计算弹窗的显示位置
 *
 * 技术要点：
 * 1. 应用固定像素偏移，使弹窗显示在标记点上方
 * 2. 进行边界检测，确保弹窗不会超出视口范围
 *
 * @param {Array} pixel - 标记点的屏幕像素坐标 [x, y]
 */
const updatePopoverPosition = (pixel) => {
  if (!pixel) return;

  // 获取地图容器的位置信息
  const mapElement = document.getElementById("mapView");
  const mapRect = mapElement.getBoundingClientRect();

  // 应用固定像素偏移（弹窗显示在标记点上方）
  const adjustedPixel = [
    pixel[0] + POPOVER_OFFSET[0], // 水平偏移
    pixel[1] + POPOVER_OFFSET[1], // 垂直偏移（向上）
  ];

  // 转换为屏幕坐标（相对于整个浏览器窗口）
  const screenX = adjustedPixel[0] + mapRect.left;
  const screenY = adjustedPixel[1] + mapRect.top;

  // 边界处理参数
  const viewportWidth = window.innerWidth; // 视口宽度
  const viewportHeight = window.innerHeight; // 视口高度
  const popoverWidth = 200; // 弹窗宽度（估算值）
  const popoverHeight = 80; // 弹窗高度（估算值）
  const margin = 10; // 边距

  // 水平边界检测：确保弹窗不会超出左右边界
  let finalX = Math.max(
    margin, // 最小值：左边距
    Math.min(screenX, viewportWidth - popoverWidth - margin), // 最大值：右边界
  );

  // 垂直边界检测：确保弹窗不会超出上下边界
  let finalY = Math.max(
    margin, // 最小值：上边距
    Math.min(screenY, viewportHeight - popoverHeight - margin), // 最大值：下边界
  );

  // 应用最终位置（使用 Object.assign 更新响应式对象）
  Object.assign(popoverStyle, {
    left: `${finalX}px`,
    top: `${finalY}px`,
    visibility: "visible", // 确保可见
  });
};

/* ============================================================================
 * 【业务逻辑】缩放等级与行政层级自动映射
 *
 * 根据地图的缩放等级和后端返回的区域数据，自动确定应该显示哪个行政层级的数据。
 * ============================================================================ */

/**
 * 根据缩放等级自动选择行政层级
 * 功能：根据地图缩放等级和后端返回的区域数据，决定显示哪个层级的行政区划
 *
 * 层级优先级（从小到大）：
 * 区域 → 次区域 → 国家 → 电网 → 省级 → 地级 → 县级
 *
 * 技术要点：
 * - zoom >= 8: 县级（最详细）
 * - zoom >= 7: 地级
 * - zoom >= 6: 省级
 * - zoom >= 5: 电网
 * - zoom >= 4: 国家
 * - zoom >= 3.5: 次区域
 * - 默认（zoom < 3.5）: 区域（最概括）
 *
 * @param {Object} area - 后端返回的区域数据对象（包含各层级的区域名称）
 * @param {Number} zoom - 当前地图缩放等级
 * @param {String} selectMapPath - 业务路径（当前未使用）
 * @returns {Object|null} 返回 { level: "层级名称", places: ["区域名称数组"] } 或 null
 */
function getLevelByZoom(area, zoom, selectMapPath) {
  // 按照正确的层级顺序：区域 → 次区域 → 国家 → 电网 → 省级 → 地级 → 县级
  // 调整阈值让默认状态下（zoom = 3.32）选择"区域"层级

  if (zoom >= 8 && area["县级"])
    return { level: "县级", places: [area["县级"]] };
  if (zoom >= 7 && area["地级"])
    return { level: "地级", places: [area["地级"]] };
  if (zoom >= 6 && area["省级"])
    return { level: "省级", places: [area["省级"]] };
  if (zoom >= 5 && area["电网"])
    return { level: "电网", places: [area["电网"]] };
  if (zoom >= 4 && area["国家"])
    return { level: "国家", places: [area["国家"]] };
  if (zoom >= 3.5 && area["次区域"])
    return { level: "次区域", places: [area["次区域"]] };
  if (area["区域"]) return { level: "区域", places: [area["区域"]] };

  return null; // 如果没有匹配的层级数据，返回 null
}

/* ============================================================================
 * 【核心事件】地图点击事件处理
 *
 * 这是组件最核心的交互功能：当用户点击地图时，执行以下操作：
 * 1. 在点击位置添加标记点
 * 2. 显示数据弹窗
 * 3. 请求后端获取该点的数据和区域信息
 * 4. 根据缩放等级确定行政层级，并通知其他组件更新图表
 * ============================================================================ */

/**
 * 处理地图点击事件
 *
 * 执行流程：
 * Step 1: 关闭之前的弹窗和标记点
 * Step 2: 获取点击坐标并标准化
 * Step 3: 添加新的标记点
 * Step 4: 请求后端获取点位数据（用于弹窗显示）
 * Step 5: 计算弹窗位置并显示
 * Step 6: 请求后端获取区域信息（用于图表更新）
 * Step 7: 根据缩放等级确定行政层级
 * Step 8: 通过事件总线通知其他组件更新
 *
 * @param {Object} event - OpenLayers 地图点击事件对象
 */
const handleMapClick = async (event) => {
  if(!props.active) return;
  const clickId=++pointSequence;
  // Step 1: 关闭之前的弹窗，清除标记点
  closePopover();

  // Step 2: 获取点击坐标
  const coordinate = event.coordinate; // 点击地图的坐标 [经度, 纬度]
  const normalizedCoordinate = normalizeCoordinate(coordinate); // 标准化坐标（解决环绕问题）

  // Step 3: 在地图上添加标记点
  // 同时通过 bus.emit("clickedCoordinate2D", ...) 通知其他组件
  addMarker(coordinate);

  // Step 4: 请求后端获取该点的数据值（用于弹窗显示）
  await identifyNum(normalizedCoordinate[0], normalizedCoordinate[1]);
  if(!props.active || clickId !== pointSequence) return;

  // Step 5: 计算弹窗位置
  const rawPixel = map.value.getPixelFromCoordinate(coordinate);
  const adjustedPixel = wrapPixel(rawPixel, map.value.getSize()[0]);
  if (adjustedPixel) {
    updatePopoverPosition(adjustedPixel);
    showPopover.value = true; // 显示弹窗
  }
  if (identifyNumResult.value && identifyNumResult.value.area) {
    const area = identifyNumResult.value.area; // 后端返回的区域数据对象
    const zoom = map.value.getView().getZoom(); // 当前缩放等级

    // 根据缩放等级自动选择行政层级
    const result = getLevelByZoom(area, zoom, props.selectMapPath);

    if (result) {
      // 通过事件总线广播地图点选事件，通知图表组件更新
      bus.emit("mapPointSelected", {
        level: result.level, // 行政层级（如："国家"、"省级"等）
        places: result.places, // 区域名称数组（如：["中国"]）
        map: props.selectMapPath, // 业务路径
        language: locale.value, // 当前语言
        area, // 完整的区域数据对象
      });
    }
  } else {
    console.error("[Map2D] getpoint 返回无 area:", identifyNumResult.value);
  }
};

/* ============================================================================
 * 【辅助函数】世界地图环绕显示支持
 *
 * 在 OpenLayers 中，当启用世界地图环绕显示时，标记点可能会出现在多个
 * "世界副本"中。这些函数负责处理环绕显示的相关逻辑。
 * ============================================================================ */

/**
 * 计算标记点在所有世界副本中的坐标
 * 功能：根据原始坐标和当前视图范围，计算标记点在所有可能的世界副本中的坐标
 *
 * 背景：当用户向左或向右平移地图时，地图会显示"重复的世界"，例如：
 * - 原始世界：经度 [-180, 180]
 * - 左侧副本：经度 [-540, -180]
 * - 右侧副本：经度 [180, 540]
 *
 * @param {Array} coord - 原始坐标 [经度, 纬度]
 * @param {Array} extent - 当前视图范围 [minX, minY, maxX, maxY]
 * @returns {Array} 所有可能的世界副本坐标数组
 */
const calculateWorldCoordinates = (coord, extent) => {
  const worldWidth = 360; // 世界宽度（经度范围）
  // 计算需要创建多少个世界副本
  const visibleWorlds = Math.ceil((extent[2] - extent[0]) / worldWidth) + 1;
  const coordinates = [];

  // 生成左右各 visibleWorlds 个副本的坐标
  for (let i = -visibleWorlds; i <= visibleWorlds; i++) {
    coordinates.push([coord[0] + i * worldWidth, coord[1]]);
  }
  return coordinates;
};

/**
 * 查找第一个可见的世界副本坐标
 * 功能：从所有世界副本中，找到距离视图中心最近且在可见范围内的副本
 *
 * 技术要点：选择距离视图中心最近的副本，避免弹窗跳跃
 *
 * @param {Array} coordinates - 所有世界副本的坐标数组
 * @param {Array} extent - 当前视图范围 [minX, minY, maxX, maxY]
 * @returns {Array|null} 最近的可见坐标，如果没有可见坐标则返回 null
 */
const findFirstVisibleCoordinate = (coordinates, extent) => {
  const viewCenter = map.value.getView().getCenter(); // 视图中心坐标

  // 使用 reduce 找到距离中心最近的可见副本
  return coordinates.reduce(
    (nearest, coord) => {
      if (containsCoordinate(extent, coord)) {
        const dist = Math.abs(coord[0] - viewCenter[0]); // 计算距离
        return dist < nearest.distance ? { coord, distance: dist } : nearest;
      }
      return nearest;
    },
    { coord: null, distance: Infinity }, // 初始值
  ).coord;
};

/* ============================================================================
 * 【核心事件】地图视图变化事件处理
 *
 * 当用户平移或缩放地图时，需要：
 * 1. 判断标记点是否仍在可见范围内
 * 2. 如果可见，更新弹窗位置以跟随标记点
 * 3. 如果不可见，隐藏弹窗
 *
 * 技术要点：使用 lodash 的 debounce 防抖，避免频繁触发
 * ============================================================================ */

/**
 * 处理地图视图变化事件（防抖处理，延迟 100ms 执行）
 *
 * 执行流程：
 * Step 1: 检查是否有标记点，如果没有则隐藏弹窗
 * Step 2: 获取当前视图范围和分辨率
 * Step 3: 判断标记点是否在可见范围内
 * Step 4: 如果可见，计算所有世界副本坐标，选择最近的可见副本
 * Step 5: 更新弹窗位置
 * Step 6: 更新坐标信息并通过事件总线广播
 */
const handleViewChange = _.debounce(() => {
  // Step 1: 检查是否有标记点
  if (!markerSource || markerSource.getFeatures().length === 0) {
    showPopover.value = false; // 没有标记点，隐藏弹窗
    return;
  }

  // Step 2: 获取视图信息
  const view = map.value.getView();
  const mapSize = map.value.getSize();
  const extent = view.calculateExtent(mapSize); // 当前视图范围
  const resolution = view.getResolution(); // 当前分辨率

  // Step 3: 基于原始坐标和当前分辨率判断可见性
  const isVisible = checkMarkerVisibility(
    rawMarkerCoordinate,
    extent,
    resolution,
  );

  showPopover.value = isVisible; // 更新弹窗显示状态

  if (isVisible) {
    // Step 4: 计算所有可能的世界副本坐标
    const worldCoordinates = calculateWorldCoordinates(
      rawMarkerCoordinate,
      extent,
    );
    // 选择距离视图中心最近的可见副本
    const visibleCoord = findFirstVisibleCoordinate(worldCoordinates, extent);

    // Step 5: 获取该副本的屏幕像素位置，并更新弹窗位置
    const pixel = map.value.getPixelFromCoordinate(visibleCoord);
    updatePopoverPosition(pixel);
  }

  // Step 6: 更新并广播坐标信息
  if (marker) {
    const currentCoord = marker.getGeometry().getCoordinates(); // 获取当前标记点坐标
    // 更新坐标信息
    const normalized=normalizeCoordinate(currentCoord);
    clickedCoordinate2D = {longitude:normalized[0].toFixed(3), latitude:normalized[1].toFixed(3)};
    longitude.value = clickedCoordinate2D.longitude;
    latitude.value = clickedCoordinate2D.latitude;

    bus.emit("clickedCoordinate2D", clickedCoordinate2D);
  }
}, 100); // 防抖延迟：100 毫秒

/**
 * 基于分辨率的标记点可见性检测
 * 功能：判断标记点是否在视图范围内（考虑标记点的实际大小）
 *
 * 技术要点：将标记点看作一个有实际大小的图形，而不是一个数学点
 * 这样可以在标记点刚刚移出边界时提前隐藏弹窗，避免视觉跳跃
 *
 * @param {Array} coord - 标记点坐标 [经度, 纬度]
 * @param {Array} extent - 视图范围 [minX, minY, maxX, maxY]
 * @param {Number} resolution - 当前地图分辨率（每像素代表多少地图单位）
 * @returns {Boolean} 标记点是否可见
 */
const checkMarkerVisibility = (coord, extent, resolution) => {
  // 计算标记点实际占用的屏幕空间
  const markerSize = 20; // 标记点直径（像素）
  const markerBuffer = (markerSize / 2) * resolution; // 转换为地图单位

  // 扩展检测范围（在原有范围基础上扩大 markerBuffer）
  const expandedExtent = [
    extent[0] - markerBuffer, // 左边界向左扩展
    extent[1] - markerBuffer, // 下边界向下扩展
    extent[2] + markerBuffer, // 右边界向右扩展
    extent[3] + markerBuffer, // 上边界向上扩展
  ];

  return containsCoordinate(expandedExtent, coord);
};

/**
 * 像素环绕处理函数
 * 功能：处理像素坐标的水平环绕
 *
 * 用途：在世界地图环绕显示时，确保像素坐标在有效范围内
 *
 * @param {Array} pixel - 原始像素坐标 [x, y]
 * @param {Number} mapWidth - 地图宽度（像素）
 * @returns {Array|null} 处理后的像素坐标或 null
 */
const wrapPixel = (pixel, mapWidth) => {
  if (!pixel) return null;
  let x = pixel[0];
  // 处理水平环绕：将 x 坐标归到 [0, mapWidth) 范围内
  x = ((x % mapWidth) + mapWidth) % mapWidth;
  return [x, pixel[1]];
};

/* ============================================================================
 * 【数据获取】点位数据值获取
 *
 * 负责从后端获取点击位置的具体数据值，并在弹窗中显示。
 * ============================================================================ */

// 数据值响应式变量
const identifyNumResult = ref(null); // 获取到的数据值
const isLoading = ref(false); // 加载状态

/**
 * 获取点位数据值函数
 * 功能：请求后端 API，获取指定经纬度位置的数据值
 *
 * 技术要点：
 * 1. 使用 async/await 处理异步请求
 * 2. 显示加载状态
 * 3. 错误处理：如果请求失败或返回 null，显示友好提示
 * 4. 数据格式化：保留 2 位小数
 *
 * @param {Number} longitude - 经度
 * @param {Number} latitude - 纬度
 */
const identifyNum = async (longitude, latitude) => {
  if(!props.active) return;
  const cacheKey = "getPointData_"+props.qgsMapPath+"_"+props.tifMapPath+"_"+longitude.toFixed(3)+"_"+latitude.toFixed(3)+"_"+locale.value;
  const abortKey = "identifyNum";
  const previousController = abortControllers.get(abortKey);
  if (previousController && lastPointKey !== cacheKey) { previousController.abort(); }

  const abortController = lastPointKey === cacheKey && previousController && !previousController.signal.aborted ? previousController : new AbortController();
  lastPointKey = cacheKey;
  abortControllers.set(abortKey, abortController);

  isLoading.value = true; // 开始加载
  identifyNumResult.value = null; // 清空之前的结果

  try {

    const result = await cachedRequest(cacheKey, () =>
      getPointData(
        props.qgsMapPath,
        props.tifMapPath,
        longitude,
        latitude,
        locale.value,
        abortController.signal,
      ),
    );

    if (abortController.signal.aborted || !props.active) {
      return;
    }

    // 格式化结果：保留 2 位小数，如果为 null 则显示 "null"
    identifyNumResult.value = result || "null";
  } catch (error) {
    if (error.name !== "CanceledError" && error.name !== "AbortError") {
      console.error("数值获取失败:", error);
      identifyNumResult.value = t("message.dataException"); // 显示错误提示（国际化）
    }
  } finally {
    if(abortControllers.get(abortKey) === abortController) isLoading.value = false; // 结束当前请求加载
    if (abortControllers.get(abortKey) === abortController) {
      abortControllers.delete(abortKey);
    }
  }

  
};

/* ============================================================================
 * 【图层管理】根据语言获取基础图层数组
 *
 * 功能：根据当前语言设置，返回不同的基础图层组合
 * - 中文模式：底图 + 中文注记 + 边界 + 标记点
 * - 英文模式：底图 + 边界 + 标记点 + 国家点（仅显示地名标注）
 *
 * 技术要点：通过动态切换图层实现多语言支持
 * ============================================================================ */

/**
 * 根据当前语言返回基础图层数组
 *
 * @param {String} localeVal - 当前语言代码（"english" 或其他）
 * @returns {Array} OpenLayers 图层对象数组
 */
function getBaseLayersByLocale(localeVal) {
  if (localeVal === "english") {
    // 英文模式：底图、边界、marker、国家点（只显示地名标注，不显示蓝色圆点）
    return [
      tiandiMapLayer, // 天地图矢量底图
      tiandituBoundaryLayer, // 天地图全球境界
      markerLayer, // 标记点图层
      countryPointLayer, // 国家点图层（仅文本标注）
    ];
  } else {
    // 中文模式：底图、中文注记、边界、marker
    return [
      tiandiMapLayer, // 天地图矢量底图
      tiandituMessageLayer, // 天地图中文注记
      tiandituBoundaryLayer, // 天地图全球境界
      markerLayer, // 标记点图层
    ];
  }
}

/* ============================================================================
 * 【响应式监听】监听地图数据变化
 *
 * 当父组件传入的 qgsMapPath 或 tifMapPath 发生变化时，需要：
 * 1. 重新创建 WMS 业务数据图层
 * 2. 更新地图图层列表
 * 3. 重新绑定事件监听器
 *
 * 技术要点：使用 watch 侦听器，immediate: true 表示组件挂载时立即执行一次
 * ============================================================================ */
watch(
  // 侦听目标：监听 props 中的两个属性
  () => [props.qgsMapPath, props.tifMapPath],

  // 回调函数：当监听的属性发生变化时执行
  ([newQgs, newTif]) => {
    // 如果地图实例存在且两个路径都有值，则加载业务数据图层
    if (map.value && newQgs && newTif) {
      closePopover(); // 关闭弹窗
      markerSource.clear(); // 清除标记点

      // 重新创建 WMS 业务数据图层
      qgjZoomLayer1.value = createQgjZoomLayer1();

      // 获取基础图层数组（根据当前语言）
      const layers = getBaseLayersByLocale(locale.value);

      // 将业务数据图层插入到图层数组中
      layers.splice(1, 0, qgjZoomLayer1.value);

      // 可选：添加高亮图层（当前被注释掉）
      // layers.push(highLightLayer);

      // 更新地图的图层列表
      map.value.setLayers(layers);

      // 重新绑定事件监听器
      map.value.un("click", handleMapClick);
      map.value.on("click", handleMapClick); // 点击事件
      map.value.un("moveend", handleViewChange);
      map.value.on("moveend", handleViewChange); // 视图变化事件
    } else {
      // 如果路径为空，则只显示基础图层
      map.value?.setLayers(getBaseLayersByLocale(locale.value));

      // 移除事件监听器（使用 un 方法）
      map.value?.un("click", handleMapClick);
      map.value?.un("moveend", handleViewChange);

      // 清理 UI
      closePopover();
      markerSource.clear();
    }
  },
  { immediate: true }, // 组件挂载时立即执行一次
);

/* ============================================================================
 * 【OpenLayers 绘制流程 Step 2】创建地图实例
 *
 * 在组件挂载时（DOM 元素已创建），创建 OpenLayers Map 实例并初始化视图。
 * 这是 OpenLayers 从0到1的关键步骤。
 * ============================================================================ */
onMounted(() => {
  // 创建 OpenLayers Map 对象
  map.value = new Map({
    target: "mapView", // 目标 DOM 元素的 id
    layers: getBaseLayersByLocale(locale.value), // 初始图层列表（根据当前语言）
    view: new View({
      center: [116.46, 39.92], // 视图中心坐标（北京）[经度, 纬度]
      projection: "EPSG:4326", // 坐标系：WGS84 地理坐标系
      zoom: 1, // 初始缩放等级
    }),
    controls: [], // 控件列表（空数组表示不显示默认控件）
  });

  // 注：事件监听器在 watch 中根据 props 动态绑定，而不是在这里直接绑定
});

/* ============================================================================
 * 【响应式监听】监听语言切换
 *
 * 当用户切换语言时，需要：
 * 1. 更新基础图层（中文/英文注记）
 * 2. 如果有业务数据图层，需要重新创建（因为 WMS 请求参数中包含 language 参数）
 *
 * 技术要点：语言切换会影响地图显示的文字内容和 WMS 服务返回的数据
 * ============================================================================ */
watch(() => props.active, active => {if(!active){pointSequence++;for(const controller of abortControllers.values())controller.abort();abortControllers.clear();isLoading.value=false;}else nextTick(() => map.value?.updateSize());});

watch(locale, (newLocale) => {
  if (!map.value) return; // 如果地图未初始化，直接返回

  // 如果有业务数据图层，需要重新创建 WMS 图层以使用新的语言参数
  if (props.qgsMapPath && props.tifMapPath) {
    closePopover(); // 关闭弹窗
    markerSource.clear(); // 清除标记点

    // 重新创建 WMS 业务数据图层（包含新的 language 参数）
    qgjZoomLayer1.value = createQgjZoomLayer1();

    // 重新设置图层，包括新创建的 WMS 图层
    const layers = getBaseLayersByLocale(newLocale);
    layers.splice(1, 0, qgjZoomLayer1.value); // 在索引 1 位置插入业务图层
    layers.push(highLightLayer); // 添加高亮图层（可选）
    map.value.setLayers(layers);

    // 重新绑定事件监听器
    map.value.un("click", handleMapClick);
      map.value.on("click", handleMapClick);
    map.value.un("moveend", handleViewChange);
      map.value.on("moveend", handleViewChange);
  } else {
    // 没有业务数据时，只更新基础图层
    map.value.setLayers(getBaseLayersByLocale(newLocale));
  }
});

/* ============================================================================
 * 【生命周期】组件卸载前清理
 *
 * 在组件卸载前，需要移除事件监听器，防止内存泄漏。
 * ============================================================================ */
onBeforeUnmount(() => {
  if (map.value) {
    // 移除事件监听器（使用 un 方法）
    map.value.un("click", handleMapClick);
    map.value.un("moveend", handleViewChange);
  }

  abortControllers.forEach((controller) => controller.abort());
  abortControllers.clear();
  pendingRequests.clear();
  requestCache.clear();
});

/**
 * 组件卸载后清理（当前为空，保留以备后续扩展）
 */
onUnmounted(() => {
  // 可选：取消事件总线监听
  // bus.off("boundaryParams");
});
</script>

<!-- ============================================================================
  样式定义
  
  使用 scoped 限定作用域，防止样式污染全局。
  使用 Less 预处理器，支持嵌套语法。
  ============================================================================ -->
<style scoped lang="less">
/* 地图容器：组件的根元素 */
.map-container {
  width: 100%; /* 占满父容器宽度 */
  height: 100%; /* 占满父容器高度 */
  margin: 0;
  padding: 0;
}

/* 地图视图：OpenLayers 地图的挂载点 */
.mapView {
  width: 100%;
  height: 100%;
  margin: 0;
}

/* 数据弹窗：点击地图后显示的数据信息弹窗 */
.coordinate-popover {
  position: fixed; /* 固定定位，相对于浏览器窗口 */
  z-index: 1000; /* 层级：确保显示在地图之上 */
  background: rgba(255, 255, 255, 0.95); /* 半透明白色背景 */
  border: 1px solid #409eff; /* 边框：蓝色 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 阴影效果 */
  padding: 5px;
  min-width: 170px; /* 最小宽度 */
  font-family: Arial, sans-serif;

  /* 关闭按钮 */
  .close-btn {
    position: absolute; /* 绝对定位，相对于弹窗 */
    top: 0px; /* 距离顶部 */
    right: 0px; /* 距离右侧 */
    background: none;
    background-color: rgb(216, 213, 213); /* 默认背景色：灰色 */
    border: none;
    font-size: 16x;
    cursor: pointer; /* 鼠标指针：手型 */
    color: #666; /* 文字颜色 */

    /* 悬停效果 */
    &:hover {
      color: white; /* 文字变白 */
      background-color: red; /* 背景变红 */
    }
  }

  /* 弹窗内容区 */
  .popover-content {
    position: relative;
    margin: 5px;
    margin-top: 10px; /* 顶部留出空间给关闭按钮 */

    /* 坐标信息容器 */
    .coordinates {
      .coord-item {
        margin: 8px 0;
        display: flex; /* 弹性布局 */
        align-items: center; /* 垂直居中 */
        justify-content: center; /* 水平居中 */
        color: black;
        font-weight: 500; /* 字体加粗 */

        /* 标签部分 */
        .label {
          min-width: 10px; /* 最小宽度 */
        }

        /* 数值部分 */
        .value {
          min-width: 10px;

          /* 加载中文本 */
          .loading-text {
            color: black;
          }
        }
      }
    }
  }
}

/* 地图许可证信息（当前未在模板中使用，但保留样式） */
.map-license {
  position: fixed; /* 固定定位 */
  left: 0;
  right: 0;
  bottom: 20px; /* 距离底部 20px */
  margin: 0 auto; /* 水平居中 */
  width: fit-content; /* 宽度自适应内容 */
  z-index: 9999; /* 最高层级 */
  padding: 4px 16px;
  background: #fff; /* 白色背景 */
  color: #222;
  font-size: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 阴影 */
  border-radius: 4px; /* 圆角 */
}

/* 许可证链接样式 */
.map-license a {
  color: #222;
  text-decoration: none; /* 去除下划线 */
}

/* 许可证链接悬停效果 */
.map-license a:hover {
  color: #409eff; /* 蓝色 */
  text-decoration: underline; /* 添加下划线 */
}
</style>
