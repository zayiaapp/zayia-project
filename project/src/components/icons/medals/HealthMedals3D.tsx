import React from 'react'

export const HealthInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthInitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hlthInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#BE185D" floodOpacity="0.5"/>
      </filter>
      <filter id="hlthInitGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#hlthInitGrad)" filter="url(#hlthInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthInitShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#BE185D" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Simples figura humana em pé */}
    <g transform="translate(50, 50)" filter="url(#hlthInitGlow)">
      {/* Cabeça */}
      <circle cx="0" cy="-8" r="4" fill="#FFFFFF" opacity="0.95" />

      {/* Corpo */}
      <rect x="-3" y="-2" width="6" height="8" rx="1" fill="#FFFFFF" opacity="0.94" />

      {/* Braços */}
      <line x1="-3" y1="0" x2="-8" y2="-1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="0" x2="8" y2="-1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Pernas */}
      <line x1="-1.5" y1="6" x2="-3" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="6" x2="3" y2="12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Coração no peito */}
      <path d="M -1.5 1 Q -2 -0.5 -2.5 0 Q -2.5 1 -1.5 2 L 0 3 L 1.5 2 Q 2.5 1 2.5 0 Q 2 -0.5 1.5 1 Z" fill="#BE185D" opacity="0.7" />
    </g>
  </svg>
)

export const HealthPractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthPratGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hlthPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#EC4899" floodOpacity="0.6"/>
      </filter>
      <filter id="hlthPratGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#hlthPratGrad)" filter="url(#hlthPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthPratShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Pessoa alongando/se exercitando */}
    <g transform="translate(50, 50)" filter="url(#hlthPratGlow)">
      {/* Cabeça */}
      <circle cx="-1" cy="-9" r="4" fill="#FFFFFF" opacity="0.97" />

      {/* Corpo */}
      <ellipse cx="0" cy="-1" rx="3" ry="4" fill="#FFFFFF" opacity="0.96" />

      {/* Braço esticado para cima */}
      <line x1="-1" y1="-5" x2="-5" y2="-13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="-5" cy="-13" r="1.2" fill="#FFFFFF" opacity="0.95" />

      {/* Outro braço */}
      <line x1="1" y1="-3" x2="7" y2="-5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Pernas em posição de exercício */}
      <line x1="-1" y1="3" x2="-4" y2="10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="3" x2="4" y2="10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Aura de energia */}
      <circle cx="0" cy="0" r="12" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.5" />

      {/* Coração ativo */}
      <path d="M 0 -1 Q -1.5 -3 -2.5 -1 Q -3 1 -1 2 L 0 3 L 1 2 Q 3 1 2.5 -1 Q 1.5 -3 0 -1 Z" fill="#BE185D" opacity="0.8" />
    </g>
  </svg>
)

export const HealthMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthMastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="33%" stopColor="#EC4899" />
        <stop offset="66%" stopColor="#BE185D" />
        <stop offset="100%" stopColor="#831843" />
      </linearGradient>
      <radialGradient id="hlthMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#BE185D" floodOpacity="0.7"/>
      </filter>
      <filter id="hlthMastGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#hlthMastGrad)" filter="url(#hlthMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthMastShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#BE185D" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="49" fill="none" stroke="#EC4899" strokeWidth="0.5" opacity="0.4" />

    {/* Conteúdo: Pessoa em movimento com fluxo de energia */}
    <g transform="translate(50, 50)" filter="url(#hlthMastGlow)">
      {/* Cabeça */}
      <circle cx="0" cy="-9" r="5" fill="#FFFFFF" opacity="0.98" />

      {/* Torso em movimento */}
      <path d="M -3 -2 Q -1 1 -2 6 L 2 6 Q 1 1 3 -2 Z" fill="#FFFFFF" opacity="0.97" />

      {/* Braço levantado (força) */}
      <line x1="-3" y1="-2" x2="-8" y2="-12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="-8" cy="-12" r="1.5" fill="#FFFFFF" opacity="0.96" />

      {/* Outro braço em movimento */}
      <line x1="3" y1="0" x2="9" y2="-2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Pernas em posição atlética */}
      <line x1="-1" y1="6" x2="-4" y2="13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="6" x2="5" y2="12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Coração grande e poderoso */}
      <path d="M -2 0 Q -3 -2 -4.5 -0.5 Q -5.5 1 -3 3 L 0 5.5 L 3 3 Q 5.5 1 4.5 -0.5 Q 3 -2 2 0 Z" fill="#BE185D" opacity="0.9" />

      {/* Aura de vitalidade (dupla) */}
      <circle cx="0" cy="0" r="13" fill="none" stroke="#EC4899" strokeWidth="1.2" opacity="0.6" />
      <circle cx="0" cy="0" r="16" fill="none" stroke="#F472B6" strokeWidth="0.8" opacity="0.4" />

      {/* Pulsos de energia */}
      <circle cx="-10" cy="-8" r="1" fill="#EC4899" opacity="0.6" />
      <circle cx="10" cy="-2" r="1" fill="#EC4899" opacity="0.6" />
    </g>
  </svg>
)

