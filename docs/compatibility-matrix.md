# 前端兼容与验证矩阵

查阅日期：2026-10-07（Asia/Shanghai）。本文保留初始源码事实与验证规格；实际已执行结果见 [验证记录](validation/results.md) 和 [浏览器证据](validation/e2e.json)。仅依据原项目静态查阅和已记录的两次外部服务短请求；本文中的示例为初始规格，最终实际测试入口为 scripts/e2e.mjs 与 scripts/visual-parity.mjs；未逐项执行的规格不自动标记通过。实现范围和已确认产品决策沿用 `docs/design/decisions.md` 及主任务记录，本文不重新作出决策。

原前端：`F:\CX_notes\cxDlogver\source\_posts\Project\2024_QH_FGKSH\QHFG.Web`。

## 1. 证据入口

| 简称 | 原源码 | 负责内容 |
| --- | --- | --- |
| Router | [router/index.js](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/router/index.js) | hash 路由、导航守卫、缓存标记 |
| Main | [main.js](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/main.js) | 语言初始化、全局组件 |
| Shell | [HomeView.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/views/HomeView.vue) | 顶部菜单、登录状态、语言、keep-alive、默认结果 |
| Login | [Login.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/views/Login.vue) | 登录表单和会话写入 |
| Register | [Register.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/views/Register.vue) | 注册、邮箱验证码、表单校验 |
| Reset | [ForgotPassword.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/views/ForgotPassword.vue) | 重置验证码与密码 |
| Home | [HomeBody.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/home/HomeBody.vue) | 三屏首页、主题跳转、定位天气、拖动折叠 |
| Data | [DataService.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/DataService.vue) | 当前真实数据页、结果、图例、共享参数、缓存 |
| Data3DReference | [DataService copy.vue](<F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/DataService copy.vue>) | 尚未接入旧路由的三维入口参考 |
| Condition | [ConditionBox.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/condition/ConditionBox.vue) | 四组筛选树、时间选择、六数组事件 |
| Map2D | [Map2D.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/Map2D.vue) | OpenLayers、瓦片、点位、统计联动 |
| Map3D | [Map3D.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/Map3D.vue) | Cesium、相机、三维点位与相同统计事件 |
| Chart | [ChartBox.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/chart/ChartBox.vue) | 区域/时间筛选、图表、表格参数和说明 |
| Table | [TableBox.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/chart/table/TableBox.vue) | 列/行渲染、事件接收 |
| Tools | [ToolBox.vue](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/chart/table/ToolBox.vue) | 清除、协议、下载、说明 |
| Request | [request/index.js](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/request/index.js) | 实际请求参数与响应拆包 |
| Axios | [request/axios.js](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/request/axios.js) | `token` 请求头、错误响应处理 |

## 2. 实际路由、可见标题及交互

浏览器地址形式为 `${BASE_URL}/#/home`，不是仅请求服务端 `/home`。默认验收视口沿用主任务性能场景配置。下表的「标题」是页面可见标题或路由 meta；不要把它们全部等同 `document.title`。

