import { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import { useAuth } from '../../../../contexts/AuthContext'
import { LoadingSpinner } from '../../../ui/LoadingSpinner'

export function AvatarUpload() {
  const { profile, updateProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(profile?.avatar_url || null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida (PNG, JPG, WebP)')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 5MB')
      return
    }

    setIsUploading(true)

    try {
      // 1. Converter para base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string

        // 2. Salvar base64 em localStorage para preview persistente
        localStorage.setItem(`zayia_avatar_${profile?.id}`, base64String)
        setPreview(base64String)

        // 3. Atualizar profile com nova URL
        // Em produção, isto seria uma URL de Supabase Storage
        // Por agora, salvamos o base64 diretamente
        await updateProfile({
          avatar_url: base64String
        })

        console.log('✅ Avatar atualizado com sucesso')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('❌ Erro ao fazer upload:', err)
      setError('Erro ao fazer upload da foto. Tente novamente.')
    } finally {
      setIsUploading(false)
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!confirm('Tem certeza que deseja remover a foto?')) return

    try {
      setIsUploading(true)
      localStorage.removeItem(`zayia_avatar_${profile?.id}`)
      setPreview(null)
      await updateProfile({
        avatar_url: undefined
      })
      console.log('✅ Foto removida')
    } catch (err) {
      console.error('❌ Erro ao remover:', err)
      setError('Erro ao remover foto')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender flex items-center justify-center overflow-hidden shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-5xl">👤</div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Alterar foto de perfil"
          className="absolute bottom-0 right-0 bg-zayia-soft-purple text-white p-2.5 rounded-full hover:bg-zayia-deep-violet disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {isUploading ? (
            <div className="animate-spin">
              <Upload className="w-5 h-5" />
            </div>
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>

        {/* Remove Button (se tem foto) */}
        {preview && (
          <button
            onClick={handleRemoveAvatar}
            disabled={isUploading}
            title="Remover foto"
            className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 disabled:opacity-50 transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      {/* Status Message */}
      {isUploading && (
        <div className="flex items-center gap-2 text-zayia-soft-purple">
          <LoadingSpinner size="sm" />
          <span className="text-sm font-medium">Enviando foto...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-500 text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-zayia-violet-gray text-center">
        Clique na câmera para alterar foto
        <br />
        <span className="text-xs">Máximo 5MB • PNG, JPG ou WebP</span>
      </p>
    </div>
  )
}
