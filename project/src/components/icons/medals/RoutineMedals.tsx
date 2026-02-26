import React from 'react'

export const RoutineInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="rotInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
      <radialGradient id="rotInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="rotInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#rotInitGrad)" filter="url(#rotInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#rotInitShine)" />
    <g transform="translate(50, 50)">
      <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#FFFFFF" opacity="0.95" />
      <rect x="-10" y="-10" width="20" height="4" fill="#F97316" />
      <circle cx="-6" cy="0" r="1.5" fill="#F97316" />
      <circle cx="0" cy="0" r="1.5" fill="#F97316" />
      <circle cx="6" cy="0" r="1.5" fill="#F97316" />
      <line x1="-10" y1="6" x2="10" y2="6" stroke="#F97316" strokeWidth="1" />
    </g>
  </svg>
)

export const RoutinePractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="rotPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
      <radialGradient id="rotPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="rotPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#rotPratGrad)" filter="url(#rotPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#rotPratShine)" />
    <g transform="translate(50, 50)">
      <rect x="-13" y="-13" width="26" height="26" rx="2" fill="#FFFFFF" opacity="0.97" />
      <rect x="-11" y="-11" width="22" height="5" fill="#F97316" />
      <circle cx="-7" cy="1" r="2" fill="#F97316" />
      <circle cx="0" cy="1" r="2" fill="#F97316" />
      <circle cx="7" cy="1" r="2" fill="#F97316" />
      <line x1="-11" y1="7" x2="11" y2="7" stroke="#F97316" strokeWidth="1.5" />
      <path d="M -9 10 L -7 8 M -2 10 L 0 8 M 5 10 L 7 8" stroke="#FFD700" strokeWidth="1" />
    </g>
  </svg>
)

export const RoutineMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="rotMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
      <radialGradient id="rotMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="rotMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="rotMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#rotMastGrad)" filter="url(#rotMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#rotMastShine)" />
    <g transform="translate(50, 50)" filter="url(#rotMastGlow)">
      <circle cx="0" cy="0" r="13" fill="#FFFFFF" opacity="0.98" />
      <circle cx="0" cy="0" r="12" fill="none" stroke="#F97316" strokeWidth="1.5" />
      <path d="M 0 -8 L 0 0 M 8 0 L 0 0 M 0 8 L 0 0" stroke="#F97316" strokeWidth="2" />
      <circle cx="0" cy="0" r="2" fill="#F97316" />
      <circle cx="0" cy="-8" r="2" fill="#FFD700" />
      <circle cx="8" cy="0" r="2" fill="#FFD700" />
    </g>
  </svg>
)

export const RoutineSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="rotSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="50%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
      <radialGradient id="rotSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="rotSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="rotSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#rotSuprGrad)" filter="url(#rotSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#rotSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#rotSuprGlow)">
      <circle cx="0" cy="0" r="14" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="0" r="13" fill="none" stroke="#F97316" strokeWidth="2" />
      <path d="M 0 -9 L 0 0 M 9 0 L 0 0 M 0 9 L 0 0 M -9 0 L 0 0" stroke="#F97316" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="2.5" fill="#F97316" />
      <circle cx="0" cy="-9" r="2.5" fill="#FFD700" />
      <circle cx="9" cy="0" r="2.5" fill="#FFD700" />
      <polygon points="22,-14 25,-8 30,-12" fill="#FFD700" />
      <polygon points="22,14 25,8 30,12" fill="#FFD700" />
    </g>
  </svg>
)
