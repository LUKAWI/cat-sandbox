import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { memo } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CodeComponentProps {
  node?: unknown
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export const MarkdownRenderer = memo(({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={`markdown prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }: CodeComponentProps) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  background: '#1e1e1e',
                  border: '1px solid #3c3c3c',
                  borderRadius: '6px',
                  padding: '16px',
                  fontSize: '12px',
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
                  lineHeight: '1.6',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code 
                className={cn(className, 'bg-[#252526] px-1.5 py-0.5 rounded text-xs font-mono text-[#ce9178]')}
                {...props}
              >
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'
