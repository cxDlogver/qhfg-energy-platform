# 性能优化过程记录

日期：2026-10-07（Asia/Shanghai）

每完成有意义的步骤即追加，保留失败与回滚原因、原始报告；不把预计收益写成实测结果。

## 阶段0：调查与设计确认

状态：只读调查完成。已写入决策记录；尚无源码优化、Lighthouse分数或性能提升结论。

用户确认：公开独立仓库；调用范围内TS后端；三维接入；本地Lighthouse Node API。

待验证疑点：70,695,673字节背景GIF、17,840,436字节字体、Cesium首屏注入、UI/图表全量导入、图表监听未释放、三维重复请求与停用生命周期。

原二维已有缓存、防抖、取消请求和Blob URL回收，后续需区分原有机制和本次改动。

API、QGIS、天气的限时只读连通检查不能代表浏览器功能验证，也不能代表Lighthouse结果。底图短请求403作为现有依赖问题登记，不能静默换底图后宣称视觉一致。

| 场景 | Performance | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | --- | --- | --- | --- | --- |
| 原版首页 | 未测 | 未测 | 未测 | 未测 | 未测 | 未测 |
| 原版登录 | 未测 | 未测 | 未测 | 未测 | 未测 | 未测 |
| 原版二维数据服务 | 未测 | 未测 | 未测 | 未测 | 未测 | 未测 |
| 三维数据服务 | 原实际路由未接入，接入后另建优化基线 | — | — | — | — | — |

## 每轮记录模板

1. 时间、代码版本、数据与真实服务/本地测试模式。
2. 假设、具体改动和功能/样式兼容依据。
3. Node、Lighthouse、Chrome、设备、网络、缓存和登录状态。
4. 原始JSON/HTML/trace位置，多次运行中位数及范围。
5. 前后指标差异、业务操作耗时、失败结果。
6. 截图和筛选/地图/图表/表格/下载回归。
7. 保留或回滚的结论、原因与下一步。

导航分数与地图交互分别报告。本地测试数据结果不代表生产服务；未完成真实服务验证的场景需明确标记。

