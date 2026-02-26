import React from 'react'

export const RoutineInitiate3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="routInitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
      <radialGradient id="routInitShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="routInitShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F97316" floodOpacity="0.5"/>
      </filter>
      <filter id="routInitGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#routInitGrad)" filter="url(#routInitShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#routInitShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.6" />

    {/* Conteúdo: Simples relógio */}
    <g transform="translate(50, 50)" filter="url(#routInitGlow)">
      {/* Mostrador */}
      <circle cx="0" cy="0" r="11" fill="#FFFFFF" opacity="0.95" stroke="#F97316" strokeWidth="1.5" />

      {/* Números do relógio (12 e 6) */}
      <circle cx="0" cy="-8" r="0.7" fill="#F97316" />
      <circle cx="0" cy="8" r="0.7" fill="#F97316" />
      <circle cx="8" cy="0" r="0.7" fill="#F97316" />
      <circle cx="-8" cy="0" r="0.7" fill="#F97316" />

      {/* Ponteiros */}
      <line x1="0" y1="0" x2="0" y2="-6" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="4" y2="0" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />

      {/* Centro do relógio */}
      <circle cx="0" cy="0" r="1.4" fill="#F97316" />
    </g>
  </svg>
)

export const RoutinePractitioner3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="routPratGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <radialGradient id="routPratShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="routPratShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#F97316" floodOpacity="0.6"/>
      </filter>
      <filter id="routPratGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#routPratGrad)" filter="url(#routPratShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#routPratShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.7" />

    {/* Conteúdo: Relógio com lista de tarefas */}
    <g transform="translate(50, 50)" filter="url(#routPratGlow)">
      {/* Relógio esquerdo */}
      <circle cx="-8" cy="-2" r="8" fill="#FFFFFF" opacity="0.97" stroke="#EA580C" strokeWidth="1" />
      <line x1="-8" y1="-2" x2="-8" y2="-8" stroke="#F97316" strokeWidth="1.2" />
      <line x1="-8" y1="-2" x2="-2" y2="-2" stroke="#F97316" strokeWidth="1" />
      <circle cx="-8" cy="-2" r="1" fill="#F97316" />

      {/* Checklist direito */}
      <rect x="2" y="-11" width="16" height="3" rx="1" fill="#FFFFFF" opacity="0.96" />
      <rect x="2" y="-6" width="16" height="3" rx="1" fill="#FFFFFF" opacity="0.96" />
      <rect x="2" y="-1" width="16" height="3" rx="1" fill="#FFFFFF" opacity="0.96" />

      {/* Marcas de conclusão */}
      <path d="M 3 -9 L 6 -6 L 8 -11" stroke="#EA580C" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M 3 -4 L 6 -1 L 8 -6" stroke="#EA580C" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Linha de conexão */}
      <line x1="0" y1="-2" x2="2" y2="-8" stroke="#F97316" strokeWidth="0.8" opacity="0.5" />
    </g>
  </svg>
)

export const RoutineMaster3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="routMastGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="33%" stopColor="#F97316" />
        <stop offset="66%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <radialGradient id="routMastShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="routMastShadow">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#EA580C" floodOpacity="0.7"/>
      </filter>
      <filter id="routMastGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <circle cx="50" cy="50" r="45" fill="url(#routMastGrad)" filter="url(#routMastShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#routMastShine)" />
    <circle cx="50" cy="50" r="47" fill="none" stroke="#EA580C" strokeWidth="1.5" opacity="0.8" />
    <circle cx="50" cy="50" r="49" fill="none" stroke="#F97316" strokeWidth="0.5" opacity="0.4" />

    {/* Conteúdo: Calendário com rotinas */}
    <g transform="translate(50, 50)" filter="url(#routMastGlow)">
      {/* Cabeçalho do calendário */}
      <rect x="-14" y="-13" width="28" height="5" rx="1" fill="#EA580C" opacity="0.8" />
      <text x="0" y="-9" textAnchor="middle" fontSize="2" fill="#FFFFFF" opacity="0.9">MÊS</text>

      {/* Dia/semanas */}
      <rect x="-14" y="-7" width="28" height="19" fill="#FFFFFF" opacity="0.97" stroke="#F97316" strokeWidth="1" />

      {/* Grade do calendário (7 células) */}
      <circle cx="-8" cy="-1" r="2" fill="#EA580C" opacity="0.5" />
      <circle cx="0" cy="-1" r="2" fill="#EA580C" opacity="0.5" />
      <circle cx="8" cy="-1" r="2" fill="#EA580C" opacity="0.5" />

      {/* Marca de rotina concluída */}
      <circle cx="0" cy="-1" r="2.5" fill="none" stroke="#F97316" strokeWidth="1.2" opacity="0.7" />

      {/* Indicador de hora certa */}
      <circle cx="0" cy="12" r="2" fill="#F97316" opacity="0.7" />
      <path d="M -0.5 11 L 0.5 12 L 0 13" stroke="#FFFFFF" strokeWidth="0.5" fill="none" />
    </g>
  </svg>
)

