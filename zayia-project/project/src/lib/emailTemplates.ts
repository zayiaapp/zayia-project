// Templates de email para Resend
export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  welcome: (userName: string): EmailTemplate => ({
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
  }),

  passwordReset: (userName: string, resetLink: string): EmailTemplate => ({
    subject: 'Redefinir sua senha - ZAYIA 🔐',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha - ZAYIA</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #FEFBFF, #E9D5FF); margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">ZAYIA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Redefinição de Senha</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #7C3AED; font-size: 24px; margin: 0 0 20px 0;">Olá, ${userName}! 🔐</h2>
              
              <p style="color: #6B7280; line-height: 1.6; margin: 0 0 20px 0;">
                Recebemos uma solicitação para redefinir a senha da sua conta ZAYIA.
              </p>
              
              <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="color: #92400E; margin: 0; font-size: 14px;">
                  ⚠️ <strong>Importante:</strong> Este link expira em 1 hora por segurança.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Redefinir Minha Senha 🔑
                </a>
              </div>
              
              <p style="color: #6B7280; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
                Se você não solicitou esta redefinição, pode ignorar este email com segurança.
              </p>
              
              <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #6B7280; margin: 0; font-size: 12px; font-family: monospace;">
                  Link alternativo: ${resetLink}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F8FAFC; padding: 20px 30px; text-align: center; border-top: 1px solid #E9D5FF;">
              <p style="color: #6B7280; margin: 0; font-size: 12px;">
                © 2024 ZAYIA - Sua segurança é nossa prioridade
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta ZAYIA.
      
      Clique no link abaixo para criar uma nova senha:
      ${resetLink}
      
      ⚠️ IMPORTANTE: Este link expira em 1 hora por segurança.
      
      Se você não solicitou esta redefinição, pode ignorar este email com segurança.
      
      Equipe ZAYIA
    `
  }),

  weeklyReport: (userName: string, stats: any): EmailTemplate => ({
    subject: 'Seu relatório semanal ZAYIA 📊💜',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Relatório Semanal - ZAYIA</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #FEFBFF, #E9D5FF); margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">ZAYIA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Relatório Semanal</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #7C3AED; font-size: 24px; margin: 0 0 20px 0;">Parabéns, ${userName}! 🎉</h2>
              
              <p style="color: #6B7280; line-height: 1.6; margin: 0 0 30px 0;">
                Aqui está um resumo da sua semana de transformação:
              </p>
              
              <!-- Stats Grid -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
                <div style="text-align: center; padding: 20px; background: #E9D5FF; border-radius: 12px;">
                  <div style="font-size: 32px; font-weight: bold; color: #7C3AED;">${stats?.challenges || 12}</div>
                  <div style="color: #6B7280; font-size: 14px;">Desafios Completos</div>
                </div>
                <div style="text-align: center; padding: 20px; background: #E9D5FF; border-radius: 12px;">
                  <div style="font-size: 32px; font-weight: bold; color: #A855F7;">${stats?.streak || 7}</div>
                  <div style="color: #6B7280; font-size: 14px;">Dias de Sequência</div>
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, #E9D5FF, #FEFBFF); padding: 25px; border-radius: 15px; margin: 30px 0;">
                <h3 style="color: #7C3AED; margin: 0 0 15px 0;">💜 Mensagem da Semana:</h3>
                <p style="color: #6B7280; margin: 0; font-style: italic;">
                  "Você está se tornando a mulher que sempre sonhou ser. Cada desafio completado é uma prova da sua força interior."
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://zayia.com/dashboard" style="background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Continuar Minha Jornada 💜
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F8FAFC; padding: 20px 30px; text-align: center; border-top: 1px solid #E9D5FF;">
              <p style="color: #6B7280; margin: 0; font-size: 12px;">
                © 2024 ZAYIA - Transformando vidas, uma mulher de cada vez
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Parabéns! 🎉
      
      Aqui está um resumo da sua semana de transformação:
      
      📊 Seus números:
      • ${stats?.challenges || 12} desafios completos
      • ${stats?.streak || 7} dias de sequência
      
      💜 Mensagem da Semana:
      "Você está se tornando a mulher que sempre sonhou ser. Cada desafio completado é uma prova da sua força interior."
      
      Continue sua jornada: https://zayia.com/dashboard
      
      Com amor,
      Equipe ZAYIA
    `
  }),

  communityInvite: (userName: string, groupName: string, groupLink: string): EmailTemplate => ({
    subject: 'Convite especial para a Comunidade ZAYIA 👥💜',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite Comunidade - ZAYIA</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #FEFBFF, #E9D5FF); margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7C3AED, #A855F7); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">ZAYIA</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">Convite Especial</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #7C3AED; font-size: 24px; margin: 0 0 20px 0;">Olá, ${userName}! 👥</h2>
              
              <p style="color: #6B7280; line-height: 1.6; margin: 0 0 20px 0;">
                Você foi convidada para participar da nossa comunidade exclusiva no WhatsApp:
              </p>
              
              <div style="background: linear-gradient(135deg, #E9D5FF, #FEFBFF); padding: 25px; border-radius: 15px; margin: 20px 0; text-align: center;">
                <h3 style="color: #7C3AED; margin: 0 0 10px 0; font-size: 20px;">${groupName}</h3>
                <p style="color: #6B7280; margin: 0 0 20px 0;">
                  Um espaço seguro para compartilhar experiências, receber apoio e crescer junto com outras mulheres incríveis.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${groupLink}" style="background: #25D366; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Entrar no Grupo WhatsApp 📱
                </a>
              </div>
              
              <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="color: #92400E; margin: 0; font-size: 14px;">
                  💡 <strong>Dica:</strong> Apresente-se no grupo e conte um pouco sobre seus objetivos. A comunidade está aqui para te apoiar!
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #F8FAFC; padding: 20px 30px; text-align: center; border-top: 1px solid #E9D5FF;">
              <p style="color: #6B7280; margin: 0; font-size: 12px;">
                © 2024 ZAYIA - Juntas somos mais fortes 💜
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá, ${userName}!
      
      Você foi convidada para participar da nossa comunidade exclusiva no WhatsApp:
      
      ${groupName}
      
      Um espaço seguro para compartilhar experiências, receber apoio e crescer junto com outras mulheres incríveis.
      
      Entre no grupo: ${groupLink}
      
      💡 Dica: Apresente-se no grupo e conte um pouco sobre seus objetivos. A comunidade está aqui para te apoiar!
      
      Com amor,
      Equipe ZAYIA
    `
  })
}

// Função para enviar emails via Resend
export async function sendEmail(
  to: string, 
  template: EmailTemplate, 
  resendConfig: { api_key: string, from_email: string, from_name: string }
): Promise<boolean> {
  try {
    // Em produção, fazer requisição real para Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendConfig.api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${resendConfig.from_name} <${resendConfig.from_email}>`,
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text
      })
    })

    return response.ok
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}