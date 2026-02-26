import React from 'react'

export const Level0Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl0Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#9CA3AF" />
      </linearGradient>
      <radialGradient id="lvl0Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl0Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl0Shine)" />
    <g transform="translate(50, 50)">
      <circle cx="0" cy="0" r="4" fill="#D1D5DB" stroke="#6B7280" strokeWidth="1.5" />
      <circle cx="0" cy="2" r="2" fill="#9CA3AF" opacity="0.6" />
    </g>
  </svg>
)

export const Level1Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BBEF63" />
        <stop offset="100%" stopColor="#86EFAC" />
      </linearGradient>
      <radialGradient id="lvl1Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl1Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl1Shine)" />
    <g transform="translate(50, 50)">
      <line x1="0" y1="6" x2="0" y2="-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="-2" cy="-4" r="1.5" fill="#FFFFFF" />
      <circle cx="2" cy="-4" r="1.5" fill="#FFFFFF" />
      <circle cx="0" cy="-6" r="1.5" fill="#FFFFFF" />
    </g>
  </svg>
)

export const Level2Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <radialGradient id="lvl2Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl2Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl2Shine)" />
    <g transform="translate(50, 50)">
      <line x1="0" y1="8" x2="0" y2="-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="-4" cy="-2" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="4" cy="-2" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-2" cy="-6" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="2" cy="-6" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="-8" r="2" fill="#FFFFFF" opacity="0.94" />
    </g>
  </svg>
)

export const Level3Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <radialGradient id="lvl3Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl3Glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl3Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl3Shine)" />
    <g transform="translate(50, 50)" filter="url(#lvl3Glow)">
      <line x1="0" y1="8" x2="0" y2="-8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-5" cy="0" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="5" cy="0" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-3" cy="-4" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="3" cy="-4" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-1" cy="-8" r="2" fill="#FFFFFF" opacity="0.95" />
      <circle cx="1" cy="-8" r="2" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="-10" r="1.8" fill="#FFFFFF" opacity="0.94" />
    </g>
  </svg>
)

export const Level4Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl4Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <radialGradient id="lvl4Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl4Glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl4Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl4Shine)" />
    <g transform="translate(50, 50)" filter="url(#lvl4Glow)">
      <line x1="0" y1="9" x2="0" y2="-10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-6" cy="2" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="6" cy="2" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-4" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="4" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-2" cy="-7" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="2" cy="-7" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="0" cy="-10" r="2" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="-12" r="1.8" fill="#FFFFFF" opacity="0.94" />
    </g>
  </svg>
)

export const Level5Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl5Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="100%" stopColor="#9333EA" />
      </linearGradient>
      <radialGradient id="lvl5Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl5Glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl5Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl5Shine)" />
    <g transform="translate(50, 50)" filter="url(#lvl5Glow)">
      <line x1="0" y1="10" x2="0" y2="-12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-7" cy="3" r="3.5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="7" cy="3" r="3.5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-5" cy="-2" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="5" cy="-2" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-3" cy="-7" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="3" cy="-7" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-1" cy="-11" r="2" fill="#FFFFFF" opacity="0.95" />
      <circle cx="1" cy="-11" r="2" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="-13" r="2" fill="#FFFFFF" opacity="0.94" />
      <circle cx="0" cy="-1.5" r="1.5" fill="#E9D5FF" opacity="0.6" />
    </g>
  </svg>
)

export const Level6Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl6Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <radialGradient id="lvl6Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl6Glow">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl6Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl6Shine)" />
    <g transform="translate(50, 50)" filter="url(#lvl6Glow)">
      <line x1="0" y1="11" x2="0" y2="-14" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="-8" cy="4" r="4" fill="#FFFFFF" opacity="0.99" />
      <circle cx="8" cy="4" r="4" fill="#FFFFFF" opacity="0.99" />
      <circle cx="-6" cy="-2" r="3.5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="6" cy="-2" r="3.5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-4" cy="-7" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="4" cy="-7" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-2" cy="-12" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="2" cy="-12" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="0" cy="-15" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="0" r="2" fill="#0891B2" opacity="0.7" />
      <circle cx="-10" cy="0" r="0.8" fill="#67E8F9" opacity="0.5" />
      <circle cx="10" cy="0" r="0.8" fill="#67E8F9" opacity="0.5" />
    </g>
  </svg>
)

