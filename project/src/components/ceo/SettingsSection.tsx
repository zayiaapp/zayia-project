import { DarkModeToggle } from '../ui/DarkModeToggle'

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-zayia-deep-violet to-zayia-soft-purple rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">⚙️ Configurações</h1>
        <p className="text-white/90 text-lg mt-2">Personalize sua experiência na ZAYIA</p>
      </div>

      {/* Aparência Section */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">🎨 Aparência</h3>
        <DarkModeToggle />
      </div>

      {/* Sobre Section */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">ℹ️ Sobre</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Versão da ZAYIA</span>
            <span className="font-semibold text-zayia-deep-violet">2.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Ambiente</span>
            <span className="font-semibold text-zayia-deep-violet">Produção</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Última atualização</span>
            <span className="font-semibold text-zayia-deep-violet">2026-02-25</span>
          </div>
        </div>
      </div>
    </div>
  )
}
