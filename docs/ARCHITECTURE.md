# MEMORY.md - Long-Term Memory

## Preferences

- **联网搜索优先使用 searxng skill** —— 只要涉及联网搜索任务，优先调用 searxng 技能而非直接使用 web_search 工具。

## Notes

- Created: 2026-03-05

---

## 🦞 6 Agent 架构方案 (2026-03-09)

### 架构总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                 自进化的多Agent系统 (6 Agents)                        │
│                  适用于: 2核2G服务器                                  │
└─────────────────────────────────────────────────────────────────────┘

                         ┌───────────────────────────────────────┐
                         │         Gateway (单进程 ~550MB)        │
                         └───────────────────────────────────────┘
                                           │
         ┌────────────┬────────────┬───────┴───────┬────────────┬────────────┐
         ▼            ▼            ▼               ▼            ▼            ▼
    ┌─────────┐ ┌─────────┐  ┌─────────┐   ┌─────────┐  ┌─────────┐  ┌─────────┐
    │  猫王   │ │ CODING  │  │RESEARCH │   │  OPS    │  │ DESIGN  │  │EVOLUTION│
    │  MAIN   │ │         │  │         │   │         │  │         │  │         │
    └─────────┘ └─────────┘  └─────────┘   └─────────┘  └─────────┘  └─────────┘
```

### Agent 详细配置

#### 🐱 Agent 1: 猫王 (MAIN) — 调度中心

| 维度 | 配置 |
|------|------|
| **模型** | `glm-5` (快速响应) |
| **内存** | 30-50MB/session |
| **响应** | 1-3秒 |
| **性格** | 幽默、主动、有点调皮 |

**核心职责：**
- 日常对话、情绪陪伴
- 任务识别与分发
- 进度跟踪与汇报
- 多Agent协调
- 提醒管理

---

#### 💻 Agent 2: CODING — 编程专家

| 维度 | 配置 |
|------|------|
| **模型** | `qwen3-max-2026-01-23` (深度推理) |
| **内存** | 50-100MB/session |
| **响应** | 5-15秒 |
| **性格** | 严谨、精确、代码洁癖 |

**核心职责：**
- 代码编写与重构
- Bug诊断与修复
- 技术方案设计
- 代码审查
- 第三方服务集成

---

#### 🔍 Agent 3: RESEARCH — 研究员 & PM & 文字工作

| 维度 | 配置 |
|------|------|
| **模型** | `qwen3.5-plus` (100万上下文) |
| **内存** | 80-150MB/session |
| **响应** | 10-30秒 |
| **性格** | 严谨、详尽、有深度 |

**核心职责：**
- 论文研读与分析
- 深度研究与报告
- 项目管理（精密计划、审查）
- 长文档处理
- 文字工作（报告撰写、文档生成、论文评审）
- 数据分析

---

#### 🔧 Agent 4: OPS — 运维监控

| 维度 | 配置 |
|------|------|
| **模型** | `glm-5` (轻量够用) |
| **内存** | 20-40MB/session |
| **响应** | 2-5秒 |
| **性格** | 稳重、警觉、有点强迫症 |

**核心职责：**
- 系统资源监控
- 服务健康检查
- 安全漏洞扫描
- 告警通知
- 文件管理

---

#### 🎨 Agent 5: DESIGN — 视觉设计

| 维度 | 配置 |
|------|------|
| **模型** | `qwen3-vl-plus` (多模态) |
| **内存** | 50-80MB/session |
| **响应** | 8-20秒 |
| **性格** | 审美在线、追求完美 |

**核心职责：**
- PPT设计与制作
- 前端UI设计
- 视觉风格把控
- 文档排版优化

---

#### 🧬 Agent 6: EVOLUTION — 自我进化引擎

| 维度 | 配置 |
|------|------|
| **模型** | `glm-5` (轻量即可) |
| **内存** | 20-40MB/session |
| **响应** | 2-5秒 |
| **性格** | 好学、自省、持续改进 |

**核心职责：**
- 持续学习：每天学习2个新skill/项目
- 自我反思：回顾行为，识别改进点
- 系统维护：配置检查、记忆优化
- 能力评估：发现缺口，提议新功能

---

### 定时任务配置

```json5
{
  cron: {
    entries: [
      // EVOLUTION 任务
      { id: "daily-skill-learning", schedule: "0 10 * * *", agentId: "evolution" },
      { id: "daily-reflection", schedule: "0 22 * * *", agentId: "evolution" },
      { id: "memory-optimization", schedule: "0 20 */3 * *", agentId: "evolution" },
      { id: "weekly-project-learning", schedule: "0 10 * * 6", agentId: "evolution" },
      { id: "weekly-config-check", schedule: "0 9 * * 0", agentId: "evolution" },
      
      // OPS 任务
      { id: "system-health-monitor", schedule: "0 */6 * * *", agentId: "ops" },
      { id: "weekly-security-scan", schedule: "0 8 * * 1", agentId: "ops" },
      
      // 猫王 任务
      { id: "morning-briefing", schedule: "0 9 * * *", agentId: "main" },
    ],
  },
}
```

---

### 资源占用评估

| 场景 | 内存占用 | 状态 |
|------|----------|------|
| 单Agent工作 | ~650MB | ✅ 安全 |
| 3个Agent同时 | ~800MB | ✅ 安全 |
| 5个Agent同时 | ~950MB | ✅ 可行 |
| 全部6个Agent | ~1000MB | ⚠️ 接近上限 |

**安全边界：** 1870MB物理内存 + 2047MB Swap

---

### 稳定性评估

- **崩溃概率（日常使用）**：< 1%
- **稳定性评级**：B+ (85分)
- **响应速度评级**：A- (90分)

---

### 风险应对策略

1. **内存安全配置**：maxConcurrent: 3
2. **监控告警**：OPS每6小时检查，>80%警告，>90%紧急重启
3. **降级策略**：内存紧张时只保留猫王Agent
4. **定期维护**：每天凌晨4点重启Gateway

---

### 项目工作流程

```
Phase 1: 需求接收 (猫王)
    ↓
