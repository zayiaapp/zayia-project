import React from 'react'

// Ícone customizado para Relacionamentos
export function RelationshipsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.4 7 14 7.4 14 8V10C14 10.6 14.4 11 15 11H17V13C17 13.6 17.4 14 18 14S19 13.6 19 13V11H21C21.6 11 22 10.6 22 10V8C22 7.4 21.6 7 21 7V9ZM9 7H3C2.4 7 2 7.4 2 8V10C2 10.6 2.4 11 3 11H5V13C5 13.6 5.4 14 6 14S7 13.6 7 13V11H9C9.6 11 10 10.6 10 10V8C10 7.4 9.6 7 9 7ZM12 8C10.9 8 10 8.9 10 10V12C10 13.1 10.9 14 12 14S14 13.1 14 12V10C14 8.9 13.1 8 12 8ZM12 16C9.8 16 8 17.8 8 20V22H16V20C16 17.8 14.2 16 12 16Z"/>
    </svg>
  )
}

// Ícone customizado para Digital Detox
export function DigitalDetoxIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z"/>
      <path d="M9 8H15V10H9V8Z"/>
      <path d="M9 11H15V13H9V11Z"/>
      <path d="M9 14H13V16H9V14Z"/>
      <circle cx="12" cy="19" r="1"/>
      {/* X para indicar "detox" */}
      <path d="M15 3L17 5M17 3L15 5" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  )
}

// Ícone customizado para Corpo & Saúde
export function HealthIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
      <circle cx="6.5" cy="6.5" r="1.5"/>
      <circle cx="17.5" cy="6.5" r="1.5"/>
      <path d="M12 10C10.9 10 10 10.9 10 12S10.9 14 12 14S14 13.1 14 12S13.1 10 12 10Z"/>
      <path d="M8 16C8 18.2 9.8 20 12 20S16 18.2 16 16"/>
    </svg>
  )
}