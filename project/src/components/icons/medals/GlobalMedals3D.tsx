import React from 'react'

// FASE 1: OVO (Egg) - Primeiros Passos
export const GlobalEgg3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="eggGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#D6E9FF" />
      </linearGradient>
      <radialGradient id="eggShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="eggShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#7DD3FC" floodOpacity="0.3"/>
      </filter>
      <filter id="eggGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#eggGrad)" filter="url(#eggShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#eggShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#7DD3FC" strokeWidth="0.8" opacity="0.4" />

    {/* Conteúdo: Ovo minúsculo */}
    <g transform="translate(50, 50)" filter="url(#eggGlow)">
      {/* Forma de ovo */}
      <ellipse cx="0" cy="0" rx="8" ry="10" fill="#E0F2FE" opacity="0.98" stroke="#7DD3FC" strokeWidth="0.8" />

      {/* Pequeno brilho */}
      <ellipse cx="-2" cy="-3" rx="2" ry="3" fill="#FFFFFF" opacity="0.4" />
    </g>
  </svg>
)

// FASE 2: LAGARTA (Caterpillar) - Conquistadora
export const GlobalCaterpillar3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="caterpillarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#BBF7D0" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <radialGradient id="caterpillarShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="caterpillarShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#059669" floodOpacity="0.4"/>
      </filter>
      <filter id="caterpillarGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#caterpillarGrad)" filter="url(#caterpillarShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#caterpillarShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#059669" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Lagarta segmentada */}
    <g transform="translate(50, 50)" filter="url(#caterpillarGlow)">
      {/* Cabeça */}
      <circle cx="-8" cy="0" r="3" fill="#FFFFFF" opacity="0.97" />
      <circle cx="-8" cy="-2" r="0.8" fill="#059669" opacity="0.7" />
      <circle cx="-8" cy="2" r="0.8" fill="#059669" opacity="0.7" />

      {/* Corpo segmentado (4 segmentos) */}
      <circle cx="-3" cy="0" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="2" cy="0" r="2.5" fill="#FFFFFF" opacity="0.96" />
      <circle cx="7" cy="0" r="2.5" fill="#FFFFFF" opacity="0.95" />
      <circle cx="12" cy="0" r="2.2" fill="#FFFFFF" opacity="0.94" />

      {/* Detalhes dos segmentos */}
      <path d="M -5 -2 Q -3 -1.5 -1 -2" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.6" />
      <path d="M 0 -2 Q 2 -1.5 4 -2" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.6" />
      <path d="M 5 -2 Q 7 -1.5 9 -2" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.5" />

      {/* Pequenas pernas/antenas */}
      <line x1="-8" y1="3" x2="-9" y2="6" stroke="#059669" strokeWidth="0.8" opacity="0.6" />
      <line x1="12" y1="2.5" x2="13" y2="5" stroke="#059669" strokeWidth="0.6" opacity="0.5" />
    </g>
  </svg>
)

// FASE 3: CRISÁLIDA (Chrysalis) - Heroína
export const GlobalChrysalis3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="chrysalisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <radialGradient id="chrysalisShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="chrysalisShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#A855F7" floodOpacity="0.5"/>
      </filter>
      <filter id="chrysalisGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#chrysalisGrad)" filter="url(#chrysalisShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#chrysalisShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#A855F7" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Crisálida envolvida */}
    <g transform="translate(50, 50)" filter="url(#chrysalisGlow)">
      {/* Forma envolvida (casulo) */}
      <ellipse cx="0" cy="0" rx="10" ry="14" fill="#FFFFFF" opacity="0.98" stroke="#A855F7" strokeWidth="1" />

      {/* Textura de casulo */}
      <path d="M -8 -8 Q -6 -10 -4 -8" fill="none" stroke="#A855F7" strokeWidth="0.5" opacity="0.5" />
      <path d="M 4 -8 Q 6 -10 8 -8" fill="none" stroke="#A855F7" strokeWidth="0.5" opacity="0.5" />
      <path d="M -8 0 Q -10 2 -8 4" fill="none" stroke="#A855F7" strokeWidth="0.5" opacity="0.5" />
      <path d="M 8 0 Q 10 2 8 4" fill="none" stroke="#A855F7" strokeWidth="0.5" opacity="0.5" />

      {/* Aura começando */}
      <circle cx="0" cy="0" r="16" fill="none" stroke="#A855F7" strokeWidth="1" opacity="0.4" />

      {/* Brilho */}
      <ellipse cx="-3" cy="-5" rx="3" ry="4" fill="#FFFFFF" opacity="0.3" />
    </g>
  </svg>
)

