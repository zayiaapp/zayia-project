import React from 'react'

export const OrganizationInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="org1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#0099FF" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="org1Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="org1Glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="org1Shadow">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00FFFF" floodOpacity="0.5"/>
      </filter>
    </defs>

    {/* Círculo base com sombra neon */}
    <circle cx="50" cy="50" r="45" fill="url(#org1Grad)" filter="url(#org1Shadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#org1Shine)" />

    {/* Aura leve */}
    <circle cx="50" cy="50" r="47" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Pasta simples */}
    <g transform="translate(50, 50)" filter="url(#org1Glow)">
      {/* Abas da pasta */}
      <path d="M -16 -14 L -8 -18 L -8 -14 L 16 -14 L 16 12 L -16 12 Z" fill="#FFFFFF" opacity="0.95" />

      {/* Linhas de documento */}
      <line x1="-12" y1="-6" x2="12" y2="-6" stroke="#00FFFF" strokeWidth="1.5" />
      <line x1="-12" y1="-1" x2="12" y2="-1" stroke="#00FFFF" strokeWidth="1" opacity="0.7" />
      <line x1="-12" y1="4" x2="12" y2="4" stroke="#00FFFF" strokeWidth="1" opacity="0.7" />
    </g>
  </svg>
)

export const OrganizationPractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="org2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
        <stop offset="50%" stopColor="#00DDFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#0077FF" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="org2Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="org2Glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="org2Shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00FFFF" floodOpacity="0.6"/>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#org2Grad)" filter="url(#org2Shadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#org2Shine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: 3 caixas empilhadas com perspectiva 3D */}
    <g transform="translate(50, 50)" filter="url(#org2Glow)">
      {/* Caixa 1 (inferior) */}
      <rect x="-14" y="0" width="28" height="10" fill="#FFFFFF" opacity="0.95" />
      <path d="M -14 0 L -18 -3 L 10 -3 L 14 0" fill="#00DDFF" opacity="0.6" />

      {/* Caixa 2 (meio) */}
      <rect x="-12" y="-12" width="24" height="10" fill="#FFFFFF" opacity="0.96" />
      <path d="M -12 -12 L -16 -15 L 8 -15 L 12 -12" fill="#00FFFF" opacity="0.7" />

      {/* Caixa 3 (superior) */}
      <rect x="-10" y="-22" width="20" height="8" fill="#FFFFFF" opacity="0.97" />
      <path d="M -10 -22 L -14 -25 L 6 -25 L 10 -22" fill="#00FFFF" opacity="0.8" />

      {/* Brilhos nas arestas */}
      <line x1="-10" y1="-24" x2="8" y2="-24" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
    </g>
  </svg>
)

export const OrganizationMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="org3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
        <stop offset="33%" stopColor="#0099FF" stopOpacity="1" />
        <stop offset="66%" stopColor="#8855FF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FF00FF" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="org3Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="org3Glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="org3Shadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8855FF" floodOpacity="0.7"/>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#org3Grad)" filter="url(#org3Shadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#org3Shine)" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FF00FF" strokeWidth="2" opacity="0.8" />

    {/* Conteúdo: Organizador com gavetas */}
    <g transform="translate(50, 50)" filter="url(#org3Glow)">
      {/* Estrutura do organizador */}
      <rect x="-16" y="-18" width="32" height="30" fill="#FFFFFF" opacity="0.96" rx="2" />

      {/* Gaveta 1 */}
      <rect x="-14" y="-15" width="28" height="7" fill="#E8F0FF" opacity="0.9" />
      <circle cx="12" cy="-11" r="1.5" fill="#FFD700" />

      {/* Gaveta 2 */}
      <rect x="-14" y="-6" width="28" height="7" fill="#E8F0FF" opacity="0.9" />
      <circle cx="12" cy="-2" r="1.5" fill="#FFD700" />

      {/* Gaveta 3 */}
      <rect x="-14" y="3" width="28" height="7" fill="#E8F0FF" opacity="0.9" />
      <circle cx="12" cy="7" r="1.5" fill="#FFD700" />

      {/* Maçanetas em destaque dourado */}
      <line x1="10" y1="-11" x2="14" y2="-11" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="-2" x2="14" y2="-2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="7" x2="14" y2="7" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />

      {/* Destaque de profundidade */}
      <path d="M -16 -18 L -14 -16" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
    </g>
  </svg>
)

export const OrganizationSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="org4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
        <stop offset="20%" stopColor="#00DDFF" stopOpacity="1" />
        <stop offset="40%" stopColor="#0099FF" stopOpacity="1" />
        <stop offset="60%" stopColor="#8855FF" stopOpacity="1" />
        <stop offset="80%" stopColor="#FF1493" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
      </linearGradient>
      <radialGradient id="org4Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="org4Glow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="org4Shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#FFD700" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FF1493" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#org4Grad)" filter="url(#org4Shadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#org4Shine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Sistema com engrenagens */}
    <g transform="translate(50, 50)" filter="url(#org4Glow)">
      {/* Estrutura central (pasta/sistema) */}
      <rect x="-14" y="-16" width="28" height="28" fill="#FFFFFF" opacity="0.97" rx="3" />

      {/* Gavetas do sistema */}
      <rect x="-12" y="-13" width="24" height="6" fill="#E8F0FF" opacity="0.92" />
      <circle cx="11" cy="-10" r="2" fill="#FFD700" />

      <rect x="-12" y="-5" width="24" height="6" fill="#E8F0FF" opacity="0.92" />
      <circle cx="11" cy="-2" r="2" fill="#FFD700" />

      <rect x="-12" y="3" width="24" height="6" fill="#E8F0FF" opacity="0.92" />
      <circle cx="11" cy="6" r="2" fill="#FFD700" />

      {/* Engrenagem central girando (sugestão de movimento) */}
      <g transform="translate(0, -20)">
        <circle cx="0" cy="0" r="5" fill="none" stroke="#FFD700" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3.5" fill="#FFD700" opacity="0.7" />
        {/* Dentes da engrenagem */}
        <rect x="-1" y="-6" width="2" height="2" fill="#FFD700" />
        <rect x="4" y="-2" width="2" height="2" fill="#FFD700" transform="rotate(45 5 -1)" />
        <rect x="1" y="5" width="2" height="2" fill="#FFD700" />
        <rect x="-6" y="2" width="2" height="2" fill="#FFD700" />
      </g>

      {/* Brilhos de destaque */}
      <line x1="-12" y1="-14" x2="12" y2="-14" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />

      {/* Partículas brilhando */}
      <circle cx="-18" cy="-10" r="1" fill="#FFD700" opacity="0.8" />
      <circle cx="18" cy="8" r="0.8" fill="#00FFFF" opacity="0.7" />
      <circle cx="-15" cy="15" r="0.7" fill="#FF1493" opacity="0.6" />
    </g>
  </svg>
)
