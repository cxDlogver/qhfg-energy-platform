# 当前前端使用的后端迁移契约

记录日期：2026-10-07。依据原项目源码静态调查；本文件未包含真实地址、账号、密码、签名密钥、JWT 或地图服务凭据。本文是 TS 实现规格与验收依据，不代表生产数据库、邮件投递及全部能源图层已完成运行验证。

源项目根：`F:\CX_notes\cxDlogver\source\_posts\Project\2024_QH_FGKSH`。已确认的迁移范围为当前前端实际调用的 CUG 接口共 20 个，保留二维、三维、中英文、筛选编辑、图表、表格、下载、登录注册和找回密码功能。旧 QHFG.Server 及未调用 CUG 接口不迁移。

## 1. 通用响应与鉴权

普通接口返回：

```ts
interface Result<T> {
  code: number;
  msg: string | null;
  data: T | null;
}
```

- 普通成功为 `code: 200`；数据成功为 `data: payload, msg: null`。
- `Result.success("文本")` 的 Java 重载将文本放在 `msg`，`data` 为 null，不能改成字符串 data。
- 未指定业务错误码的 `Result.error(msg)` 为数字 `0`；源码写作 `000`，不是 HTTP 500。
- 明确业务错误码见下表。控制器普通业务错误返回 Result，未设置 HTTP 状态，通常为 HTTP 200。鉴权入口明确使用 HTTP 401 / body code 401；无权限为 HTTP 403 / body code 403。
- Spring 缺必填参数的 400、未捕获异常的 500 没有统一 Result 契约；TS 应提供可控错误处理，并记录兼容性差异，不伪造成功。
- `/map/getmap`、`/map/getboundary` 是裸图片二进制；`/map/getlegend` 是 Result 包装的 **Base64 字符串**（Java byte[] JSON 序列化），不是数组；`/statistical/download` 是 XLSX 附件。
- 前端 axios 响应拦截器只解一层 HTTP response，返回 body；各封装函数有的继续返回 `body.data`，所以后端不可去掉 Result 外壳。
- 用户信息存在 localStorage 键 `leiyangUser`；请求头为 `token`，二维瓦片手动发 `Token`。HTTP 头名称大小写不敏感，二者均须识别。
- 除账户开放路径外，其余接口要求认证。筛选树、GIS、曲线、表格要求 `normal` 权限；下载要求 `download` 权限；区域/说明控制器没有方法权限注解，但受全局 authenticated 规则约束。
- 角色标签不能替代权限表。权限来自 `sys_user.role -> sys_role_permission.permission`。用户角色显示值为：`admin -> 管理员`、`normalUser -> 普通用户`、`downloadUser -> 可下载用户`，其他为“未知”，null 为 ""。
- 密码存 BCrypt；JWT 使用 HS256，`jti=用户ID字符串`、`sub=username`、`iss=clj`，有效期 24 小时。密钥必须由新环境配置，不复制源码密钥。
- Java 登录将含用户与权限的 LoginUser JSON 存 Redis `login:<id>`，没有显式 Redis TTL；token 校验后以 jti 查 Redis。TS 保留“JWT + 可撤销会话 + DB权限”的业务关系，内部缓存表示可改变。禁止将密码散列、JWT、完整用户对象输出日志。
- 旧代码登录查询未过滤 `is_deleted`、Redis 会话无 TTL、无效 JWT 可能空指针。这些是已发现缺陷，不是界面必须依赖的功能；实现时应明确记录修复，而非无意复制。

