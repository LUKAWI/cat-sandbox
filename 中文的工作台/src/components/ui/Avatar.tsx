import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback: string
  size?: 'sm' | 'md' | 'lg'
  status?: 'online' | 'busy' | 'offline'
  showStatus?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallback, size = 'md', status, showStatus = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-md border border-[#3c3c3c] shadow-md",
          "transition-all duration-200 hover:shadow-lg hover:border-[#007acc]/50",
          {
            "h-8 w-8": size === 'sm',
            "h-10 w-10": size === 'md',
            "h-12 w-12": size === 'lg',
          },
          className
        )}
        {...props}
      >
        {src ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={src}
            alt={fallback}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#252526] text-base">
            {fallback}
          </div>
        )}
        {showStatus && status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full border-2 border-[#1e1e1e] status-indicator",
              {
                "bg-[#4ec9b0]": status === 'online',
                "bg-[#dcdcaa]": status === 'busy',
                "bg-[#808080]": status === 'offline',
              }
            )}
            style={{
              boxShadow: status === 'online' 
                ? '0 0 8px rgba(78, 201, 176, 0.5)' 
                : status === 'busy'
                ? '0 0 8px rgba(220, 220, 170, 0.5)'
                : 'none'
            }}
            aria-label={`状态：${status === 'online' ? '在线' : status === 'busy' ? '忙碌' : '离线'}`}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
