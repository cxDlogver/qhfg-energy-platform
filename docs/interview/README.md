# 全球清洁能源开发潜力评估系统：面试答辩目录

本目录以简历所写的**资源缓存、请求优化与分层渲染**为三项技术主线，按照“项目介绍 → 业务数据链路 → 性能成本 → 资源加载与缓存 → 异步请求治理 → 渲染与交互 → 性能验证和工程取舍”的顺序组织 **20 道递进面试题**。

每道题统一包含 **【回答要点】**（明确需要理解的完整机制与回答路径）和 **【重点回答】**（完整标准答案、项目真实源码、关键状态变化、工程边界与必要的验证）。回答不以术语或摘要替代代码执行逻辑。

## 1. 面试题顺序

### [01. 项目介绍与性能问题定位](01-项目介绍与性能问题定位.md)

1. **Q01** 请介绍全球清洁能源开发潜力评估系统，你主要负责什么工作？
2. **Q02** 从用户选择能源数据到地图和图表展示，完整业务链路如何运行？
3. **Q03** 全球尺度为什么带来加载与交互成本，如何定位性能问题？

### [02. 地图资源加载与缓存优化](02-地图资源加载与缓存优化.md)

4. **Q04** 为什么采用 TileWMS 瓦片化，而不是一次加载整张全球地图？
5. **Q05** TileGrid 如何配置分辨率，前端 LOD 与 GeoTIFF 金字塔是什么关系？
6. **Q06** 私有瓦片如何通过 Token、Blob 和 ObjectURL 获取、显示与释放？
7. **Q07** OpenLayers、HTTP 缓存与服务端内存缓存如何划分职责？

### [03. 网络请求与异步控制优化](03-网络请求与异步控制优化.md)

8. **Q08** 如何区分重复的历史查询、相同在途查询和过时查询？
9. **Q09** requestCache 与 pendingRequests 如何管理缓存键、TTL、Promise 与请求清理？
10. **Q10** AbortController 如何通知 Axios 中止旧请求？
11. **Q11** 取消请求以后为什么还需要序号检查与 Controller 所有权保护？

### [04. 分层渲染与地图交互优化](04-分层渲染与地图交互优化.md)

12. **Q12** 栅格 TileWMS、底图、矢量 Feature 和 HTML 弹窗为什么需要分工？
13. **Q13** 点击标记为什么不需要重新请求能源热力图？实际是否只重绘一个图层？
14. **Q14** 如何按语言、缩放与业务数据装配图层并管理其生命周期？
15. **Q15** 全球地图移动缩放时如何校正世界环绕坐标与弹窗位置？
16. **Q16** 要素规模增长以后如何选择 Feature 复用、Style 缓存、裁剪和聚合？

### [05. 性能验证与工程取舍](05-性能验证与工程取舍.md)

17. **Q17** 如何建立瓦片、缓存、请求与分层渲染的可重复性能验证体系？
18. **Q18** 当前项目哪些指标改善、哪些指标回退、还有什么瓶颈？
19. **Q19** Fixture、Source、Real 模式分别能证明什么，实际数据和生产环境有什么边界？
20. **Q20** 如何根据证据、性能成本与业务约束确定下一轮优化方案？

## 2. 简历强调的三条优化主线

| 核心工作 | 对应题目 | 面试要验证的能力 |
| --- | --- | --- |
| 资源缓存与地图加载 | Q04–Q07 | 地理瓦片范围与分辨率、OpenLayers/HTTP/Source 缓存、私有数据图片加载 |
| 网络请求优化 | Q08–Q11 | 已完成结果缓存、Promise 在途去重、AbortSignal/Axios、状态所有权与竞态 |
| 分层渲染与交互 | Q12–Q16 | 栅格/矢量职责、Source 独立性、局部更新、图层生命周期、坐标与弹窗 |
| 业务背景与结果验证 | Q01–Q03、Q17–Q20 | 项目职责、完整数据流、开销定位、Lighthouse/交互测量和工程取舍 |

## 3. 关键源码和测量证据

- [Map2D.vue](../../apps/web/src/components/dataService/Map2D.vue)：TileGrid、TileWMS、自定义瓦片加载、点位缓存与取消、矢量交互和世界环绕
- [DataService.vue](../../apps/web/src/components/dataService/DataService.vue)、[ConditionBox.vue](../../apps/web/src/components/dataService/condition/ConditionBox.vue)、[ChartBox.vue](../../apps/web/src/components/dataService/chart/ChartBox.vue)：能源筛选、路径生成、地图/图表/表格联动
- [request/index.js](../../apps/web/src/request/index.js)、[request/axios.js](../../apps/web/src/request/axios.js)：业务点位 API 与 Signal
- [app.ts](../../apps/server/src/app.ts)、[source.ts](../../apps/server/src/source.ts)、[real.ts](../../apps/server/src/real.ts)：服务端路由、Provider 模式和进程内缓存
- [后端接口契约](../backend-contract.md)、[兼容矩阵](../compatibility-matrix.md)：接口与行为验证依据
- [性能测量协议](../performance/methodology.md)、[结果](../performance/results.md)、[完整优化日志](../performance/optimization-log.md)：实验条件、性能数字、失败候选
- [功能验收](../validation/results.md)、[真实能源数据恢复](../validation/restoration.md)、[Source 性能报告](../performance/restored-source.md)：不同验证环境的能力边界

## 4. 内容归档及事实核验规则

原有四题讨论已完整整合到本目录：项目介绍对应 Q01，性能开销对应 Q03，资源缓存、请求去重与取消对应 Q04–Q11、Q15，分层渲染与局部更新对应 Q12–Q16；同时补充完整业务链路 Q02 和性能验证 Q17–Q20。临时讨论草稿在正式归档和核对完成后已删除，后续以这五篇正式问答为维护入口。

[原项目分析](../能源平台项目.md) · [简历描述](https://github.com/cxDlogver/cx-learn-notes/blob/main/Full-Stack-AI-NOTES/resource/简历.md)

整理和答辩时必须区分：**原项目个人职责**、**原二维功能已有能力**、**后续代码重构新增内容**、**Fixture 的隔离验证**、**Source 真实局部数据验证**以及**Real 模式尚需受控生产验收**。源码能证明代码行为，不能代替历史个人贡献或线上效果证明。报告中的移动数据页性能回退、超大 GeoTIFF 未覆盖范围、未验证真实 QGIS 连接必须如实保留。