依据：[S1](#s1)、[S2](#s2)、[S3](#s3)、[S4](#s4)。

## 2. 20 个接口清单与精确参数

参数列的大小写是当前客户端/控制器真实写法。GET 参数均在 query；POST 参数为 JSON body。

| # | 方法与路径 | 参数 | 返回 data / msg | 权限 |
|---|---|---|---|---|
| 1 | POST /login | username, password | data: role, username, email, phone, company, region, token | 开放 |
| 2 | POST /register | username, password, fullName, phone, email, company, region, code | msg: 注册成功 | 开放 |
| 3 | GET /sendcode | email | msg: 验证码发送成功 | 开放 |
| 4 | GET /user/sendmodcode | email | msg: 验证码发送成功 | 开放 |
| 5 | POST /user/modifypwd | email, code, password | msg: 修改成功！ | 开放 |
| 6 | GET /list/getresourcelist | language（客户端发送，Java不消费） | TreeNode 根对象或 null | normal |
| 7 | GET /list/getdatatypelist | conditionId, language（后者忽略） | 空名假根，children为数据类型子树 | normal |
| 8 | GET /list/getchild | conditionId, language（后者忽略） | 空名假根，children为直属子节点 | normal |
| 9 | POST /list/updatecondition | conditionId, name | msg: 修改成功！ | normal |
| 10 | POST /list/addChild | name, nameEn, parentId, type | msg: 添加成功！ | normal |
| 11 | POST /list/delcondition | conditionId | msg: 删除成功！ | normal |
| 12 | GET /map/getmap | WMS query，二维真实客户端发 Map, LAYERS, SERVICE, VERSION, REQUEST, FORMAT, CRS, language，OL追加BBOX/WIDTH/HEIGHT等 | 裸PNG | normal |
| 13 | GET /map/getlegend | **MAP**, **LAYER**, language（忽略） | Base64 PNG字符串或 null | normal |
| 14 | GET /map/getpoint | **MAP**, **LAYERS**, **LONGITUDE**, **LATITUDE**, language（忽略） | {value: number|null, area: 地域属性对象} | normal |
| 15 | GET /map/getboundary | level, area, class，加WMS尺寸/BBOX/CRS等 | 裸PNG | normal |
| 16 | GET /statistical/getlinedata | **map**, **timescale**, **timespan**, **level**, **places**, language（忽略） | {xAxisData, SeriesData} | normal |
| 17 | GET /statistical/getexceldata | **map**, **timeScale**, **year**, **level**, **language** | {columns, data} | normal |
| 18 | GET /statistical/download | 与 #17 相同 | 裸XLSX附件 data.xlsx | download |
| 19 | GET /region/getregions | map | {id?,map?,regionsZn,regionsEn} | 认证 |
| 20 | GET /i/getdescription | map, language | {descriptionZn?或descriptionEn?,其他实体字段可能null} | 认证 |

特别注意：

- `timescale`（曲线）与 `timeScale`（Excel）不是同一个参数。
- 曲线 `timescale` 为 `yr`、`mo_2021`、`hr_2021` 一类表名后缀；Excel timeScale 为中文 `年/月/小时`，即使 UI 是英文。
- Excel `year` 在 Java 控制器标为必填；年度请求发送空字符串仍存在该参数。
- 曲线数组在旧客户端模板字符串中被转成逗号分隔；例如 `places=甲,乙`、`timespan=`。TS 接受逗号列表和重复 query，空 timespan 解析为 []。
- 图例是单数 LAYER；点查询是复数 LAYERS。
- 二维 getmap 的 Map 为混合大小写；可以在 GIS adapter 规范成 MAP，但必须接受旧客户端写法。点查询缺 uppercase MAP/LAYERS/LONGITUDE/LATITUDE 会返回业务错误。
- 不迁移：CUG /logout、/list/getdatalist、/statistical/getdata、/i/putinfo、/i/uploaddescription、/hello、/no；QHFG.Server 全部接口。无调用的旧 `parseMapToTableName` 算法不能被误用在 getlinedata。

依据：[S5](#s5)、[S6](#s6)、[S7](#s7)、[S8](#s8)、[S9](#s9)、[S10](#s10)、[S11](#s11)。

## 3. 数据实体与数据库字段

下面是源码映射，不是已取得的真实 DDL。数据库字段类型、唯一索引、默认值、约束与统计表注册表仍需迁移环境确认。自动 camelCase -> snake_case 的部分应以实际 schema 验证。

| 表 | Java / API 字段 | 数据库列 | 类型/说明 |
|---|---|---|---|
| sys_user | id | id | Integer，自增 |
| sys_user | username | username | String |
| sys_user | password | password | String，BCrypt散列，禁止API返回 |
| sys_user | fullName | full_name | String |
| sys_user | phone, email, company, region, role | 同名 | String |
| sys_user | isDeleted | is_deleted | Boolean |
| sys_user | createDate | create_date | Date |
| sys_role_permission | id, role, permission | 同名 | Integer/String/String |
| data_select_conditions_tree | conditionId | condition_id | Integer，自增 |
| data_select_conditions_tree | name, nameEn | name, name_en | String，中英文名称 |
| data_select_conditions_tree | parentId, type, delFlag | parent_id, type, del_flag | Integer/String/Boolean |
| data_statistic_region | id, map | id, map | Integer/String |
| data_statistic_region | regionsZn, regionsEn | regions_zn, regions_en（约定映射，待DDL确认） | String，斜杠串，不是级联JSON |
| data_description | id, map, dataName | id, map, data_name（约定映射） | Integer/String/String |
| data_description | descriptionZn, descriptionEn | description_zn, description_en（约定映射） | 中英文HTML String |
| data_description | time | **created_at** | LocalDateTime，显式映射，JSON yyyy-MM-dd HH:mm:ss |
| data_description | developer | developer | String |

RegisterRequest 字段为 username/password/fullName/phone/email/company/region/code；找回密码复用此 DTO，只需要 email/code/password。当前登录 data **没有 id、fullName、permissions**，不要因内部需要而更改外部结构。

依据：[S12](#s12)、[S13](#s13)、[S14](#s14)、[S15](#s15)、[S16](#s16)、[S17](#s17)。

## 4. 登录、验证码、注册和改密

### 4.1 登录 data 与会话

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "role": "普通用户",
    "username": "<测试用户名>",
    "email": "<测试邮箱>",
    "phone": "<测试电话>",
    "company": "<测试单位>",
    "region": "<测试地区>",
    "token": "<运行时生成，不写入文档>"
  }
}
```

按 username 从 sys_user 读取一行，BCrypt核对密码；从 sys_role_permission 获取权限列表。DB role 标签转换后放 login data.role。真实 adapter 需要完整用户字段、权限表、BCrypt支持、JWT配置、Redis会话。原登录对 email/phone/company/region 调用 toString，null会失败；TS可保持外部字符串字段并处理空值，记录修复。

### 4.2 账户业务错误码

| 操作/条件 | body code | msg |
|---|---:|---|
| 登录认证失败 | 401 | 登录失败，请检查用户名和密码 |
| sendcode / sendmodcode 邮箱格式不匹配 | 415 | 邮箱格式不正确 |
| register 用户名不匹配 ^[a-zA-Z0-9_]{4,20}$ | 416 | 用户名长度需在 4 - 20 个字符，只能包含字母、数字和下划线 |
| register / modifypwd 验证码不匹配或过期 | 411 | 验证码错误 |
| register 未删除用户名重复 | 412 | 用户名已存在 |
| register 未删除邮箱重复 | 413 | 邮箱已被注册 |
| register 未删除电话重复 | 414 | 电话已被注册 |
| register insert结果为0 | 419 | 注册失败 |
| sendcode 邮件发送异常 | 500 | 发送失败：后接异常信息（TS不泄露内部连接信息） |
| sendmodcode 查询不到邮箱 | 412 | 用户邮箱不存在 |
| sendmodcode 发送失败 | 500 | 发送失败： |
| modifypwd update结果为0 | 419 | 修改失败 |

邮箱正则为 `^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$`。验证码为6位数字，存 `verify_code:<email>`，TTL为5分钟。先发邮件，成功后写Redis。两种验证码共用同一key前缀。校验仅比较传入code与缓存；校验失败不删除，注册成功/改密成功后删除。

注册顺序：用户名格式 -> 验证码 -> username/email/phone重复检查（均只查 is_deleted=false）-> BCrypt -> insert。新用户 role 为 normalUser、is_deleted=false、create_date为当前时间；fullName等字段从请求复制。源码没有服务端密码长度、电话格式等校验，不应把UI校验误写为既有服务规则。邮件 subject 分别“注册验证码”“修改密码验证码”。

sendmodcode 的 hasUser 与 modifypwd 的 update 按email查询，原实现未过滤 is_deleted；新实现若限制到活动用户，作为明确缺陷修复记录。不要在真实性验收中向生产库注册/改密，必须使用隔离数据或获准测试记录。

依据：[S2](#s2)、[S18](#s18)、[S19](#s19)、[S20](#s20)。

## 5. ConditionTree：结构、树生成、节点修改、路径

### 5.1 JSON节点

```ts
interface TreeNode {
  id: number;             // conditionId改名，不是新增数据库ID
  name: string;
  nameEn: string | null;
  parentId: number;
  type: string;
  children: TreeNode[];    // 叶子也必须为[]
}
```

CreateConditionTree.cTree先按conditionId建Map，再按原列表遍历：parentId=-1指定根，否则只在父节点存在时加入父.children；找不到父的节点不直接提升成根。单一root返回对象，不是数组，多个root时最后一个胜出。来自SQL的顺序为condition_id升序，children顺序沿用列表顺序。

- getresourcelist：只读 del_flag=false 且 type IN (rnode,resource)，按conditionId升序，再构树。需要真实根节点的parentId=-1。
- getdatatypelist：从请求conditionId的直属子节点开始递归，只递归type IN (dnode,datatype)且未删除的节点；最后追加 `{conditionId:请求ID,name:"",nameEn:null,parentId:-1,type:""}` 假根。结果的假根children为这棵子树。
- getchild：只读取该parentId的未删除直属子节点，不递归；末尾加入相同假根，所以各真实直属子节点children通常为[]。用于空间和时间筛选。
- language参数在Java这三个读取接口中没有消费，必须同时返回name/nameEn，不能改成单一已翻译name。

### 5.2 节点修改规则

- updatecondition仅修改指定conditionId的中文name；不会更新nameEn、parentId或type。更新行数>0成功，否则code0/“修改失败！”。
- addChild插入name/nameEn/parentId/type，delFlag强制false；在事务中读取父原type。新type为resource则父type改为rnode；新type为datatype且父原type不是resource则父type改为dnode；其他新type不改父。
- insert和必要父update均非0时成功，返回msg“添加成功！”，否则code0/“添加失败！”。原事务没有因返回false主动throw；不要把“返回false也可能提交”当成必须复现的业务功能。
- delcondition只将自身delFlag设true，不级联删除后代，不改父type。行数>0返回“删除成功！”，否则code0/“删除失败！”。
- 前端新增选项：resource、datatype、space、time，未选择时发送node；rnode/dnode是后端形成的中间节点类型。

### 5.3 path由前端生成，不是后端字段

ConditionBox通过id在树中找祖先路径，使用 **name中文值** 将资源路径/数据类型路径/子选项路径/时间路径按 "/" 串联，移除末尾单个 "/"；英文UI也使用中文路径。因此adapter必须保留name与树拓扑，不能翻译物理路径或悄悄删除中间节点。

DataService将路径转换为QGIS文件：

- 年值或“多年平均”一类没有 "-" 的选择：`/io/data/<筛选path>/<选择值>.qgs`，图层名 `<选择值>.tif`。
- 月或小时含 "-"：移除 "-" 和空格，小时先截去冒号后部分，得到tempTime；QGS为 `/io/data/<筛选path>/<年份>/<tempTime>.qgs`，图层名 `<tempTime>.tif`。
- selectMapPath来自筛选path；ChartBox再去掉时间段获得统计map。不得将地图绝对MAP路径直接拿作统计表路径。
- 前端读取children[0].type=="space"改变标题；实际空间/时间节点类型和顺序必须来自真实seed，不能随意补假类型。

依据：[S6](#s6)、[S21](#s21)、[S22](#s22)、[S23](#s23)、[S24](#s24)。

## 6. GIS真实adapter契约

### 6.1 getmap与三维WMS

getmap将query覆盖到默认值 `SERVICE=WMS, VERSION=1.1.0, REQUEST=GetMap, CRS=EPSG:4326, FORMAT=image/png` 上，向配置QGIS base URL + /ows/发GET，请求accept:image/png，裸返回响应bytes。旧实现原样透传query，包含二维Map、BBOX/WIDTH/HEIGHT、透明设置等。

Map3D的WebMapServiceImageryProvider目前直接调用外部/ows/，业务影像使用props.qgsMapPath与props.tifMapPath，透明PNG、EPSG:4326、WMS1.1.0，同时开启GetFeatureInfo。迁移应将该URL变成配置；若经TS代理，则必须支持与直连相同的GetMap/GetFeatureInfo及认证/跨域行为，不能只凭二维getmap通过判定三维已接入。

### 6.2 图例

getlegend必须有MAP和LAYER，缺失为code0、msg“参数缺失，请提供MAP 和 LAYER 参数”。返回 `Result.success(bytes)`，客户端将data拼进 `data:image/png;base64,...`。

向QGIS调用WMS1.1.1 GetLegendGraphic。若MAP包含“现状数据”则走SHP图例样式，否则栅格样式。保留已有参数后覆盖服务/样式参数：

| 参数 | 现状/SHP | 栅格 |
|---|---|---|
| FORMAT / TRANSPARENT / LAYERTITLE | image/png / TRUE / FALSE | 同左 |
| SRCWIDTH / SRCHEIGHT | 300 / 400 | 200 / 600 |
| BOXSPACE / LAYERSPACE / SYMBOLSPACE | 5 / 3 / 2 | 2 / 0 / 0 |
| ICONLABELSPACE | 4 | 2 |
| SYMBOLWIDTH / SYMBOLHEIGHT | 12 / 12 | 10 / 35 |
| LAYERFONTSIZE / ITEMFONTSIZE | 8 / 18 | 10 / 15 |
| RULELABEL | 不覆盖 | FALSE |

原FetchLegendService注入server.port而地图服务注入QGISPort，属于配置不一致；新adapter应使用同一个明确的QGIS端点，登记为修复。

### 6.3 getpoint数值与地域属性

必须有uppercase LONGITUDE/LATITUDE/MAP/LAYERS，缺失code0/“参数缺失，请提供 LONGITUDE、LATITUDE、MAP 和 LAYERS 参数”；数字解析失败code0/“参数格式错误，LONGITUDE 和 LATITUDE 必须为有效的数字”。

数值查询：QGIS WMS1.1.1 GetFeatureInfo，QUERY_LAYERS=LAYERS、MAP原值、INFO_FORMAT=application/json、WIDTH=HEIGHT=1、X=Y=0、CRS=EPSG:4326、BBOX为longitude/latitude各±0.01度，取features[0]。

- MAP不含“现状数据”：取properties["Band 1"]，"nan"或无feature返回null，否则parseDouble。
- MAP含“现状数据”：取feature.id第一个 "." 前面的字符串，属性名为 "Y"+该字符串；从该属性取数字，例如id为“2021.xxx”则取Y2021。该规则以源码为准，不能替换为Band 1。
- 返回data.value为数字或null，无值仍code200。

地域查询使用同样小BBOX，但WMS1.1.0：

1. MAP=/io/data/boundary/boundary.qgs，QUERY_LAYERS=Global_boundary，取features[0].properties中的区域1/区域2/国家/国家_1。
2. 无匹配则查询Global_ocean；仍无匹配返回空对象{}。
3. 国家为“中国”时，再使用/io/data/boundary/china_boundary.qgs、china_boundary，补充电网_0/省级/地级/县级。
4. 只保留存在的属性，以string值返回，字段映射如下；不得输出QGIS geometry或完整feature。

| QGIS属性 | API area字段 |
|---|---|
| 区域1 | 区域 |
| 区域2 | 次区域 |
| 国家 | 国家 |
| 国家_1 | 地区 |
| 电网_0 | 电网 |
| 省级 / 地级 / 县级 | 同名 |

成功形态：`{code:200,msg:null,data:{value:数值或null,area:{区域:"...",国家:"...",省级:"..."}}}`。area允许只有部分键或{}，不能用数组替代。Map3D调用此接口查询value与area，并通知图表按地图缩放/区域切换。

### 6.4 边界

getboundary默认为同一WMS GetMap参数，MAP为/io/data/boundary/boundary.qgs，LAYERS为 `Global_<class>`，class前端为boundary或ocean。area为逗号地区名列表。level映射到上一表对应QGIS属性列，构造：

`FILTER = <layers>:"<column>" = '<area1>' OR "<column>" = '<area2>'`

之后透传WMS参数，返回PNG bytes。真实adapter必须验证class/level、转义地区引号、将MAP限定在配置根范围。原代码把请求参数在默认FILTER后覆盖，不能原样允许任意上游URL或文件路径。安全限制应登记，不更改合法界面请求。

依据：[S7](#s7)、[S25](#s25)、[S26](#s26)、[S27](#s27)。

## 7. Region与Description

Region按map完全相等读data_statistic_region，只选择regionsZn/regionsEn。空map返回code0、“参数值缺失，请提供map参数值”；无行返回code0、“无数据,请提供正确的map路径”。省略map在旧实现可能空指针，TS应返回受控错误。

外部字段采用前端实际消费的 **regionsZn / regionsEn**（接口文档旧示例全部小写不能作为准据）。值是 `区域/次区域/国家/电网/省级/地级/县级` 之类斜杠字符串。ChartBox对regionsZn.split("/")，用段数剪裁本地original_options层级；首段是“电网”时选电网模板。英文UI也读取regionsZn，使用本地英文模板。后端不返回完整级联树，regionsEn仍需保留。

getdescription按map完全相等查询data_description。language=chinese时只选择descriptionZn，english时只选择descriptionEn；无行code0/“无数据”。成功data是Description实体，选中的HTML字符串是关键字段，其他未选字段为null/可遗漏。源码未知language构造空Description后返回成功，TS应记录是否改成参数错误，不能假称源码已验证非法语言。

依据：[S9](#s9)、[S10](#s10)、[S28](#s28)、[S29](#s29)、[S30](#s30)。

## 8. getlinedata：实际调用算法

### 8.1 表名

**实际调用 TranstoUtils.MapTranstoTableName(map,timescale,level)**：

1. map按"/"分段，查下表替换，不认识的段原样保留；按"_"连接。
2. 直接追加 "_"+timescale（已经由前端变成yr、mo_年份、hr_年份）。
3. level按下表替换后追加 "_"+level。
4. **不追加global/china；不单独传year；不使用FetchStatisticalDataService.parseMapToTableName这个旧接口算法。**

例如：map=发电侧/风力发电/低空风电/陆上风电/潜力数据/2.5MW/容量因子/10km，timescale=mo_2021，level=国家，则逻辑表名为 `pg_wind_low_on_pot_2_5mw_cf_10km_mo_2021_cntry`。该示例只说明拼名，不声称数据库已有该表。

| 中文段 | 统计标识 |
|---|---|
| 发电侧 / 电网侧 / 用户侧 | pg / grid / cus |
| 风力发电 / 光伏发电 / 光热发电 / 水力发电 | wind / pv / csp / hydp |
| 低空风电 / 高空风电 / 海上风电 / 陆上风电 | low / high / off / on |
| 集中式光伏发电 / 分布式光伏发电 | 空字符串（源码会保留分段分隔符，形成连续下划线） |
| 潜力数据 / 现状数据 | pot / curr |
| 2.5MW / 5MW / 6.5MW / 15MW / 6MW / 8MW | 2_5mw / 5mw / 6_5mw / 15mw / 6mw / 8mw |
| 陆基5MW / 空基5MW | lb5mw / ab5mw |
| 单晶硅 / 异质结 / 钙钛矿 / 钙钛矿_硅叠层 | mono / hjt / psc / pcS |
| 塔式 / 径流式 | tow / ror |
| 容量因子 / 发电潜力 / 装机潜力 / 平准化度电成本 | cf / gp / cp / lcoe |
| 发电量 / 发电厂 / 装机量 / 输配电线路 | eg / pploc / ic / tdl |
| 全社会用电量 / 人均社会用电量 | tec / pcec |
| 小时 / 年 / 月 | hr / yr / mo（路径段转换；timescale本身直接追加） |
| 1km / 10km / 25km / 100m | 同名 |
| 区域 / 次区域 / 国家 / 电网 / 省级 / 地级 / 县级 | reg / subreg / cntry / grid / prov / city / county |

“陆上光伏发电”“总电量消耗”在此字典中是注释掉的旧条目，不能因另一旧算法字典有值就补入。原SQL不加标识符引号，因此PostgreSQL对pcS折成小写的实际行为、连续下划线表名、所有可用产品表，须由真实schema/表注册表确认。

### 8.2 列和查询

所有当前曲线表需要 `place_china, place_english, time, value`：

- 非hr：SELECT * FROM已注册表 WHERE place_china IN参数places；timespan非空再AND time IN参数timespan；ORDER BY time ASC。
- hr：对每个place查询。空timespan查所有；非空按time BETWEEN timespan[0]::timestamp AND timespan[1]::timestamp，边界包含。SELECT place_china,place_english,`to_char(time,'YYYY-MM-DD HH24') AS time`,value，ORDER BY time ASC。
- 原mapper将表名用字符串替换插入SQL。TS必须使用允许表名注册表，值参数化；不允许用户路径任意生成可执行标识符。
- language虽由客户端发送，Java控制器不消费；两种名字总是成对返回。

### 8.3 返回

```ts
interface ChartData {
  xAxisData: string[];
  SeriesData: Array<{
    name: [string, string]; // [place_china, place_english]
    data: Array<number | null>;
  }>;
}
```

非hr按有序查询结果迭代，用LinkedHashSet收集time.toString形成xAxisData，用[中文名,英文名]分组累计value，series保持首次出现顺序。hr每个place异步查，时间用排序集合取并集，series来自并发Map，原series顺序不稳定。

原转换器未按xAxis补齐缺失时间点：稀疏place序列可能错位。新实现应按完整时间轴对齐、缺值填null，作为明确的数据正确性修复验证，不声称旧源码已有该能力。真实golden fixture须核对日期字符串、时区、数据库numeric解析与缺值。JS实现不能把值字符串直接送ECharts或将缺值变0。

依据：[S8](#s8)、[S31](#s31)、[S32](#s32)、[S33](#s33)、[S34](#s34)。

## 9. Excel表格与下载

所有参数精确为map/timeScale/year/level/language。timeScale始终中文，level也保留中文。scope从level推断：

- 国家/区域/次区域 -> Global；
- 县级/地级/省级/电网 -> China；
- 其他level原服务抛IllegalArgumentException，不返回业务code。

物理文件路径：

- timeScale="年"：`<ExcelBasePath><map>/年/<scope>.xlsx`；
- 否则：`<ExcelBasePath><map>/<timeScale>/<year>/<scope>.xlsx`。

ExcelBasePath必须由配置提供并保证分隔符；完整真实文件树的名字需与服务规则匹配，不是任意ZIP文件名。选择工作簿中sheetName以中文level开头的sheet，按工作簿顺序取第一个。没有匹配sheet的旧代码会失败，TS应受控报错而不返回伪造空表。

getSheetData：

- 0号行作为列头，保持顺序；有单元格则getStringCellValue，缺失列头生成Column1/Column2等。
- 从1号行到最后一行，null行跳过；以列名为key，按columns顺序读取。
- STRING -> string；NUMERIC -> number，但Excel日期为Date；BOOLEAN -> boolean；FORMULA -> **公式文本**（不计算）；其他/缺单元格 -> ""。
- date序列化细节需fixture确认，不能凭源码猜成固定ISO或数字。
- data返回 `{columns:string[], data:Array<Record<string,unknown>>}`。

语言筛列的精确规则：

- containsChinese：列名含任意Unicode HAN字符。
- containsEnglish：列名非空，**每个字符都为ASCII A-Z或a-z**，并非“含任意英文”。
- language=chinese：移除containsEnglish为true的列。例如Regions移除；Regions 1、2021、Year2021不符合该判断。
- language=english：移除containsChinese为true的列。
- 混合“中文English”在english删除，在chinese不删除；纯数字日期列在两种语言都保留。
- 同时从columns与每条row删除这些列，不能只隐藏前端列。
- 其他language不筛列。

download复用同一筛选后的getExcelData，创建新工作簿，sheet名Data，首行columns，其后按列顺序写rows。string/number/boolean保持对应单元格类型。原Date等类型不被写入，留空；公式已作为string写入。返回HTTP200、Content-Type application/octet-stream、Content-Disposition attachment（filename=data.xlsx），裸bytes。以保留下载内容/列順序/语言为验收核心；日期导出缺陷修复应单独记录。

依据：[S8](#s8)、[S35](#s35)、[S36](#s36)。

## 10. 真实adapter需要的配置与数据

本表仅列类别/字段名，不含现有值。不得把原配置复制到公开仓库。

| adapter | 需要配置或真实资料 | 验收要点 |
|---|---|---|
| PostgreSQL | PG连接（host/port/database/user/password或DATABASE_URL）、受控schema、五个业务实体表、所有统计表注册表 | 查询树/权限/区域/说明/年/月/小时；禁止随请求拼任意表名 |
| Redis | REDIS_URL或host/port/password、prefix、session/code TTL | token可撤销；code5分钟；错误code兼容 |
| JWT/BCrypt | 新JWT_SECRET、24h期限、issuer、BCrypt兼容 | 不复制真实签名密钥；旧测试身份与新token可单独取得 |
| SMTP | SMTP_HOST/PORT/USER/PASSWORD/FROM、TLS配置、受控测试邮箱 | 注册与改密两种验证码真实投递；日志无验证码/密码 |
| QGIS | QGIS_BASE_URL（含/ows/或明确拼接）、QGIS_DATA_ROOT、BOUNDARY_QGS、CHINA_BOUNDARY_QGS、ENERGY_MAP_REGISTRY | WMS图片/图例/点值/区域/边界，二维三维均验证 |
| Excel | EXCEL_DATA_ROOT、允许产品路径注册、对应Global.xlsx/China.xlsx、sheet前缀规则 | 表格与下载同列同值，中英文一致 |
| 外部底图/三维 | 天地图/其他底图的用户自有配置、Cesium配置，静态国家点GeoJSON | 凭据外置；三维真实影像可见，点查询驱动图表 |
| 验收身份 | 隔离normal/download权限用户、专用邮箱和可回滚测试库 | 不将远程可达或模拟响应当成生产验收成功 |

已确认的运行事实：现有API未认证请求返回401；现有远程PG/Redis TCP可达；QGIS指定源码boundary.qgs的GetCapabilities返回200合法WMS XML。尚未验证这些服务的业务登录/表结构/完整能源图层/Excel树。当前本地SQL目录为空、10个Data ZIP无SQL/QGS、配置Excel目录不存在；不能据此声称完整离线可重现。

最低真实fixture清单：

1. 注册/验证码/登录/改密的受控流程及normal/download权限区分。
2. 原筛选树snapshot（含全部id/name/nameEn/type/parentId/删除标志），一次添加/改名/删除在隔离库验证。
3. 一组年、月、小时产品的QGS/图层、统计表、Excel；至少一个中国点与一个境外点/海洋点/NoData点。
4. 中英文region/description/legend、表格列筛选、XLSX内容与下载权限。
5. 对齐日期格式/时区/稀疏序列的golden响应；保存测量配置和真实/模拟环境标记。

## 源码依据索引

下列链接定位原始绝对路径。编号用于上文追溯；内容保留源码事实，未将真实敏感配置值写入本文。

### S1
[Result.java:14](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/common/Result.java:14)：success/error重载、code/msg/data。

### S2
[LoginServiceImpl.java:34](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/LoginServiceImpl.java:34)：登录、Redis、data字段。
[JwtConstant.java:19](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/util/jwt/JwtConstant.java:19)：24h期限（同文件敏感字段未复制）。
[JwtUtils.java:27](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/util/jwt/JwtUtils.java:27)：算法和claims（密钥未复制）。

### S3
[SecurityConfig.java:35](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/security/SecurityConfig.java:35)：BCrypt、开放路径和全局认证。
[LoginUser.java:82](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/security/LoginUser.java:82)：角色中文标签。
[UserDetailsServiceImpl.java:29](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/security/UserDetailsServiceImpl.java:29)：用户和权限查询。

### S4
[axios.js:13](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/request/axios.js:13)：token与响应处理。
[AuthenticationEntryPointImpl.java:24](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/security/AuthenticationEntryPointImpl.java:24)：401。
[AccessDeniedHandlerImpl.java:20](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/security/AccessDeniedHandlerImpl.java:20)：403。

### S5
[index.js:12](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/request/index.js:12)：全部API封装（账户12、筛选58、GIS111、统计146、区域178、说明185、改密199）。

### S6
[ConditionTreeController.java:21](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/ConditionTreeController.java:21)：接口、权限与修改消息。

### S7
[GisMapController.java:38](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/GisMapController.java:38)：参数、图片/图例/点返回。

### S8
[StatisticalDataController.java:59](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/StatisticalDataController.java:59)：曲线和表格参数、下载权限。

### S9
[RegionController.java:25](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/RegionController.java:25)：区域业务错误。

### S10
[DescriptionController.java:50](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/DescriptionController.java:50)：语言和无数据。

### S11
[ConditionBox.vue:664](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/condition/ConditionBox.vue:664)：添加真实调用；698删除、723改名。

### S12
[SysUser.java:11](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/entity/SysUser.java:11)；
[SysUserMapper.xml:7](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/resources/mapper/SysUserMapper.xml:7)：用户字段与列。

### S13
[RegisterRequest.java:6](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/dto/RegisterRequest.java:6)：DTO。

### S14
[ConditionTree.java:20](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/entity/ConditionTree.java:20)：筛选实体。

### S15
[Region.java:18](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/entity/Region.java:18)：区域实体。

### S16
[Description.java:23](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/entity/Description.java:23)：说明实体、created_at。

### S17
[SysRolePermissionMapper.xml:16](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/resources/mapper/SysRolePermissionMapper.xml:16)：用户名到role到permission。

### S18
[RegisterController.java:43](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/RegisterController.java:43)：邮箱/注册规则、错误码（注册82）。

### S19
[SysUserController.java:35](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/SysUserController.java:35)；
[SysUserServiceImpl.java:43](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/SysUserServiceImpl.java:43)：改密流程与查询。

### S20
[VerificationCodeService.java:12](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/util/utils/VerificationCodeService.java:12)：验证码缓存。

### S21
[CreateConditionTree.java:21](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/util/utils/CreateConditionTree.java:21)：TreeNode字段；45构树。

### S22
[ConditionTreeServiceImpl.java:63](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/ConditionTreeServiceImpl.java:63)：改名、添加79、删除105、资源119、假根139/159。

### S23
[ConditionTreeMapper.java:19](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/mapper/ConditionTreeMapper.java:19)：数据类型递归CTE。

### S24
[ConditionBox.vue:618](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/condition/ConditionBox.vue:618)：type选择；757寻路，919拼path。
[DataService.vue:208](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/DataService.vue:208)：QGS/图层路径。

### S25
[FetchGISMapServiceImpl.java:64](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/FetchGISMapServiceImpl.java:64)：getmap；104点值；215边界；313地域。

### S26
[FetchLegendServiceImpl.java:31](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/FetchLegendServiceImpl.java:31)：端口与图例样式。

### S27
[Map2D.vue:213](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/Map2D.vue:213)：Map参数与瓦片token。
[Map3D.vue:274](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/Map3D.vue:274)：WMS；118/756点查询。

### S28
[RegionServiceImpl.java:22](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/RegionServiceImpl.java:22)：按map读取两个区域串。

### S29
[ChartBox.vue:1102](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/chart/ChartBox.vue:1102)：regionsZn.split和本地级联。

### S30
[DescriptionServiceImpl.java:68](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/DescriptionServiceImpl.java:68)：中英文单列查询。

### S31
[TranstoUtils.java:18](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/util/utils/TranstoUtils.java:18)：映射字典；155拼表名；181结果转换。

### S32
[FetchStatisticalDataServiceImpl.java:408](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/FetchStatisticalDataServiceImpl.java:408)：当前曲线入口；301非hr查询；340hr并发。

### S33
[StatisticalDataMapper.java:44](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/mapper/StatisticalDataMapper.java:44)：place/time/value SQL；84小时格式；96时间区间。

### S34
[ChartBox.vue:492](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/QHFG.Web/src/components/dataService/chart/ChartBox.vue:492)：曲线query；368/372/377时间尺度后缀；1226名字数组消费。

### S35
[FetchStatisticalDataServiceImpl.java:444](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/service/impl/FetchStatisticalDataServiceImpl.java:444)：scope/path/语言筛列；520HAN；534全字母规则。
[ExcelUtil.java:67](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/util/utils/ExcelUtil.java:67)：sheet前缀；206读取单元格类型。

### S36
[StatisticalDataController.java:85](F:/CX_notes/cxDlogver/source/_posts/Project/2024_QH_FGKSH/CUG_QHFG.Server/src/main/java/com/cug/qhfg/controller/StatisticalDataController.java:85)：新建Data sheet与下载headers。