Phase 2: 精密计划 (Research)
    ↓
Phase 3: 并行开发 (Coding + Design + Research)
    ↓
Phase 4: 多层审查 (Coding代码审查 + Design设计审查 + Research项目审查)
    ↓
Phase 5: 交付部署 (猫王汇报)
    ↓
Phase 6: 持续进化 (Evolution + OPS后台运行)
```

---

### 配置示例

```json5
{
  agents: {
    list: [
      {
        id: "main",
        name: "猫王",
        workspace: "~/.openclaw/workspace",
        model: "dashscope-coding/glm-5",
        default: true,
      },
      {
        id: "coding",
        name: "CODING",
        workspace: "~/.openclaw/workspace-coding",
        model: "dashscope/qwen3-max-2026-01-23",
      },
      {
        id: "research",
        name: "RESEARCH",
        workspace: "~/.openclaw/workspace-research",
        model: "dashscope/qwen3.5-plus",
      },
      {
        id: "ops",
        name: "OPS",
        workspace: "~/.openclaw/workspace-ops",
        model: "dashscope-coding/glm-5",
      },
      {
        id: "design",
        name: "DESIGN",
        workspace: "~/.openclaw/workspace-design",
        model: "dashscope-us/qwen3-vl-plus",
      },
      {
        id: "evolution",
        name: "EVOLUTION",
        workspace: "~/.openclaw/workspace-evolution",
        model: "dashscope-coding/glm-5",
      },
    ],
  },
  
  bindings: [
    { agentId: "main", match: { channel: "feishu", peer: { kind: "direct" } } },
    // 其他绑定按需配置
  ],
}
```

---

*方案定稿时间: 2026-03-09 17:08*