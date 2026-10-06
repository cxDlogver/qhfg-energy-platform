# 本地工具链调查

调查日期：2026-10-07（Asia/Shanghai）。本文件记录已有安装的版本及可复用路径，供项目声明依赖、开发验证和性能评测使用。调查没有安装工具、修改全局环境、读取认证凭据或创建远程资源。

## 运行环境

| 工具 | 已确认版本 | 本地路径或来源 |
| --- | --- | --- |
| Node.js（项目验证可用） | 24.19.0 | `C:\Users\xiang\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe` |
| Node.js（当前 PATH） | 22.12.0 | `D:\xiang\CX_application\1_Configuration_Files\Front_Rear_END\nodeJS\node.exe` |
| pnpm | 10.28.2 | 当前 PATH；父仓库 `packageManager` 同版本 |
| npm | 10.9.0 | 当前 PATH |
| Git | 2.45.2.windows.1 | `D:\xiang\CX_application\Git\cmd\git.exe` |
| Git Credential Manager | 2.5.0 | `git credential-manager --version` |
| Chrome | 154.0.8037.97 | `C:\Program Files\Google\Chrome\Application\chrome.exe` |

Lighthouse 13.5.0 的本地 `package.json` 声明 Node `>=22.19`。性能脚本应使用上述 Node 24 绝对路径；当前 PATH 中的 Node 22.12.0 不满足该要求。调查没有切换全局 PATH。

## 可复用依赖

以下目录缩写均对应已检查的本地绝对路径。表中给出包目录；确切版本从该目录的 `package.json` 读取。

- `B`：`F:\CX_notes\cx-learn-notes\browser-monitor\node_modules\.pnpm`
- `R`：`F:\CX_notes\cx-learn-notes\node_modules\.pnpm`
- `D`：`C:\Users\xiang\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules`
- `W`：`F:\CX_notes\cx-learn-notes\browser-monitor\platform\apps\audit-worker\node_modules`
- `O`：`F:\CX_notes\cxDlogver\source\_posts\Project\2024_QH_FGKSH\QHFG.Web\node_modules`

| 包 | 已安装版本 | 包目录 |
| --- | --- | --- |
| `fastify` | 5.12.5 | `B/fastify@5.12.5/node_modules/fastify` |
| `@fastify/cors` | 11.3.0 | `B/@fastify+cors@11.3.0/node_modules/@fastify/cors` |
| `pg` | 8.23.0 | `B/pg@8.23.0/node_modules/pg` |
| `ioredis` | 5.11.1 | `B/ioredis@5.11.1/node_modules/ioredis` |
| `jose` | 6.2.12 | `R/jose@6.2.12/node_modules/jose` |
| `nodemailer` | 7.0.13 | `B/nodemailer@7.0.13/node_modules/nodemailer` |
| `xlsx` | 0.18.5 | `O/xlsx`，原项目已有依赖 |
| `zod` | 4.6.5 | `R/zod@4.6.5/node_modules/zod` |
| `tsx` | 4.23.15 | `B/tsx@4.23.15/node_modules/tsx` |
| `playwright` | 1.62.1 | `D/playwright` |
| `playwright-core` | 1.62.1 | `D/playwright-core` |
| `sharp` | 0.35.4 | `D/sharp` |
| `pixelmatch` | 7.2.0 | `D/pixelmatch` |
| `lighthouse` | 13.5.0 | `W/lighthouse` |
| `chrome-launcher` | 1.2.1 | `W/chrome-launcher` |

其他已安装版本：`fastify@5.11.3`（B）、`ioredis@5.9.2`（official-network 的 pnpm store）、`jose@6.2.10`（qhzhc-realtime-platform 根 node_modules）、`zod@3.25.76`（B/R/official-network store）、`tsx@4.23.12`（qhzhc 根 node_modules）、`playwright-core@1.63.0`（R）及 `1.58.2`（official-network store）、`sharp@0.34.5`（R/official-network store）。

在本次检查的父仓库、browser-monitor、official-network、qhzhc 前后端、原 Web 和内置 runtime 的 node_modules 中，未发现 `redis`、`bcryptjs`、`jsonwebtoken`、`exceljs`、`@playwright/test`。该结论限于这些目录。已有 `ioredis`、`jose`、`xlsx` 分别提供 Redis、JWT 和 Excel 相关工具，但原 Java 密码散列兼容性仍需由后端实现和验证确定。

使用 Node 24.19.0 已成功导入 Fastify、CORS、pg、ioredis、nodemailer、jose、zod、Playwright、Sharp、Pixelmatch、Lighthouse、Chrome launcher 和 xlsx。这里只验证了模块可加载；数据库连接、邮件投递、浏览器运行和页面评分另行记录。没有启动服务或浏览器。tsx 仅核实安装版本。

## 本地引用与可复现性

项目的 `package.json` 和锁文件应显式记录自身依赖及确切版本。以上外部目录用于本机工具复用和调查证据；公开仓库的正常安装流程应从项目自身依赖恢复。机器路径及现成 node_modules 不进入应用运行配置。

Windows 下动态导入本地绝对路径时，应通过 `pathToFileURL()` 转为文件 URL。直接向 `import()` 传入 `F:\...` 会产生 `ERR_UNSUPPORTED_ESM_URL_SCHEME`。调查已按以下方式验证模块：

```js
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const requireFromPackage = createRequire(packageJsonAbsolutePath);
const moduleUrl = pathToFileURL(requireFromPackage.resolve(packageName));
const module = await import(moduleUrl.href);
```

已有 Lighthouse API 参考实现在：

`F:\CX_notes\cx-learn-notes\browser-monitor\platform\apps\audit-worker\src\lighthouse-runner.ts`

它通过 Chrome launcher 启动浏览器并调用 `lighthouse(url, options, config)`。新项目的前后基准应固定 Chrome/Lighthouse 版本、URL、数据状态、视口、节流、缓存及登录配置，并保存原始结果；本文件不包含任何已测页面性能分数。

## GitHub 仓库创建与认证能力

- 当前 GitHub Connector 登录账号为 `cxDlogver`；父仓库 `cxDlogver/cx-learn-notes` 为 public/main，Connector metadata 返回 admin/push 权限。
- Connector 提供仓库读取、分支、提交、文件和 PR 操作；已暴露的工具没有 `create_repository`。
- 本机 `gh` 不在 PATH，常见安装目录及内置 runtime 的 override/fallback 中也未找到。
- GCM 的 `git credential-manager github --help` 仅列出 `list`、`login`、`logout`；它是认证辅助工具，未提供创建仓库命令。调查仅执行版本和帮助命令，没有执行这些账户操作，也没有调用 `fill/get`。
- 可用的建仓流程是由负责仓库集成的执行者打开 `https://github.com/new`，确认页面登录身份为 `cxDlogver`，创建公开的 `qhfg-energy-platform`，然后在新项目仓库设置 origin 并通过 Git 推送。浏览器登录状态尚未在本次调查中验证。
- 父仓库已有 `official-network`、`browser-monitor` 和 `qhzhc-realtime-platform` 三个 Git 子模块。新项目沿用独立仓库和同名子模块；先推送子仓库，再更新父仓库的固定提交引用。

本次调查没有创建仓库、发起登录、读取认证令牌或推送代码。
