# 页面性能指标与优化结果

本地 Lighthouse Node API 的 24 次生产构建审计：原版与优化版各 12 次，每组 3 次取中位数。数据源为隔离 fixture，真实登录；不代表公网、真实 QGIS/数据库/天气服务性能。

## 测量设置

Lighthouse 13.5.0、Chrome 154、Node 24；桌面 1920×1080，模拟网络 RTT 40ms、10Mbps、CPU 1×；移动端 Lighthouse 默认移动模拟网络/CPU配置。浏览器缓存冷启动，disableStorageReset保留经过表单验证的登录和2021默认筛选。原版/新版共用同一fixture API、同一启动预压缩 Brotli quality 4/gzip 预览服务器。导航审计的TBT不是线上INP。LCP移动数据为模拟值，不是实际等待数分钟的墙钟时间。

## 三次中位数

|设备/页面|性能分 前→后|FCP ms 前→后|LCP ms 前→后|SI ms 前→后|TBT ms 前→后|CLS 前→后|传输 MB 前→后|
|---|---|---|---|---|---|---|---|
|desktop/home|62 → 75|2331.1 → 618.4|61725.6 → 59863.8|2331.1 → 735.9|63.0 → 6.0|0.0367 → 0.0002|82.13 → 80.36|
|desktop/data|55 → 55|16348.5 → 8963.8|16634.5 → 9423.8|16348.5 → 8963.8|0.0 → 0.0|0.0373 → 0.0007|20.23 → 11.28|
|mobile/home|47 → 67|12906.7 → 2859.5|384591.1 → 373592.7|12906.7 → 2859.5|358.0 → 188.0|0.0000 → 0.0000|82.13 → 80.36|
|mobile/data|55 → 43|101567.6 → 3904.7|102921.6 → 57304.4|101567.6 → 4643.2|0.0 → 998.0|0.0000 → 0.0000|20.23 → 11.27|

完整波动区间：[comparison.json](comparison.json)；每轮原始JSON和可打开HTML位于[reports](reports/)，具体编号为device-page-run。三维在旧实际路由没有入口，因此没有捏造“旧3D分数”；首次3D加载、点位到表格及隐藏零帧由[端到端记录](../validation/e2e.json)单独报告。

## 优化与边界

1. 完整原GIF保留；WebP候选通过像素/时序验证，但移动端退化后未选用。候选证据：[asset-equivalence.json](asset-equivalence.json)。
2. 三个字体完整WOFF2，保留所有cmap、glyph顺序、metrics和轮廓：[font-equivalence.json](font-equivalence.json)。
3. 首页移除无用Antd/VChart/全量UI注册，保留完整CSS/reset；目录、图表、OpenLayers与Cesium按页面需要加载。
4. Cesium首次三维激活才请求；keep-alive停用、二维切换和页签隐藏停止循环。Chart与地图事件清理、取消迟到请求，点缓存保持5分钟并限制200项；OpenLayers实例用shallowRef避免深代理。页面壳体flow-root阻止边距折叠，最终七页像素相同。
5. 完整实时过程、失败修复和证据边界：[optimization-log.md](optimization-log.md)。

页面沿用原桌面固定面板布局；移动审计衡量加载性能，并不证明小屏交互布局已改进。字体/动画无损验证和冻结截图验证覆盖本地fixture画面；生产底图有效类型、全部能源项目和外部邮件仍需使用受控真实配置验证。

参考：[Lighthouse Node API](https://github.com/GoogleChrome/lighthouse/blob/main/docs/readme.md)、[性能计分](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)、[Cesium Viewer](https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html)、[Sharp WebP](https://sharp.pixelplumbing.com/api-output/#webp)。

## 结果解释与残留瓶颈

- desktop/home：传输变化 -2.2%；LCP变化 -3.0%；性能分 62 → 75。
- desktop/data：传输变化 -44.3%；LCP变化 -43.3%；性能分 55 → 55。
- mobile/home：传输变化 -2.2%；LCP变化 -2.9%；性能分 47 → 67。
- mobile/data：传输变化 -44.3%；LCP变化 -44.3%；性能分 55 → 43。

首页仍需下载70.70MB完整原GIF动画；数据页完整中文WOFF2为10.47MB。模拟慢网会放大LCP，评分并未达到90分，这与保留全部动画/字体的约束相符。原字体的font-display及字体族样式未改变；原版数据页FCP存在2.47s与16.35s两类值，完整min/max已保留，不从波动中挑优胜样本。导航TBT为0的轮次仍有长模拟FCP/LCP，说明TBT不能独立代表加载快。

原GIF+flow-root+浅引用为最终候选；WebP的12轮数据在optimized-webp保留，选择以实际CPU/加载平衡及视觉完整为依据，而非只看压缩比例。页面仍存在部分移动CPU负担和字体加载引起的FCP波动，所有退化也展示。

三维首次显示本机单次墙钟 757.1ms，二维点到表格 197.6ms。修正预览即时压缩后首次三维由15.15秒降到约0.80秒；这项服务器改进对两版同等应用，不能混算成旧页面三维升级的收益。首次三维引擎下载与热切换不同，隐藏停帧验证为独立功能证据。

## 后续可评估优化

- 在真实部署保持相同资源时，预压缩、内容哈希与长期缓存/CDN可减少后续访问成本；需用真实环境重新测量。
- 若将来允许资源策略变化，可评估动画分段加载/尺寸响应或完整字库分包；应先证明全字符覆盖、字形与动画节奏等价，不能直接裁中文字符或替换为静态图。
- 在真实QGIS环境测地图瓦片/点查/统计耗时，单独区分网络、服务、数据库和前端交互；使用现场真实用户指标补充导航Lighthouse。

探索阶段12份即时压缩基线在reports/baseline-on-demand、12份WebP候选在reports/optimized-webp中单独保留；最终统计只取重测baseline与optimized各12份。

## 明确保留的回退

移动数据页性能分55→43，TBT中位数0→998ms，是当前没有解决的回退；不会把更低传输量和LCP说成全部指标改善。原版移动FCP约101.57秒（模拟），大量初始化任务发生在FCP之前；优化版其中两轮FCP约3.90秒，使地图/控件/图表的挂载工作落入FCP之后的TBT计量窗口。这是结合原始长任务时间线的解释，不是免除真实阻塞的理由。TBT定义见 [Chrome文档](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time)。需进一步对组件初始化分段、真实移动交互及字体策略做独立实验；本次保留全部数据，不通过延迟首帧或只选55分轮次抬分。

浅引用优化保留外部对象身份，但本次没有隔离单变量测量，不能把整体分数变化全部归功于shallowRef。依据 [Vue文档](https://vuejs.org/api/reactivity-advanced.html#shallowref)。
