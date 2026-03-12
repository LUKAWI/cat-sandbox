# 🐱 猫砂盒工作台 v2.0

AI 助手工作台 - 支持 6 个专业 Agent 切换

## 📦 项目结构

```
中文的工作台/
├── src/              # 前端源码 (React + TypeScript)
│   ├── components/   # UI 组件
│   ├── hooks/        # React Hooks
│   ├── stores/       # Zustand 状态管理
│   ├── types/        # TypeScript 类型定义
│   └── lib/          # 工具函数
├── server/           # 后端服务器 (Express + TypeScript)
│   └── index.ts      # API 服务器入口
├── public/           # 静态资源
├── package.json      # 依赖配置
├── vite.config.ts    # Vite 构建配置
└── tsconfig.json     # TypeScript 配置
```

## 🚀 快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件：

```bash
# Gateway 配置
GATEWAY_URL=http://127.0.0.1:10224
GATEWAY_TOKEN=你的 gateway token

# 后端服务器配置
PORT=10230

# 前端 Vite 配置
VITE_PORT=10225
```

### 3. 启动服务

**方式一：分开启动（开发环境）**

```bash
# 终端 1 - 启动后端
npx tsx server/index.ts

# 终端 2 - 启动前端
npm run dev
```

**方式二：生产环境构建**

```bash
# 构建前端
npm run build

# 启动后端（同时服务静态文件）
npx tsx server/index.ts
```

## 🔧 端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| Vite 前端 | 10225 | 开发服务器 |
| Express 后端 | 10230 | API 服务器 |
| Gateway | 10224 | OpenClaw Gateway |

## 🎯 功能特性

- ✅ React 18 + TypeScript
- ✅ Tailwind CSS 极客风格
- ✅ Markdown 渲染 + 代码高亮
- ✅ 6 个 Agent 切换（猫王、Turing、Newton、Hopper、Da Vinci、Darwin）
- ✅ Zustand 状态管理
- ✅ TanStack Query 数据获取
- ✅ Gateway API 集成
- ✅ Token 认证 + API Key 保护

## 📝 开发日志

- `SEND_BUTTON_FIX.md` - Send 键修复报告
- `DEBUG_GUIDE.md` - 调试指南
- `FINAL_CODE_REVIEW.md` - 代码审查报告
- `测试说明.md` - 测试说明

## 🔑 登录 Token

服务器启动时自动生成，查看 `/tmp/workbench-token.txt`

## 🌐 访问地址

- 前端：http://localhost:10225
- 后端 API：http://127.0.0.1:10230

## 📦 打包说明

此包已排除 `node_modules` 和 `dist` 目录，需要手动安装依赖。

打包时间：2026-03-12
