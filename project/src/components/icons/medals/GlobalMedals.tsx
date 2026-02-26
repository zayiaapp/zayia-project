import React from 'react'

export const GlobalFirstSteps = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="glbFirstGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <radialGradient id="glbFirstShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="glbFirstShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#glbFirstGrad)" filter="url(#glbFirstShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#glbFirstShine)" />
    <g transform="translate(50, 50)">
      <path d="M -6 -8 L -6 6 L -2 2 M 6 -8 L 6 6 L 2 2" stroke="#6B7280" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="-6" cy="8" r="2" fill="#6B7280" />
      <circle cx="6" cy="8" r="2" fill="#6B7280" />
    </g>
  </svg>
)

export const GlobalConqueror = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="glbConqGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <radialGradient id="glbConqShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="glbConqShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#glbConqGrad)" filter="url(#glbConqShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#glbConqShine)" />
    <g transform="translate(50, 50)">
      <circle cx="0" cy="0" r="8" fill="#FFFFFF" opacity="0.97" />
      <path d="M -6 -2 L -2 2 L 4 -4" stroke="#6B7280" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -8 8 L -4 12 M 8 8 L 4 12" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)

export const GlobalHeroine = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="glbHeroGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <radialGradient id="glbHeroShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="glbHeroGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glbHeroShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#glbHeroGrad)" filter="url(#glbHeroShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#glbHeroShine)" />
    <g transform="translate(50, 50)" filter="url(#glbHeroGlow)">
      <circle cx="0" cy="0" r="9" fill="#FFFFFF" opacity="0.98" />
      <path d="M 0 -6 L 3 0 L 0 3 L -3 0 Z" fill="#6B7280" />
      <path d="M -8 2 L -4 8 M 8 2 L 4 8" stroke="#FFD700" strokeWidth="2" />
      <circle cx="0" cy="-3" r="1.5" fill="#FFD700" />
    </g>
  </svg>
)

export const GlobalChampion = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="glbChampGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <radialGradient id="glbChampShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="glbChampGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glbChampShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#glbChampGrad)" filter="url(#glbChampShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#glbChampShine)" />
    <g transform="translate(50, 50)" filter="url(#glbChampGlow)">
      <path d="M -8 6 L -8 -6 L -4 -10 L 0 -8 L 4 -10 L 8 -6 L 8 6 Z" fill="#FFFFFF" opacity="0.98" />
      <path d="M -6 -4 L 0 -7 L 6 -4" stroke="#FFD700" strokeWidth="2.5" fill="none" />
      <circle cx="0" cy="2" r="2" fill="#6B7280" />
    </g>
  </svg>
)

export const GlobalQueenSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="glbQueenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F3E8FF" />
        <stop offset="50%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
      <radialGradient id="glbQueenShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="glbQueenGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glbQueenShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#glbQueenGrad)" filter="url(#glbQueenShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#glbQueenShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
    <g transform="translate(50, 50)" filter="url(#glbQueenGlow)">
      <path d="M -10 8 L -10 -8 L -6 -14 L -2 -12 L 2 -14 L 6 -12 L 10 -8 L 10 8 Z" fill="#FFFFFF" opacity="0.99" />
      <path d="M -8 -8 L -2 -14 L 2 -10 L 8 -8" stroke="#FFD700" strokeWidth="2.5" fill="none" />
      <circle cx="-6" cy="-12" r="2" fill="#FFD700" />
      <circle cx="6" cy="-12" r="2" fill="#FFD700" />
      <polygon points="20,-10 23,-4 28,-8" fill="#FFD700" />
      <polygon points="20,10 23,4 28,8" fill="#FFD700" />
    </g>
  </svg>
)
