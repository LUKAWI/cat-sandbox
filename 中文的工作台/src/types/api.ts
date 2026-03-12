// API 请求/响应类型定义

export interface ChatRequest {
  message: string
  session_id?: string
  agent_id?: string
}

export interface ChatResponse {
  reply: string
  sessionId: string
  agentId: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface Session {
  id: string
  title: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  agentId: string
}

export interface SessionsResponse {
  sessions: Session[]
}

export interface AgentStatus {
  agentId: string
  status: 'online' | 'busy' | 'offline'
  load?: 'low' | 'medium' | 'high'
}

export interface ApiError {
  error: string
  message?: string
}

export interface HealthResponse {
  status: string
  service: string
  version: string
  timestamp: string
}
