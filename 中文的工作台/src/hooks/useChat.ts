import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ChatRequest, ChatResponse, SessionsResponse, AgentStatus, ApiError } from '@/types/api'

const API_BASE = '/api'
const API_TIMEOUT = 30000 // 30 秒超时

/**
 * 带超时的 fetch 封装
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接')
    }
    throw error
  }
}

// 获取会话列表
export function useSessions() {
  return useQuery<SessionsResponse, ApiError>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await fetchWithTimeout(`${API_BASE}/sessions`, {})
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: '获取会话失败' }))
        throw new Error(error.error || '获取会话失败')
      }
      return response.json()
    },
    retry: 1,
  })
}

// 发送消息
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation<ChatResponse, ApiError, ChatRequest>({
    mutationFn: async ({ message, session_id, agent_id }) => {
      console.log('[API] 开始调用 /api/chat')
      console.log('[API] 参数:', { message, session_id, agent_id })
      
      const url = `${API_BASE}/chat`
      console.log('[API] URL:', url)
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: session_id || 'default',
          agent_id: agent_id || 'main',
        }),
      }
      console.log('[API] Options:', JSON.stringify(options, null, 2))
      
      const response = await fetchWithTimeout(url, options)
      console.log('[API] 响应状态:', response.status, response.ok)
      
      const data = await response.json()
      console.log('[API] 响应数据:', data)

      if (!response.ok) {
        console.error('[API] 错误:', data)
        const error = data.error || data.message || '发送失败'
        throw new Error(error)
      }

      return data
    },
    onSuccess: (data) => {
      console.log('[API] onSuccess 回调，data:', data)
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: (error) => {
      console.error('[API] onError 回调，error:', error)
    },
    retry: 1,
  })
}

// 获取 Agent 状态
export function useAgentStatus(agentId: string) {
  return useQuery<AgentStatus, ApiError>({
    queryKey: ['agent', agentId, 'status'],
    queryFn: async () => {
      const response = await fetchWithTimeout(`${API_BASE}/agents/${agentId}/status`, {})
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: '获取状态失败' }))
        throw new Error(error.error || '获取状态失败')
      }
      return response.json()
    },
    enabled: !!agentId,
    retry: 1,
  })
}
