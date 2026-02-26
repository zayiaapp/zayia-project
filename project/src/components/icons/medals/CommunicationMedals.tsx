import React from 'react'

export const CommunicationInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <radialGradient id="comInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#comInitGrad)" filter="url(#comInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comInitShine)" />
    <g transform="translate(50, 50)">
      <path d="M -18 -8 Q -18 -14 -12 -14 L 12 -14 Q 18 -14 18 -8 L 18 6 Q 18 12 12 12 L 0 12 L -6 18 L -6 12 L -12 12 Q -18 12 -18 6 Z" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-8" cy="0" r="2" fill="#F87171" />
      <circle cx="0" cy="0" r="2" fill="#F87171" />
      <circle cx="8" cy="0" r="2" fill="#F87171" />
    </g>
  </svg>
)

export const CommunicationPractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <radialGradient id="comPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#comPratGrad)" filter="url(#comPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comPratShine)" />
    <g transform="translate(50, 50)">
      <path d="M -16 -8 Q -16 -14 -10 -14 L 10 -14 Q 16 -14 16 -8 L 16 4 Q 16 10 10 10 L -2 10 L -6 14 L -6 10 L -10 10 Q -16 10 -16 4 Z" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-6" cy="-2" r="2" fill="#F87171" />
      <circle cx="4" cy="-2" r="2" fill="#F87171" />
      <path d="M -12 -6 Q -6 -8 0 -6" stroke="#F87171" strokeWidth="1.5" fill="none" />
      <path d="M -14 6 Q -8 5 -2 7" stroke="#FFD700" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
)

export const CommunicationMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <radialGradient id="comMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="comMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#comMastGrad)" filter="url(#comMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comMastShine)" />
    <g transform="translate(50, 50)" filter="url(#comMastGlow)">
      <path d="M 0 -18 L 8 -8 L 16 -12 L 12 0 L 16 8 L 8 4 L 0 12 L -8 4 L -16 8 L -12 0 L -16 -12 L -8 -8 Z" fill="#FFFFFF" opacity="0.98" />
      <path d="M -8 -2 Q 0 2 8 -2" stroke="#F87171" strokeWidth="2" fill="none" />
      <circle cx="0" cy="4" r="1.5" fill="#F87171" />
      <path d="M -10 2 L -14 8 M 10 2 L 14 8" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)

export const CommunicationSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="comSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="50%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <radialGradient id="comSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="comSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="comSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#comSuprGrad)" filter="url(#comSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#comSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#comSuprGlow)">
      <path d="M 0 -20 L 10 -8 L 18 -12 L 14 2 L 18 10 L 10 6 L 0 14 L -10 6 L -18 10 L -14 2 L -18 -12 L -10 -8 Z" fill="#FFFFFF" opacity="0.99" />
      <path d="M -10 0 Q 0 4 10 0" stroke="#F87171" strokeWidth="2.5" fill="none" />
      <circle cx="0" cy="6" r="2" fill="#F87171" />
      <polygon points="20,-18 23,-12 28,-15" fill="#FFD700" />
      <polygon points="20,18 23,12 28,15" fill="#FFD700" />
    </g>
  </svg>
)