export const Level7Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl7Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" />
        <stop offset="50%" stopColor="#00DDFF" />
        <stop offset="100%" stopColor="#FF1493" />
      </linearGradient>
      <radialGradient id="lvl7Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl7Glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl7Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl7Shine)" />
    <g transform="translate(50, 50)" filter="url(#lvl7Glow)">
      <line x1="0" y1="12" x2="0" y2="-16" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-9" cy="5" r="4.5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="9" cy="5" r="4.5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="-7" cy="-2" r="4" fill="#FFFFFF" opacity="0.98" />
      <circle cx="7" cy="-2" r="4" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-5" cy="-8" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="5" cy="-8" r="3.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-3" cy="-13" r="3" fill="#FFFFFF" opacity="0.96" />
      <circle cx="3" cy="-13" r="3" fill="#FFFFFF" opacity="0.96" />
      <circle cx="0" cy="-16" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="0" r="2.5" fill="#FF1493" opacity="0.8" />
      <circle cx="-12" cy="2" r="1" fill="#00FFFF" opacity="0.6" />
      <circle cx="12" cy="2" r="1" fill="#FF1493" opacity="0.6" />
      <circle cx="0" cy="-18" r="1" fill="#00FFFF" opacity="0.6" />
    </g>
  </svg>
)

export const Level8Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl8Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>
      <radialGradient id="lvl8Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl8Glow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#lvl8Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl8Shine)" />
    <g transform="translate(50, 50)" filter="url(#lvl8Glow)">
      <line x1="0" y1="13" x2="0" y2="-18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-10" cy="6" r="5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="10" cy="6" r="5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="-8" cy="-1" r="4.5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="8" cy="-1" r="4.5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-6" cy="-9" r="4" fill="#FFFFFF" opacity="0.97" />
      <circle cx="6" cy="-9" r="4" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-4" cy="-14" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="4" cy="-14" r="3.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-1" cy="-18" r="3" fill="#FFFFFF" opacity="0.95" />
      <circle cx="1" cy="-18" r="3" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="0" r="3" fill="#0369A1" opacity="0.8" />
      <circle cx="-13" cy="3" r="1.2" fill="#38BDF8" opacity="0.7" />
      <circle cx="13" cy="3" r="1.2" fill="#38BDF8" opacity="0.7" />
      <circle cx="0" cy="-20" r="1.2" fill="#0369A1" opacity="0.6" />
      <circle cx="-6" cy="10" r="0.8" fill="#38BDF8" opacity="0.5" />
      <circle cx="6" cy="10" r="0.8" fill="#38BDF8" opacity="0.5" />
    </g>
  </svg>
)

export const Level9Icon3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="lvl9Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFACD" />
        <stop offset="14%" stopColor="#00FFFF" />
        <stop offset="28%" stopColor="#0099FF" />
        <stop offset="42%" stopColor="#8855FF" />
        <stop offset="56%" stopColor="#FF00FF" />
        <stop offset="70%" stopColor="#FF1493" />
        <stop offset="84%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <radialGradient id="lvl9Shine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="lvl9Glow">
        <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FF1493" strokeWidth="1.5" opacity="0.4" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl9Grad)" />
    <circle cx="50" cy="50" r="45" fill="url(#lvl9Shine)" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.9" />
    <g transform="translate(50, 50)" filter="url(#lvl9Glow)">
      <line x1="0" y1="14" x2="0" y2="-20" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="-11" cy="7" r="5.5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="11" cy="7" r="5.5" fill="#FFFFFF" opacity="0.99" />
      <circle cx="-9" cy="0" r="5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="9" cy="0" r="5" fill="#FFFFFF" opacity="0.98" />
      <circle cx="-7" cy="-9" r="4.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="7" cy="-9" r="4.5" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-5" cy="-15" r="4" fill="#FFFFFF" opacity="0.96" />
      <circle cx="5" cy="-15" r="4" fill="#FFFFFF" opacity="0.96" />
      <circle cx="-2" cy="-19" r="3.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="2" cy="-19" r="3.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="-20" r="3" fill="#FFFFFF" opacity="0.94" />
      <circle cx="0" cy="0" r="4" fill="#FFD700" opacity="0.9" />
      <circle cx="-15" cy="4" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="15" cy="4" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="0" cy="-22" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="-8" cy="12" r="1.2" fill="#00FFFF" opacity="0.7" />
      <circle cx="8" cy="12" r="1.2" fill="#FF1493" opacity="0.7" />
      <circle cx="-12" cy="-8" r="1" fill="#00FFFF" opacity="0.6" />
      <circle cx="12" cy="-8" r="1" fill="#FF1493" opacity="0.6" />
      <circle cx="18" cy="0" r="1" fill="#FFD700" opacity="0.6" />
      <circle cx="-18" cy="0" r="1" fill="#FFD700" opacity="0.6" />
      <circle cx="0" cy="18" r="1.2" fill="#FFD700" opacity="0.7" />
      <circle cx="0" cy="-24" r="1" fill="#00FFFF" opacity="0.5" />
    </g>
  </svg>
)