| hash 路径 | 路由名 / meta | 可见标题或内容 | 关键交互 / 原源文件 |
| --- | --- | --- | --- |
| `/` | redirect | 重定向 `/home` | 验证最终 URL |
| `/home` | `home` / 主页 | 可再生能源分析与系统优化平台（REASON）；英文 Renewable Energy Analytic and System Optimization Network（REASON） | 三屏滚动、3 个圆点、3 个主题卡、天气拖动/双击折叠；Home |
| `/home/login` | `login` / 登录页面 | 登录页面 / login page | 用户名、密码、登录、注册跳转、忘记密码；Login |
| `/home/register` | `register` / 注册页面 | 注册页面 / register page | 用户名、两份密码、真实姓名、国家/地区、电话、邮箱、单位、身份、验证码；Register |
| `/forgot-password` | `forgot-password` / 重置密码 | 重置密码 / Reset Password | 邮箱、验证码、新密码、确认密码、返回登录；Reset。此路由位于 `/home` 外，没有顶部 Shell |
| `/home/about` | `about` / 关于我们 | 关于我们 / About Us | 背景、功能、团队、致谢四段；AboutView.vue |
| `/home/dataService` | `dataService` / 数据服务；`requiresAuth: true`，`keepAlive: true` | 筛选条件、筛选结果、地图、图表与表格 | 数据服务完整流程；Data。三维是本次接入的已确认增量 |
| `/home/nav-page1` | `theme1-directory` | 可再生能源资源利用现状与潜力洞察 | 返回首页、3 篇文章链接；components/home/nav-page1.vue |
| `/home/nav-page1/paper1` | `paper1-1` | 清华大学碳中和研究院鲁玺教授团队在揭示屋顶光伏的动态气候价值与潜力实现方面取得新成果 | 正文/图/来源链接/返回目录；components/home/theme1/paper1.vue |
| `/home/nav-page1/paper2` | `paper1-2` | 清华大学环境学院、碳中和研究院、哈佛大学等联合团队系统解析我国太阳能发电平价路径与并网潜力 | 同上；theme1/paper2.vue |
| `/home/nav-page1/paper3` | `paper1-3` | 环境学院鲁玺课题组在我国陆上风电跨区域联合并网及开发优化布局方面取得新进展 | 同上；theme1/paper3.vue |
| `/home/nav-page2` | `theme2-directory` | 碳中和目标下可再生能源发展路径 | 返回首页、4 篇文章链接；components/home/nav-page2.vue |
| `/home/nav-page2/paper1` | `paper2-1` | 环境学院鲁玺课题组在时空动态化评估我国陆上风电碳足迹及成本变动性方面取得新进展 | 正文/图/来源链接/返回目录；theme2/paper1.vue |
| `/home/nav-page2/paper2` | `paper2-2` | 高时空分辨率电力系统优化模型揭示碳中和目标下可再生能源发展布局 | 同上；theme2/paper2.vue |
| `/home/nav-page2/paper3` | `paper2-3` | 《中国碳中和目标下的风光技术展望》报告重磅发布 | 同上；theme2/paper3.vue |
| `/home/nav-page2/paper4` | `paper2-4` | 环境学院鲁玺团队合作揭示全球光伏产业链温室气体排放与减排的时空分布特征 | 同上；theme2/paper4.vue |
| `/home/nav-page3` | `theme3-directory` | 高比例可再生能源系统风险与韧性提升 | 返回首页、3 篇文章链接；components/home/nav-page3.vue |
| `/home/nav-page3/paper1` | `paper3-1` | Nature Communications 中国可再生能源发电内在的时空不确定性研究 | 正文/图/来源链接/返回目录；theme3/paper1.vue |
| `/home/nav-page3/paper2` | `paper3-2` | 大规模山区风电场对京津冀地区冬季空气质量的影响 | 同上；theme3/paper2.vue |
| `/home/nav-page3/paper3` | `paper3-3` | 清华与哈佛研究团队合作揭示空气质量提升对光伏发电与碳中和目标的协同效益 | 同上；theme3/paper3.vue |

源目录另有 `theme1/paper4.vue`、`nav-page.vue`、`theme.vue` 等文件，它们不在上述实际路由里。文件存在不能作为已接入页面的证明。文章页中英文内容存于各 Vue 文件的 computed 对象，验收应覆盖两种语言、非空标题、正文、图片和回退路径。

标题的特殊事实：`index.html` 初始 `<title>` 为 REASON；Shell 的 `changeMenu` 才将其改为 `全球清洁能源智慧图谱决策系统 (GCE-IADS)` 加中文菜单 label。直接打开 hash、登录后跳转、主题/文章跳转没有统一修改标题逻辑。不能用一个恒定 `toHaveTitle` 代替全部路由验收；需要纠正此历史命名时单独记录差异。

## 3. Playwright 可定位元素

以下选择器来自原模板，尚未通过运行时确认。重构保留 CSS 类与外观时可直接使用。Element Plus 的日期面板、select/cascader 下拉、对话框常 teleport 到 body，应定位当前可见浮层；不要把所有浮层都限定在原页面根容器中。原源码没有 `data-testid`。

