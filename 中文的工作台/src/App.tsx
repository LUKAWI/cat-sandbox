import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useChatStore } from '@/stores/chatStore'
import { useSendMessage } from '@/hooks/useChat'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { LoginModal } from '@/components/LoginModal'

// Agent 类型定义
interface Agent {
  id: string
  name: string
  emoji: string
  color: string
  status: 'online' | 'busy' | 'offline'
  description: string
  motto: string
}

// Agent 列表
const agents: Agent[] = [
  { 
    id: 'main', 
    name: '猫王', 
    emoji: '🐱', 
    color: '#6366f1', 
    status: 'online',
    description: '调度中心 · 日常对话 · 任务分发',
    motto: '快速响应，精准调度，让专业的人做专业的事'
  },
  { 
    id: 'coding', 
    name: 'Turing', 
    emoji: '💻', 
    color: '#10b981', 
    status: 'online',
    description: '编程专家 · 代码审查 · 技术支持',
    motto: '代码即艺术，严谨铸就完美'
  },
  { 
    id: 'research', 
    name: 'Newton', 
    emoji: '📚', 
    color: '#3b82f6', 
    status: 'online',
    description: '研究助手 · 论文分析 · 报告生成',
    motto: '站在巨人的肩膀上，探索知识的边界'
  },
  { 
    id: 'ops', 
    name: 'Hopper', 
    emoji: '🔧', 
    color: '#f59e0b', 
    status: 'online',
    description: '运维专家 · 系统监控 · 健康检查',
    motto: '细节决定成败，稳定压倒一切'
  },
  { 
    id: 'design', 
    name: 'Da Vinci', 
    emoji: '🎨', 
    color: '#ec4899', 
    status: 'online',
    description: '设计专家 · UI/UX · 视觉设计',
    motto: '简约而不简单，美是功能的升华'
  },
  { 
    id: 'evolution', 
    name: 'Darwin', 
    emoji: '🧬', 
    color: '#8b5cf6', 
    status: 'online',
    description: '进化学习 · 持续优化 · 技能提升',
    motto: '适者生存，持续进化，永不止步'
  },
]

// 动画变体 - 优化性能
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  }
}

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.98,
    transition: { duration: 0.15 }
  }
}