参考：[Lighthouse Node API](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md)、[认证页面测量](https://github.com/GoogleChrome/lighthouse/blob/main/docs/recipes/auth/README.md)、[User Flows](https://github.com/GoogleChrome/lighthouse/blob/main/docs/user-flows.md)。

## 2026-10-07 03:41:58 — 阶段1：确认范围与建立工作副本

用户已同意：本地隔离测试数据与真实适配分开验收；等效资源编码保持视觉；三维单击停转并识别，各自保存视角；保留隐藏编辑接口和入口可见性。已复制前端及私有基线，不改原项目；建立独立工作区和环境变量模板。

## 2026-10-07 03:44:34 — 阶段1：配置化访问与冻结原版

保留原版DOM/CSS及业务逻辑，基线仅把API、天气和底图访问配置为本地同一测试环境；公开前端移除旧凭据字面值。删除未引用副本，三维从原组件增量接入。原项目不变。

## 2026-10-07 03:55:10 — 阶段 2：三维页面接入

保留旧 Map3D 的模板、工具和弹窗 CSS；采用异步组件、共享业务 props/事件、独立相机视角。单击停止自转并识别；页面隐藏/keep-alive 停用暂停循环，销毁 Viewer 与 handler。修复初始化前访问和双重查询，移除源码地图凭据。

## 2026-10-07 03:56:06 — 阶段 2：测试与工具链修复

后端三组契约测试通过，覆盖20接口及认证/权限/验证码/稀疏序列/Excel下载。Windows pnpm shim固定调用Node22，改用Node24显式调用Corepack；首次构建误导入Vite CJS入口，已改成Vite ESM Node API后重试。坐标清空事件增加null处理。

## 2026-10-07 03:57:39 — 原版基线构建

冻结原版前端，保留原始全量 UI/ECharts/Cesium 入口、字体与动画资源；仅替换本地 API/底图/天气凭据。原版静态目录由测量服务器补充挂载，不伪造构建优化。

## 2026-10-07 03:58:58 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:01:15 — Lighthouse 开始：baseline

本地 Lighthouse Node API；实际表单登录 fixture 后再审计数据页，disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。3 次/设备/页面。

## 2026-10-07 04:02:06 — Lighthouse 完成 baseline/desktop-home-1

{"variant":"baseline","device":"desktop","route":"home","run":1,"fetchTime":"2026-10-06T20:01:45.161Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":56.99999999999999,"first-contentful-paint":2321.1502999999993,"largest-contentful-paint":61669.77755,"speed-index":6274.202748742548,"total-blocking-time":58,"cumulative-layout-shift":0.0366847161429389,"total-byte-weight":81752815,"warnings":[]}

## 2026-10-07 04:03:42 — 阶段 2：首轮基线与清理修复

桌面首页首轮performance57，LCP61669.8ms，total-byte-weight81752815B，完整报告已保存。Windows默认Chrome临时目录清理EPERM导致脚本中断，改用项目.local内独立profile并按已保存轮次恢复，避免重跑或覆盖首轮结果。

## 2026-10-07 04:03:43 — Lighthouse 开始：baseline

本地 Lighthouse Node API；实际表单登录 fixture 后再审计数据页，disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。3 次/设备/页面。

## 2026-10-07 04:04:16 — Lighthouse 完成 baseline/desktop-home-2

{"variant":"baseline","device":"desktop","route":"home","run":2,"fetchTime":"2026-10-06T20:03:56.153Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":56.99999999999999,"first-contentful-paint":2320.9429,"largest-contentful-paint":61665.086025,"speed-index":5970.826526117405,"total-blocking-time":62,"cumulative-layout-shift":0.0366847161429389,"total-byte-weight":81752815,"warnings":[]}

## 2026-10-07 04:04:49 — Lighthouse 完成 baseline/desktop-home-3

{"variant":"baseline","device":"desktop","route":"home","run":3,"fetchTime":"2026-10-06T20:04:29.274Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":56.00000000000001,"first-contentful-paint":2282.8692,"largest-contentful-paint":61617.5517,"speed-index":6478.036193809949,"total-blocking-time":95,"cumulative-layout-shift":0.0366847161429389,"total-byte-weight":81752815,"warnings":[]}

## 2026-10-07 04:05:25 — Lighthouse 完成 baseline/desktop-data-1

{"variant":"baseline","device":"desktop","route":"data","run":1,"fetchTime":"2026-10-06T20:05:05.501Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":56.00000000000001,"first-contentful-paint":2063.7003,"largest-contentful-paint":16238.9021,"speed-index":7293.718986036452,"total-blocking-time":130.4999999999999,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":19809430,"warnings":[]}

## 2026-10-07 04:06:00 — Lighthouse 完成 baseline/desktop-data-2

{"variant":"baseline","device":"desktop","route":"data","run":2,"fetchTime":"2026-10-06T20:05:40.462Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":54,"first-contentful-paint":2101.5016000000005,"largest-contentful-paint":16243.1398,"speed-index":7298.8856661304135,"total-blocking-time":151.75240000000053,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":19809430,"warnings":[]}

## 2026-10-07 04:06:04 — 阶段 2/3：审查修复

修复曲线中英文组合分组与自然时间排序；支持重复query列表；Excel跳过缺失行；QGIS规范化后的MAP写回请求、工程/图层注册、固定WMS操作/允许参数/尺寸；真实底图支持原WMTS境界参数。双地图坐标仅由活动维度更新，二维moveend形状修复；三维WMS保持底图与注记之间，无数据翻译键修正，刷新工具恢复初始视角后自转。

## 2026-10-07 04:06:35 — Lighthouse 完成 baseline/desktop-data-3

{"variant":"baseline","device":"desktop","route":"data","run":3,"fetchTime":"2026-10-06T20:06:16.098Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":56.00000000000001,"first-contentful-paint":2128.9456,"largest-contentful-paint":16240.6192,"speed-index":7087.15712049548,"total-blocking-time":126.39120000000003,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":19809430,"warnings":[]}

## 2026-10-07 04:07:07 — Lighthouse 完成 baseline/mobile-home-1

{"variant":"baseline","device":"mobile","route":"home","run":1,"fetchTime":"2026-10-06T20:06:49.033Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":38,"first-contentful-paint":11465.7469,"largest-contentful-paint":382715.665025,"speed-index":17414.78336996843,"total-blocking-time":597.1141499999985,"cumulative-layout-shift":0.08508026282440621,"total-byte-weight":81752815,"warnings":[]}

## 2026-10-07 04:07:39 — Lighthouse 完成 baseline/mobile-home-2

{"variant":"baseline","device":"mobile","route":"home","run":2,"fetchTime":"2026-10-06T20:07:20.989Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":41,"first-contentful-paint":11363.771700000001,"largest-contentful-paint":382730.78774999996,"speed-index":16687.55255910664,"total-blocking-time":498.5,"cumulative-layout-shift":0.08508026282440621,"total-byte-weight":81752815,"warnings":[]}

## 2026-10-07 04:08:11 — Lighthouse 完成 baseline/mobile-home-3

{"variant":"baseline","device":"mobile","route":"home","run":3,"fetchTime":"2026-10-06T20:07:53.355Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":42,"first-contentful-paint":11248.847400000002,"largest-contentful-paint":382726.89365,"speed-index":16554.79160199329,"total-blocking-time":465.5,"cumulative-layout-shift":0.08508026282440621,"total-byte-weight":81752815,"warnings":[]}

## 2026-10-07 04:08:25 — 阶段 3：异步竞态和页面隐藏

二维点选加入active/序号检查，停用取消请求，重复同一点去重并保留5分钟TTL，上限200项；三维与二维仅活动状态回写业务，visibilitychange暂停三维。恢复旧cva中文注记、完整英文标签参数和两位小数。下载拒绝权限的JSON Blob按错误处理，防止误导出错误页面；事件off不删除其他组件监听器。

## 2026-10-07 04:08:45 — Lighthouse 完成 baseline/mobile-data-1

{"variant":"baseline","device":"mobile","route":"data","run":1,"fetchTime":"2026-10-06T20:08:26.280Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":38,"first-contentful-paint":11679.565499999997,"largest-contentful-paint":99912.555125,"speed-index":19783.346980093196,"total-blocking-time":697.9896250000011,"cumulative-layout-shift":0,"total-byte-weight":19806875,"warnings":[]}

## 2026-10-07 04:09:19 — Lighthouse 完成 baseline/mobile-data-2

{"variant":"baseline","device":"mobile","route":"data","run":2,"fetchTime":"2026-10-06T20:09:00.871Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":41,"first-contentful-paint":11593.5406,"largest-contentful-paint":99917.98665,"speed-index":19448.96316405319,"total-blocking-time":573.9460500000023,"cumulative-layout-shift":0,"total-byte-weight":19806875,"warnings":[]}

## 2026-10-07 04:09:54 — Lighthouse 完成 baseline/mobile-data-3

{"variant":"baseline","device":"mobile","route":"data","run":3,"fetchTime":"2026-10-06T20:09:34.940Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":38,"first-contentful-paint":11718.837499999998,"largest-contentful-paint":99913.30312499999,"speed-index":20247.306506026976,"total-blocking-time":671,"cumulative-layout-shift":0,"total-byte-weight":19806875,"warnings":[]}

## 2026-10-07 04:11:02 — 阶段 3：入口与生命周期优化

删除未使用的全局 Antd、VChart 与全量 ElementPlus 注册，保留原完整 CSS/reset；路由目录异步加载；i18n 从 main 抽离避免循环依赖。图表只注册实际 Bar/Line/组件；移除未调用 require renderer；命名 resize/bus handler 并在停用/销毁清理。Cesium 脚本/CSS 改首次3D切换加载。表格参数明确顺序，off只移除自身处理器。

## 2026-10-07 04:11:03 — 阶段 3：等价资源压缩开始

保持全部动画帧、像素、每帧时长和循环次数；字体转完整 WOFF2，不进行中文字符裁剪。验证失败不替换页面引用。

## 2026-10-07 04:14:07 — 阶段 3：等价资源压缩验证通过

动画 70695673 → 61373410 字节；所有 299 帧解码 RGBA SHA256 相等，duration/loop 相等；完整字体 cmap/glyphOrder 验证通过，证据保存 asset-equivalence.json、font-equivalence.json。现在替换引用，保留原始文件用于复核。

## 2026-10-07 04:14:42 — 阶段 3：删除调试输出

AST 移除 14 个 console.log/debug 语句，包括原注册密码、登录令牌与点查询日志；保留错误处理及 CSS/模板。无真实凭据进入公开仓库。

## 2026-10-07 04:17:04 — 阶段 3：删除调试输出

AST 移除 0 个 console.log/debug 语句，包括原注册密码、登录令牌与点查询日志；保留错误处理及 CSS/模板。无真实凭据进入公开仓库。

## 2026-10-07 04:17:35 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:19:09 — 阶段 3：图表残余入口清理

构建检查发现主题目录仍有未使用的 echarts/color 导入，触发全量 ECharts 模块副作用。删除两处无用途导入，保持目录内容和样式。

## 2026-10-07 04:23:00 — 阶段 4：协议下载运行缺陷修复

E2E诊断：原协议语言包邮箱@未作literal interpolation，vue-i18n SyntaxError10，弹窗按钮缺失。仅转义文案@为literal，最终邮箱显示不变，修复用户下载流程后重新验收。

## 2026-10-07 04:23:22 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:30:58 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:32:21 — 发布体积整理

18 个 AST 不可达旧代码移入 .local/unused-source；未引用原 GIF、已验证的三种原字体及 OPPOSans/your-background 移入 .local/original-assets。原提供目录仍完整，公开仓库只保留当前使用的资源和等价证据。资源工具将从外部原目录或 .local 原资产读取。

## 2026-10-07 04:32:51 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:33:25 — 可复现工具整理

一次性源码替换/诊断脚本移到忽略的.local/migration-scripts，公开仅保留运行、构建、Lighthouse、功能/视觉/资源验证工具。资源再编码支持 ORIGINAL_ASSETS_DIR；完整原始源码 SHA256 清单已写入 source-fingerprint.json。

## 2026-10-07 04:34:44 — 功能回归发现与修复

实际 XLSX 下载证实协议邮件@使 vue-i18n 语法异常，已用字面量插值保持显示文本；四层多年平均原 handler 缺分支且字符串 emit 拆字，已同步已有时间选择行为并保留完整层名。增加 UI/数据排序回归，不改控件样式。三维已独立证实能初始化，首次引擎冷加载等待设为45秒以测实际耗时。

## 2026-10-07 04:35:07 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:35:14 — 公开文件检查通过

{"runAt":"2026-10-06T20:35:14.350Z","files":188,"bytes":123977192,"findings":[],"scope":"candidate files excluding gitignore-generated/private folders; values never recorded; examples and fixture passwords are intentional. This automated scan complements review, not a claim of universal secret detection."}

## 2026-10-07 04:35:54 — 功能端到端验收通过

{"environment":"local fixture; not production acceptance","viewport":{"width":1920,"height":1080},"checks":["unauthenticated route redirects","direct empty cache has no default layer","menu creates 2021 default and valid legend","2D page does not load Cesium","2D point updates numeric result, coordinates, chart and table","repeated point uses 5-minute cache","agreement download contains real XLSX and Chinese columns","description dialog","four-level annual filter adds a second result","results are mutually exclusive","multi-year average preserves complete layer name","3D click stops rotation and identifies shared business layer","hidden 3D renders zero frames and stops loop","dimension switch preserves last 3D camera","keep-alive deactivation pauses 3D","keep-alive return keeps selected dimension","English menu persists language","clear removes both language caches","about, three directories and ten article routes render","zero uncaught browser errors"],"timings":{"pointToTableMs":208.96860000000015,"first3DFrameMs":15148.1488},"errors":[],"runAt":"2026-10-06T20:35:54.812Z"}

## 2026-10-07 04:38:33 — 性能诊断：修正静态压缩测量干扰

发现三维15.15秒首次等待的主要本地原因：Brotli数值参数0为MODE而非QUALITY，原服务器按请求即时高质量压缩。改用具名QUALITY=4并启动预压缩；对原版/新版均生效。初始12轮探索证据留在baseline-on-demand，最终基线全部重新执行，避免比较不同压缩环境。

## 2026-10-07 04:38:49 — 功能端到端验收通过

{"environment":"local fixture; not production acceptance","viewport":{"width":1920,"height":1080},"checks":["unauthenticated route redirects","direct empty cache has no default layer","menu creates 2021 default and valid legend","2D page does not load Cesium","2D point updates numeric result, coordinates, chart and table","repeated point uses 5-minute cache","agreement download contains real XLSX and Chinese columns","description dialog","four-level annual filter adds a second result","results are mutually exclusive","multi-year average preserves complete layer name","3D click stops rotation and identifies shared business layer","hidden 3D renders zero frames and stops loop","dimension switch preserves last 3D camera","keep-alive deactivation pauses 3D","keep-alive return keeps selected dimension","English menu persists language","clear removes both language caches","about, three directories and ten article routes render","zero uncaught browser errors"],"timings":{"pointToTableMs":179.83999999999924,"first3DFrameMs":798.1623000000009},"errors":[],"runAt":"2026-10-06T20:38:49.105Z"}

## 2026-10-07 04:39:45 — 视觉对照执行

[{"route":"home","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"data","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"about","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"login","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page1","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page2","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page3","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true}]

## 2026-10-07 04:40:04 — Lighthouse 开始：baseline

本地 Lighthouse Node API；实际表单登录 fixture 后再审计数据页，disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。3 次/设备/页面。

## 2026-10-07 04:40:19 — Lighthouse 完成 baseline/desktop-home-1

{"variant":"baseline","device":"desktop","route":"home","run":1,"fetchTime":"2026-10-06T20:40:08.901Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":61,"first-contentful-paint":2364.3032000000003,"largest-contentful-paint":61725.5612,"speed-index":2364.3032000000003,"total-blocking-time":96,"cumulative-layout-shift":0.0366847161429389,"total-byte-weight":82134717,"warnings":[]}

## 2026-10-07 04:40:36 — Lighthouse 完成 baseline/desktop-home-2

{"variant":"baseline","device":"desktop","route":"home","run":2,"fetchTime":"2026-10-06T20:40:25.003Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":62,"first-contentful-paint":2331.0676000000003,"largest-contentful-paint":61724.736600000004,"speed-index":2331.0676000000003,"total-blocking-time":63,"cumulative-layout-shift":0.0366847161429389,"total-byte-weight":82134717,"warnings":[]}

## 2026-10-07 04:40:53 — Lighthouse 完成 baseline/desktop-home-3

{"variant":"baseline","device":"desktop","route":"home","run":3,"fetchTime":"2026-10-06T20:40:41.970Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":62,"first-contentful-paint":2325.3794000000003,"largest-contentful-paint":61732.827900000004,"speed-index":2325.3794000000003,"total-blocking-time":56,"cumulative-layout-shift":0.0366847161429389,"total-byte-weight":82134717,"warnings":[]}

## 2026-10-07 04:41:09 — Lighthouse 完成 baseline/desktop-data-1

{"variant":"baseline","device":"desktop","route":"data","run":1,"fetchTime":"2026-10-06T20:40:59.449Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":16351.689175000001,"largest-contentful-paint":16634.5107,"speed-index":16351.689175000001,"total-blocking-time":0,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":20228797,"warnings":[]}

## 2026-10-07 04:41:14 — 验收证据整理

7页视觉截图差异均0，computed styles一致；20项浏览器流程和4组后端测试通过。三维引擎冷显示约798ms，静态压缩修正单独记录且用于双方公平基线。真实服务、完整生产月/小时范围及真实影像仍未声称通过。docs/validation/results.md 汇总实际证据与边界。

## 2026-10-07 04:41:25 — Lighthouse 完成 baseline/desktop-data-2

{"variant":"baseline","device":"desktop","route":"data","run":2,"fetchTime":"2026-10-06T20:41:15.318Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":60,"first-contentful-paint":2468.8857,"largest-contentful-paint":16616.971299999997,"speed-index":2468.8857,"total-blocking-time":105.2999749999999,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":20228797,"warnings":[]}

## 2026-10-07 04:41:40 — Lighthouse 完成 baseline/desktop-data-3

{"variant":"baseline","device":"desktop","route":"data","run":3,"fetchTime":"2026-10-06T20:41:31.271Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":16348.494499999999,"largest-contentful-paint":16649.0608,"speed-index":16348.494499999999,"total-blocking-time":0,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":20228797,"warnings":[]}

## 2026-10-07 04:41:58 — Lighthouse 完成 baseline/mobile-home-1

{"variant":"baseline","device":"mobile","route":"home","run":1,"fetchTime":"2026-10-06T20:41:46.262Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":47,"first-contentful-paint":12900.3394,"largest-contentful-paint":384589.21975,"speed-index":12900.3394,"total-blocking-time":353,"cumulative-layout-shift":0,"total-byte-weight":82134717,"warnings":[]}

## 2026-10-07 04:42:15 — Lighthouse 完成 baseline/mobile-home-2

{"variant":"baseline","device":"mobile","route":"home","run":2,"fetchTime":"2026-10-06T20:42:03.414Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":47,"first-contentful-paint":12929.5557,"largest-contentful-paint":384591.112375,"speed-index":12929.5557,"total-blocking-time":373,"cumulative-layout-shift":0,"total-byte-weight":82134717,"warnings":[]}

## 2026-10-07 04:42:33 — Lighthouse 完成 baseline/mobile-home-3

{"variant":"baseline","device":"mobile","route":"home","run":3,"fetchTime":"2026-10-06T20:42:21.475Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":47,"first-contentful-paint":12906.7066,"largest-contentful-paint":384592.43275000004,"speed-index":12906.7066,"total-blocking-time":358,"cumulative-layout-shift":0,"total-byte-weight":82134717,"warnings":[]}

## 2026-10-07 04:42:48 — Lighthouse 完成 baseline/mobile-data-1

{"variant":"baseline","device":"mobile","route":"data","run":1,"fetchTime":"2026-10-06T20:42:39.391Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":101567.5857,"largest-contentful-paint":102921.58245,"speed-index":101567.5857,"total-blocking-time":0,"cumulative-layout-shift":0,"total-byte-weight":20226242,"warnings":[]}

## 2026-10-07 04:43:04 — Lighthouse 完成 baseline/mobile-data-2

{"variant":"baseline","device":"mobile","route":"data","run":2,"fetchTime":"2026-10-06T20:42:55.141Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":101585.0416,"largest-contentful-paint":102937.2317,"speed-index":101585.0416,"total-blocking-time":0,"cumulative-layout-shift":0,"total-byte-weight":20226242,"warnings":[]}

## 2026-10-07 04:43:20 — Lighthouse 完成 baseline/mobile-data-3

{"variant":"baseline","device":"mobile","route":"data","run":3,"fetchTime":"2026-10-06T20:43:10.596Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":101342.70030000001,"largest-contentful-paint":102615.7336,"speed-index":101342.70030000001,"total-blocking-time":0,"cumulative-layout-shift":0,"total-byte-weight":20226242,"warnings":[]}

## 2026-10-07 04:43:44 — Lighthouse 开始：optimized

本地 Lighthouse Node API；实际表单登录 fixture 后再审计数据页，disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。3 次/设备/页面。

## 2026-10-07 04:43:58 — Lighthouse 完成 optimized/desktop-home-1

{"variant":"optimized","device":"desktop","route":"home","run":1,"fetchTime":"2026-10-06T20:43:47.654Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":72,"first-contentful-paint":622.12115,"largest-contentful-paint":52580.388775,"speed-index":878.6309675892417,"total-blocking-time":152,"cumulative-layout-shift":0.03653444676409186,"total-byte-weight":71034563,"warnings":[]}

## 2026-10-07 04:44:12 — Lighthouse 完成 optimized/desktop-home-2

{"variant":"optimized","device":"desktop","route":"home","run":2,"fetchTime":"2026-10-06T20:44:02.825Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":75,"first-contentful-paint":618.37675,"largest-contentful-paint":52578.107375,"speed-index":794.8804411256654,"total-blocking-time":4,"cumulative-layout-shift":0.03653444676409186,"total-byte-weight":71034563,"warnings":[]}

## 2026-10-07 04:44:26 — Lighthouse 完成 optimized/desktop-home-3

{"variant":"optimized","device":"desktop","route":"home","run":3,"fetchTime":"2026-10-06T20:44:16.767Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":75,"first-contentful-paint":616.60775,"largest-contentful-paint":52575.780875,"speed-index":796.3983143364151,"total-blocking-time":4,"cumulative-layout-shift":0.03653444676409186,"total-byte-weight":71034563,"warnings":[]}

## 2026-10-07 04:44:41 — Lighthouse 完成 optimized/desktop-data-1

{"variant":"optimized","device":"desktop","route":"data","run":1,"fetchTime":"2026-10-06T20:44:32.458Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":8962.964,"largest-contentful-paint":9462.964,"speed-index":8962.964,"total-blocking-time":0,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":11277068,"warnings":[]}

## 2026-10-07 04:44:56 — Lighthouse 完成 optimized/desktop-data-2

{"variant":"optimized","device":"desktop","route":"data","run":2,"fetchTime":"2026-10-06T20:44:48.217Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":70,"first-contentful-paint":784.8140000000001,"largest-contentful-paint":9403.6105,"speed-index":1668.040252551611,"total-blocking-time":134,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":11277068,"warnings":[]}

## 2026-10-07 04:45:11 — Lighthouse 完成 optimized/desktop-data-3

{"variant":"optimized","device":"desktop","route":"data","run":3,"fetchTime":"2026-10-06T20:45:03.285Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":69,"first-contentful-paint":784.4932000000001,"largest-contentful-paint":9443.3699,"speed-index":1661.1932922265855,"total-blocking-time":156,"cumulative-layout-shift":0.037254221323170945,"total-byte-weight":11277068,"warnings":[]}

## 2026-10-07 04:45:25 — Lighthouse 完成 optimized/mobile-home-1

{"variant":"optimized","device":"mobile","route":"home","run":1,"fetchTime":"2026-10-06T20:45:16.555Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":59,"first-contentful-paint":2858.80915,"largest-contentful-paint":327916.35985,"speed-index":2858.80915,"total-blocking-time":372.5,"cumulative-layout-shift":0.0850546780072904,"total-byte-weight":71034563,"warnings":[]}

## 2026-10-07 04:45:38 — Lighthouse 完成 optimized/mobile-home-2

{"variant":"optimized","device":"mobile","route":"home","run":2,"fetchTime":"2026-10-06T20:45:29.769Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":43,"first-contentful-paint":2861.454625,"largest-contentful-paint":327921.272875,"speed-index":2861.454625,"total-blocking-time":1396.8181250000002,"cumulative-layout-shift":0.0850546780072904,"total-byte-weight":71034563,"warnings":[]}

## 2026-10-07 04:45:53 — Lighthouse 完成 optimized/mobile-home-3

{"variant":"optimized","device":"mobile","route":"home","run":3,"fetchTime":"2026-10-06T20:45:43.249Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":41,"first-contentful-paint":2859.74785,"largest-contentful-paint":327918.10315,"speed-index":2859.74785,"total-blocking-time":1761.0372499999999,"cumulative-layout-shift":0.0850546780072904,"total-byte-weight":71034563,"warnings":[]}

## 2026-10-07 04:46:07 — 独立公开仓库已创建

GitHub 返回 https://github.com/cxDlogver/qhfg-energy-platform，private=false，owner=cxDlogver。创建使用既有 Git 身份，仅在内存消费认证，未输出/保存认证值；尚未推送源码，待最终报告完整后提交。父仓库保留原有 official-network 工作区改动，只迁移本项目两份已跟踪文档为 gitlink。

## 2026-10-07 04:46:07 — Lighthouse 完成 optimized/mobile-data-1

{"variant":"optimized","device":"mobile","route":"data","run":1,"fetchTime":"2026-10-06T20:45:59.710Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":40,"first-contentful-paint":3904.535475,"largest-contentful-paint":57378.88755,"speed-index":4576.16410000962,"total-blocking-time":1052.999999999999,"cumulative-layout-shift":0.0850546780072904,"total-byte-weight":11274513,"warnings":[]}

## 2026-10-07 04:46:22 — Lighthouse 完成 optimized/mobile-data-2

{"variant":"optimized","device":"mobile","route":"data","run":2,"fetchTime":"2026-10-06T20:46:14.261Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":40,"first-contentful-paint":3905.8462250000002,"largest-contentful-paint":57080.01105,"speed-index":4579.683121371012,"total-blocking-time":1111.999999999999,"cumulative-layout-shift":0.0850546780072904,"total-byte-weight":11274513,"warnings":[]}

## 2026-10-07 04:46:36 — Lighthouse 完成 optimized/mobile-data-3

{"variant":"optimized","device":"mobile","route":"data","run":3,"fetchTime":"2026-10-06T20:46:28.426Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":53,"first-contentful-paint":54978.919350000004,"largest-contentful-paint":56928.91935,"speed-index":54978.919350000004,"total-blocking-time":0,"cumulative-layout-shift":0.0850546780072904,"total-byte-weight":11274513,"warnings":[]}

## 2026-10-07 04:49:46 — 候选评估：移动端性能退化处理

WebP候选桌面分数62→75、55→69，但移动首页三轮59/43/41、数据40/40/53，TBT明显波动；原始主线程other变多，动画解码为待验证假设，不能据此宣称全面提升。CLS指向body整体70px位移，源为main上边距折叠。#app建立flow-root只阻止外层折叠，随后必须重新做像素对照。原GIF与全部帧保留作为较低CPU候选，WebP12份报告移入optimized-webp，不丢弃退化结果。

## 2026-10-07 04:50:10 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:51:01 — 视觉对照执行

[{"route":"home","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"data","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"about","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"login","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page1","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page2","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page3","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true}]

## 2026-10-07 04:51:43 — 地图第三方实例代理优化

源码发现 OpenLayers Map 与 WMS Layer 存入深 ref，Vue会深代理外部引擎。改为shallowRef保留对象身份、避免深响应式开销；业务参数仍响应式。ECharts实例本来是普通变量，未重复声称优化。依据Vue高级响应式文档 https://vuejs.org/api/reactivity-advanced.html#shallowref 。必须通过点选/图层/视觉回归及最终12轮测量验证收益。

## 2026-10-07 04:52:06 — 构建通过

TypeScript 后端与 Vite 前端生产构建通过；仅生产产物用于性能测量。

## 2026-10-07 04:52:37 — 功能端到端验收通过

{"environment":"local fixture; not production acceptance","viewport":{"width":1920,"height":1080},"checks":["unauthenticated route redirects","direct empty cache has no default layer","menu creates 2021 default and valid legend","2D page does not load Cesium","2D point updates numeric result, coordinates, chart and table","repeated point uses 5-minute cache","agreement download contains real XLSX and Chinese columns","description dialog","four-level annual filter adds a second result","results are mutually exclusive","multi-year average preserves complete layer name","3D click stops rotation and identifies shared business layer","hidden 3D renders zero frames and stops loop","dimension switch preserves last 3D camera","keep-alive deactivation pauses 3D","keep-alive return keeps selected dimension","English menu persists language","clear removes both language caches","about, three directories and ten article routes render","zero uncaught browser errors"],"timings":{"pointToTableMs":197.61130000000003,"first3DFrameMs":757.1154999999999},"errors":[],"runAt":"2026-10-06T20:52:37.613Z"}

## 2026-10-07 04:53:36 — 视觉对照执行

[{"route":"home","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"data","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"about","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"login","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page1","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page2","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true},{"route":"nav-page3","mismatchedPixels":0,"totalPixels":2073600,"percent":0,"computedStylesEqual":true}]

## 2026-10-07 04:53:54 — Lighthouse 开始：optimized

本地 Lighthouse Node API；实际表单登录 fixture 后再审计数据页，disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。3 次/设备/页面。

## 2026-10-07 04:56:45 — 候选重测初始化修复

候选重测首次登录表单等待超时，没有生成可计分报告。此前profile路径按variant/device/run命名，候选复测会复用已登录状态/缓存。改为每轮追加randomUUID，以真正独立新profile进行实际表单登录；失败尝试不纳入统计，完整过程保留。

## 2026-10-07 04:56:46 — Lighthouse 开始：optimized

本地 Lighthouse Node API；实际表单登录 fixture 后再审计数据页，disableStorageReset 保留会话；每次独立 Chrome、冷浏览器缓存，同一生产预览压缩策略。3 次/设备/页面。

## 2026-10-07 04:56:59 — Lighthouse 完成 optimized/desktop-home-1

{"variant":"optimized","device":"desktop","route":"home","run":1,"fetchTime":"2026-10-06T20:56:50.369Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":75,"first-contentful-paint":621.4632,"largest-contentful-paint":59862.8492,"speed-index":676.5470875571158,"total-blocking-time":3.0000000000001137,"cumulative-layout-shift":0.0001502693788470439,"total-byte-weight":80356697,"warnings":[]}

## 2026-10-07 04:57:13 — Lighthouse 完成 optimized/desktop-home-2

{"variant":"optimized","device":"desktop","route":"home","run":2,"fetchTime":"2026-10-06T20:57:03.766Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":75,"first-contentful-paint":618.42325,"largest-contentful-paint":59865.03875,"speed-index":736.2566232885317,"total-blocking-time":5.999999999999886,"cumulative-layout-shift":0.0001502693788470439,"total-byte-weight":80356697,"warnings":[]}

## 2026-10-07 04:57:26 — Lighthouse 完成 optimized/desktop-home-3

{"variant":"optimized","device":"desktop","route":"home","run":3,"fetchTime":"2026-10-06T20:57:17.947Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":75,"first-contentful-paint":617.465,"largest-contentful-paint":59863.775,"speed-index":735.9307871523598,"total-blocking-time":6,"cumulative-layout-shift":0.0001502693788470439,"total-byte-weight":80356697,"warnings":[]}

## 2026-10-07 04:57:40 — Lighthouse 完成 optimized/desktop-data-1

{"variant":"optimized","device":"desktop","route":"data","run":1,"fetchTime":"2026-10-06T20:57:31.844Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":8963.8094,"largest-contentful-paint":9423.8094,"speed-index":8963.8094,"total-blocking-time":0,"cumulative-layout-shift":0.0007197745590790897,"total-byte-weight":11277162,"warnings":[]}

## 2026-10-07 04:57:54 — Lighthouse 完成 optimized/desktop-data-2

{"variant":"optimized","device":"desktop","route":"data","run":2,"fetchTime":"2026-10-06T20:57:45.793Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":8964.38585,"largest-contentful-paint":9444.385849999999,"speed-index":8964.38585,"total-blocking-time":0,"cumulative-layout-shift":0.0007197745590790897,"total-byte-weight":11277162,"warnings":[]}

## 2026-10-07 04:58:08 — Lighthouse 完成 optimized/desktop-data-3

{"variant":"optimized","device":"desktop","route":"data","run":3,"fetchTime":"2026-10-06T20:58:00.045Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":70,"first-contentful-paint":784.8558,"largest-contentful-paint":9423.64185,"speed-index":1581.2075372936158,"total-blocking-time":129,"cumulative-layout-shift":0.0007197745590790897,"total-byte-weight":11277162,"warnings":[]}

## 2026-10-07 04:58:21 — Lighthouse 完成 optimized/mobile-home-1

{"variant":"optimized","device":"mobile","route":"home","run":1,"fetchTime":"2026-10-06T20:58:13.302Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":67,"first-contentful-paint":2859.541875,"largest-contentful-paint":373592.72062499996,"speed-index":2859.541875,"total-blocking-time":190,"cumulative-layout-shift":0,"total-byte-weight":80356697,"warnings":[]}

## 2026-10-07 04:58:34 — Lighthouse 完成 optimized/mobile-home-2

{"variant":"optimized","device":"mobile","route":"home","run":2,"fetchTime":"2026-10-06T20:58:26.441Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":67,"first-contentful-paint":2861.616675,"largest-contentful-paint":373596.573825,"speed-index":2861.616675,"total-blocking-time":188,"cumulative-layout-shift":0.00002558481711580784,"total-byte-weight":80356697,"warnings":[]}

## 2026-10-07 04:58:47 — Lighthouse 完成 optimized/mobile-home-3

{"variant":"optimized","device":"mobile","route":"home","run":3,"fetchTime":"2026-10-06T20:58:39.872Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":67,"first-contentful-paint":2859.5490499999996,"largest-contentful-paint":373592.73395,"speed-index":2859.5490499999996,"total-blocking-time":185,"cumulative-layout-shift":0.00002558481711580784,"total-byte-weight":80356697,"warnings":[]}

## 2026-10-07 04:59:00 — Lighthouse 完成 optimized/mobile-data-1

{"variant":"optimized","device":"mobile","route":"data","run":1,"fetchTime":"2026-10-06T20:58:53.123Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":43,"first-contentful-paint":3904.7124000000003,"largest-contentful-paint":57379.0392,"speed-index":4582.352490883302,"total-blocking-time":998,"cumulative-layout-shift":0,"total-byte-weight":11274607,"warnings":[]}

## 2026-10-07 04:59:13 — Lighthouse 完成 optimized/mobile-data-2

{"variant":"optimized","device":"mobile","route":"data","run":2,"fetchTime":"2026-10-06T20:59:06.382Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":55.00000000000001,"first-contentful-paint":54979.431300000004,"largest-contentful-paint":57304.4313,"speed-index":54979.431300000004,"total-blocking-time":0,"cumulative-layout-shift":0,"total-byte-weight":11274607,"warnings":[]}

## 2026-10-07 04:59:26 — Lighthouse 完成 optimized/mobile-data-3

{"variant":"optimized","device":"mobile","route":"data","run":3,"fetchTime":"2026-10-06T20:59:19.491Z","lighthouseVersion":"13.5.0","browserVersion":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36","performance":42,"first-contentful-paint":3904.010125,"largest-contentful-paint":57303.43725,"speed-index":4643.19537788584,"total-blocking-time":1076.5,"cumulative-layout-shift":0,"total-byte-weight":11274607,"warnings":[]}

## 2026-10-07 05:00:30 — 阶段 4：前后性能对比完成

desktop/home: performance 62 → 75; LCP 61725.6 → 59863.8ms

desktop/data: performance 55.00000000000001 → 55.00000000000001; LCP 16634.5 → 9423.8ms

mobile/home: performance 47 → 67; LCP 384591.1 → 373592.7ms

mobile/data: performance 55.00000000000001 → 43; LCP 102921.6 → 57304.4ms

## 2026-10-07 05:00:30 — 指标解释与下一步记录

统计包含全部24轮，传输/LCP变化和未达到90分的瓶颈已写入results.md；12份即时压缩探索报告仅用于过程证据，不混入最终对照。

## 2026-10-07 05:00:31 — 公开文件检查通过

{"runAt":"2026-10-06T21:00:31.481Z","files":290,"bytes":185358027,"findings":[],"scope":"candidate files excluding gitignore-generated/private folders; values never recorded; examples and fixture passwords are intentional. This automated scan complements review, not a claim of universal secret detection."}

## 2026-10-07 05:02:17 — 最终性能结论与未解决回退

首页桌面62→75、移动47→67；数据页桌面55→55、移动55→43。数据传输下降44.3%、LCP桌面下降43.3%/移动44.3%；移动数据TBT 0→998ms未解决，明确写入results.md。不会用波动中最好值或延迟FCP掩盖回退。WebP候选未启用；七页视觉0差异与全部业务验证保留。

## 2026-10-07 05:06:17 — 发布空间故障与恢复

首次git add因F盘空间耗尽失败，未产生提交或推送。核对目标位于本项目、目录无reparse链接且审计进程已结束后，仅删除忽略的.local/lighthouse临时Chrome profiles，释放约1.14GB。48份JSON/HTML报告、源码、私有冻结源码与原提供目录均保留；新仓库core.autocrlf=false，不改全局设置。随后重新提交发布。
