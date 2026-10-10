# QHFG Energy Platform

能源数据可视化项目：保留原 Vue 3 页面、二维地图、中英文、筛选、图表、表格、账户流程与 Excel 下载；将实际使用的 20 个 Java API 重构为 TypeScript。三维 Cesium 已接入数据服务页，共享业务筛选和点查询，保留独立相机视角。

父仓库：[cx-learn-notes](https://github.com/cxDlogver/cx-learn-notes)。本仓库作为其独立 Git submodule 引用。

## 真实能源展示恢复

新增source模式，读取原本地ZIP内109栅格、99统计Excel，恢复463节点目录、真实热力图、二维/三维共享图层、点值与省市县边界。先执行 pnpm data:import "<原项目目录>" 再启动。默认是地图和统计均有文件的陆上风电5MW/25km/2021。详见[恢复范围与验证](docs/validation/restoration.md)。

没有原文件的普通clone仍默认fixture，仅供流程测试；占位图不能证明真实展示。Windows旧Node可用 .\scripts\dev.ps1 自动选择兼容Node。

## 本地运行

需要 Node >=22.19（本次验收 Node 24.19）、pnpm 10.28.2、Chrome。前端版本保持原工程实际运行的 Vue 3.5.13 / Vite 5.4.11 / Cesium 1.99.0 / ECharts 5.6.0 / OpenLayers 10.3.1。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

访问 http://127.0.0.1:5173 。默认是隔离 fixture，不连接生产数据库。账号 `demo_download` 或 `demo_normal`，密码 `Energy-demo-2026`；后者没有下载权限。fixture 邮箱验证码为 `123456`，仅供本地流程演示，不发送邮件、不代表真实能源数值或地图。

```sh
pnpm check
pnpm build
node apps/server/dist/main.js
node scripts/serve.mjs optimized
pnpm test:e2e
node scripts/visual-parity.mjs
pnpm perf:optimized
pnpm perf:compare
```

Chrome 自动从 Windows 常用路径读取，其他平台设置 `CHROME_PATH`。性能测量通过 Lighthouse Node API 调用，不依赖网页服务或 CLI 包装器。原版测量需提供原始源码并冻结到 `.local/baseline-web`，依照[测量说明](docs/performance/methodology.md)；普通 clone 不包含私有原工程、生产凭据、数据库或大数据 ZIP。

## 目录与运行边界

- `apps/web`：保留模板/CSS、业务行为；i18n 独立模块、页面/图表/三维按需加载。
- `apps/server/src`：Fastify TS API；`fixture.ts` 为隔离测试数据，`real.ts` 为 PG/Redis/QGIS/SMTP/Excel/天气/底图 adapter。
- `docs/backend-contract.md`：20 接口、响应外壳、大小写、权限、树与统计/Excel 映射。
- `docs/compatibility-matrix.md`：原行为与验收矩阵；`docs/validation` 保存实际执行结果。
- `docs/performance`：Lighthouse 原始报告、前后指标、资源等价证明、实时优化日志。

真实模式：复制 `apps/server/.env.example` 为 `.env`，配置 `DATA_PROVIDER=real`、新 JWT_SECRET、PG/Redis/SMTP/QGIS/Excel 与用户自有地图/天气凭据；设置 `ENERGY_REGISTRY_FILE` 为受控产品/统计表/工程图层注册表，参考 `energy-registry.example.json`。QGIS 工程必须在配置根内，表名/图层必须登记；不会用 fixture 回退伪造真实请求成功。

原提供目录没有数据库 DDL/完整可运行的能源工程及 Excel 部署树，本仓库不会猜测生产 schema 或自动向现有数据库写入。真实服务可达不代表业务验收通过；必须用受控账号/数据核对注册邮件、账户、图层、统计与下载。未调用的旧后端接口及 QHFG.Server 不迁移。

## 项目面试答辩专项

[项目面试答辩目录：20 道递进问题、完整源码机制及性能验证](docs/interview/README.md) · [项目性能问题](docs/interview/01-项目介绍与性能问题定位.md) · [资源和缓存](docs/interview/02-地图资源加载与缓存优化.md) · [网络请求治理](docs/interview/03-网络请求与异步控制优化.md) · [分层渲染](docs/interview/04-分层渲染与地图交互优化.md) · [性能验证和取舍](docs/interview/05-性能验证与工程取舍.md)

## 性能与验证

[指标结果](docs/performance/results.md) · [完整优化过程](docs/performance/optimization-log.md) · [决策](docs/design/decisions.md)

最终24次导航审计分别覆盖原版/新版、桌面/移动、首页/认证数据页；每组三次中位数与波动范围。三维旧实际路由没有入口，使用新增入口交互测量，避免捏造旧三维基线。导航 TBT 不当作线上 INP。

原GIF全部帧与节奏保留；WebP候选经全部RGBA/时序等价验证，但移动性能回退后没有选用。WOFF2 保留全部中文/英文字形、轮廓及度量。文章内容与控件CSS保留；壳体仅阻止外层边距折叠，七页最终像素对照相同。固定桌面面板沿用旧实现，小屏交互并未重新设计。

## 父仓库引用

```sh
git clone --recurse-submodules https://github.com/cxDlogver/cx-learn-notes.git
git submodule update --init qhfg-energy-platform
```

先提交并推送本仓库，再更新父仓库的 submodule 指针。不要把父仓库其他项目变更混入本项目提交。公开源代码保留原资源/第三方归属，不声称拥有第三方素材授权，也不添加未经确认的整体开源许可证。

资源重编码需另提供原资产：设置 ORIGINAL_ASSETS_DIR 指向包含 img/background.gif 和 font/ 原字体的目录；FONT_PYTHON 指向安装 fontTools、Brotli 的 Python，然后执行 pnpm assets:optimize。所有像素/字形校验失败都会中止。WebP只输出到忽略的.local/asset-candidates，不自动替换原GIF。视觉基线也需用户原源码；普通 clone 可直接运行 fixture 与优化版 Lighthouse。

另保留24次探索审计：即时压缩初始基线12次、WebP候选12次。最终对照采用统一预压缩的baseline/optimized，全部候选包括回退结果均公开记录，不混合服务策略或挑选最好分数。
