import { useState, useEffect } from 'react'

interface LoginModalProps {
  onLogin: (token: string) => void
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 尝试从 localStorage 加载已保存的 Token
  useEffect(() => {
    const savedToken = localStorage.getItem('workbench_token')
    if (savedToken) {
      verifyToken(savedToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyToken = async (tokenToVerify: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToVerify }),
      })

      const data = await response.json()

      if (data.valid) {
        localStorage.setItem('workbench_token', tokenToVerify)
        onLogin(tokenToVerify)
      } else {
        setError('Token 无效，请重试')
      }
    } catch (err) {
      setError('验证失败：' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) {
      setError('请输入 Token')
      return
    }
    verifyToken(token)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">🔐 访问验证</h2>
          <p className="text-muted-foreground">请输入工作台 Token 以继续访问</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="输入 Token..."
              className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '验证中...' : '验证'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-xl">
          <p className="text-xs text-muted-foreground text-center">
            🔑 Token 由管理员提供，请妥善保管
          </p>
        </div>
      </div>
    </div>
  )
}
