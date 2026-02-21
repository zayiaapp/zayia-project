import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Bell } from 'lucide-react'
import { getGreeting } from '../../lib/utils'

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { profile } = useAuth()
  const greeting = getGreeting()

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-zayia-lilac/30 sticky top-0 z-30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu Hambúrguer */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-zayia-lilac/20 rounded-xl transition-colors touch-manipulation"
            aria-label="Abrir menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
              <div className="w-5 h-0.5 bg-zayia-deep-violet rounded-full"></div>
              <div className="w-5 h-0.5 bg-zayia-deep-violet rounded-full"></div>
              <div className="w-5 h-0.5 bg-zayia-deep-violet rounded-full"></div>
            </div>
          </button>
          
          {/* Logo e Saudação */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-zayia-sunset rounded-xl rotate-45 animate-pulse-slow"></div>
              <div className="absolute inset-1 bg-white rounded-lg rotate-45"></div>
              <div className="absolute inset-2 bg-zayia-glow rounded-md rotate-45 animate-float"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-xs rotate-45 z-10">Z</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-zayia-deep-violet">
                {greeting}
              </p>
              <p className="text-xs text-zayia-deep-violet/70">
                {profile?.full_name?.split(' ')[0] || 'Usuária'}
              </p>
            </div>
          </div>

          {/* Notificações */}
          <div className="flex items-center">
            <button className="relative p-2 hover:bg-zayia-lilac/20 rounded-xl transition-colors touch-manipulation">
              <Bell className="w-5 h-5 text-zayia-deep-violet" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}