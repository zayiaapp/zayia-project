/**
 * Mock data para Community System
 * Sincroniza com localStorage para simular Supabase
 */

export interface CommunityMessage {
  id: string
  userId: string
  userProfile: {
    id: string
    fullName: string
    email: string
    avatarUrl?: string
  }
  content: string
  createdAt: string
  updatedAt: string
  deletedByAdmin: boolean
  deletedAt?: string
  deletionReason?: string
  reactions: MessageReaction[]
}

export interface MessageReaction {
  emoji: string
  count: number
  userReacted: boolean
}

export interface CommunityBan {
  id: string
  userId: string
  banNumber: number
  banDuration: '1_day' | '7_days' | 'permanent'
  reason: string
  bannedAt: string
  expiresAt?: string
  status: 'active' | 'expired'
}

export interface CommunityRules {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  updatedByAdminId: string
}

export interface DeletedMessagesLog {
  id: string
  messageId: string
  userId: string
  content: string
  deletedByAdminId: string
  reason: string
  deletedAt: string
}

interface ReactionRecord {
  emoji: string
  userId: string
}

// Helper function to convert ReactionRecords to MessageReactions
function formatReactions(reactions: ReactionRecord[], currentUserId?: string): MessageReaction[] {
  if (!reactions || reactions.length === 0) return []

  const grouped: Record<string, { emoji: string; userIds: string[] }> = {}
  reactions.forEach((r) => {
    if (!grouped[r.emoji]) {
      grouped[r.emoji] = { emoji: r.emoji, userIds: [] }
    }
    grouped[r.emoji].userIds.push(r.userId)
  })

  return Object.values(grouped).map((g) => ({
    emoji: g.emoji,
    count: g.userIds.length,
    userReacted: currentUserId ? g.userIds.includes(currentUserId) : false
  }))
}

export interface MessageReport {
  id: string
  messageId: string
  messageContent: string
  messageSenderId: string
  messageSenderName: string
  reportedBy: string | null // null se anônimo
  reportedByName: string | null
  reason: 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other'
  description?: string
  createdAt: string
  status: 'pending' | 'resolved' | 'archived'
}

export class CommunityDataMock {
  private static readonly STORAGE_KEYS = {
    messages: 'zayia_community_messages',
    bans: 'zayia_community_bans',
    rules: 'zayia_community_rules',
    deletedLog: 'zayia_community_deleted_log',
    reactions: 'zayia_community_reactions',
    reports: 'zayia_community_reports'
  }