| 场景 | 建议定位 | 注意事项 |
| --- | --- | --- |
| 顶部首页 / 关于 / 数据服务 | `page.locator('.header .system_menu > .menu_item').filter({ hasText: '数据服务' })`；英文 `Data Services` | 三个导航是 div，不能使用 `getByRole('link')` |
| 语言菜单入口 | `.header .system_menu .menu_item` 按 `切换语言` / `Language` 过滤；先 `hover()` | 原 el-dropdown 默认 hover；浮层用 `getByRole('menuitem', {name:'English', exact:true})` 或 `简体中文` |
| 未登录入口 | `.header .login-link` | 和登录页提交按钮不同 |
| 用户名 / 退出 | `.header .user_name`、`.header .user-dropdown` 后 hover；可见 `menuitem` 的 `退出登录` / `Logout` | 退出会清空全部 localStorage |
| 登录输入 | `.login input[name="username"]`、`.login input[name="password"]` | `el-input` 渲染后的原生 input |
| 登录提交 | `.login .login_btn` | div；不能假定有 button role |
| 注册 / 忘记密码跳转 | `.login .to_register span`；`.login .footer-center .el-link` | 断言最终 hash |
| 注册输入 | `.register` 中 `getByPlaceholder('请输入用户名',{exact:true})`、`请输入密码`、`请再次输入密码`、`请输入真实姓名`、`请输入手机号`、`请输入邮箱`、`请输入单位`、`请输入验证码` | 英文 placeholder 见 locales/en.json，避免仅按 input 顺序选择 |
| 注册下拉与提交 | `.register .el-select` 共国家/地区、身份两组；可按 placeholder/`.el-form-item` label 限定；`.register .register_btn` | 下拉选项用 body 下可见 `.el-select-dropdown__item`；发送验证码用精确按钮名 |
| 重置密码 | `.forgot-pwd`；邮箱 `getByPlaceholder('请输入注册邮箱')`、验证码 `请输入验证码`；密码 `.forgot-pwd input[type="password"]` 的第 0/1 项 | 原新密码和确认密码 placeholder 相同；`.code-btn`，`getByRole('button',{name:'重置密码',exact:true})` |
| 首页圆点与主题 | `.page-nav .nav-dot` 的 0/1/2；`.full-page-container` 的 style transform；`.news-cards .card` 的 0/1/2 | 卡片先展示第二屏；theme card 点击直接跳转目录 |
| 天气 | `.weather_popup`、`.weather_popup.collapsed`、`.weather-temp`、`.weather-text` | 原 `dblclick()` 折叠；拖动后验证 style left/top 及 storage，不把真实天气文本设为固定值 |
| 关于 | `.about_view h1.title`；`#background`、`#features`、`#team`、`#thanks` | 团队列表非空和语言更新 |
| 主题目录 | `h1.theme1-title` / `h1.theme2-title` / `h1.theme3-title`；`a[href="#/home/nav-page1/paper1"]` | hash history 生成的 router-link href；目录返回 `.back-btn button` 或 `.breadcrumb a` |
| 文章 | `.paperClass .article-title`；`.paperClass img`；`.paperClass .back-btn button` | 图片等 `complete && naturalWidth > 0`，返回对应目录 |
| 筛选四棵树 | `.condition_box .resourceTree`、`.dataTypeTree`、`.childTree`、`.TimeTree` | 后三组依赖上一步响应，可能隐藏 |
| 某叶节点复选 | `root.locator('.custom-tree-node').filter({hasText: /^陆上风电$/}).locator('input[type="checkbox"]')` | 应保证单一命中；只有 `children: []` 的叶子有复选框；Element Plus 输入可用 `check({force:true})` 或点击 label |
| 筛选时间 | `.condition_box .yearPicker input`、`.monthPicker input`、`.hourPicker input.el-range-input` | 多年/多月应通过可见日期面板选择，不能假定 `fill()` 就触发 Vue change |
| 筛选确定 | `.condition_box .submit_confirm_btn button` | 与图表「确定」、对话框「确定」同名，必须 scoped |
| 面板显隐 | `.show_condition_box`、`.show_result_box`、`.show_chart_box` | 原 v-show 不卸载；验证 visibility 和保留选择 |
| 结果与图例 | `.result_box .checkbox-wrapper`、`.result_box input[type="checkbox"]`、`.result_box .result_img img` | 结果 label 含 `v-html`/换行；选择一个会取消其他项；图例需有有效图像尺寸 |
| 清除所有结果 | `.result_box .result_box_top_right button` | 同时删除两份语言结果缓存 |
| 二维地图 | `#mapView .ol-viewport` 或 `#mapView` | `.ol-viewport` 的相对坐标点击；canvas 存在不代表瓦片有效 |
| 点位弹窗 | 活动地图中的 `.coordinate-popover`、`.value`、`.close-btn` | 未来两地图同时驻留时必须限定可见容器，避免选到隐藏弹窗 |
| 地图坐标 | `.dataService_page .mapInfo` | 经纬度字符串原保留 3 位小数；二维关闭弹窗发送 null |
| 图表区域 / 时间 / 确定 | `.chart_box .region-cascader`、`.chart_box .param_box .el-select`、`.chart_box .param_box > button` | cascader 支持同级多选；时间选择器取决于图层时间尺度 |
| 图表与表格 | `.chart_box .chart canvas`；`.table_box .el-table__body-wrapper tbody tr`；`.el-table__header-wrapper th` | canvas 只证明初始化；要结合接口结果、series/像素、表格列行验证 |
| 下载 / 清除所选 / 说明 | `.tools_box2 .download_button`、`.clear_button`、`button.info` | 下载先协议；clear_button 不等同清空全部筛选结果 |
| 协议 / 说明浮层 | `.el-message-box:visible`，确认按钮 `同意并下载` / `Agree and Download`；`.info-dialog-custom:visible .info-dialog-body` | 不使用浏览器原生 `dialog` 事件代替 Element Plus MessageBox |
| 三维切换 / 地球 / 工具 | `.show_two_three`；`#cesiumContainer canvas`；`.tdt-toolbar .icon-fangda` / `.icon-suoxiao` / `.icon-refresh-1-copy` 所在 `.tdt-btn` | 切换按钮原实际页只有 CSS，接入后才存在；点击地球中心前先确认 canvas 尺寸和场景完成 |

## 4. 登录、语言与缓存契约

### 4.1 登录精确 shape

