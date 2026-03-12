import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agentId: string
}

interface Session {
  id: string
  title: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  agentId: string
}

interface ChatState {
  // 每个 Agent 独立的对话历史
  conversations: Record<string, Message[]>
  sessions: Session[]
  currentSessionId: string | null
  currentAgentId: string
  isLoading: boolean
  error: string | null
  
  // Actions
  addMessage: (message: Message) => void
  setMessages: (agentId: string, messages: Message[]) => void
  setCurrentSession: (sessionId: string | null) => void
  setCurrentAgent: (agentId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearMessages: (agentId?: string) => void
  getMessages: () => Message[]
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: {
    main: [],
    coding: [],
    research: [],
    ops: [],
    design: [],
    evolution: [],
  },
  sessions: [],
  currentSessionId: null,
  currentAgentId: 'main',
  isLoading: false,
  error: null,

  // 添加消息到当前 Agent 的对话
  addMessage: (message) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [message.agentId]: [...(state.conversations[message.agentId] || []), message],
      },
    })),

  // 设置指定 Agent 的消息列表
  setMessages: (agentId, messages) =>
    set((state) => ({
      conversations: {
        ...state.conversations,
        [agentId]: messages,
      },
    })),

  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

  setCurrentAgent: (agentId) => set({ currentAgentId: agentId }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // 清空指定 Agent 或所有 Agent 的消息
  clearMessages: (agentId) =>
    set((state) => {
      if (agentId) {
        return {
          conversations: {
            ...state.conversations,
            [agentId]: [],
          },
        }
      }
      return {
        conversations: {
          main: [],
          coding: [],
          research: [],
          ops: [],
          design: [],
          evolution: [],
        },
      }
    }),

  // 获取当前 Agent 的消息列表
  getMessages: () => {
    const state = get()
    return state.conversations[state.currentAgentId] || []
  },
}))
