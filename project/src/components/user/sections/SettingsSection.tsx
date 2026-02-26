import { DarkModeToggle } from '../../ui/DarkModeToggle'

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zayia-deep-violet">⚙️ Configurações</h2>
        <p className="text-zayia-violet-gray text-sm mt-1">Personalize sua experiência na ZAYIA</p>
      </div>

      {/* Aparência Section */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">🎨 Aparência</h3>
        <DarkModeToggle />
      </div>

      {/* Notificações Section */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4">🔔 Notificações</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <label className="text-gray-700 font-medium cursor-pointer">Desafios Diários</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <label className="text-gray-700 font-medium cursor-pointer">Medalhas Conquistadas</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <label className="text-gray-700 font-medium cursor-pointer">Mensagens da Comunidade</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
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