  /**
   * Inicializar dados mock no localStorage
   */
  static initialize() {
    if (!localStorage.getItem(this.STORAGE_KEYS.messages)) {
      localStorage.setItem(this.STORAGE_KEYS.messages, JSON.stringify([
        {
          id: 'msg-1',
          userId: 'user-demo',
          userProfile: {
            id: 'user-demo',
            fullName: 'Maria Silva',
            email: 'user@zayia.com',
            avatarUrl: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
          },
          content: 'Oi meninas! 👋 Bem-vinda a comunidade ZAYIA! Aqui é um espaço seguro para a gente compartilhar experiências.',
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          deletedByAdmin: false,
          reactions: []
        },
        {
          id: 'msg-2',
          userId: 'user-ana',
          userProfile: {
            id: 'user-ana',
            fullName: 'Ana Costa',
            email: 'ana@exemplo.com',
            avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
          },
          content: 'Amei a iniciativa! Estou muito feliz em estar aqui com vocês todas.',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          deletedByAdmin: false,
          reactions: []
        }
      ]))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.bans)) {
      localStorage.setItem(this.STORAGE_KEYS.bans, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.rules)) {
      localStorage.setItem(
        this.STORAGE_KEYS.rules,
        JSON.stringify({
          id: 'rules-default',
          content: `## 📋 Regras da Comunidade ZAYIA

1. **Respeito acima de tudo** - Trate todas com respeito e dignidade
2. **Sem assédio ou discriminação** - Qualquer forma de discriminação não é tolerada
3. **Sem spam** - Não faça spam de links ou conteúdo irrelevante
4. **Sem conteúdo ilegal** - Proibido compartilhar conteúdo ilegal ou prejudicial
5. **Privacidade** - Respeite a privacidade das outras meninas
6. **Sem self-promotion excessivo** - Publicidades devem ser aprovadas
7. **Construtivo é melhor** - Críticas devem ser construtivas e respeitosas

**Consequências por violação:**
- 1ª vez: Ban de 1 dia
- 2ª vez: Ban de 7 dias
- 3ª vez: Ban permanente`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedByAdminId: 'ceo-123'
        })
      )
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.deletedLog)) {
      localStorage.setItem(this.STORAGE_KEYS.deletedLog, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.reactions)) {
      localStorage.setItem(this.STORAGE_KEYS.reactions, JSON.stringify({}))
    }

    if (!localStorage.getItem(this.STORAGE_KEYS.reports)) {
      localStorage.setItem(this.STORAGE_KEYS.reports, JSON.stringify([]))
    }
  }

  /**
   * Obter todas as mensagens (incluindo deletadas)
   * Deletadas são marcadas com deletedByAdmin: true mas ainda incluídas
   */
  static getMessages(limit = 50, offset = 0): CommunityMessage[] {
    const messages = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.messages) || '[]') as CommunityMessage[]
    const reactions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reactions) || '{}') as Record<string, ReactionRecord[]>

    return messages
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)
      .map((msg) => ({
        ...msg,
        reactions: formatReactions(reactions[msg.id] || [])
      }))
  }

  /**
   * Enviar nova mensagem
   */
  static sendMessage(userId: string, userProfile: CommunityMessage['userProfile'], content: string): CommunityMessage {
    const messages = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.messages) || '[]') as CommunityMessage[]

    const newMessage: CommunityMessage = {
      id: `msg-${Date.now()}`,
      userId,
      userProfile,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedByAdmin: false,
      reactions: []
    }

    messages.push(newMessage)
    localStorage.setItem(this.STORAGE_KEYS.messages, JSON.stringify(messages))

    return newMessage
  }

  /**
   * Deletar mensagem (admin only)
   */
  static deleteMessage(messageId: string, deletedByAdminId: string, reason: string): boolean {
    const messages = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.messages) || '[]') as CommunityMessage[]
    const deletedLog = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.deletedLog) || '[]') as DeletedMessagesLog[]

    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return false

    const message = messages[messageIndex]

    // Marcar como deletado
    messages[messageIndex].deletedByAdmin = true
    messages[messageIndex].deletedAt = new Date().toISOString()
    messages[messageIndex].deletionReason = reason

    // Adicionar ao log
    deletedLog.push({
      id: `log-${Date.now()}`,
      messageId,
      userId: message.userId,
      content: message.content,
      deletedByAdminId,
      reason,
      deletedAt: new Date().toISOString()
    })

    localStorage.setItem(this.STORAGE_KEYS.messages, JSON.stringify(messages))
    localStorage.setItem(this.STORAGE_KEYS.deletedLog, JSON.stringify(deletedLog))

    return true
  }

  /**
   * Adicionar reação a mensagem
   */
  static addReaction(messageId: string, userId: string, emoji: string): boolean {
    const reactions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reactions) || '{}') as Record<string, ReactionRecord[]>

    if (!reactions[messageId]) {
      reactions[messageId] = []
    }

    // Verificar se usuária já reagiu com esse emoji
    const existingReaction = reactions[messageId].find(
      (r) => r.emoji === emoji && r.userId === userId
    )

    if (existingReaction) {
      return false // Já reagiu
    }

    reactions[messageId].push({ emoji, userId })
    localStorage.setItem(this.STORAGE_KEYS.reactions, JSON.stringify(reactions))

    return true
  }

  /**
   * Remover reação de mensagem
   */
  static removeReaction(messageId: string, userId: string, emoji: string): boolean {
    const reactions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reactions) || '{}') as Record<string, ReactionRecord[]>

    if (!reactions[messageId]) return false

    const initialLength = reactions[messageId].length
    reactions[messageId] = reactions[messageId].filter(
      (r) => !(r.emoji === emoji && r.userId === userId)
    )

    const removed = reactions[messageId].length < initialLength

    if (removed) {
      localStorage.setItem(this.STORAGE_KEYS.reactions, JSON.stringify(reactions))
    }

    return removed
  }

  /**
   * Obter reações formatadas para uma mensagem
   */
  static getFormattedReactions(messageId: string, currentUserId: string): MessageReaction[] {
    const reactions = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reactions) || '{}') as Record<string, ReactionRecord[]>
    const messageReactions = reactions[messageId] || []

    // Agrupar por emoji e contar
    const grouped = messageReactions.reduce((acc: Record<string, { emoji: string; userIds: string[] }>, r) => {
      if (!acc[r.emoji]) {
        acc[r.emoji] = { emoji: r.emoji, userIds: [] }
      }
      acc[r.emoji].userIds.push(r.userId)
      return acc
    }, {})

    return Object.values(grouped).map((group: any) => ({
      emoji: group.emoji,
      count: group.userIds.length,
      userReacted: group.userIds.includes(currentUserId)
    }))
  }

  /**
   * Banir usuária
   */
  static banUser(userId: string, _bannedByAdminId: string, reason: string): CommunityBan {
    const bans = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.bans) || '[]')
    const activeBans = bans.filter((b: any) => b.userId === userId && b.status === 'active')

    const banNumber = activeBans.length + 1
    let banDuration: '1_day' | '7_days' | 'permanent' = '1_day'
    let expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    if (banNumber === 2) {
      banDuration = '7_days'
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    } else if (banNumber >= 3) {
      banDuration = 'permanent'
      expiresAt = undefined
    }

    const newBan: CommunityBan = {
      id: `ban-${Date.now()}`,
      userId,
      banNumber,
      banDuration,
      reason,
      bannedAt: new Date().toISOString(),
      expiresAt,
      status: 'active'
    }

    bans.push(newBan)
    localStorage.setItem(this.STORAGE_KEYS.bans, JSON.stringify(bans))

    // Atualizar profiles com status de ban
    const savedProfile = localStorage.getItem('zayia_profile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      if (profile.id === userId) {
        profile.community_banned = true
        profile.community_ban_expires_at = expiresAt
        localStorage.setItem('zayia_profile', JSON.stringify(profile))
      }
    }

    return newBan
  }

  /**
   * Verificar se usuária está banida
   */
  static checkIfUserIsBanned(userId: string): { isBanned: boolean; expiresAt?: string; banNumber?: number } {
    const bans = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.bans) || '[]')
    const activeBans = bans
      .filter((b: any) => b.userId === userId && b.status === 'active')
      .sort((a: any, b: any) => new Date(b.bannedAt).getTime() - new Date(a.bannedAt).getTime())

    if (activeBans.length === 0) {
      return { isBanned: false }
    }

    const latestBan = activeBans[0]

    // Verificar se ban temporário expirou
    if (latestBan.banDuration !== 'permanent' && latestBan.expiresAt) {
      const now = new Date()
      const expiresAt = new Date(latestBan.expiresAt)

      if (now > expiresAt) {
        // Ban expirou
        latestBan.status = 'expired'
        localStorage.setItem(this.STORAGE_KEYS.bans, JSON.stringify(bans))
        return { isBanned: false }
      }
    }

    return {
      isBanned: true,
      expiresAt: latestBan.expiresAt,
      banNumber: latestBan.banNumber
    }
  }

  /**
   * Obter histórico de bans de uma usuária
   */
  static getUserBanHistory(userId: string): CommunityBan[] {
    const bans = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.bans) || '[]')
    return bans
      .filter((b: any) => b.userId === userId)
      .sort((a: any, b: any) => new Date(b.bannedAt).getTime() - new Date(a.bannedAt).getTime())
  }

  /**
   * Obter regras da comunidade
   */
  static getRules(): CommunityRules {
    return JSON.parse(
      localStorage.getItem(this.STORAGE_KEYS.rules) ||
        JSON.stringify({
          id: 'rules-default',
          content: 'Regras da comunidade não configuradas.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedByAdminId: 'ceo-123'
        })
    )
  }

  /**
   * Atualizar regras (admin only)
   */
  static updateRules(content: string, updatedByAdminId: string): CommunityRules {
    const newRules: CommunityRules = {
      id: `rules-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedByAdminId
    }

    localStorage.setItem(this.STORAGE_KEYS.rules, JSON.stringify(newRules))

    return newRules
  }

  /**
   * Obter log de deletions
   */
  static getDeletedMessagesLog(): DeletedMessagesLog[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.deletedLog) || '[]').sort(
    // @ts-ignore
      (a: any, b: any) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    )
  }

  /**
   * Enviar report de mensagem
   */
  static submitReport(
    messageId: string,
    message: CommunityMessage,
    reportedBy: string | null,
    reportedByName: string | null,
    reason: 'disrespectful' | 'inappropriate' | 'spam' | 'discrimination' | 'privacy' | 'other',
    description?: string
  ): MessageReport {
    const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reports) || '[]')

    const newReport: MessageReport = {
      id: `report-${Date.now()}`,
      messageId,
      messageContent: message.content,
      messageSenderId: message.userId,
      messageSenderName: message.userProfile.fullName,
      reportedBy,
      reportedByName,
      reason,
      description,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    reports.push(newReport)
    localStorage.setItem(this.STORAGE_KEYS.reports, JSON.stringify(reports))

    return newReport
  }

  /**
   * Obter reports (filtrados por status)
   */
  static getReports(status?: 'pending' | 'resolved' | 'archived'): MessageReport[] {
    const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reports) || '[]')

    // @ts-ignore
    if (status) {
      return reports.filter((r: any) => r.status === status).sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
    // @ts-ignore

    return reports.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  /**
   * Atualizar status de report
    // @ts-ignore
   */
  static updateReportStatus(reportId: string, newStatus: 'pending' | 'resolved' | 'archived'): boolean {
    const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reports) || '[]')
    const reportIndex = reports.findIndex((r: any) => r.id === reportId)

    if (reportIndex === -1) return false

    reports[reportIndex].status = newStatus
    localStorage.setItem(this.STORAGE_KEYS.reports, JSON.stringify(reports))

    return true
  }

  /**
    // @ts-ignore
   * Obter contagem de reports pendentes
   */
  static getPendingReportCount(): number {
    const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reports) || '[]')
    return reports.filter((r: any) => r.status === 'pending').length
  }

    // @ts-ignore
  /**
   * Obter report por ID
   */
  static getReportById(reportId: string): MessageReport | null {
    const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.reports) || '[]')
    return reports.find((r: any) => r.id === reportId) || null
  }
}

// Inicializar ao carregar
CommunityDataMock.initialize()
