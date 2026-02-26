import React from 'react'

export const InnovationInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innovInitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <radialGradient id="innovInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innovInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#A78BFA" floodOpacity="0.5"/>
      </filter>
      <filter id="innovInitGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#innovInitGrad)" filter="url(#innovInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innovInitShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#A78BFA" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Simples lâmpada */}
    <g transform="translate(50, 50)" filter="url(#innovInitGlow)">
      {/* Globo da lâmpada */}
      <path d="M -6 -8 Q -8 -3 -6 3 Q -3 5 0 5 Q 3 5 6 3 Q 8 -3 6 -8 Q 3 -11 0 -11 Q -3 -11 -6 -8" fill="#FFFFFF" opacity="0.95" stroke="#A78BFA" strokeWidth="1" />

      {/* Soquete */}
      <rect x="-4" y="5" width="8" height="3" fill="#FFFFFF" opacity="0.9" />

      {/* Filamento simples */}
      <path d="M -3 -5 Q 0 -2 3 -5" fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.7" />

      {/* Raio de luz */}
      <line x1="0" y1="-12" x2="0" y2="-16" stroke="#A78BFA" strokeWidth="1" opacity="0.6" />
    </g>
  </svg>
)

export const InnovationPractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innovPratGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="50%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <radialGradient id="innovPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innovPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#A78BFA" floodOpacity="0.6"/>
      </filter>
      <filter id="innovPratGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#innovPratGrad)" filter="url(#innovPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innovPratShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Duas lâmpadas conectadas */}
    <g transform="translate(50, 50)" filter="url(#innovPratGlow)">
      {/* Lâmpada esquerda */}
      <path d="M -14 -7 Q -17 -2 -14 4 Q -11 7 -8 7 Q -5 7 -4 4 Q -1 -2 -4 -7 Q -7 -10 -8 -10 Q -11 -10 -14 -7" fill="#FFFFFF" opacity="0.97" />
      <rect x="-12" y="7" width="6" height="2" fill="#FFFFFF" opacity="0.9" />

      {/* Lâmpada direita */}
      <path d="M 8 -7 Q 5 -2 8 4 Q 11 7 14 7 Q 17 7 18 4 Q 21 -2 18 -7 Q 15 -10 14 -10 Q 11 -10 8 -7" fill="#FFFFFF" opacity="0.97" />
      <rect x="8" y="7" width="6" height="2" fill="#FFFFFF" opacity="0.9" />

      {/* Linha de conexão */}
      <line x1="-4" y1="0" x2="8" y2="0" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />

      {/* Raios de luz */}
      <line x1="-8" y1="-11" x2="-8" y2="-15" stroke="#A78BFA" strokeWidth="0.8" opacity="0.6" />
      <line x1="14" y1="-11" x2="14" y2="-15" stroke="#A78BFA" strokeWidth="0.8" opacity="0.6" />
      <line x1="0" y1="-3" x2="0" y2="-8" stroke="#A78BFA" strokeWidth="1" opacity="0.5" />
    </g>
  </svg>
)

export const InnovationMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innovMastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="33%" stopColor="#A78BFA" />
        <stop offset="66%" stopColor="#9333EA" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
      <radialGradient id="innovMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innovMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#9333EA" floodOpacity="0.7"/>
      </filter>
      <filter id="innovMastGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#innovMastGrad)" filter="url(#innovMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innovMastShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#9333EA" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="49" fill="none" stroke="#A78BFA" strokeWidth="0.5" opacity="0.4" />

    {/* Conteúdo: Rede de lâmpadas (inovação colaborativa) */}
    <g transform="translate(50, 50)" filter="url(#innovMastGlow)">
      {/* Central lâmpada (maior) */}
      <path d="M -5 -3 Q -8 2 -5 8 Q -2 10 0 10 Q 2 10 5 8 Q 8 2 5 -3 Q 2 -6 0 -6 Q -2 -6 -5 -3" fill="#FFFFFF" opacity="0.98" />
      <rect x="-4" y="10" width="8" height="3" fill="#FFFFFF" opacity="0.96" />

      {/* 4 lâmpadas menores ao redor */}
      <path d="M -15 -11 Q -17 -8 -14 -5 Q -12 -2 -10 -2 Q -8 -2 -6 -5 Q -4 -8 -6 -12 Q -8 -14 -10 -14 Q -13 -14 -15 -11" fill="#FFFFFF" opacity="0.96" />
      <path d="M 15 -11 Q 17 -8 14 -5 Q 12 -2 10 -2 Q 8 -2 6 -5 Q 4 -8 6 -12 Q 8 -14 10 -14 Q 13 -14 15 -11" fill="#FFFFFF" opacity="0.96" />
      <path d="M -12 11 Q -14 14 -10 17 Q -8 19 -5 19 Q -2 19 0 17 Q 2 14 0 11 Q -2 8 -5 8 Q -8 8 -12 11" fill="#FFFFFF" opacity="0.96" />
      <path d="M 12 11 Q 14 14 10 17 Q 8 19 5 19 Q 2 19 0 17 Q -2 14 0 11 Q 2 8 5 8 Q 8 8 12 11" fill="#FFFFFF" opacity="0.96" />

      {/* Linhas de conexão (rede) */}
      <line x1="-5" y1="0" x2="-10" y2="-4" stroke="#9333EA" strokeWidth="1" opacity="0.6" />
      <line x1="5" y1="0" x2="10" y2="-4" stroke="#9333EA" strokeWidth="1" opacity="0.6" />
      <line x1="-2" y1="10" x2="-6" y2="14" stroke="#9333EA" strokeWidth="1" opacity="0.6" />
      <line x1="2" y1="10" x2="6" y2="14" stroke="#9333EA" strokeWidth="1" opacity="0.6" />

      {/* Raios de luz */}
      <line x1="0" y1="-7" x2="0" y2="-13" stroke="#A78BFA" strokeWidth="1.2" opacity="0.7" />
      <circle cx="-10" cy="-15" r="0.8" fill="#A78BFA" opacity="0.6" />
      <circle cx="10" cy="-15" r="0.8" fill="#A78BFA" opacity="0.6" />
    </g>
  </svg>
)

