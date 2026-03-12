import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007acc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1e1e]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          'btn-industrial border-highlight',
          {
            // Default - VS Code blue
            'bg-[#007acc] text-white hover:bg-[#0098e6] border border-[#005a9e] shadow-md hover:shadow-lg': variant === 'default',
            // Secondary - dark gray
            'bg-[#252526] text-[#d4d4d4] hover:bg-[#2a2d2e] border border-[#3c3c3c] shadow-sm hover:shadow-md': variant === 'secondary',
            // Outline - subtle border
            'border border-[#3c3c3c] bg-transparent hover:bg-[#252526] text-[#d4d4d4] shadow-sm': variant === 'outline',
            // Ghost - minimal
            'hover:bg-[#252526] text-[#d4d4d4]': variant === 'ghost',
          },
          {
            'h-9 px-3 text-xs font-mono': size === 'sm',
            'h-10 px-4 text-sm font-mono': size === 'md',
            'h-11 px-8 text-sm font-mono': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
        style={variant === 'default' ? {
          boxShadow: '0 2px 8px rgba(0, 122, 204, 0.3)'
        } : undefined}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
