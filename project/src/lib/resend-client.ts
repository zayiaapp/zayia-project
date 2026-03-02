export interface ResendConfig {
  api_key: string
  from_email: string
  from_name: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class ResendClient {
  private config: ResendConfig | null = null

  initialize(config: ResendConfig) {
    this.config = config
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<{ success: boolean, messageId?: string, error?: string }> {
    try {
      if (!this.config) {
        throw new Error('Resend not configured')
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${this.config.from_name} <${this.config.from_email}>`,
          to: [to],
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao enviar email')
      }

      const data = await response.json()
      
      return {
        success: true,
        messageId: data.id
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  generateWelcomeEmail(userName: string): EmailTemplate {
    return {
      subject: 'Bem-vinda à ZAYIA! 💜 Sua jornada de transformação começa agora',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vinda à ZAYIA</title>
          </head>
          <body style="font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #FEFBFF, #E9D5FF); margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">ZAYIA</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Sua mentora de transformação pessoal</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #7C3AED; font-size: 24px; margin: 0 0 20px 0;">Olá, ${userName}! ✨</h2>
                
                <p style="color: #6B7280; line-height: 1.6; margin: 0 0 20px 0;">
                  Que alegria ter você conosco! Sua jornada de transformação e crescimento pessoal começa agora.
                </p>
                
                <div style="background: linear-gradient(135deg, #E9D5FF, #FEFBFF); padding: 25px; border-radius: 15px; margin: 20px 0;">
                  <h3 style="color: #7C3AED; margin: 0 0 15px 0; font-size: 18px;">🎯 O que te espera na ZAYIA:</h3>
                  <ul style="color: #6B7280; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Chat personalizado com IA especializada em empoderamento feminino</li>
                    <li>Desafios diários para fortalecer autoestima e confiança</li>
                    <li>Sistema de gamificação com níveis e conquistas</li>
                    <li>Comunidade acolhedora de mulheres em transformação</li>
                    <li>Acompanhamento de progresso e celebração de vitórias</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://zayia.com/dashboard" style="background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Começar Minha Jornada 💜
                  </a>
                </div>
                
                <p style="color: #6B7280; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                  Lembre-se: cada pequeno passo conta. Você é mais forte do que imagina! 💪
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #F8FAFC; padding: 20px 30px; text-align: center; border-top: 1px solid #E9D5FF;">
                <p style="color: #6B7280; margin: 0; font-size: 12px;">
                  © 2024 ZAYIA - Feito com 💜 para mulheres que querem transformar suas vidas
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Olá, ${userName}!
        
        Bem-vinda à ZAYIA! 💜
        
        Que alegria ter você conosco! Sua jornada de transformação e crescimento pessoal começa agora.
        
        O que te espera na ZAYIA:
        • Chat personalizado com IA especializada em empoderamento feminino
        • Desafios diários para fortalecer autoestima e confiança  
        • Sistema de gamificação com níveis e conquistas
        • Comunidade acolhedora de mulheres em transformação
        • Acompanhamento de progresso e celebração de vitórias
        
        Acesse: https://zayia.com/dashboard
        
        Lembre-se: cada pequeno passo conta. Você é mais forte do que imagina! 💪
        
        Com amor,
        Equipe ZAYIA
      `
    }
  }

  generateTestEmail(): EmailTemplate {
    return {
      subject: '🧪 Teste Resend - ZAYIA',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Teste Resend</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 500px; margin: 0 auto; text-align: center;">
              <h1 style="color: #7C3AED;">🧪 Teste Resend</h1>
              <p>Se você recebeu este email, o Resend está configurado corretamente!</p>
              <div style="background: #E9D5FF; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0; color: #7C3AED; font-weight: bold;">
                  ✅ Integração funcionando perfeitamente!
                </p>
              </div>
              <p style="color: #6B7280; font-size: 14px;">
                Enviado em: ${new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
        🧪 Teste Resend - ZAYIA
        
        Se você recebeu este email, o Resend está configurado corretamente!
        
        ✅ Integração funcionando perfeitamente!
        
        Enviado em: ${new Date().toLocaleString('pt-BR')}
      `
    }
  }

  async testConnection(testEmail: string): Promise<{ success: boolean, message: string, details?: unknown }> {
    try {
      if (!this.config) {
        return {
          success: false,
          message: 'Resend não configurado'
        }
      }

      const template = this.generateTestEmail()
      const result = await this.sendEmail(testEmail, template)

      if (result.success) {
        return {
          success: true,
          message: 'Email de teste enviado com sucesso!',
          details: {
            test_email_sent: true,
            message_id: result.messageId,
            recipient: testEmail,
            from: `${this.config.from_name} <${this.config.from_email}>`
          }
        }
      } else {
        return {
          success: false,
          message: result.error || 'Erro ao enviar email de teste'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro no Resend: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      }
    }
  }
}

export const resendClient = new ResendClient()