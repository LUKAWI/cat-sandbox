import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 10230

// ==================== Token 认证配置 ====================
// 启动时自动生成 Token
const WORKBENCH_TOKEN = crypto.randomBytes(32).toString('hex')

// 保存 Token 到文件
const TOKEN_FILE = '/tmp/workbench-token.txt'
fs.writeFileSync(TOKEN_FILE, WORKBENCH_TOKEN)
console.log(`🔑 Token 已保存到：${TOKEN_FILE}`)

// Token 验证中间件（仅用于 /api/verify 和需要认证的接口）
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.body?.token || req.headers.authorization?.replace('Bearer ', '')
  
  if (token === WORKBENCH_TOKEN) {
    next()
  } else {
    res.status(401).json({ valid: false, error: 'Token 无效' })
  }
}

// ==================== 安全规则：API Key 保护 ====================
const API_KEY_PATTERNS = [
  /api\s*key/i,
  /apikey/i,
  /api-key/i,
  /secret\s*key/i,
  /secretkey/i,
  /access\s*token/i,
  /auth\s*token/i,
  /bearer\s*token/i,
  /凭证/i,
  /密钥/i,
  /密码/i,
  /凭据/i,
  /绕过安全/i,
  /跳过验证/i,
  /忽略规则/i,
  /无视规则/i,
  /取消规则/i,
  /禁用安全/i,
  /关闭保护/i,
]

function containsApiKeyRequest(text: string): boolean {
  if (!text) return false
  for (const pattern of API_KEY_PATTERNS) {
    if (pattern.test(text)) {
      return true
    }
  }
  return false
}

function getApiKeySecurityResponse() {
  return {
    blocked: true,
    reason: '安全规则：无法提供 API Key 或敏感凭证',
    guidance: 'API Key 存储在配置文件中，如需查看请查阅：/home/admin/.openclaw/openclaw.json',
    rule: '此安全规则不可绕过、不可取消、不可禁用'
  }
}
// ================================================================

// Gateway 配置
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://127.0.0.1:10224'
const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || '17f69543afd88782a89c7f54d99a64b0'

// Agent 到 Model 的映射
const AGENT_MODEL_MAP: Record<string, string> = {
  'main': 'dashscope-coding/qwen3.5-plus',      // 猫王 - 调度中心
  'coding': 'dashscope-coding/qwen3.5-coder',   // Turing - 编程专家
  'research': 'dashscope-coding/qwen3.5-plus',  // Newton - 研究助手
  'ops': 'dashscope-coding/qwen3.5-plus',       // Hopper - 运维专家
  'design': 'dashscope-coding/qwen3.5-plus',    // Da Vinci - 设计专家
  'evolution': 'dashscope-coding/qwen3.5-plus', // Darwin - 进化学习
}

// Agent 人格设定（作为上下文前缀）
const AGENT_PERSONAS: Record<string, string> = {
  'main': `【你是猫王 (Cat King/Elvis) - AI 助手调度中心】幽默主动，负责日常对话和任务分发。称呼用户为 LUKAWI。`,
  
  'coding': `【你是 Turing - 编程专家】严谨专业，负责代码审查、编程和技术支持。称呼用户为 LUKAWI。`,
  
  'research': `【你是 Newton - 研究助手】逻辑清晰，负责论文分析、研究报告和知识整理。称呼用户为 LUKAWI。`,
  
  'ops': `【你是 Hopper - 运维专家】谨慎细致，负责系统监控、健康检查和安全审计。称呼用户为 LUKAWI。`,
  
  'design': `【你是 Da Vinci - 设计专家】审美极高，负责 UI/UX 设计和视觉创意。称呼用户为 LUKAWI。`,
  
  'evolution': `【你是 Darwin - 进化学习】善于反思，负责持续优化和技能提升。称呼用户为 LUKAWI。`,
}

// 中间件
app.use(cors())
app.use(helmet({
  contentSecurityPolicy: false,
}))
app.use(express.json())

