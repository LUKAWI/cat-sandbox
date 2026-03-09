# 猫砂盒 🐱

> OpenClaw 6 Agent 多智能体系统部署文档

## 项目简介

这是一个基于 OpenClaw 的多 Agent 架构系统，部署在 2核2G 的阿里云服务器上。

## 架构概览

```
🐱 猫王 (MAIN)     - 调度中心、日常对话、任务分发
💻 CODING         - 编程专家、代码实现、技术方案
🔍 RESEARCH       - 研究员、论文研读、项目管理、文字工作
🔧 OPS            - 运维专家、系统监控、安全审计
🎨 DESIGN         - 设计师、PPT制作、前端UI、风格把控
🧬 EVOLUTION      - 进化引擎、自我学习、配置维护
```

## 硬件配置

- CPU: 2核
- 内存: 2GB
- 存储: 40GB SSD
- 系统: Linux (Alibaba Cloud)

## 文档目录

- [架构设计](docs/ARCHITECTURE.md) - 详细的Agent架构设计
- [配置方案](docs/CONFIG_PLAN.md) - 分阶段配置步骤
- [配置示例](config/openclaw.json.example) - 脱敏配置文件

## 快速开始

```bash
# 1. 安装 OpenClaw
npm install -g openclaw@latest

# 2. 运行配置向导
openclaw onboard --install-daemon

# 3. 启动 Gateway
openclaw gateway --port 18789
```

## 创建时间

- 2026-03-09

## 作者

- LUKAWI

## 相关链接

- [OpenClaw 官网](https://openclaw.ai)
- [OpenClaw 文档](https://docs.openclaw.ai)
- [ClawHub 技能市场](https://clawhub.com)