import React from 'react'

const LeadshipIcon = ({ initiate = false, practitioner = false, master = false }: unknown) => {
  const opacity = initiate ? 0.6 : practitioner ? 0.8 : 0.95
  return <circle cx="0" cy="0" r="2.5" fill="#FBBF24" opacity={opacity} />
}

export const LeadershipInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="leadInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#leadInitGrad)" filter="url(#leadInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadInitShine)" />
    <g transform="translate(50, 50)">
      <path d="M -8 -12 L 0 -18 L 8 -12 L 6 0 L 8 8 L 0 4 L -8 8 L -6 0 Z" fill="#FFFFFF" opacity="0.95" />
      <path d="M -6 -6 L 6 -6" stroke="#FBBF24" strokeWidth="1.5" />
      <circle cx="0" cy="2" r="1.5" fill="#FBBF24" />
    </g>
  </svg>
)

export const LeadershipPractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="leadPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#leadPratGrad)" filter="url(#leadPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadPratShine)" />
    <g transform="translate(50, 50)">
      <path d="M -10 -12 L 0 -20 L 10 -12 L 8 2 L 10 10 L 0 6 L -10 10 L -8 2 Z" fill="#FFFFFF" opacity="0.97" />
      <path d="M -8 -6 L 8 -6" stroke="#FBBF24" strokeWidth="2" />
      <circle cx="0" cy="4" r="2" fill="#FBBF24" />
      <path d="M -14 2 L -18 8 M 14 2 L 18 8" stroke="#FFD700" strokeWidth="1.5" />
    </g>
  </svg>
)

export const LeadershipMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="leadMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="leadMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#leadMastGrad)" filter="url(#leadMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadMastShine)" />
    <g transform="translate(50, 50)" filter="url(#leadMastGlow)">
      <path d="M -12 -12 L 0 -22 L 12 -12 L 10 4 L 12 12 L 0 8 L -12 12 L -10 4 Z" fill="#FFFFFF" opacity="0.98" />
      <path d="M -10 -8 L 10 -8" stroke="#FBBF24" strokeWidth="2.5" />
      <circle cx="0" cy="6" r="2.5" fill="#FBBF24" />
      <path d="M -14 -2 L -20 -6 M 14 -2 L 20 -6" stroke="#FFD700" strokeWidth="2" />
    </g>
  </svg>
)

export const LeadershipSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="leadSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <radialGradient id="leadSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="leadSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="leadSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#leadSuprGrad)" filter="url(#leadSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#leadSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#leadSuprGlow)">
      <path d="M -14 -12 L 0 -24 L 14 -12 L 12 6 L 14 14 L 0 10 L -14 14 L -12 6 Z" fill="#FFFFFF" opacity="0.99" />
      <path d="M -12 -8 L 12 -8" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="0" cy="8" r="3" fill="#FBBF24" />
      <polygon points="24,-14 27,-8 32,-12" fill="#FFD700" />
      <polygon points="24,14 27,8 32,12" fill="#FFD700" />
    </g>
  </svg>
)
