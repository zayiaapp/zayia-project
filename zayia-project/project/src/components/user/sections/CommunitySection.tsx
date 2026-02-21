import React, { useState, useEffect } from 'react'
import { supabaseClient, type WhatsAppGroup } from '../../../lib/supabase-client'
import { integrationsManager } from '../../../lib/integrations-manager'
import { 
  MessageCircle, 
  ExternalLink, 
  Users, 
  Shield, 
  Heart,
  ArrowRight,
  Smartphone
} from 'lucide-react'
import { LoadingSpinner } from '../../ui/LoadingSpinner'

export function CommunitySection() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setLoading(true)
    try {
      // Tentar carregar do Supabase primeiro
      if (integrationsManager.isSupabaseConfigured()) {
        const groupsData = await supabaseClient.getActiveWhatsAppGroups()
        if (groupsData.length > 0) {
          setGroups(groupsData)
        } else {
          // Fallback para dados mock
          setGroups(getMockGroups())
        }
      } else {
        setGroups(getMockGroups())
      }
    } catch (error) {
      console.error('Error loading groups:', error)
      setGroups(getMockGroups())
    } finally {
      setLoading(false)
    }
  }

  // Dados mock para demonstração
  const getMockGroups = (): WhatsAppGroup[] => [
    {
      id: '1',
      name: 'ZAYIA - Mindfulness & Meditação',
      description: 'Grupo focado em práticas de mindfulness, meditação e bem-estar emocional.',
      link: 'https://chat.whatsapp.com/mindfulness-zayia',
      rules: '1. Seja respeitosa com todas as participantes\n2. Compartilhe apenas conteúdo relacionado ao mindfulness\n3. Evite spam e autopromoção\n4. Mantenha um ambiente acolhedor\n5. Respeite a privacidade das outras',
      welcome_message: 'Bem-vinda ao grupo de Mindfulness! 🧘‍♀️ Aqui compartilhamos práticas de meditação e bem-estar.',
      member_count: 234,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'ZAYIA - Corpo & Saúde',
      description: 'Grupo dedicado a exercícios, alimentação saudável e cuidados com o corpo.',
      link: 'https://chat.whatsapp.com/corpo-saude-zayia',
      rules: '1. Compartilhe dicas de exercícios e alimentação\n2. Apoie as colegas em suas jornadas fitness\n3. Sem body shaming\n4. Celebre todas as vitórias, grandes e pequenas\n5. Mantenha o foco na saúde, não na aparência',
      welcome_message: 'Bem-vinda ao grupo Corpo & Saúde! 💪 Vamos juntas em direção a uma vida mais saudável!',
      member_count: 189,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'ZAYIA - Carreira & Empreendedorismo',
      description: 'Espaço para trocar experiências sobre carreira, negócios e desenvolvimento profissional.',
      link: 'https://chat.whatsapp.com/carreira-zayia',
      rules: '1. Compartilhe oportunidades de trabalho\n2. Apoie o crescimento profissional das colegas\n3. Sem spam de produtos ou serviços\n4. Mantenha discussões construtivas\n5. Celebre as conquistas profissionais',
      welcome_message: 'Bem-vinda ao grupo de Carreira! 💼 Aqui crescemos profissionalmente juntas!',
      member_count: 156,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-zayia-violet-gray">Carregando comunidade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da Comunidade */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-zayia-soft-purple to-zayia-lavender rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
          Comunidade ZAYIA 💜
        </h2>
        <p className="text-zayia-violet-gray text-sm px-4">
          Conecte-se com outras guerreiras em grupos exclusivos do WhatsApp
        </p>
      </div>

      {/* Estatísticas da Comunidade */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="zayia-card p-4 text-center">
          <MessageCircle className="w-6 h-6 text-zayia-soft-purple mx-auto mb-2" />
          <div className="text-xl font-bold text-zayia-deep-violet">{groups.length}</div>
          <div className="text-xs text-zayia-violet-gray">Grupos Ativos</div>
        </div>
        <div className="zayia-card p-4 text-center">
          <Heart className="w-6 h-6 text-zayia-lavender mx-auto mb-2" />
          <div className="text-xl font-bold text-zayia-deep-violet">
            {groups.reduce((total, group) => total + (group.member_count || 0), 0)}
          </div>
          <div className="text-xs text-zayia-violet-gray">Guerreiras Conectadas</div>
        </div>
      </div>

      {/* Lista de Grupos */}
      {groups.length === 0 ? (
        <div className="zayia-card p-8 text-center">
          <Smartphone className="w-16 h-16 text-zayia-violet-gray mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">
            Em breve!
          </h3>
          <p className="text-zayia-violet-gray text-sm">
            Os grupos da comunidade serão liberados em breve. Fique atenta às novidades!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="zayia-card p-6">
              {/* Header do Grupo */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-zayia-deep-violet mb-1">
                    {group.name}
                  </h3>
                  <p className="text-sm text-zayia-violet-gray">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Informações do Grupo */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-zayia-lilac/20 rounded-xl">
                  <Users className="w-5 h-5 text-zayia-soft-purple mx-auto mb-1" />
                  <div className="text-lg font-bold text-zayia-deep-violet">
                    {group.member_count || 0}
                  </div>
                  <div className="text-xs text-zayia-violet-gray">Participantes</div>
                </div>
                <div className="text-center p-3 bg-zayia-lilac/20 rounded-xl">
                  <Shield className="w-5 h-5 text-zayia-lavender mx-auto mb-1" />
                  <div className="text-lg font-bold text-zayia-deep-violet">
                    {group.rules?.split('\n').length || 0}
                  </div>
                  <div className="text-xs text-zayia-violet-gray">Regras</div>
                </div>
              </div>

              {/* Regras do Grupo */}
              {group.rules && (
                <div className="mb-4 p-4 bg-zayia-lilac/10 rounded-xl">
                  <h4 className="font-semibold text-zayia-deep-violet mb-2 text-sm">
                    📋 Regras do Grupo:
                  </h4>
                  <div className="space-y-1">
                    {group.rules.split('\n').map((rule, index) => (
                      <p key={index} className="text-xs text-zayia-violet-gray">
                        {rule}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem de Boas-vindas */}
              {group.welcome_message && (
                <div className="mb-4 p-3 bg-gradient-to-r from-zayia-lilac/20 to-zayia-lavender/20 rounded-xl">
                  <p className="text-sm text-zayia-deep-violet font-medium">
                    💜 {group.welcome_message}
                  </p>
                </div>
              )}

              {/* Botão de Entrar */}
              <a
                href={group.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full zayia-button py-4 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:scale-105 transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Entrar no Grupo
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="zayia-card p-6 text-center bg-gradient-to-r from-zayia-lilac/30 to-zayia-lavender/30">
        <Heart className="w-12 h-12 text-zayia-orchid mx-auto mb-3" />
        <h3 className="text-lg font-bold text-zayia-deep-violet mb-2">
          Juntas Somos Mais Fortes! 💪
        </h3>
        <p className="text-sm text-zayia-violet-gray">
          Participe dos grupos e conecte-se com outras guerreiras que estão na mesma jornada de transformação que você.
        </p>
      </div>
    </div>
  )
}