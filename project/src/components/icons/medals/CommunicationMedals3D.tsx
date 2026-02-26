import React from 'react'

export const CommunicationInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comInitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF69B4" stopOpacity="1" />
        <stop offset="100%" stopColor="#FF1493" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="comInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comInitShadow">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#FF1493" floodOpacity="0.5"/>
      </filter>
      <filter id="comInitGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#comInitGrad)" filter="url(#comInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comInitShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#FF1493" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Simples bolha de fala */}
    <g transform="translate(50, 50)" filter="url(#comInitGlow)">
      <rect x="-18" y="-14" width="36" height="24" rx="6" fill="#FFFFFF" opacity="0.95" />
      <path d="M -10 12 L -7 16 L -4 12" fill="#FFFFFF" />
      <line x1="-14" y1="-8" x2="12" y2="-8" stroke="#FF1493" strokeWidth="2" opacity="0.7" />
      <line x1="-14" y1="-2" x2="12" y2="-2" stroke="#FF1493" strokeWidth="1.5" opacity="0.5" />
    </g>
  </svg>
)

export const CommunicationPractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comPratGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF69B4" stopOpacity="1" />
        <stop offset="50%" stopColor="#FF1493" stopOpacity="1" />
        <stop offset="100%" stopColor="#8855FF" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="comPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#FF1493" floodOpacity="0.6"/>
      </filter>
      <filter id="comPratGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#comPratGrad)" filter="url(#comPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comPratShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#FF1493" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Duas pessoas com bolhas */}
    <g transform="translate(50, 50)" filter="url(#comPratGlow)">
      {/* Pessoa esquerda */}
      <circle cx="-10" cy="-8" r="5" fill="#FFFFFF" opacity="0.97" />
      <rect x="-14" y="0" width="8" height="12" fill="#FFFFFF" opacity="0.95" rx="1.5" />

      {/* Pessoa direita */}
      <circle cx="10" cy="-8" r="5" fill="#FFFFFF" opacity="0.97" />
      <rect x="6" y="0" width="8" height="12" fill="#FFFFFF" opacity="0.95" rx="1.5" />

      {/* Bolha esquerda */}
      <rect x="-18" y="-13" width="14" height="9" rx="3" fill="#8855FF" opacity="0.6" />

      {/* Bolha direita */}
      <rect x="4" y="-13" width="14" height="9" rx="3" fill="#8855FF" opacity="0.6" />

      {/* Linha de conexão */}
      <line x1="-6" y1="12" x2="6" y2="12" stroke="#FF69B4" strokeWidth="1.5" opacity="0.5" />
    </g>
  </svg>
)

export const CommunicationMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comMastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF69B4" stopOpacity="1" />
        <stop offset="33%" stopColor="#FF1493" stopOpacity="1" />
        <stop offset="66%" stopColor="#8855FF" stopOpacity="1" />
        <stop offset="100%" stopColor="#0099FF" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="comMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#8855FF" floodOpacity="0.7"/>
      </filter>
      <filter id="comMastGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#comMastGrad)" filter="url(#comMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comMastShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#8855FF" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="49" fill="none" stroke="#FF1493" strokeWidth="0.5" opacity="0.4" />

    {/* Conteúdo: Megafone com ondas de som */}
    <g transform="translate(50, 50)" filter="url(#comMastGlow)">
      {/* Megafone */}
      <path d="M -14 -5 L -14 5 L -4 10 L -4 -10 Z" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-14" cy="0" r="3.5" fill="#FFFFFF" opacity="0.97" />

      {/* Ondas sonoras */}
      <circle cx="3" cy="0" r="7" fill="none" stroke="#FF1493" strokeWidth="1.5" opacity="0.7" />
      <circle cx="3" cy="0" r="11" fill="none" stroke="#FF1493" strokeWidth="1" opacity="0.5" />
      <circle cx="3" cy="0" r="15" fill="none" stroke="#0099FF" strokeWidth="0.8" opacity="0.3" />

      {/* Detalhe brilhante */}
      <circle cx="-15" cy="-3" r="1.5" fill="#FFFFFF" opacity="0.6" />
      <circle cx="4" cy="-6" r="1.2" fill="#FF1493" opacity="0.5" />
    </g>
  </svg>
)

export const CommunicationSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comSuprGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF69B4" stopOpacity="1" />
        <stop offset="16%" stopColor="#FF1493" stopOpacity="1" />
        <stop offset="32%" stopColor="#8855FF" stopOpacity="1" />
        <stop offset="48%" stopColor="#0099FF" stopOpacity="1" />
        <stop offset="64%" stopColor="#00FFFF" stopOpacity="1" />
        <stop offset="80%" stopColor="#00FFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="comSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comSuprGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="comSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#FFD700" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#FF1493" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#comSuprGrad)" filter="url(#comSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comSuprShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Globo com sinais de comunicação */}
    <g transform="translate(50, 50)" filter="url(#comSuprGlow)">
      {/* Globo */}
      <circle cx="0" cy="0" r="14" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="0" r="14" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.6" />

      {/* Linhas de latitude */}
      <ellipse cx="0" cy="0" rx="14" ry="5" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.4" />
      <path d="M -14 0 Q -9 -4 0 -4 Q 9 -4 14 0" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.4" />

      {/* Sinais conectados (linhas) */}
      <line x1="-10" y1="-8" x2="-18" y2="-16" stroke="#FFD700" strokeWidth="2" opacity="0.7" />
      <line x1="10" y1="-8" x2="18" y2="-16" stroke="#FFD700" strokeWidth="2" opacity="0.7" />
      <line x1="-10" y1="8" x2="-18" y2="16" stroke="#FFD700" strokeWidth="2" opacity="0.7" />
      <line x1="10" y1="8" x2="18" y2="16" stroke="#FFD700" strokeWidth="2" opacity="0.7" />

      {/* Pontos de sinal */}
      <circle cx="-18" cy="-16" r="2.5" fill="#FFD700" opacity="0.8" />
      <circle cx="18" cy="-16" r="2.5" fill="#FFD700" opacity="0.8" />
      <circle cx="-18" cy="16" r="2.5" fill="#FFD700" opacity="0.8" />
      <circle cx="18" cy="16" r="2.5" fill="#FFD700" opacity="0.8" />

      {/* Partículas */}
      <circle cx="-22" cy="0" r="1.5" fill="#FFD700" opacity="0.7" />
      <circle cx="22" cy="0" r="1.5" fill="#00FFFF" opacity="0.6" />
      <circle cx="0" cy="-22" r="1.2" fill="#FF1493" opacity="0.5" />
    </g>
  </svg>
)