export const HealthSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthSuprGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBCFE8" />
        <stop offset="25%" stopColor="#F472B6" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="75%" stopColor="#BE185D" />
        <stop offset="100%" stopColor="#831843" />
      </linearGradient>
      <radialGradient id="hlthSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthSuprGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="hlthSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#BE185D" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#EC4899" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#F472B6" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#hlthSuprGrad)" filter="url(#hlthSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthSuprShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#EC4899" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Figura suprema em estado de plenitude com fluxo vital */}
    <g transform="translate(50, 50)" filter="url(#hlthSuprGlow)">
      {/* Cabeça suprema */}
      <circle cx="0" cy="-11" r="5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="-11" r="5" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.6" />

      {/* Aura da cabeça */}
      <circle cx="0" cy="-11" r="8" fill="none" stroke="#F472B6" strokeWidth="1" opacity="0.5" />

      {/* Corpo em equilíbrio e força */}
      <path d="M -4 -2 Q -3 1 -4 7 L 4 7 Q 3 1 4 -2 Z" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="0" r="5" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.5" />

      {/* Braços em posição de graça/plenitude */}
      <path d="M -4 -1 Q -9 -4 -12 0" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 4 -1 Q 9 -4 12 0" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Mãos abertas */}
      <circle cx="-12" cy="0" r="2" fill="#FFFFFF" opacity="0.97" />
      <circle cx="12" cy="0" r="2" fill="#FFFFFF" opacity="0.97" />

      {/* Pernas em posição estável */}
      <line x1="-2" y1="7" x2="-3" y2="14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="2" y1="7" x2="3" y2="14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Pés */}
      <circle cx="-3" cy="14.5" r="1.2" fill="#FFFFFF" opacity="0.96" />
      <circle cx="3" cy="14.5" r="1.2" fill="#FFFFFF" opacity="0.96" />

      {/* Coração supremo (grande e radiante) */}
      <path d="M -2.5 0 Q -4 -2 -5.5 -0.5 Q -6.5 1 -4 4 L 0 7 L 4 4 Q 6.5 1 5.5 -0.5 Q 4 -2 2.5 0 Z" fill="#BE185D" opacity="0.95" />
      <circle cx="0" cy="2.5" r="1.2" fill="#FFFFFF" opacity="0.6" />

      {/* Fluxos de energia vital ao redor (8 pontos) */}
      <circle cx="0" cy="-17" r="1.5" fill="#EC4899" opacity="0.8" />
      <circle cx="13" cy="-10" r="1.2" fill="#EC4899" opacity="0.7" />
      <circle cx="17" cy="0" r="1.5" fill="#F472B6" opacity="0.8" />
      <circle cx="13" cy="10" r="1.2" fill="#EC4899" opacity="0.7" />
      <circle cx="0" cy="17" r="1.5" fill="#EC4899" opacity="0.8" />
      <circle cx="-13" cy="10" r="1.2" fill="#F472B6" opacity="0.7" />
      <circle cx="-17" cy="0" r="1.5" fill="#EC4899" opacity="0.8" />
      <circle cx="-13" cy="-10" r="1.2" fill="#F472B6" opacity="0.7" />

      {/* Auras múltiplas de vitalidade */}
      <circle cx="0" cy="0" r="18" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.5" />
      <circle cx="0" cy="0" r="22" fill="none" stroke="#F472B6" strokeWidth="1" opacity="0.3" />
    </g>
  </svg>
)
