import React from 'react'

export const EmotionalInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emInitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <radialGradient id="emInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10B981" floodOpacity="0.5"/>
      </filter>
      <filter id="emInitGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#emInitGrad)" filter="url(#emInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emInitShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Simples coração */}
    <g transform="translate(50, 50)" filter="url(#emInitGlow)">
      <path d="M -5 -3 Q -9 -8 -12 -5 Q -13 -2 -10 3 L 0 10 L 10 3 Q 13 -2 12 -5 Q 9 -8 5 -3 Q 0 1 0 1 Q 0 1 -5 -3" fill="#FFFFFF" opacity="0.95" />
      <path d="M -5 -3 Q -9 -8 -12 -5 Q -13 -2 -10 3 L 0 10 L 10 3 Q 13 -2 12 -5 Q 9 -8 5 -3 Q 0 1 0 1 Q 0 1 -5 -3" fill="none" stroke="#10B981" strokeWidth="2" />
    </g>
  </svg>
)

export const EmotionalPractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emPratGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <radialGradient id="emPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#10B981" floodOpacity="0.6"/>
      </filter>
      <filter id="emPratGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#emPratGrad)" filter="url(#emPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emPratShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Pessoa meditando com aura */}
    <g transform="translate(50, 50)" filter="url(#emPratGlow)">
      {/* Cabeça */}
      <circle cx="0" cy="-6" r="6" fill="#FFFFFF" opacity="0.97" />

      {/* Corpo */}
      <path d="M -3 3 L -3 12 L 3 12 L 3 3 Z" fill="#FFFFFF" opacity="0.96" />

      {/* Braços em repouso */}
      <line x1="-3" y1="3" x2="-10" y2="4" stroke="#FFFFFF" strokeWidth="2" />
      <line x1="3" y1="3" x2="10" y2="4" stroke="#FFFFFF" strokeWidth="2" />

      {/* Aura ao redor */}
      <circle cx="0" cy="-6" r="10" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
      <circle cx="0" cy="-6" r="13" fill="none" stroke="#86EFAC" strokeWidth="1" opacity="0.3" />

      {/* Pernas */}
      <line x1="-1.5" y1="12" x2="-3" y2="18" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="1.5" y1="12" x2="3" y2="18" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>
  </svg>
)

export const EmotionalMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emMastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="33%" stopColor="#10B981" />
        <stop offset="66%" stopColor="#059669" />
        <stop offset="100%" stopColor="#065F46" />
      </linearGradient>
      <radialGradient id="emMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#10B981" floodOpacity="0.7"/>
      </filter>
      <filter id="emMastGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#emMastGrad)" filter="url(#emMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emMastShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="49" fill="none" stroke="#86EFAC" strokeWidth="0.5" opacity="0.4" />

    {/* Conteúdo: Árvore emocional equilibrada */}
    <g transform="translate(50, 50)" filter="url(#emMastGlow)">
      {/* Tronco */}
      <rect x="-3" y="2" width="6" height="14" fill="#FFFFFF" opacity="0.98" />

      {/* Folhas superiores */}
      <circle cx="-9" cy="-6" r="6" fill="#FFFFFF" opacity="0.97" />
      <circle cx="0" cy="-10" r="7" fill="#FFFFFF" opacity="0.97" />
      <circle cx="9" cy="-6" r="6" fill="#FFFFFF" opacity="0.97" />

      {/* Raízes */}
      <path d="M -4 16 L -8 22 M 0 16 L 0 22 M 4 16 L 8 22" stroke="#FFFFFF" strokeWidth="2" />

      {/* Aura emocional */}
      <circle cx="0" cy="0" r="15" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />

      {/* Brilhos nas folhas */}
      <circle cx="-9" cy="-7" r="1.5" fill="#FFFFFF" opacity="0.6" />
      <circle cx="0" cy="-11" r="1.5" fill="#FFFFFF" opacity="0.6" />
      <circle cx="9" cy="-7" r="1.5" fill="#FFFFFF" opacity="0.6" />
    </g>
  </svg>
)

export const EmotionalSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emSuprGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D1FAE5" />
        <stop offset="25%" stopColor="#86EFAC" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="75%" stopColor="#059669" />
        <stop offset="100%" stopColor="#065F46" />
      </linearGradient>
      <radialGradient id="emSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emSuprGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="emSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#10B981" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#86EFAC" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#emSuprGrad)" filter="url(#emSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emSuprShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#10B981" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Sistema holístico com padrão mandala */}
    <g transform="translate(50, 50)" filter="url(#emSuprGlow)">
      {/* Círculo central (coração) */}
      <circle cx="0" cy="0" r="7" fill="#FFFFFF" opacity="0.99" />
      <path d="M -3 -1 Q -5 -4 -6 -1 Q -6.5 1 -3 3 L 0 6 L 3 3 Q 6.5 1 6 -1 Q 5 -4 3 -1 Q 0 1 0 1" fill="#10B981" opacity="0.8" />

      {/* Pétalas ao redor */}
      <circle cx="0" cy="-12" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="12" cy="0" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="0" cy="12" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-12" cy="0" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="8" cy="-8" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="8" cy="8" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-8" cy="8" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-8" cy="-8" r="3.5" fill="#FFFFFF" opacity="0.96" />

      {/* Linhas conectando pétalas */}
      <line x1="0" y1="-12" x2="12" y2="0" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
      <line x1="12" y1="0" x2="0" y2="12" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
      <line x1="0" y1="12" x2="-12" y2="0" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
      <line x1="-12" y1="0" x2="0" y2="-12" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />

      {/* Aura mandala */}
      <circle cx="0" cy="0" r="18" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.6" />
      <circle cx="0" cy="0" r="22" fill="none" stroke="#86EFAC" strokeWidth="1.5" opacity="0.4" />

      {/* Partículas de luz */}
      <circle cx="-20" cy="0" r="1.5" fill="#10B981" opacity="0.7" />
      <circle cx="20" cy="0" r="1.5" fill="#10B981" opacity="0.7" />
      <circle cx="0" cy="-20" r="1.2" fill="#86EFAC" opacity="0.6" />
      <circle cx="0" cy="20" r="1.2" fill="#86EFAC" opacity="0.6" />
    </g>
  </svg>
)