export const InnovationSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innovSuprGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="20%" stopColor="#C4B5FD" />
        <stop offset="40%" stopColor="#A78BFA" />
        <stop offset="60%" stopColor="#9333EA" />
        <stop offset="80%" stopColor="#7E22CE" />
        <stop offset="100%" stopColor="#581C87" />
      </linearGradient>
      <radialGradient id="innovSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innovSuprGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="innovSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#7E22CE" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#9333EA" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#innovSuprGrad)" filter="url(#innovSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innovSuprShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#9333EA" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Rede neural/ecossistema de inovação suprema */}
    <g transform="translate(50, 50)" filter="url(#innovSuprGlow)">
      {/* Central lâmpada (suprema) */}
      <path d="M -7 -1 Q -10 4 -7 9 Q -4 12 0 12 Q 4 12 7 9 Q 10 4 7 -1 Q 4 -4 0 -4 Q -4 -4 -7 -1" fill="#FFFFFF" opacity="0.99" />
      <rect x="-5" y="12" width="10" height="3" fill="#FFFFFF" opacity="0.98" />
      <circle cx="0" cy="0" r="4" fill="none" stroke="#9333EA" strokeWidth="1" opacity="0.7" />

      {/* 6 nós de inovação ao redor (hexagono) */}
      <circle cx="0" cy="-16" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="14" cy="-8" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="14" cy="8" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="0" cy="16" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-14" cy="8" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-14" cy="-8" r="3.5" fill="#FFFFFF" opacity="0.97" />

      {/* Linhas de conexão em rede (todas as conexões) */}
      <line x1="0" y1="-4" x2="0" y2="-16" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />
      <line x1="5" y1="0" x2="14" y2="-8" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />
      <line x1="5" y1="5" x2="14" y2="8" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />
      <line x1="0" y1="12" x2="0" y2="16" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />
      <line x1="-5" y1="5" x2="-14" y2="8" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />
      <line x1="-5" y1="0" x2="-14" y2="-8" stroke="#9333EA" strokeWidth="1.5" opacity="0.7" />

      {/* Conexões diagonais (mais denso) */}
      <line x1="14" y1="-8" x2="14" y2="8" stroke="#7E22CE" strokeWidth="0.8" opacity="0.5" />
      <line x1="0" y1="-16" x2="14" y2="8" stroke="#7E22CE" strokeWidth="0.8" opacity="0.4" />
      <line x1="0" y1="-16" x2="-14" y2="8" stroke="#7E22CE" strokeWidth="0.8" opacity="0.4" />
      <line x1="-14" y1="-8" x2="14" y2="-8" stroke="#7E22CE" strokeWidth="0.8" opacity="0.4" />

      {/* Raios supremos de energia */}
      <circle cx="0" cy="-20" r="1.2" fill="#A78BFA" opacity="0.8" />
      <circle cx="18" cy="-10" r="1" fill="#A78BFA" opacity="0.7" />
      <circle cx="18" cy="10" r="1" fill="#A78BFA" opacity="0.7" />
      <circle cx="0" cy="20" r="1.2" fill="#A78BFA" opacity="0.8" />
      <circle cx="-18" cy="10" r="1" fill="#A78BFA" opacity="0.7" />
      <circle cx="-18" cy="-10" r="1" fill="#A78BFA" opacity="0.7" />

      {/* Brilhos nos nós */}
      <circle cx="0" cy="-17" r="0.6" fill="#FFFFFF" opacity="0.7" />
      <circle cx="14.5" cy="-8.5" r="0.6" fill="#FFFFFF" opacity="0.7" />
      <circle cx="14.5" cy="8.5" r="0.6" fill="#FFFFFF" opacity="0.7" />
    </g>
  </svg>
)
