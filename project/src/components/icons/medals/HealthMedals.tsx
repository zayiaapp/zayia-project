import React from 'react'

export const HealthInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hlthInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#hlthInitGrad)" filter="url(#hlthInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthInitShine)" />
    <g transform="translate(50, 50)">
      <circle cx="0" cy="-4" r="5" fill="#FFFFFF" opacity="0.95" />
      <path d="M -6 4 L -2 2 L 2 6 L 6 0" stroke="#EC4899" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -10 2 L -6 6 M 10 2 L 6 6" stroke="#EC4899" strokeWidth="1.5" opacity="0.6" />
    </g>
  </svg>
)

export const HealthPractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hlthPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#hlthPratGrad)" filter="url(#hlthPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthPratShine)" />
    <g transform="translate(50, 50)">
      <circle cx="0" cy="-4" r="6" fill="#FFFFFF" opacity="0.97" />
      <path d="M -8 4 L -2 2 L 2 8 L 8 0" stroke="#EC4899" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -12 2 L -8 8 M 12 2 L 8 8" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)

export const HealthMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hlthMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="hlthMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#hlthMastGrad)" filter="url(#hlthMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthMastShine)" />
    <g transform="translate(50, 50)" filter="url(#hlthMastGlow)">
      <circle cx="0" cy="-6" r="7" fill="#FFFFFF" opacity="0.98" />
      <path d="M -10 6 L -2 2 L 2 10 L 10 -2" stroke="#EC4899" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -14 2 L -10 10 M 14 2 L 10 10" stroke="#FFD700" strokeWidth="2" />
      <circle cx="-6" cy="2" r="1" fill="#EC4899" opacity="0.5" />
      <circle cx="6" cy="2" r="1" fill="#EC4899" opacity="0.5" />
    </g>
  </svg>
)

export const HealthSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="hlthSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FBCFE8" />
        <stop offset="50%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
      <radialGradient id="hlthSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="hlthSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="hlthSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#hlthSuprGrad)" filter="url(#hlthSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#hlthSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#hlthSuprGlow)">
      <circle cx="0" cy="-6" r="8" fill="#FFFFFF" opacity="0.99" />
      <path d="M -12 8 L -2 2 L 2 12 L 12 -4" stroke="#EC4899" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -16 2 L -12 12 M 16 2 L 12 12" stroke="#FFD700" strokeWidth="2.5" />
      <polygon points="24,-14 27,-8 32,-12" fill="#FFD700" />
      <polygon points="24,14 27,8 32,12" fill="#FFD700" />
      <circle cx="-8" cy="4" r="1.5" fill="#FFD700" />
      <circle cx="8" cy="4" r="1.5" fill="#FFD700" />
    </g>
  </svg>
)