成功 `POST /login` 请求 body：`{ username, password }`。Login 检查业务 `code === 200`，读取 `res.data.token`，写入：

```ts
// 示例为形状说明，不包含真实用户或令牌。
type UserSession = { username: string; token: string };
localStorage.setItem('leiyangUser', JSON.stringify({
  username: 'test_user', token: '<TEST_ONLY_TOKEN>',
} satisfies UserSession));
window.dispatchEvent(new Event('loginStatusChanged'));
```

登录后跳转 `/home`、`currentSystemMenu = "home"`。Axios 发出 **自定义请求头 `token`**，值等于 session.token；没有 `Bearer` 前缀，也不是原代码的 `Authorization` 头。后端返回 body.token 时会更新已存在会话。Login 的 HTTP body 兼容形状为 `{ code: 200, data: { token: "..." } }`。

Router 只检查 `leiyangUser` 字符串是否存在；Shell 另做 JSON.parse。伪造存储可测试导航守卫的 UI 分支，不能证明后端登录/权限有效。Data 挂载还调用资源列表作 token 检查，但原 Axios 将有响应体的 HTTP 错误 resolve，所以原代码不一定因 401 进入 catch。测试必须检查业务与 HTTP 状态及实际列表，不能把留在数据页当作认证通过。

注册成功跳转登录，不自动建立 session。注册向后端传入 `username,password,fullName,phone,email,company,region,code`；国码是表单 UI 字段，原提交发送 `phone`，并未拼接 `countryCode`。重置提交仅 `email,code,password`，确认密码只负责前端校验。真实邮件/重置必须使用已指定的受控测试身份；fixture 的发送成功只能证明 UI 流程。

### 4.2 语言和 storage

| 键 | 精确值 / shape | 行为 |
| --- | --- | --- |
| `language` | `"chinese"` 或 `"english"` | Shell 挂载读取，语言菜单写入；Condition 首次请求读它 |
| `user-locale` | 同上 | Main 创建 i18n 读取；Data 的语言 watcher 写入。两键不同步时 Shell 挂载值可能覆盖 Main 初值 |
| `currentSystemMenu` | `home` / `about` / `dataService` | 顶部 active 菜单保存 |
| `dataServiceResults_zh` / `_en` | 见下方六数组对象 | Data 按语言恢复；clearResult 删除两键 |
| `userLocation` | `{ latitude:number, longitude:number }` | 首页定位缓存；天气测试固定位置或拒绝权限，不能把本地真实坐标写报告 |
| `weatherPosition` | `{ x:number, y:number }` | 首页天气位置 |
| `weatherCollapsed` | JSON boolean 字符串 | 首页天气折叠 |

```ts
type ResultCache = {
  filterResultList: string[];
  selectedResults: boolean[];
  timeResult: string[];
  mapPathUrlList: string[];
  dataUnlitList: string[]; // 原字段拼写 Unlit，不是 Unit。
  dataTypeThreeList: string[];
};
```

六数组同一索引对应同一结果。原恢复发现没有 true 但数组非空时会自动激活第一项。用户勾选只保留当前一项；原 `handleResultSelect` 没同步持久化选中状态，刷新可能恢复此前状态，这是应记录的历史缺陷。清除所有结果删除中英文缓存；「清除所选项」只清表格/说明上下文，不能与清除全部结果混淆。退出登录使用 `localStorage.clear()`，会一并清语言、天气和结果。

两个入口必须分开验证：

1. 已登录、两份结果缓存为空，直接访问 `#/home/dataService`：当前 Data 恢复空结果/空业务路径。
2. 从顶部菜单进入数据服务：Shell 如无目标语言缓存会写入并激活 **2021 陆上风电容量因子** 默认结果；即使之前 clearResult 删除缓存，再点顶部菜单也会创建默认结果。
3. 语言菜单会重写目标语言缓存为上述默认结果，再发 `changeLanguage`；Data 的 watcher 恢复对应语言结果。不要把此源行为描述为完整保留用户所有自定义筛选。

Shell 保持数据服务 `keep-alive`，其他子页面不缓存。数据服务离开/返回需要保留当前筛选和地图视角，同时不可让隐藏三维继续渲染/自转。组件 deactivated 并不自动触发 unmounted；必须分别验证停用和最终销毁。

## 5. 筛选树、时间与六数组输出

### 5.1 API 与节点

资源 `GET /list/getresourcelist?language=chinese`；选资源叶后请求 `GET /list/getdatatypelist?conditionId=<id>&language=...`；选数据类型叶后请求 `GET /list/getchild?conditionId=<id>&language=...`，空间叶被选时再用同一 getchild 请求时间节点。

HTTP JSON 必须保留 envelope：`{ code:200, data:{ children: ConditionNode[] } }`。Axios 已剥掉 HTTP response 外壳，各 helper/组件仍需要 body.data.children。返回裸数组会显示空树。

