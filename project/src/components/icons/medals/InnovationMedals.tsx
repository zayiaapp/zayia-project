import React from 'react'

export const InnovationInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <radialGradient id="innInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#innInitGrad)" filter="url(#innInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innInitShine)" />
    <g transform="translate(50, 50)">
      <path d="M -8 8 L -8 -8 Q 0 -14 8 -8 L 8 8 Q 0 14 -8 8" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="0" r="4" fill="none" stroke="#A78BFA" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="1.5" fill="#A78BFA" />
    </g>
  </svg>
)

export const InnovationPractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <radialGradient id="innPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#innPratGrad)" filter="url(#innPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innPratShine)" />
    <g transform="translate(50, 50)">
      <path d="M -10 10 L -10 -10 Q 0 -16 10 -10 L 10 10 Q 0 16 -10 10" fill="#FFFFFF" opacity="0.97" />
      <circle cx="0" cy="0" r="5" fill="none" stroke="#A78BFA" strokeWidth="2" />
      <circle cx="0" cy="0" r="2" fill="#A78BFA" />
      <path d="M -12 -4 L -16 -8 M 12 -4 L 16 -8" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)

export const InnovationMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <radialGradient id="innMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="innMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#innMastGrad)" filter="url(#innMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innMastShine)" />
    <g transform="translate(50, 50)" filter="url(#innMastGlow)">
      <path d="M -12 12 L -12 -12 Q 0 -18 12 -12 L 12 12 Q 0 18 -12 12" fill="#FFFFFF" opacity="0.98" />
      <circle cx="0" cy="0" r="6" fill="none" stroke="#A78BFA" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="2.5" fill="#A78BFA" />
      <path d="M -14 -2 L -18 -6 M 14 -2 L 18 -6" stroke="#FFD700" strokeWidth="2" />
      <g transform="translate(0, 0)">
        <circle cx="-6" cy="0" r="1" fill="#A78BFA" opacity="0.6" />
        <circle cx="6" cy="0" r="1" fill="#A78BFA" opacity="0.6" />
      </g>
    </g>
  </svg>
)

export const InnovationSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="innSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DDD6FE" />
        <stop offset="50%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <radialGradient id="innSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="innSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="innSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#innSuprGrad)" filter="url(#innSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#innSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#innSuprGlow)">
      <path d="M -14 14 L -14 -14 Q 0 -20 14 -14 L 14 14 Q 0 20 -14 14" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="0" r="7" fill="none" stroke="#A78BFA" strokeWidth="3" />
      <circle cx="0" cy="0" r="3" fill="#A78BFA" />
      <polygon points="22,-16 25,-10 30,-14" fill="#FFD700" />
      <polygon points="22,16 25,10 30,14" fill="#FFD700" />
      <path d="M -8 -6 L -10 -10 M 8 -6 L 10 -10" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)
