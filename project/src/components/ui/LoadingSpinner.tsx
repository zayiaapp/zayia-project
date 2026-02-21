import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-2 border-zayia-lilac"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-zayia-deep-violet animate-spin"></div>
      </div>
    </div>
  )
}

export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-zayia-soft-purple rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-zayia-lavender rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-zayia-lilac rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  )
}