```ts
type ConditionNode = {
  id: number; parentId: number | null;
  name: string; nameEn: string;
  type: 'resource' | 'datatype' | 'space' | 'time' | 'node';
  children: ConditionNode[];
};
```

原模板只为 `children && children.length === 0` 的叶节点渲染 checkbox，省略 children 的叶不能选。`node-key="id"`、严格相等路径查找要求 id 类型稳定；不要响应一处数字、另一处字符串。中英文显示切换读取 name/nameEn，**文件路径始终用中文 name 拼接**。

可重复的最小测试路径（测试节点 ID 可自造，下面不是生产数据 ID）：

| 阶段 | 节点中文路径 | 树类型 / 下一请求 |
| --- | --- | --- |
| resource | 发电侧 → 风力发电 → 低空风电 → 陆上风电 | 末节点 children=[]；getdatatypelist(resourceLeaf.id) |
| datatype | 潜力数据 → 2.5MW → 容量因子 | 末节点 children=[]；getchild(datatypeLeaf.id) |
| child | 10km | type=space、children=[]；getchild(spaceLeaf.id) |
| time | 年 / 月 / 小时 | type=time、children=[]；显示对应选择器 |

数据类型若直接返回时间节点，child 组即可选择年/月/小时；不能强制所有真实数据都有空间组。上层变化清空下层选择及时间，年/月禁用未来日期；小时原实现尝试限制同一天，字符串日期解析有兼容风险，应实测。

### 5.2 选择与结果

Condition 发 `updateEmitResultList`，精确位置为：

```ts
type FilterEmit = [
  labels: string[], checked: boolean[], times: string[],
  paths: string[], units: string[], types: string[],
];
// 一条年结果，尚未勾选；用于 fixture 和兼容断言。
const annual: FilterEmit = [
  ['陆上风电 容量因子(2.5MW,10km,2021)'], [false], ['2021'],
  ['发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km/年'],
  [''], ['容量因子'],
];
```

Data 以 label 去重；重复确定提示「数据已存在」。确定只加入结果，原事件 checked 默认 false；需要再勾结果才加载图层。事件发送后清空时间输入，但资源树选择不等于全部重置。

| 选择 | `timeResult` | 勾选后 qgsMapPath / tifMapPath |
| --- | --- | --- |
| 年 2021 | `["2021"]` | `/io/data/<中文路径含年>/2021.qgs` / `2021.tif` |
| 月 2021-01 | `["2021-01"]` | `/io/data/<中文路径含月>/2021/202101.qgs` / `202101.tif` |
| 小时范围 | 每小时一项 `"2021-01-01 00:00"`，包含起止小时 | `/io/data/<中文路径含小时>/2021/2021010100.qgs` / `2021010100.tif` |
| 多年平均 | 期望单一平均项；原代码把字符串 spread 成字符数组 | 原 Data 用首字符特殊判断修补成平均 layer 名；不能把六数组长度不一致当正常输出，需单独验证修复 |

时间路径的目录结构、大小写参数和中文节点名称须与真实 QGIS/统计数据吻合。 fixture 能验证转换逻辑，但不能证明实际工程和 tif 存在。

## 6. 点选 → 图表 → 表格 → 下载契约

### 6.1 HTTP 与业务数据

除下载/瓦片外，HTTP body 形状为 `{ code, data, ... }`；request helper 返回 body.data。以下是消费端需要的 data，不应额外套一次 data：

```ts
type PointData = {
  value: number | null;
  area: Partial<Record<'区域' | '次区域' | '国家' | '电网' | '省级' | '地级' | '县级', string>>;
};
type LineData = {
  xAxisData: string[];
  SeriesData: { name: [string, string]; data: (number | null)[] }[];
};
type ExcelData = { columns: string[]; data: Record<string, string | number | null>[] };
type RegionData = { regionsZn: string }; // 例如按层级的斜杠分隔字符串，供 dynamic_region 选择深度。
type DescriptionData = { dataName: string; descriptionZn: string; descriptionEn: string };
```

SeriesData.name 原 Chart 分别取 `[0]` / `[1]` 作为中英文 series 名，字符串会被错误地取首/次字符。每条 data 与 xAxisData 长度对应；单横坐标为柱状图，多横坐标为折线图。表格 columns 的每个名称必须对应行对象的同名键。说明支持 HTML，示例数据只用可信固定文本。

`GET /map/getpoint` 的参数是 **`MAP,LAYERS,LONGITUDE,LATITUDE,language`**，MAP 为 qgs 路径、LAYERS 为 tif。Map2D 使用 getPointData helper，Map3D 使用 request.get 后读取 body.data。业务 value=0 是合法数据，测试需覆盖零值、null、无 area、超时和取消，不得以 falsy 当失败。

图例 `GET /map/getlegend?MAP=...&LAYER=...&language=...` 的 data 是 PNG base64，不含 `data:image/...` 前缀；Data 添加前缀。WMS `/map/getmap` 则返回真实图像字节，不能返回 JSON 包装或 HTTP 200 的错误文字。

