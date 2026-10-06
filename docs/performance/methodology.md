# 性能测量协议

本机记录日期 2026-10-07，时区 Asia/Shanghai。原始目录保持只读；仅在目标目录制作私有冻结副本。source-fingerprint.json 可核对原文件指纹，不含凭据值。

- 原版副本：.local/baseline-web；保留原模板/CSS/字体/GIF、全量库注册及构建分块。只将 API、地图、天气改到同一隔离 fixture；补挂载原 static 目录及 Cesium 插件资源，不把缺失资源 404 当作性能优势。
- 新版：apps/web 的 Vite production dist。两者由同一个 scripts/serve.mjs 提供相同压缩和 API 代理；不测 Vite dev。
- Node 24.19.0 / Lighthouse 13.5.0 / Chrome 154.0.0.0 / Windows。桌面 1920×1080，移动默认模拟；完整配置写在 scripts/lighthouse.mjs 和每轮 LHR.configSettings。
- 每轮创建独立 Chrome profile，先通过实际本地表单登录 demo_download；数据页通过菜单写入默认2021结果并确认图例可加载。disableStorageReset 保留该状态，浏览器资源缓存由 Lighthouse 冷启动。
- 首页、数据页 × 桌面、移动 × 3轮 × 原版、新版，最终公平对照共24轮；另保留12轮即时压缩探索基线（baseline-on-demand）与12轮WebP候选（optimized-webp），不混入最终统计。设备/页面分别取各指标中位数，同时保留 min/max；不从三轮中挑最好成绩。
- 指标：performance score、FCP、LCP、SI、TBT、CLS、total-byte-weight。TBT 不等于线上 INP；模拟 LCP 不等于真实墙钟。三维新增能力单独报告首次显示/业务响应、隐藏零帧/keep-alive恢复，不与不存在的旧入口比较。
- 原始JSON/HTML公开仅含本地 fixture URL与测试数据；不公开 Chrome profile、真实环境变量、JWT headers、私有生产数据或源码凭据。
- 优化前后审计不与资源编码/构建任务并发，减少本机 CPU/磁盘竞争。真实数据服务延迟、外网地图、网络状态不能从该本地报告推断。

## 冻结原版重现

历史测量基线来自用户提供的 QHFG.Web；没有把该私有原工程或其 node_modules 发布到新仓库。拥有原始源码时，复制前端到 .local/baseline-web（排除.git/.svn/node_modules/旧报告），提供该前端原锁文件对应的依赖，设置所有外部业务请求为 /api、天气为 /api/weather、天地图为 /api/tiles，并保持原样式与资源。

然后运行 node scripts/baseline.mjs，在一个终端启动 node scripts/serve.mjs baseline、另一个终端启动 fixture API，再执行 node scripts/lighthouse.mjs baseline。此命令使用原依赖入口，不向原始目录写入。原版 static 没有在 Vite public 内，因此预览服务器补挂载；原插件的 Cesium 静态资源必须完整而非404。

## 优化目标（基线之后设定）

优先保证行为/样式和资源等价；性能目标是减少首屏非必要 JS、避免二维加载 Cesium、缩短 FCP/LCP、减少总传输量并控制 TBT/CLS。未承诺任意网络环境下固定90分；保留完整大动画/中文字库会限制最大传输降幅。全部轮次与未达标情况均记录，结果没有取代真实服务验收。

## 预览服务器校正

初始12轮基线使用按请求即时 Brotli 压缩。三维冷加载实测15.15秒后查得数值参数0实际是 MODE，并非 QUALITY，造成默认高压缩级别的服务器CPU延迟。用 Node zlib.constants.BROTLI_PARAM_QUALITY 明确设4，并在两个预览启动时预压缩同类资源、按mtime失效。修正同时作用于原版和新版；原12轮保存在 reports/baseline-on-demand，最终原版12轮全部重测，不与不同服务策略比较。浏览器缓存仍保持冷启动，服务器压缩缓存用于模拟已准备的生产静态资产。

## 最终候选

WebP有完整像素等价，但首批移动TBT与分数退化。最终保留原GIF，继续完整WOFF2与按需代码；#app的flow-root解决边距折叠造成的整页位移，OpenLayers Map/Layer使用shallowRef以保留第三方对象身份。七页静态像素复核仍为0差异；全部候选原始报告保留，最终12轮不得沿用WebP候选值。