// FASE 4: BORBOLETA EM METAMORFOSE - Campeã
export const GlobalButterflyEmerging3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="buttEmerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="33%" stopColor="#A855F7" />
        <stop offset="66%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
      <radialGradient id="buttEmerShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="buttEmerShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#EC4899" floodOpacity="0.6"/>
      </filter>
      <filter id="buttEmerGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#buttEmerGrad)" filter="url(#buttEmerShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#buttEmerShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.8" />

    {/* Conteúdo: Borboleta emergindo */}
    <g transform="translate(50, 50)" filter="url(#buttEmerGlow)">
      {/* Corpo */}
      <ellipse cx="0" cy="0" rx="2" ry="8" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="-8" r="2.5" fill="#FFFFFF" opacity="0.98" />

      {/* Asas abrindo (45 graus) */}
      <path d="M -2 -2 Q -10 -8 -12 -2 Q -11 2 -4 3" fill="#86EFAC" opacity="0.95" stroke="#059669" strokeWidth="0.8" />
      <path d="M 2 -2 Q 10 -8 12 -2 Q 11 2 4 3" fill="#A855F7" opacity="0.95" stroke="#7E22CE" strokeWidth="0.8" />

      {/* Antenas */}
      <path d="M -1 -10 Q -2 -14 -2 -16" fill="none" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M 1 -10 Q 2 -14 2 -16" fill="none" stroke="#FFFFFF" strokeWidth="1" />

      {/* Aura forte */}
      <circle cx="0" cy="0" r="16" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.6" />
      <circle cx="0" cy="0" r="20" fill="none" stroke="#0EA5E9" strokeWidth="1" opacity="0.4" />

      {/* Partículas de energia */}
      <circle cx="-14" cy="-2" r="1" fill="#EC4899" opacity="0.7" />
      <circle cx="14" cy="-2" r="1" fill="#0EA5E9" opacity="0.7" />
    </g>
  </svg>
)

// FASE 5: BORBOLETA RADIANTE - Rainha Suprema
export const GlobalButterflyRadiant3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="buttRadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="16%" stopColor="#10B981" />
        <stop offset="32%" stopColor="#0EA5E9" />
        <stop offset="48%" stopColor="#A855F7" />
        <stop offset="64%" stopColor="#EC4899" />
        <stop offset="80%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <radialGradient id="buttRadShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="buttRadShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#FFD700" floodOpacity="0.8"/>
      </filter>
      <filter id="buttRadGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#buttRadGrad)" filter="url(#buttRadShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#buttRadShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Borboleta radiante suprema */}
    <g transform="translate(50, 50)" filter="url(#buttRadGlow)">
      {/* Corpo supremo */}
      <ellipse cx="0" cy="0" rx="3" ry="10" fill="#FFFFFF" opacity="0.99" />
      <circle cx="0" cy="-11" r="3.5" fill="#FFFFFF" opacity="0.99" />

      {/* Olhos brilhantes */}
      <circle cx="-1" cy="-11" r="0.6" fill="#FFD700" opacity="0.8" />
      <circle cx="1" cy="-11" r="0.6" fill="#FFD700" opacity="0.8" />

      {/* Asas superiores completamente abertas */}
      <path d="M -3 -4 Q -16 -14 -18 -4 Q -16 4 -6 6 Z" fill="#86EFAC" opacity="0.97" stroke="#059669" strokeWidth="1" />
      <path d="M 3 -4 Q 16 -14 18 -4 Q 16 4 6 6 Z" fill="#0EA5E9" opacity="0.97" stroke="#0284C7" strokeWidth="1" />

      {/* Asas inferiores */}
      <path d="M -3 4 Q -14 12 -14 18 Q -10 16 -4 12 Z" fill="#A855F7" opacity="0.96" stroke="#7E22CE" strokeWidth="0.8" />
      <path d="M 3 4 Q 14 12 14 18 Q 10 16 4 12 Z" fill="#EC4899" opacity="0.96" stroke="#BE185D" strokeWidth="0.8" />

      {/* Antenas elegantes */}
      <path d="M -1 -14 Q -3 -18 -3.5 -20" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 1 -14 Q 3 -18 3.5 -20" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

      {/* Detalhes nas asas (padrão) */}
      <circle cx="-12" cy="-8" r="1.2" fill="#FFD700" opacity="0.7" />
      <circle cx="12" cy="-8" r="1.2" fill="#FCD34D" opacity="0.7" />
      <circle cx="-9" cy="2" r="0.8" fill="#FFFFFF" opacity="0.6" />
      <circle cx="9" cy="2" r="0.8" fill="#FFFFFF" opacity="0.6" />

      {/* Aura brilhante múltipla */}
      <circle cx="0" cy="0" r="20" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.7" />
      <circle cx="0" cy="0" r="25" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.4" />
      <circle cx="0" cy="0" r="30" fill="none" stroke="#0EA5E9" strokeWidth="1" opacity="0.2" />

      {/* Pó mágico e partículas celestiais */}
      <circle cx="-24" cy="-4" r="1.5" fill="#FFD700" opacity="0.8" />
      <circle cx="24" cy="-4" r="1.5" fill="#FCD34D" opacity="0.8" />
      <circle cx="-18" cy="14" r="1" fill="#EC4899" opacity="0.7" />
      <circle cx="18" cy="14" r="1" fill="#0EA5E9" opacity="0.7" />
      <circle cx="0" cy="-22" r="1.2" fill="#FFD700" opacity="0.7" />
      <circle cx="-20" cy="8" r="0.8" fill="#86EFAC" opacity="0.6" />
      <circle cx="20" cy="8" r="0.8" fill="#A855F7" opacity="0.6" />

      {/* Efeito bioluminescência (pequenos brilhos extras) */}
      <circle cx="-10" cy="-10" r="0.5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="10" cy="-10" r="0.5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="-8" cy="4" r="0.4" fill="#FFFFFF" opacity="0.7" />
      <circle cx="8" cy="4" r="0.4" fill="#FFFFFF" opacity="0.7" />
    </g>
  </svg>
)