### 6.2 事件与参数

| 事件 | 生产 → 消费 | 精确 payload / 约束 |
| --- | --- | --- |
| `clickedCoordinate2D` | Map2D → Data | `{longitude:string|null,latitude:string|null}`；字符串 3 位小数，关闭时 null |
| `clickedCoordinate3D` | Map3D → Data3DReference；目标 Data 应接收 | 同 shape；原 3D closePopover 不发送坐标清空 |
| `mapPointSelected` | 两地图 → Chart | `{level,places:string[],map,language,area}`；level 用中文行政层级；map 为 selectMapPath，不是 `/io/data/...qgs` |
| `tableParams` | Chart → Table、Tools | `{map,timescale,year,level,language}`；timescale=`年/月/小时`，year=月/小时对应年或年尺度空字符串 |
| `excelDataParams` | Data3DReference → Table、Tools | 同5字段，但副本键拼作 timeScale；原实现利用 Object.values 顺序。当前真实 Data 不在结果勾选时发送它 |
| `boundaryParams` | Chart 确定 → bus | `{level,area:places.join(','),class:'boundary'|'ocean',CRS:'EPSG:4326'}`；原 Map2D 没有活动 bus.on 接收，不能宣称边界联动已工作 |
| `clearSelected` | Data / Tools → Chart、Table | 通常 `[]`；清表格/说明，Data 路径变空另驱动图表清空 |
| `changeLanguage` | Shell → Table 等 | `"chinese"` / `"english"` |
| `clearDataServiceResult` / `restoreDataServiceLocalData` | Shell → Data | 无 payload；清全结果 / 重新读取语言缓存 |

Chart 收到 point 后确定行政层级及 places，请求：

```ts
// GET /statistical/getlinedata
{
  map: '<中文业务路径，去掉末级年/月/小时>',
  timescale: 'yr', // 或 mo_2021 / hr_2021
  timespan: [], // 或所选年/月/小时数组，原URL插值为逗号分隔
  level: '区域', places: ['东亚与太平洋地区'], language: 'chinese',
}
// 随后发送 tableParams（插入顺序按原代码）。
{
  map: '<相同业务路径>', timescale: '年', year: '',
  level: '区域', language: 'chinese',
}
```

Table 调用 `getExcelData(map,timeScale,year,level,language)`，HTTP 参数名是 **`timeScale`**；Tools 下载同名参数。原 Table/Tools 用 `...Object.values(payload)`，所以字段顺序是兼容风险；重构应显式按字段取值，同时兼容原副本 timeScale 拼写，避免名称正确但顺序错乱。

Chart 选中图层后先请求区域、默认7大区域折线/柱状图、数据说明，**当前真实 Data 仅选择图层并不会发送初始化表格参数**。点地图或在图表点确定后才会发送 tableParams。测试旧基线时不要要求刚勾图层即有表格行；目标若改进这个行为须记录。

原自动点选层级：二维按 zoom 3.5/4/5/6/7/8 区分次区域/国家/电网/省级/地级/县级；三维按相机高度 1500/1000/700/400/200/100 万米阈值。否则选区域。手工 cascader 要求所有路径同深度，否则提示「请选择相同层级的区域！」并恢复此前选择；其原 LEVEL_MAPPING 未含地级/电网且 depth 映射不完整，需作为兼容缺陷检查，不能仅以 cascader 打开为通过。

### 6.3 下载与说明

只有 `潜力数据` 且非用户侧/电网侧路径时原下载按钮 enabled。先点击协议，取消不能发起下载；同意后调用 `/statistical/download`，响应为 Blob，文件名 `数据.xlsx`。必须校验下载状态、非空、XLSX zip/workbook 可解析、sheet 列和行与预期对应；`page.waitForEvent('download')`、文件扩展名、Blob MIME 单独都不足。服务错误不得包装成 Excel 文件冒充成功。

说明按钮显示 `dataName` 标题、按语言选择 descriptionZn / descriptionEn；无说明显示原默认「数据说明/无数据来源说明」。协议和说明不应因导入优化丢失原格式/宽度。

## 7. Map3D 适配保留面与生命周期

必保留输入：`qgsMapPath,tifMapPath,selectMapPath,dataUnit,dataTypeThree`（String）。`hourYear` 是 Chart 的输入，不是原 Map3D prop。必保留业务输出为上表的 `clickedCoordinate3D` 与 `mapPointSelected`；内部可改 typed emit，输出含义保持一致。当前 Map3D 没有 defineExpose，不能将新增适配 API 误称原有能力。

原有可见交互为放大、缩小、回到初始相机并自转、数据红点和弹窗、中英文注记、业务 WMS alpha=0.8。两地图共用选择状态，原参考中的相机相互独立。接入时按已经确认的点击/自转/相机决策实现；原首击停转、次击点选只是基线事实，不得覆盖已批准的目标交互。

