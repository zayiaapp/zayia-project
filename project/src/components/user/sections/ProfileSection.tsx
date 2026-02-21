import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { 
  User, 
  Camera, 
  Save, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Edit,
  CreditCard,
  Home,
  FileText,
  Crown,
  Trophy
} from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'

export function ProfileSection() {
  const { profile, updateProfile, signOut } = useAuth()
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    nickname: profile?.nickname || '',
    cpf: profile?.cpf || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: {
      street: profile?.address?.street || '',
      number: profile?.address?.number || '',
      complement: profile?.address?.complement || '',
      neighborhood: profile?.address?.neighborhood || '',
      city: profile?.address?.city || '',
      state: profile?.address?.state || '',
      zipcode: profile?.address?.zipcode || ''
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Atualizar perfil
    await updateProfile(formData)
    
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Meu Perfil
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      {/* Foto de Perfil */}
      <div className="zayia-card p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-zayia-deep-violet text-white rounded-full flex items-center justify-center hover:bg-zayia-soft-purple transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-1">
          {profile?.full_name || 'Usuária ZAYIA'}
        </h3>
        <p className="text-sm text-zayia-violet-gray mb-2">{profile?.email}</p>
        <div className="flex items-center justify-center gap-4 text-xs text-zayia-violet-gray">
          <div className="flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span>Nível {profile?.level || 1}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>{profile?.points || 0} pontos</span>
          </div>
        </div>
      </div>

      {/* Formulário de Dados */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-zayia-deep-violet">Dados Pessoais</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Editar</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={!isEditing}
              className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Seu nome completo"
            />
          </div>

          {/* Apelido */}
          <div>
            <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
              Apelido (para o ranking)
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              disabled={!isEditing}
              className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Como quer aparecer no ranking"
            />
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
              CPF
            </label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
              disabled={!isEditing}
              className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          {/* Email (não editável) */}
          <div>
            <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full zayia-input pl-10 pr-4 py-3 rounded-xl border-0 focus:outline-none bg-gray-50 text-gray-500"
              />
            </div>
            <p className="text-xs text-zayia-violet-gray mt-1">
              Email não pode ser alterado
            </p>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zayia-violet-gray w-5 h-5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full zayia-input pl-10 pr-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Endereço Completo */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zayia-deep-violet flex items-center gap-2">
              <Home className="w-4 h-4" />
              Endereço Completo
            </h4>
            
            {/* Rua e Número */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Rua/Avenida
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  disabled={!isEditing}
                  className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Nome da rua"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => handleInputChange('address.number', e.target.value)}
                  disabled={!isEditing}
                  className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="123"
                />
              </div>
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={formData.address.complement}
                onChange={(e) => handleInputChange('address.complement', e.target.value)}
                disabled={!isEditing}
                className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Apto, bloco, etc. (opcional)"
              />
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                Bairro
              </label>
              <input
                type="text"
                value={formData.address.neighborhood}
                onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                disabled={!isEditing}
                className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Nome do bairro"
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  disabled={!isEditing}
                  className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Sua cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                  Estado
                </label>
                <select
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  disabled={!isEditing}
                  className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">UF</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
            </div>

            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-zayia-deep-violet mb-2">
                CEP
              </label>
              <input
                type="text"
                value={formData.address.zipcode}
                onChange={(e) => handleInputChange('address.zipcode', formatCEP(e.target.value))}
                disabled={!isEditing}
                className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 zayia-gradient text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Informações da Conta */}
      <div className="zayia-card p-6">
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Informações da Conta
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-zayia-lilac/20 rounded-xl">
            <span className="text-sm text-zayia-violet-gray">Membro desde:</span>
            <span className="text-sm font-medium text-zayia-deep-violet">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-zayia-lilac/20 rounded-xl">
            <span className="text-sm text-zayia-violet-gray">Último acesso:</span>
            <span className="text-sm font-medium text-zayia-deep-violet">
              {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-zayia-lilac/20 rounded-xl">
            <span className="text-sm text-zayia-violet-gray">Status da conta:</span>
            <span className="text-sm font-medium text-green-600">Ativa</span>
          </div>
        </div>
      </div>

      {/* Botão de Sair */}
      <div className="zayia-card p-6">
        <button
          onClick={signOut}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
        <p className="text-xs text-zayia-violet-gray text-center mt-2">
          Você será redirecionado para a tela de login
        </p>
      </div>
    </div>
  )
}