export const RoutineSuprema3D = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="routSuprGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEDD5" />
        <stop offset="20%" stopColor="#FED7AA" />
        <stop offset="40%" stopColor="#F97316" />
        <stop offset="60%" stopColor="#EA580C" />
        <stop offset="80%" stopColor="#C2410C" />
        <stop offset="100%" stopColor="#7C2D12" />
      </linearGradient>
      <radialGradient id="routSuprShine" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <filter id="routSuprGlow">
        <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="routSuprShadow">
        <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#C2410C" floodOpacity="0.8"/>
      </filter>
    </defs>

    {/* Aura extrema */}
    <circle cx="50" cy="50" r="50" fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.5" />
    <circle cx="50" cy="50" r="48" fill="none" stroke="#FED7AA" strokeWidth="1.5" opacity="0.4" />

    <circle cx="50" cy="50" r="45" fill="url(#routSuprGrad)" filter="url(#routSuprShadow)" />
    <circle cx="50" cy="50" r="45" fill="url(#routSuprShine)" />

    {/* Anel externo brilhante */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.9" />

    {/* Conteúdo: Sistema holístico de rotinas com tempo cíclico */}
    <g transform="translate(50, 50)" filter="url(#routSuprGlow)">
      {/* Relógio central (supremo) */}
      <circle cx="0" cy="0" r="11" fill="#FFFFFF" opacity="0.99" stroke="#F97316" strokeWidth="2" />
      <circle cx="0" cy="0" r="11" fill="none" stroke="#EA580C" strokeWidth="1" opacity="0.6" />

      {/* Fases do dia ao redor do relógio */}
      <circle cx="0" cy="-11" r="3" fill="#FFFFFF" opacity="0.95" />
      <circle cx="11" cy="0" r="3" fill="#FFFFFF" opacity="0.95" />
      <circle cx="0" cy="11" r="3" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-11" cy="0" r="3" fill="#FFFFFF" opacity="0.95" />

      {/* Indicadores de horas do relógio (6 principal) */}
      <circle cx="0" cy="-8" r="0.8" fill="#F97316" />
      <circle cx="8" cy="0" r="0.8" fill="#F97316" />
      <circle cx="0" cy="8" r="0.8" fill="#F97316" />
      <circle cx="-8" cy="0" r="0.8" fill="#F97316" />

      {/* Ponteiros animados (sugestão de movimento) */}
      <line x1="0" y1="0" x2="0" y2="-7" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="0" x2="6" y2="0" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" />

      {/* Centro com brilho */}
      <circle cx="0" cy="0" r="2" fill="#F97316" opacity="0.8" />

      {/* Linhas de conexão entre fases */}
      <line x1="0" y1="-11" x2="11" y2="0" stroke="#F97316" strokeWidth="1" opacity="0.5" />
      <line x1="11" y1="0" x2="0" y2="11" stroke="#F97316" strokeWidth="1" opacity="0.5" />
      <line x1="0" y1="11" x2="-11" y2="0" stroke="#F97316" strokeWidth="1" opacity="0.5" />
      <line x1="-11" y1="0" x2="0" y2="-11" stroke="#F97316" strokeWidth="1" opacity="0.5" />

      {/* Aura de ciclo/rotina */}
      <circle cx="0" cy="0" r="16" fill="none" stroke="#EA580C" strokeWidth="1.5" opacity="0.6" />
      <circle cx="0" cy="0" r="20" fill="none" stroke="#FED7AA" strokeWidth="1" opacity="0.4" />

      {/* Partículas de rotina suprema */}
      <circle cx="0" cy="-21" r="1" fill="#F97316" opacity="0.7" />
      <circle cx="21" cy="0" r="1" fill="#F97316" opacity="0.7" />
      <circle cx="0" cy="21" r="1" fill="#F97316" opacity="0.7" />
      <circle cx="-21" cy="0" r="1" fill="#F97316" opacity="0.7" />
    </g>
  </svg>
)