| 生命周期 | 适配要求与可观察证据 |
| --- | --- |
| 首次二维进入 | 不创建隐藏 Viewer；不为首屏无条件下载执行 Cesium.js/三维 widgets CSS。仅异步 Vue 组件不足，旧插件生产 HTML 仍全局注入 |
| 首次切三维 | 容器可见并 nextTick 后创建 Viewer，然后应用当时已选业务图层。原 setup 的 watchEffect 在 viewer 前运行，惰性挂载必须修复 |
| 筛选/语言变化 | 替换旧 WMS、刷新注记；同一个请求结果同时供 value/area，避免原重复 getpoint；已失效请求不能回写当前场景 |
| 切回二维 / keep-alive deactivated / 页面隐藏 | 暂停自转与渲染、暂停隐藏场景的点选监听/统计回写；保留已确认的独立视角和用户停转状态 |
| 返回三维 / activated | resize 已可见容器，恢复选定视角；按已确认规则恢复渲染、自转；不重复创建 Viewer/图层/监听 |
| 最终 unmount | 取消请求、清计时器和 observer、移除精确 handler、先释放 dataSources/自建资源再 destroy Viewer；不得 destroy 后访问 viewer.dataSources |

本地 Cesium **1.99.0** 源码已经验证支持 `viewer.useDefaultRenderLoop`（getter/setter）、`viewer.resize()`、`viewer.isDestroyed()`、`viewer.destroy()`、`requestRenderMode` Viewer option，以及 `viewer.scene.requestRender()`。停用可暂停 defaultRenderLoop，恢复后 resize/requestRender；自转应另有独立可见状态，不能因调用旧 stopAutoRotate 永久修改用户旋转意图。旧 bus 的 `map3DVisible`/`map3DMounted` 可保留为内部协调或替换为可见状态，**不得对一个事件执行无 handler 的 bus.off 导致删除其他组件监听**。

## 8. 可运行场景与证据边界

所有场景初始状态标为「待执行」。fixture、真实服务、真实地图三类证据分别记录；不可相互替代。生产构建+preview 是性能和样式验收入口，Vite dev server 测量只作调试。

| ID | 准备 / 操作 | 必须断言 | 不足以通过的证据 |
| --- | --- | --- | --- |
| ROUTE-01 | 无 session，直接进入每个公共 hash；数据服务另测 | 根容器、非空实际标题、文章图片有效、返回目录/首页、数据服务重定向登录 | HTTP 首页200；只有router源码 |
| AUTH-01 | 提交空登录，再受控正确/错误账号 | 无输入不发请求；错误无session；正确保存username/token形状、显示用户、token头供后续请求 | 注入假session；控制台出现「成功」 |
| AUTH-02 | 注册/重置受控用户，验证验证码错误/重复用户/倒计时 | 表单、业务code处理、成功后到登录；后续真实凭据可登录 | mocked验证码成功代替真实邮件 |
| LANG-01 | 语言菜单 zh→en，刷新、进入Data、返回Home | 两键行为与可见文本、series双语名、图例/点位language、说明语言；记录默认缓存重写 | 只有菜单文本变更 |
| DATA-01 | 清缓存直接进Data；再从菜单进Data | 两种默认结果区别；默认2021业务路径；无权限不得返回真实业务数据 | 留在Data页；空树未报错 |
| FILTER-01 | 按最小路径选四组树、2021、确定、勾结果 | 六数组同索引、唯一结果、正确qgs/tif、图例有效、重复提示、上层改变清下层 | 展开树；只有checkbox选中 |
| FILTER-02 | 月、小时、平均各测；zh/en各测 | 正确目录/文件名、小时数量、合法平均单项、语言不改变中文文件路径 | 把字符数组平均当成功 |
| POINT-2D | 等地图有效瓦片后选已知坐标 | getpoint业务数据、红点/弹窗/坐标；linedata places/level；表格列行正确；0/null/取消覆盖 | canvas存在；后端返回200但data空 |
| POINT-3D | 已选图层时首次切3D，点已知地表，再快速切/改语言 | 无初始化异常；同业务联动；旧响应不覆盖新状态；一次点选单次point请求；地球非空 | 只有按钮/黑canvas；WMS错误 |
| LIFE-01 | 2D↔3D/关于↔Data各重复5次，页面隐藏/显示 | 视角和选择保留；隐藏渲染/旋转暂停；恢复正常；无累积handler/Viewer | keep-alive标签存在；只测第一次 |
| CHART-01 | 同层级多选、混层级、时间确认 | 正确series/时间；混级恢复；tableParams与下载上下文一致 | canvas已初始化但无series |
| DOWNLOAD-01 | 可下载/禁用路径；协议取消/同意 | 取消无请求；enabled正确；真实XLSX可解析且列行对应；错误不生成假文件 | download事件或文件名xlsx |
| CLEAR-01 | clearSelected、clearResult、logout分别测 | 清除范围准确；中英文缓存删除；退出无session且认证拦截有效 | 所有按钮都调用同一个清除 |
| STYLE-01 | 相同viewport/font/locale/data，截图对照首页/登录/注册/关于/Data及新增3D | 二维版式、控件位置、字体字形、颜色、图例、动画节奏；新增3D单独参考 | 压缩后字节少；跨语言截图比较 |
| PERF-01 | 固定Node/Lighthouse/Chrome/网络/缓存，导航多次及交互timespan | 原始HTML/JSON、参数、版本、样本、首页/登录/已登录Data、地图完成/统计完成自定义时标 | 单次总分；把timespan报告当导航分 |