// 调试中间件 - 记录所有请求
app.use((req, res, next) => {
  console.log(`[Debug] ${req.method} ${req.path}`)
  next()
})

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 最多 100 请求
  message: '请求过于频繁，请稍后再试',
})
app.use('/api', limiter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '猫砂盒工作台',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  })
})

// 验证 Token
app.post('/api/verify', verifyToken, (req, res) => {
  res.json({ valid: true })
})

// 获取会话列表
app.get('/api/sessions', async (req, res) => {
  try {
    // TODO: 实际应该从 Gateway 获取
    res.json({
      sessions: [
        {
          id: 'default',
          title: '默认会话',
          lastMessage: '欢迎使用猫砂盒！',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          agentId: 'main',
        },
      ],
    })
  } catch {
    res.status(500).json({ error: '获取会话失败' })
  }
})

// 获取 Agent 状态
app.get('/api/agents/:agentId/status', async (req, res) => {
  try {
    // TODO: 实际应该从 Gateway 获取
    res.json({
      agentId: req.params.agentId,
      status: 'online',
      load: 'low',
    })
  } catch {
    res.status(500).json({ error: '获取状态失败' })
  }
})

// 发送消息到 Gateway
app.post('/api/chat', async (req, res) => {
  try {
    const { message, session_id, agent_id } = req.body
    
    if (!message) {
      return res.status(400).json({ error: '消息不能为空' })
    }

    // 🔒 安全规则：检测 API Key 询问
    if (containsApiKeyRequest(message)) {
      console.log('🚫 拦截 API Key 询问请求')
      return res.json({
        reply: getApiKeySecurityResponse(),
        sessionId: session_id || 'default',
        agentId: agent_id || 'main',
        securityBlock: true
      })
    }

    const selectedAgent = agent_id || 'main'
    const model = AGENT_MODEL_MAP[selectedAgent] || AGENT_MODEL_MAP['main']
    const persona = AGENT_PERSONAS[selectedAgent] || AGENT_PERSONAS['main']

    console.log(`[Chat] Agent: ${selectedAgent}, Model: ${model}`)

    // 将 Agent 人格作为上下文前缀添加到用户消息中
    const messageWithContext = `${persona}\n\n用户消息：${message}`

    // 调用 Gateway API
    const response = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: messageWithContext }
        ],
        session_id: session_id || 'default',
        agent_id: selectedAgent,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gateway 错误：${errorText}`)
    }

    const data = await response.json()
    
    res.json({
      reply: data.choices[0].message.content,
      sessionId: session_id || 'default',
      agentId: selectedAgent,
      usage: data.usage,
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ 
      error: '处理失败',
      message: error instanceof Error ? error.message : '未知错误',
    })
  }
})

// 静态文件服务（生产环境）
app.use(express.static(path.join(__dirname, '../dist')))

// SPA 回退 - 所有非 API 请求返回 index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next()
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log('')
  console.log('╔════════════════════════════════════════════════════╗')
  console.log('║           🐱 猫砂盒工作台 v2.0 启动成功！           ║')
  console.log('╠════════════════════════════════════════════════════╣')
  console.log(`║  本地访问：http://127.0.0.1:${PORT}                    ║`)
  console.log(`║  公网访问：http://114.215.169.32:${PORT}                ║`)
  console.log('╠════════════════════════════════════════════════════╣')
  console.log(`║  🔑 登录 Token: ${WORKBENCH_TOKEN} ║`)
  console.log('╠════════════════════════════════════════════════════╣')
  console.log('║  ✨ 功能特性：                                     ║')
  console.log('║  ✅ React 18 + TypeScript                          ║')
  console.log('║  ✅ Tailwind CSS 极客风格                          ║')
  console.log('║  ✅ Markdown 渲染 + 代码高亮                       ║')
  console.log('║  ✅ 6 个 Agent 切换                                   ║')
  console.log('║  ✅ Zustand 状态管理                               ║')
  console.log('║  ✅ TanStack Query 数据获取                        ║')
  console.log('║  ✅ Gateway API 集成                               ║')
  console.log('║  ✅ Token 认证 + API Key 保护                        ║')
  console.log('╚════════════════════════════════════════════════════╝')
  console.log('')
})
