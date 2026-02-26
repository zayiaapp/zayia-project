import React from 'react'

export const LeadershipInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadInitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
      <radialGradient id="leadInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FBBF24" floodOpacity="0.5"/>
      </filter>
      <filter id="leadInitGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#leadInitGrad)" filter="url(#leadInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadInitShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#FBBF24" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Simples coroa */}
    <g transform="translate(50, 50)" filter="url(#leadInitGlow)">
      {/* Base da coroa */}
      <rect x="-14" y="2" width="28" height="4" rx="1.5" fill="#FFFFFF" opacity="0.95" />

      {/* Três picos */}
      <path d="M -11 2 L -8 -6 L -5 2" fill="#FFFFFF" opacity="0.95" />
      <path d="M -1 2 L 0 -8 L 1 2" fill="#FFFFFF" opacity="0.95" />
      <path d="M 5 2 L 8 -6 L 11 2" fill="#FFFFFF" opacity="0.95" />

      {/* Jóias simples */}
      <circle cx="0" cy="-8" r="2" fill="#FBBF24" />
      <circle cx="-8" cy="-6" r="1.5" fill="#FBBF24" />
      <circle cx="8" cy="-6" r="1.5" fill="#FBBF24" />
    </g>
  </svg>
)

export const LeadershipPractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadPratGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <radialGradient id="leadPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#FBBF24" floodOpacity="0.6"/>
      </filter>
      <filter id="leadPratGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#leadPratGrad)" filter="url(#leadPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadPratShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Escudo com estrela */}
    <g transform="translate(50, 50)" filter="url(#leadPratGlow)">
      {/* Escudo */}
      <path d="M -13 -8 L -13 6 Q 0 14 13 6 L 13 -8 Z" fill="#FFFFFF" opacity="0.97" />
      <path d="M -13 -8 L -13 6 Q 0 14 13 6 L 13 -8 Z" fill="none" stroke="#F59E0B" strokeWidth="2" />

      {/* Estrela dentro do escudo */}
      <path d="M 0 -2 L 2 2 L 7 2 L 3.5 5 L 5 10 L 0 7 L -5 10 L -3.5 5 L -7 2 L -2 2 Z" fill="#FBBF24" />

      {/* Detalhe da coroa no topo */}
      <rect x="-11" y="-11" width="4" height="4" fill="#FFFFFF" opacity="0.9" />
      <rect x="3" y="-11" width="4" height="4" fill="#FFFFFF" opacity="0.9" />
    </g>
  </svg>
)

export const LeadershipMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadMastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="33%" stopColor="#FBBF24" />
        <stop offset="66%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <radialGradient id="leadMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.7"/>
      </filter>
      <filter id="leadMastGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#leadMastGrad)" filter="url(#leadMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadMastShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="49" fill="none" stroke="#FBBF24" strokeWidth="0.5" opacity="0.4" />

    {/* Conteúdo: Coroa em múltiplos níveis com jóias */}
    <g transform="translate(50, 50)" filter="url(#leadMastGlow)">
      {/* Base da coroa (nível 1) */}
      <rect x="-16" y="4" width="32" height="3.5" rx="1.5" fill="#FFFFFF" opacity="0.98" />

      {/* Nível 2 (meio) */}
      <rect x="-13" y="-1" width="26" height="3.5" rx="1.5" fill="#FFFFFF" opacity="0.97" />

      {/* Nível 3 (topo) */}
      <rect x="-9" y="-6" width="18" height="3.5" rx="1.5" fill="#FFFFFF" opacity="0.97" />

      {/* 5 Picos com jóias */}
      <path d="M -14 -6 L -11 -14 L -8 -6" fill="#FFFFFF" opacity="0.97" />
      <path d="M -4 -6 L -1 -16 L 2 -6" fill="#FFFFFF" opacity="0.97" />
      <path d="M 8 -6 L 11 -14 L 14 -6" fill="#FFFFFF" opacity="0.97" />

      {/* Jóias grandes nos picos */}
      <circle cx="-11" cy="-14" r="2.5" fill="#FFD700" />
      <circle cx="-1" cy="-16" r="3" fill="#FFD700" />
      <circle cx="11" cy="-14" r="2.5" fill="#FFD700" />

      {/* Jóias menores nas laterais */}
      <circle cx="-16" cy="2" r="2" fill="#F59E0B" />
      <circle cx="16" cy="2" r="2" fill="#F59E0B" />
      <circle cx="-13" cy="1.5" r="1.5" fill="#FBBF24" />
      <circle cx="13" cy="1.5" r="1.5" fill="#FBBF24" />

      {/* Brilho nas jóias principais */}
      <circle cx="-11" cy="-15" r="0.8" fill="#FFFFFF" opacity="0.7" />
      <circle cx="-1" cy="-17" r="1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="11" cy="-15" r="0.8" fill="#FFFFFF" opacity="0.7" />
    </g>
  </svg>
)