### 8.1 可执行的 Playwright 骨架

下面是供实现验证复用的测试内容，不是已经存在的测试文件。环境已有 `@playwright/test` 和浏览器、生产 preview 已启动后，可存为测试 spec 并运行；本次只编写本文，没有安装或启动它们。`E2E_BASE_URL` 是待验收 preview 地址，示例 fixture 只证明 UI/事件兼容，不是生产身份。

```ts
import { test, expect } from '@playwright/test';

const base = (process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');

test('public routes and auth redirect', async ({ page }) => {
  for (const [path, root] of [
    ['/home', '.full-page-container'],
    ['/home/login', '.login'],
    ['/home/register', '.register'],
    ['/forgot-password', '.forgot-pwd'],
    ['/home/about', '.about_view'],
  ]) {
    await page.goto(`${base}/#${path}`);
    await expect(page.locator(root)).toBeVisible();
  }
  await page.goto(`${base}/#/home/dataService`);
  await expect(page).toHaveURL(/#\/home\/login$/);
});

test('login fixture produces exact session, without real credentials', async ({ page }) => {
  await page.route('**/login', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({code: 200, data: {token: 'fixture-token-not-a-real-jwt'}}),
  }));
  await page.goto(`${base}/#/home/login`);
  await page.locator('.login input[name="username"]').fill('test_user');
  await page.locator('.login input[name="password"]').fill('fixture_password');
  await page.locator('.login .login_btn').click();
  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.locator('.header .user_name')).toHaveText('test_user');
  const shape = await page.evaluate(() => {
    const value = JSON.parse(localStorage.getItem('leiyangUser') ?? '{}');
    return {keys:Object.keys(value).sort(), username:value.username, tokenIsString:typeof value.token === 'string'};
  });
  expect(shape).toEqual({keys:['token','username'], username:'test_user', tokenIsString:true});
});

// 日期多选示意：fixture保证年度2021存在，且日期面板已打开。
// 必须以真实运行中的 Element Plus DOM 复核选择器，不用 fill() 假冒选择器change。
async function chooseYear2021(page: import('@playwright/test').Page) {
  await page.locator('.condition_box .yearPicker input').click();
  await page.locator('.el-picker-panel:visible .el-year-table .cell')
    .filter({hasText:/^2021$/}).click();
  await page.locator('.condition_box_top_left').click();
  await page.locator('.condition_box .submit_confirm_btn button').click();
}
```

实施完整业务 spec 时用 `page.waitForResponse` 提前包住触发操作，解析 pathname/query，检查 HTTP status 与 body.code/data；不要依靠任意 sleep 或 `networkidle`（天气轮询/瓦片队列会扰动）。正常图表完成需等待业务响应和非空series/表格，不把请求开始时当完成。采集错误不得输出用户令牌、密码、定位或带密钥的完整 URL。

## 9. 已知缺陷与当前未验证项

- 原实际路由未接入 Map3D；恢复三维入口是本次增量，不能编造「原线上三维已通过」基线。
- 原 Map3D viewer 初始化前 watcher、重复 point 请求、隐藏自转、销毁后访问资源、两击点选为已查阅事实；修复和已批准行为调整需要单独结果。
- 原 Chart 未 dispose/remove resize/bus handler；keep-alive停用也没有停止三维。仅打开一次页面不能证明生命周期修复。
- 原平均时间数组、手工行政层级映射、选中状态持久化、语言缓存重写、HTTP错误resolve、下载错误可能被包装为Blob均应在报告区分原缺陷和目标修复，不要静默跳过失败后记全通过。
- 2026-10-07 终端短请求：固定北京坐标的天气请求 HTTP200、业务code200；二维实际底图单块瓦片 HTTP403。尚未确认403原因，没有浏览器CORS/混合内容结论，未证明整体底图/业务WMS/地图渲染成功。
- 前端大量业务资源依赖数据库、QGIS工程、tif及统计表；fixtures对API shape通过不能证明生产数据存在/数值等价。
- 当前本文没有 Lighthouse 原始结果、浏览器回归结果、截图差异、下载解析结果。上述所有验收场景都是待执行规格，完成后由主任务在性能/过程文档记录真实证据。
