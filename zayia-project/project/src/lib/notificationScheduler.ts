// Sistema de agendamento de notificações
export interface NotificationMessage {
  id: string
  type: 'morning' | 'evening' | 'absence'
  message: string
  scheduledTime: string
  timezone: string
}

// 15 Mensagens da Manhã (06h)
export const morningMessages: string[] = [
  "6h agora. Acorda e prova que sua disciplina manda em você, não a preguiça.",
  "O mundo ainda dorme. Você vai ser a que começa na frente ou a que sempre fica pra trás?",
  "Primeira vitória do dia: abrir o ZAYIA e encarar seus desafios.",
  "Levanta. Se você não domina a manhã, perde o resto do dia.",
  "Hoje não é sobre motivação, é sobre decisão. E a sua começa agora.",
  "6h. Sua transformação não espera. Ou você age, ou se trai de novo.",
  "Enquanto outras enrolam, você executa. Quem você quer ser hoje?",
  "Começar cedo não é sacrifício, é estratégia. Vai ou foge?",
  "Seu eu do futuro tá assistindo. Ele vai te aplaudir ou sentir vergonha?",
  "Você pediu uma chance pra mudar. Ela tá batendo na porta agora.",
  "6h. Sua disciplina não dorme. Você vai levantar junto ou vai ficar devendo?",
  "Começo do dia define tudo. Já decidiu se hoje vai ser vitória ou desculpa?",
  "Não precisa vencer o mês, nem o ano. Só precisa vencer essa manhã.",
  "Quer uma vida nova? Ela começa com o primeiro clique no ZAYIA hoje.",
  "Toda vez que você levanta cedo, você mata a versão fraca dentro de você."
]

// 15 Mensagens da Noite (20h)
export const eveningMessages: string[] = [
  "20h agora. O dia tá acabando. Se não cumpriu seus desafios, ainda dá tempo.",
  "Mais um dia se foi… vai fechar no débito ou na vitória?",
  "20h. Último chamado: cumpre seus desafios e dorme com a consciência limpa.",
  "Ainda dá tempo de salvar hoje. Um desafio. Uma ação. Fecha o dia sem desculpa.",
  "Hoje termina em poucas horas. Vai deixar em branco ou vai marcar sua execução?",
  "Quando sua cabeça encostar no travesseiro, só você vai saber se fez o que precisava.",
  "20h. Essa noite pode ser só mais uma, ou pode ser a prova da sua mudança.",
  "Antes de dormir, responde: você venceu hoje ou se traiu de novo?",
  "Dia quase acabando. Melhor terminar cansada por ter feito do que culpada por ter fugido.",
  "Ainda tem tempo de honrar a promessa que você fez pra si mesma.",
  "20h agora. Última chance de mostrar que hoje não foi mais um dia perdido.",
  "Se amanhã fosse seu recomeço, você ia dormir arrependida ou orgulhosa?",
  "Amanhã começa com o jeito que você fecha hoje. Fecha forte.",
  "Hoje não volta mais. Mas você ainda pode fechar esse ciclo executando.",
  "Sua disciplina tá de olho. Vai terminar a noite fiel ou traindo de novo?"
]

// 7 Mensagens de Ausência
export const absenceMessages: string[] = [
  "Você sumiu… mas a culpa não some junto. Volta antes que pese mais.",
  "Cada dia fora é um tijolo no muro que você mesma constrói contra sua mudança.",
  "Fugir do ZAYIA é fugir de si mesma. Só volta. Não precisa recomeçar, só continuar.",
  "Enquanto você some, sua versão fraca cresce. É isso que você quer?",
  "Se afastar não alivia, só adia. E amanhã a cobrança volta ainda mais pesada.",
  "Você jurou que ia até o fim. Esse silêncio é disciplina morrendo.",
  "Sua rotina não morreu. Só tá esperando você ter coragem de voltar."
]

export class NotificationScheduler {
  private static instance: NotificationScheduler
  private morningIndex: number = 0
  private eveningIndex: number = 0
  private absenceIndex: number = 0

