import React from 'react'

export const EmotionalInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <radialGradient id="emInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#emInitGrad)" filter="url(#emInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emInitShine)" />
    <g transform="translate(50, 50)">
      <path d="M 0 -12 Q 8 -8 12 0 Q 12 8 4 12 Q -4 12 -12 0 Q -8 -8 0 -12 Z" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-4" cy="-2" r="2" fill="#EC4899" />
      <circle cx="4" cy="-2" r="2" fill="#EC4899" />
      <path d="M -5 4 Q 0 6 5 4" stroke="#EC4899" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  </svg>
)

export const EmotionalPractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <radialGradient id="emPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#emPratGrad)" filter="url(#emPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emPratShine)" />
    <g transform="translate(50, 50)">
      <path d="M 0 -12 Q 8 -8 12 0 Q 12 8 4 12 Q -4 12 -12 0 Q -8 -8 0 -12 Z" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-4" cy="-2" r="2.5" fill="#EC4899" />
      <circle cx="4" cy="-2" r="2.5" fill="#EC4899" />
      <path d="M -5 4 Q 0 7 5 4" stroke="#EC4899" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M -10 -4 L -14 -6 M 10 -4 L 14 -6" stroke="#10B981" strokeWidth="1.5" />
    </g>
  </svg>
)

export const EmotionalMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <radialGradient id="emMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="emMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#emMastGrad)" filter="url(#emMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emMastShine)" />
    <g transform="translate(50, 50)" filter="url(#emMastGlow)">
      <path d="M 0 -14 Q 10 -8 14 2 Q 14 12 4 16 Q -4 16 -14 2 Q -10 -8 0 -14 Z" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-5" cy="-2" r="3" fill="#EC4899" />
      <circle cx="5" cy="-2" r="3" fill="#EC4899" />
      <path d="M -6 6 Q 0 9 6 6" stroke="#EC4899" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M -12 -6 L -16 -10 M 12 -6 L 16 -10" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)

export const EmotionalSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="emSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="50%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <radialGradient id="emSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="emSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="emSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#emSuprGrad)" filter="url(#emSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#emSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#emSuprGlow)">
      <path d="M 0 -16 Q 12 -8 16 4 Q 16 14 4 18 Q -4 18 -16 4 Q -12 -8 0 -16 Z" fill="#FFFFFF" opacity="0.99" />
      <circle cx="-6" cy="-2" r="3.5" fill="#EC4899" />
      <circle cx="6" cy="-2" r="3.5" fill="#EC4899" />
      <path d="M -7 8 Q 0 12 7 8" stroke="#EC4899" strokeWidth="3" fill="none" strokeLinecap="round" />
      <polygon points="22,-16 25,-10 30,-14" fill="#FFD700" />
      <polygon points="22,16 25,10 30,14" fill="#FFD700" />
    </g>
  </svg>
)
