import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Símbolo geométrico animado */}
        <div className="absolute inset-0 bg-zayia-sunset rounded-xl rotate-45 animate-pulse-slow"></div>
        <div className="absolute inset-2 bg-white rounded-lg rotate-45"></div>
        <div className="absolute inset-3 bg-zayia-glow rounded-md rotate-45 animate-float"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs rotate-45 z-10">Z</span>
        </div>
      </div>
      
      {showText && (
        <span className={`font-bold zayia-gradient-text ${textSizeClasses[size]} tracking-tight`}>
          ZAYIA
        </span>
      )}
    </div>
  )
}