export const LeadershipSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadSuprGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFACD" />
        <stop offset="20%" stopColor="#FCD34D" />
        <stop offset="40%" stopColor="#FBBF24" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="80%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="leadSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadSuprGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="leadSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#FFD700" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#leadSuprGrad)" filter="url(#leadSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadSuprShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Coroa suprema com esferas de influência */}
    <g transform="translate(50, 50)" filter="url(#leadSuprGlow)">
      {/* Base da coroa (3 níveis) */}
      <rect x="-17" y="8" width="34" height="3" rx="1" fill="#FFFFFF" opacity="0.99" />
      <rect x="-14" y="3" width="28" height="3" rx="1" fill="#FFFFFF" opacity="0.98" />
      <rect x="-10" y="-3" width="20" height="3" rx="1" fill="#FFFFFF" opacity="0.97" />

      {/* 7 Picos (mais que Master) */}
      <path d="M -15 -3 L -12 -12 L -9 -3" fill="#FFFFFF" opacity="0.98" />
      <path d="M -7 -3 L -4 -15 L -1 -3" fill="#FFFFFF" opacity="0.98" />
      <path d="M 1 -3 L 4 -15 L 7 -3" fill="#FFFFFF" opacity="0.98" />
      <path d="M 9 -3 L 12 -12 L 15 -3" fill="#FFFFFF" opacity="0.98" />

      {/* Jóias supremas nos picos principais */}
      <circle cx="-12" cy="-12" r="3.5" fill="#FFD700" />
      <circle cx="-4" cy="-15" r="4" fill="#FFD700" />
      <circle cx="4" cy="-15" r="4" fill="#FFD700" />
      <circle cx="12" cy="-12" r="3.5" fill="#FFD700" />

      {/* Esferas de influência ao redor (representa poder/influência) */}
      <circle cx="-22" cy="-2" r="3.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="22" cy="-2" r="3.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-22" cy="11" r="2.5" fill="#FFFFFF" opacity="0.92" />
      <circle cx="22" cy="11" r="2.5" fill="#FFFFFF" opacity="0.92" />

      {/* Linhas de conexão (energia/influência) */}
      <line x1="-12" y1="-12" x2="-22" y2="-2" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <line x1="12" y1="-12" x2="22" y2="-2" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
      <line x1="-22" y1="-2" x2="-22" y2="11" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />
      <line x1="22" y1="-2" x2="22" y2="11" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />

      {/* Brilhos nas jóias */}
      <circle cx="-12" cy="-13" r="1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="-4" cy="-16" r="1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="4" cy="-16" r="1" fill="#FFFFFF" opacity="0.7" />
      <circle cx="12" cy="-13" r="1" fill="#FFFFFF" opacity="0.7" />

      {/* Partículas de luz suprema */}
      <circle cx="-26" cy="0" r="1.2" fill="#FFD700" opacity="0.6" />
      <circle cx="26" cy="0" r="1.2" fill="#FFD700" opacity="0.6" />
      <circle cx="0" cy="-24" r="1" fill="#FFD700" opacity="0.5" />
    </g>
  </svg>
)
