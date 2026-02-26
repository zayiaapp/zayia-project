import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Carregar preferência do localStorage
    const saved = localStorage.getItem('zayia-dark-mode')
    if (saved) {
      const darkMode = JSON.parse(saved)
      setIsDarkMode(darkMode)
      applyTheme(darkMode)
    }
  }, [])

  const handleToggle = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('zayia-dark-mode', JSON.stringify(newMode))
    applyTheme(newMode)
  }

  const applyTheme = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        {isDarkMode ? (
          <Moon className="w-5 h-5 text-gray-600" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
        <label className="font-medium text-gray-700">
          {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
        </label>
      </div>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            isDarkMode ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