const sidebarItemVariants: Variants = {
  hover: {
    x: 4,
    backgroundColor: 'rgba(0, 122, 204, 0.08)',
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

const headerVariants: Variants = {
  hidden: { y: -10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

const inputVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1
    }
  }
}

function App() {
  const { 
    addMessage, 
    currentAgentId, 
    setCurrentAgent,
    isLoading,
    setLoading,
    error,
    setError,
    getMessages,
  } = useChatStore()
  
  const [input, setInput] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const sendMutation = useSendMessage()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentAgent = agents.find(a => a.id === currentAgentId) || agents[0]
  
  // 获取当前 Agent 的消息列表
  const messages = getMessages()

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    console.log('🔴 [SEND] ============ 发送开始 ============')
    console.log('🔴 [SEND] input:', JSON.stringify(input))
    console.log('🔴 [SEND] isLoading:', isLoading)
    console.log('🔴 [SEND] currentAgentId:', currentAgentId)
    
    if (!input.trim() || isLoading) {
      console.log('🔴 [SEND] ❌ 阻止：input 为空或正在 loading')
      return
    }

    console.log('🔴 [SEND] ✅ 通过检查，创建用户消息...')
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
      agentId: currentAgentId,
    }

    console.log('🔴 [SEND] 添加到消息列表...')
    console.log('🔴 [SEND] userMessage:', userMessage)
    addMessage(userMessage)
    
    const userInput = input
    console.log('🔴 [SEND] 清空输入前 userInput:', userInput)
    setInput('')
    setLoading(true)
    console.log('🔴 [SEND] ✅ 已清空输入，设置 loading=true')

    try {
      console.log('🔴 [SEND] 📡 开始调用 API...')
      console.log('🔴 [SEND] 参数:', { 
        message: userInput, 
        session_id: 'default', 
        agent_id: currentAgentId 
      })
      
      const response = await sendMutation.mutateAsync({
        message: userInput,
        session_id: 'default',
        agent_id: currentAgentId,
      })

      console.log('🔴 [SEND] ✅ API 响应:', response)
      
      const aiMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: response.reply,
        timestamp: new Date(),
        agentId: currentAgentId,
      }
      console.log('🔴 [SEND] 添加 AI 消息:', aiMessage)
      addMessage(aiMessage)
      setLoading(false)
      console.log('🔴 [SEND] 🎉 完成！')
    } catch (err) {
      console.error('🔴 [SEND] ❌ 错误:', err)
      console.error('🔴 [SEND] 错误堆栈:', err instanceof Error ? err.stack : 'N/A')
      setError(err instanceof Error ? err.message : '发送失败')
      setLoading(false)
    }
    console.log('🔴 [SEND] ============ 发送结束 ============')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // 未认证时显示登录模态框
  if (!isAuthenticated) {
    return <LoginModal onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      {/* 侧边栏 - Agent 列表 */}
      <motion.aside 
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-72 border-r border-[var(--border)] bg-[var(--sidebar)] flex flex-col border-highlight"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] metallic-gradient border-highlight">
          <motion.h1 
            className="text-lg font-semibold flex items-center gap-2 text-[#d4d4d4]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-xl drop-shadow-lg">🐱</span>
            <span className="tracking-wide">猫砂盒</span>
          </motion.h1>
          <p className="text-xs text-[#808080] mt-1.5 font-mono tracking-wider opacity-80">
            AI WORKBENCH v2.0
          </p>
        </div>
        
        {/* Agent 列表 */}
        <motion.div 
          className="flex-1 overflow-y-auto p-2 space-y-0.5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {agents.map((agent, index) => (
            <motion.button
              key={agent.id}
              onClick={() => setCurrentAgent(agent.id)}
              variants={sidebarItemVariants}
              whileHover="hover"
              whileTap="tap"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left sidebar-item group border ${
                currentAgentId === agent.id
                  ? 'bg-[var(--activityBar)] border-[var(--accent)]/50 active'
                  : 'border-transparent hover:border-[var(--accent)]/30'
              }`}
              aria-pressed={currentAgentId === agent.id}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <Avatar 
                fallback={agent.emoji} 
                size="md" 
                status={agent.status} 
                showStatus 
                className="shrink-0 transition-transform group-hover:scale-105"
              />
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate text-sm transition-colors ${
                  currentAgentId === agent.id ? 'text-[#d4d4d4]' : 'text-[#cccccc]'
                }`}>
                  {agent.name}
                </div>
                <div className={`text-xs truncate font-mono transition-colors ${
                  currentAgentId === agent.id 
                    ? 'text-[#007acc] opacity-100' 
                    : 'text-[#808080]'
                }`}>
                  {agent.description}
                </div>
              </div>
              {currentAgentId === agent.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-2 h-2 rounded-full bg-[#007acc] shadow-lg"
                  style={{
                    boxShadow: '0 0 8px rgba(0, 122, 204, 0.6)'
                  }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* 底部状态栏 */}
        <div className="p-3 border-t border-[var(--border)] text-xs font-mono bg-[var(--bg)] border-highlight">
          <div className="flex items-center justify-between text-[#808080]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ec9b0] animate-pulse shadow-lg" style={{
                boxShadow: '0 0 8px rgba(78, 201, 176, 0.5)'
              }} />
              <span className="tracking-wide">ALL AGENTS ONLINE</span>
            </span>
            <span className="opacity-60">v2.0.0</span>
          </div>
        </div>
      </motion.aside>

      {/* 主聊天区域 */}
      <main className="flex-1 flex flex-col bg-[#1e1e1e]">
        {/* 顶部 Header */}
        <motion.header 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="h-16 border-b border-[var(--border)] flex items-center px-6 gap-4 bg-[var(--sidebar)] metallic-gradient border-highlight"
        >
          <Avatar 
            fallback={currentAgent.emoji} 
            size="lg" 
            status={currentAgent.status} 
            showStatus 
            className="shadow-lg"
          />
          <div className="flex-1">
            <div className="font-semibold text-[#d4d4d4] text-base tracking-wide">
              {currentAgent.name}
            </div>
            <div className="text-xs text-[#808080] font-mono opacity-80 tracking-wide">
              {currentAgent.description}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-md border ${
              currentAgent.status === 'online' 
                ? 'bg-[#4ec9b0]/10 text-[#4ec9b0] border-[#4ec9b0]/30' 
                : currentAgent.status === 'busy'
                ? 'bg-[#dcdcaa]/10 text-[#dcdcaa] border-[#dcdcaa]/30'
                : 'bg-[#808080]/10 text-[#808080] border-[#808080]/30'
            }`}>
              {currentAgent.status === 'online' ? '● ONLINE' :
               currentAgent.status === 'busy' ? '● BUSY' : '○ OFFLINE'}
            </span>
          </div>
        </motion.header>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center">
                <motion.div 
                  className="text-6xl mb-6 opacity-50"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {currentAgent.emoji}
                </motion.div>
                <p className="text-sm text-[#808080] font-mono tracking-wider">
                  READY TO CHAT WITH {currentAgent.name.toUpperCase()}
                </p>
                <p className="text-xs text-[#666] mt-3 font-mono opacity-70 max-w-md mx-auto leading-relaxed">
                  {currentAgent.motto}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar
                      fallback={
                        message.role === 'user' ? '🧑' :
                        agents.find(a => a.id === message.agentId)?.emoji || '🐱'
                      }
                      size="lg"
                      status={message.role === 'assistant' ? 'online' : undefined}
                      showStatus={message.role === 'assistant'}
                      className={`shadow-md transition-transform hover:scale-105 ${
                        message.role === 'assistant' ? 'message-assistant' : 'message-user'
                      }`}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`max-w-[70%] rounded-lg p-4 border message-bubble ${
                        message.role === 'user'
                          ? 'message-bubble-user'
                          : 'message-bubble-assistant'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                      )}
                      <div className={`text-xs mt-2.5 font-mono flex items-center gap-2 ${
                        message.role === 'user' 
                          ? 'text-[#808080]' 
                          : 'text-[#666]'
                      }`}>
                        <span>{new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4"
                >
                  <Avatar fallback="🐱" size="lg" className="shadow-md" />
                  <div className="bg-[var(--sidebar)] border border-[var(--border)] rounded-lg p-4 message-bubble message-bubble-assistant">
                    <div className="flex gap-1.5">
                      <motion.span 
                        className="w-2 h-2 bg-[#007acc] rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0, ease: 'easeInOut' }}
                        style={{ boxShadow: '0 0 8px rgba(0, 122, 204, 0.6)' }}
                      />
                      <motion.span 
                        className="w-2 h-2 bg-[#007acc] rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2, ease: 'easeInOut' }}
                        style={{ boxShadow: '0 0 8px rgba(0, 122, 204, 0.6)' }}
                      />
                      <motion.span 
                        className="w-2 h-2 bg-[#007acc] rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4, ease: 'easeInOut' }}
                        style={{ boxShadow: '0 0 8px rgba(0, 122, 204, 0.6)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4"
                >
                  <Avatar fallback="⚠️" size="lg" />
                  <div className="bg-[#f44336]/10 border border-[#f44336]/30 text-[#f44336] rounded-lg p-4 font-mono text-sm shadow-lg">
                    ERROR: {error}
                  </div>
                </motion.div>
              )}
              
              {/* 滚动锚点 */}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </div>

        {/* 输入区域 */}
        <motion.div 
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          className="border-t border-[var(--border)] p-4 bg-[var(--sidebar)] border-highlight"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  const newValue = e.target.value
                  console.log('🟢 [INPUT] onChange:', JSON.stringify(newValue))
                  setInput(newValue)
                }}
                onKeyDown={(e) => {
                  console.log('🟢 [INPUT] onKeyDown:', e.key)
                  handleKeyDown(e)
                }}
                placeholder={currentAgent.motto}
                aria-label="消息输入框"
                aria-describedby="input-hint"
                className="flex-1 resize-none bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono force-white-text focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all inner-shadow input-focus-glow"
                rows={3}
                disabled={isLoading}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('🔵 [BUTTON] ============ 点击事件触发 ============')
                  console.log('🔵 [BUTTON] input:', JSON.stringify(input))
                  console.log('🔵 [BUTTON] input.trim():', input.trim())
                  console.log('🔵 [BUTTON] isLoading:', isLoading)
                  console.log('🔵 [BUTTON] disabled 条件:', !input.trim() || isLoading)
                  sendMessage()
                }}
                disabled={!input.trim() || isLoading}
                size="lg"
                className="px-8 bg-[#007acc] hover:bg-[#0098e6] disabled:bg-[#3c3c3c] disabled:text-[#666] disabled:cursor-not-allowed text-white font-mono text-sm border border-[#005a9e] shadow-lg btn-industrial tracking-wide transition-all duration-150"
                style={{
                  boxShadow: isLoading ? 'none' : '0 2px 8px rgba(0, 122, 204, 0.3)',
                  cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                  transform: 'none',
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full loading-pulse" />
                    SENDING...
                  </span>
                ) : (
                  'SEND'
                )}
              </Button>
            </div>
            <div className="mt-2 text-xs text-[#666] font-mono flex items-center gap-4 opacity-80">
              <span id="input-hint" className="sr-only">按 Enter 发送消息，Shift+Enter 换行</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#007acc]">⌨️</span> ENTER: SEND
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#007acc]">⇧</span>+ENTER: NEW LINE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#007acc]">📝</span> MARKDOWN SUPPORTED
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default App