  constructor() {
    // Carregar índices salvos
    this.morningIndex = parseInt(localStorage.getItem('morning_message_index') || '0')
    this.eveningIndex = parseInt(localStorage.getItem('evening_message_index') || '0')
    this.absenceIndex = parseInt(localStorage.getItem('absence_message_index') || '0')
  }

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler()
    }
    return NotificationScheduler.instance
  }

  // Obter próxima mensagem da manhã
  getNextMorningMessage(): string {
    const message = morningMessages[this.morningIndex]
    this.morningIndex = (this.morningIndex + 1) % morningMessages.length
    localStorage.setItem('morning_message_index', this.morningIndex.toString())
    return message
  }

  // Obter próxima mensagem da noite
  getNextEveningMessage(): string {
    const message = eveningMessages[this.eveningIndex]
    this.eveningIndex = (this.eveningIndex + 1) % eveningMessages.length
    localStorage.setItem('evening_message_index', this.eveningIndex.toString())
    return message
  }

  // Obter próxima mensagem de ausência
  getNextAbsenceMessage(): string {
    const message = absenceMessages[this.absenceIndex]
    this.absenceIndex = (this.absenceIndex + 1) % absenceMessages.length
    localStorage.setItem('absence_message_index', this.absenceIndex.toString())
    return message
  }

  // Agendar notificações diárias
  scheduleDailyNotifications() {
    // Cancelar agendamentos anteriores
    this.cancelAllScheduledNotifications()

    // Agendar manhã (6h)
    this.scheduleNotification('morning', 6, 0)
    
    // Agendar noite (20h)
    this.scheduleNotification('evening', 20, 0)
  }

  private scheduleNotification(type: 'morning' | 'evening', hour: number, minute: number) {
    const now = new Date()
    const scheduledTime = new Date()
    
    // Configurar para horário de Brasília (UTC-3)
    scheduledTime.setHours(hour - 3, minute, 0, 0) // Ajuste para UTC
    
    // Se já passou do horário hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime()

    setTimeout(() => {
      this.sendScheduledNotification(type)
      // Reagendar para o próximo dia
      this.scheduleNotification(type, hour, minute)
    }, timeUntilNotification)

    console.log(`${type} notification scheduled for:`, scheduledTime.toLocaleString('pt-BR'))
  }

  private async sendScheduledNotification(type: 'morning' | 'evening') {
    const message = type === 'morning' 
      ? this.getNextMorningMessage() 
      : this.getNextEveningMessage()

    await this.sendNotification({
      title: type === 'morning' ? '🌅 Bom dia, guerreira!' : '🌙 Hora de fechar o dia!',
      body: message,
      icon: '/zayia-icon.png',
      tag: `zayia-${type}`,
      requireInteraction: true
    })
  }

  // Verificar ausência e enviar notificação
  checkAbsenceAndNotify() {
    const lastLogin = localStorage.getItem('last_login_time')
    
    if (!lastLogin) return

    const lastLoginTime = new Date(lastLogin)
    const now = new Date()
    const hoursSinceLogin = (now.getTime() - lastLoginTime.getTime()) / (1000 * 60 * 60)

    // Se passou 24h sem login
    if (hoursSinceLogin >= 24) {
      const message = this.getNextAbsenceMessage()
      
      this.sendNotification({
        title: '💜 Sentimos sua falta...',
        body: message,
        icon: '/zayia-icon.png',
        tag: 'zayia-absence',
        requireInteraction: true
      })
    }
  }

  private async sendNotification(options: {
    title: string
    body: string
    icon: string
    tag: string
    requireInteraction: boolean
  }) {
    // Verificar se as notificações estão habilitadas
    if (Notification.permission !== 'granted') {
      console.log('Notifications not permitted')
      return
    }

    // Enviar notificação local
    new Notification(options.title, {
      body: options.body,
      icon: options.icon,
      tag: options.tag,
      requireInteraction: options.requireInteraction
    })

    // Salvar no histórico
    this.saveNotificationToHistory(options.title, options.body)
  }

  private saveNotificationToHistory(title: string, body: string) {
    const history = JSON.parse(localStorage.getItem('notification_history') || '[]')
    history.unshift({
      id: Date.now().toString(),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false
    })
    
    // Manter apenas os últimos 50
    if (history.length > 50) {
      history.splice(50)
    }
    
    localStorage.setItem('notification_history', JSON.stringify(history))
  }

  private cancelAllScheduledNotifications() {
    // Limpar todos os timeouts (em uma implementação real, você salvaria os IDs)
    console.log('Canceling all scheduled notifications')
  }

  // Inicializar sistema
  initialize() {
    // Agendar notificações diárias
    this.scheduleDailyNotifications()
    
    // Verificar ausência a cada hora
    setInterval(() => {
      this.checkAbsenceAndNotify()
    }, 60 * 60 * 1000) // A cada 1 hora
    
    console.log('Notification system initialized')
  }
}

// Instância singleton
export const notificationScheduler = NotificationScheduler.getInstance()