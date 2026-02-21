import React, { useState, useEffect } from 'react'
import { supabaseClient, type WhatsAppGroup } from '../../lib/supabase-client'
import { integrationsManager } from '../../lib/integrations-manager'
import { 
  Plus, 
  MessageCircle, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Users,
  Copy,
  Check
} from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function CommunitySection() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([])
  const [loading, setLoading] = useState(false)

  // Load groups on component mount
  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setLoading(true)
    try {
      // Always try localStorage first, then Supabase if configured
      const savedGroups = localStorage.getItem('zayia_whatsapp_groups')
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups))
      }
      
      // Try Supabase if configured
      if (integrationsManager.isSupabaseConfigured()) {
        try {
          const groupsData = await supabaseClient.getWhatsAppGroups()
          if (groupsData.length > 0) {
            setGroups(groupsData)
          }
        } catch (error) {
          console.log('Supabase fetch failed, using localStorage data')
        }
      }
    } catch (error) {
      console.log('Using fallback data for groups')
    } finally {
      setLoading(false)
    }
  }

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [newGroup, setNewGroup] = useState<Partial<WhatsAppGroup>>({
    name: '',
    description: '',
    link: '',
    rules: '1. Seja respeitosa com todas as participantes\n2. Compartilhe apenas conteúdo relacionado ao crescimento pessoal\n3. Evite spam e autopromoção excessiva\n4. Mantenha um ambiente acolhedor e positivo\n5. Respeite a privacidade das outras participantes',
    welcome_message: 'Bem-vinda à Comunidade ZAYIA! 💜 Aqui você encontrará apoio, inspiração e irmãs de jornada. Apresente-se e conte um pouco sobre seus objetivos!',
    is_active: true
  })

  const handleAddGroup = async () => {
    if (newGroup.name && newGroup.link) {
      try {
        if (integrationsManager.isSupabaseConfigured()) {
          const createdGroup = await supabaseClient.createWhatsAppGroup({
            name: newGroup.name,
            description: newGroup.description || '',
            link: newGroup.link,
            rules: newGroup.rules || '',
            welcome_message: newGroup.welcome_message || '',
            member_count: 0,
            is_active: newGroup.is_active || true
          })
          
          if (createdGroup) {
            setGroups([createdGroup, ...groups])
          }
        } else {
          // Fallback to localStorage
          const group: WhatsAppGroup = {
            id: Date.now().toString(),
            name: newGroup.name,
            description: newGroup.description || '',
            link: newGroup.link,
            rules: newGroup.rules || '',
            welcome_message: newGroup.welcome_message || '',
            member_count: 0,
            is_active: newGroup.is_active || true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          const updatedGroups = [group, ...groups]
          setGroups(updatedGroups)
          localStorage.setItem('zayia_whatsapp_groups', JSON.stringify(updatedGroups))
        }
      } catch (error) {
        console.error('Error creating group:', error)
      }
      
      setNewGroup({
        name: '',
        description: '',
        link: '',
        rules: '1. Seja respeitosa com todas as participantes\n2. Compartilhe apenas conteúdo relacionado ao crescimento pessoal\n3. Evite spam e autopromoção excessiva\n4. Mantenha um ambiente acolhedor e positivo\n5. Respeite a privacidade das outras participantes',
        welcome_message: 'Bem-vinda à Comunidade ZAYIA! 💜 Aqui você encontrará apoio, inspiração e irmãs de jornada. Apresente-se e conte um pouco sobre seus objetivos!',
        is_active: true
      })
      setShowAddForm(false)
    }
  }

  const handleDeleteGroup = async (id: string) => {
    try {
      if (integrationsManager.isSupabaseConfigured()) {
        const success = await supabaseClient.deleteWhatsAppGroup(id)
        if (success) {
          setGroups(groups.filter(group => group.id !== id))
        }
      } else {
        // Fallback to localStorage
        const updatedGroups = groups.filter(group => group.id !== id)
        setGroups(updatedGroups)
        localStorage.setItem('zayia_whatsapp_groups', JSON.stringify(updatedGroups))
      }
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }

  const handleCopyLink = (link: string, groupId: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(groupId)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const handleUpdateGroup = async (id: string, updates: Partial<WhatsAppGroup>) => {
    try {
      if (integrationsManager.isSupabaseConfigured()) {
        const updatedGroup = await supabaseClient.updateWhatsAppGroup(id, updates)
        if (updatedGroup) {
          setGroups(groups.map(group => group.id === id ? updatedGroup : group))
        }
      } else {
        // Fallback to localStorage
        const updatedGroups = groups.map(group => 
          group.id === id ? { ...group, ...updates, updated_at: new Date().toISOString() } : group
        )
        setGroups(updatedGroups)
        localStorage.setItem('zayia_whatsapp_groups', JSON.stringify(updatedGroups))
      }
    } catch (error) {
      console.error('Error updating group:', error)
    }
    setEditingGroup(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="zayia-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold zayia-gradient-text mb-2">
              💬 Comunidade WhatsApp
            </h2>
            <p className="text-zayia-violet-gray">
              Gerencie os grupos de WhatsApp da comunidade ZAYIA
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Carregando...' : 'Adicionar Grupo'}
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Users className="w-8 h-8 text-zayia-deep-violet mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">{groups.length}</div>
            <div className="text-sm text-zayia-violet-gray">Grupos Ativos</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <MessageCircle className="w-8 h-8 text-zayia-soft-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {groups.reduce((total, group) => total + (group.member_count || 0), 0)}
            </div>
            <div className="text-sm text-zayia-violet-gray">Total de Membros</div>
          </div>
          <div className="text-center p-4 bg-zayia-lilac/20 rounded-xl">
            <Check className="w-8 h-8 text-zayia-lavender mx-auto mb-2" />
            <div className="text-2xl font-bold text-zayia-deep-violet">
              {groups.filter(group => group.is_active).length}
            </div>
            <div className="text-sm text-zayia-violet-gray">Grupos Online</div>
          </div>
        </div>
      </div>

      {/* Lista de Grupos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="zayia-card p-6">
            {editingGroup === group.id ? (
              // Modo de Edição
              <div className="space-y-4">
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => setGroups(groups.map(g => 
                    g.id === group.id ? { ...g, name: e.target.value } : g
                  ))}
                  className="w-full zayia-input px-4 py-2 rounded-xl border-0 focus:outline-none font-semibold"
                />
                <textarea
                  value={group.description}
                  onChange={(e) => setGroups(groups.map(g => 
                    g.id === group.id ? { ...g, description: e.target.value } : g
                  ))}
                  className="w-full zayia-input px-4 py-2 rounded-xl border-0 focus:outline-none resize-none"
                  rows={2}
                />
                <input
                  type="url"
                  value={group.link}
                  onChange={(e) => setGroups(groups.map(g => 
                    g.id === group.id ? { ...g, link: e.target.value } : g
                  ))}
                  className="w-full zayia-input px-4 py-2 rounded-xl border-0 focus:outline-none"
                  placeholder="https://chat.whatsapp.com/..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateGroup(group.id, group)}
                    className="zayia-button px-4 py-2 rounded-xl text-white font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingGroup(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo de Visualização
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zayia-deep-violet">{group.name}</h3>
                      <p className="text-sm text-zayia-violet-gray">{group.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingGroup(group.id)}
                      className="text-zayia-soft-purple hover:text-zayia-deep-violet transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Informações do Grupo */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zayia-violet-gray">Membros:</span>
                    <span className="font-medium text-zayia-deep-violet">{group.member_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zayia-violet-gray">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      group.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {group.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zayia-violet-gray">Criado em:</span>
                    <span className="font-medium text-zayia-deep-violet">
                      {new Date(group.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Link do Grupo */}
                <div className="bg-zayia-lilac/20 p-3 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <div className="text-xs text-zayia-violet-gray mb-1">Link do Grupo:</div>
                      <div className="text-sm text-zayia-deep-violet font-mono break-all">
                        {group.link}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyLink(group.link, group.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-zayia-soft-purple text-white rounded-lg hover:bg-zayia-deep-violet transition-colors"
                    >
                      {copiedLink === group.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-xs">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Botão de Acesso */}
                <div className="flex gap-3">
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 zayia-button py-3 px-4 rounded-xl text-white font-semibold text-center flex items-center justify-center gap-2 hover:scale-105 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Entrar no Grupo
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Adicionar Grupo */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zayia-deep-violet">Adicionar Novo Grupo</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Grupo *
                  </label>
                  <input
                    type="text"
                    value={newGroup.name || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                    placeholder="Ex: ZAYIA - Mindfulness & Meditação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={newGroup.description || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Descreva o propósito e foco do grupo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do Grupo WhatsApp *
                  </label>
                  <input
                    type="url"
                    value={newGroup.link || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, link: e.target.value })}
                    className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regras do Grupo
                  </label>
                  <textarea
                    value={newGroup.rules || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, rules: e.target.value })}
                    className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none resize-none"
                    rows={6}
                    placeholder="Digite as regras do grupo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem de Boas-vindas
                  </label>
                  <textarea
                    value={newGroup.welcome_message || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, welcome_message: e.target.value })}
                    className="w-full zayia-input px-4 py-3 rounded-xl border-0 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Mensagem que será enviada para novos membros..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newGroup.is_active || false}
                    onChange={(e) => setNewGroup({ ...newGroup, is_active: e.target.checked })}
                    className="rounded border-zayia-lilac"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Grupo ativo (visível para usuárias)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-zayia-lilac/30">
                <button
                  onClick={handleAddGroup}
                  disabled={!newGroup.name || !newGroup.link}
                  className="zayia-button px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Grupo
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Mensagem quando não há grupos */}
      {groups.length === 0 && (
        <div className="zayia-card p-12 text-center">
          <MessageCircle className="w-16 h-16 text-zayia-violet-gray mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zayia-deep-violet mb-2">
            Nenhum grupo criado ainda
          </h3>
          <p className="text-zayia-violet-gray mb-6">
            Comece criando seu primeiro grupo de WhatsApp para a comunidade ZAYIA
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="zayia-button px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Grupo
          </button>
        </div>
      )}
    </div>
  )
}