import React from 'react'

export const OrganizationInitiate = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="orgInitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <radialGradient id="orgInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="orgInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#orgInitGrad)" filter="url(#orgInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#orgInitShine)" />
    <g transform="translate(50, 50)">
      <rect x="-16" y="-16" width="32" height="38" rx="3" fill="#FFFFFF" opacity="0.95" />
      <rect x="-8" y="-18" width="16" height="4" rx="2" fill="#FFD700" />
      <rect x="-12" y="-8" width="12" height="2" fill="#3B82F6" opacity="0.7" />
      <rect x="-12" y="-3" width="20" height="1" fill="#CBD5E1" />
      <rect x="-12" y="2" width="20" height="1" fill="#CBD5E1" />
      <rect x="-12" y="7" width="20" height="1" fill="#CBD5E1" />
      <rect x="-19" y="-8" width="5" height="5" rx="1" fill="#10B981" />
      <path d="M -17 -5 L -16 -3 L -14 -6" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)

export const OrganizationPractitioner = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="orgPratGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <radialGradient id="orgPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="orgPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.35" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#orgPratGrad)" filter="url(#orgPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#orgPratShine)" />
    <g transform="translate(50, 50)">
      <rect x="-16" y="-16" width="32" height="38" rx="3" fill="#FFFFFF" opacity="0.97" />
      <rect x="-8" y="-18" width="16" height="4" rx="2" fill="#FFD700" />
      <rect x="-12" y="-8" width="12" height="2" fill="#3B82F6" opacity="0.8" />
      <rect x="-12" y="-3" width="20" height="1" fill="#3B82F6" opacity="0.8" />
      <rect x="-12" y="2" width="20" height="1" fill="#CBD5E1" />
      <rect x="-12" y="7" width="20" height="1" fill="#CBD5E1" />
      <rect x="-19" y="-8" width="5" height="5" rx="1" fill="#10B981" />
      <path d="M -17 -5 L -16 -3 L -14 -6" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="-19" y="-2" width="5" height="5" rx="1" fill="#10B981" />
      <path d="M -17 1 L -16 3 L -14 0" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12 -10 L 18 -4" stroke="#FFD700" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  </svg>
)

export const OrganizationMaster = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="orgMastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <radialGradient id="orgMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="orgMastGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="orgMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#orgMastGrad)" filter="url(#orgMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#orgMastShine)" />
    <g transform="translate(50, 50)" filter="url(#orgMastGlow)">
      <rect x="-16" y="-16" width="32" height="38" rx="3" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-8" cy="-14" r="3" fill="#FFD700" />
      <path d="M -12 -12 L -4 -12" stroke="#FFD700" strokeWidth="2" />
      <rect x="-12" y="-8" width="12" height="2" fill="#3B82F6" opacity="0.9" />
      <rect x="-12" y="-3" width="20" height="1" fill="#3B82F6" opacity="0.85" />
      <rect x="-12" y="2" width="20" height="1" fill="#3B82F6" opacity="0.85" />
      <rect x="-12" y="7" width="20" height="1" fill="#3B82F6" opacity="0.85" />
      <rect x="-19" y="-8" width="5" height="5" rx="1" fill="#10B981" />
      <path d="M -17 -5 L -16 -3 L -14 -6" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)

export const OrganizationSuprema = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="orgSuprGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="50%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
      <radialGradient id="orgSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="orgSuprGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="orgSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodOpacity="0.5" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#orgSuprGrad)" filter="url(#orgSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#orgSuprShine)" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <g transform="translate(50, 50)" filter="url(#orgSuprGlow)">
      <rect x="-16" y="-16" width="32" height="38" rx="3" fill="#FFFFFF" opacity="0.99" />
      <circle cx="-8" cy="-14" r="3.5" fill="#FFD700" />
      <path d="M -12 -12 L -4 -12" stroke="#FFD700" strokeWidth="2.5" />
      <rect x="-12" y="-8" width="12" height="2.5" fill="#3B82F6" opacity="0.95" />
      <rect x="-12" y="-3" width="20" height="1" fill="#3B82F6" opacity="0.9" />
      <rect x="-12" y="2" width="20" height="1" fill="#3B82F6" opacity="0.9" />
      <rect x="-12" y="7" width="20" height="1" fill="#3B82F6" opacity="0.9" />
      <rect x="-19" y="-8" width="5" height="5" rx="1" fill="#10B981" />
      <path d="M -17 -5 L -16 -3 L -14 -6" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="25,-15 27,-10 32,-10" fill="#FFD700" />
      <polygon points="25,15 27,10 32,10" fill="#FFD700" />
    </g>
  </svg>
)
