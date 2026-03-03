import React, { useState } from 'react'
import { Download, FileJson, FileText, AlertCircle } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import jsPDF from 'jspdf'

interface UserExportData {
  profile: any
  challenges: any[]
  subscriptions: any[]
  invoices: any[]
}

export function ExportDataSection() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState<'json' | 'pdf' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchUserData = async (): Promise<UserExportData | null> => {
    try {
      if (!user || !user.id) {
        throw new Error('Usuário não autenticado')
      }

      // Fetch profile data
      const profileData = profile || {}

      // Fetch completed challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)

      if (challengesError && challengesError.code !== 'PGRST116') {
        console.warn('Warning fetching challenges:', challengesError)
      }

      // Fetch subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)

      if (subsError && subsError.code !== 'PGRST116') {
        console.warn('Warning fetching subscriptions:', subsError)
      }

      // Fetch invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)

      if (invoicesError && invoicesError.code !== 'PGRST116') {
        console.warn('Warning fetching invoices:', invoicesError)
      }

      return {
        profile: profileData,
        challenges: challenges || [],
        subscriptions: subscriptions || [],
        invoices: invoices || [],
      }
    } catch (err) {
      throw err
    }
  }

  const generateJSON = (data: UserExportData) => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      compliance: 'LGPD - Direito de Portabilidade',
      data: {
        profile: data.profile,
        challenges: {
          total: data.challenges.length,
          items: data.challenges,
        },
        subscriptions: {
          total: data.subscriptions.length,
          items: data.subscriptions,
        },
        invoices: {
          total: data.invoices.length,
          items: data.invoices,
        },
      },
    }

    const jsonString = JSON.stringify(jsonData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zayia-dados-${new Date().getTime()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generatePDF = (data: UserExportData) => {
    const doc = new jsPDF()
    let yPosition = 20

    // Header
    doc.setFontSize(16)
    doc.setTextColor(75, 0, 130) // Purple
    doc.text('EXPORTAÇÃO DE DADOS PESSOAIS - ZAYIA', 20, yPosition)
    yPosition += 10

    // Compliance note
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('LGPD - Lei Geral de Proteção de Dados (Direito de Portabilidade - Artigo 20)', 20, yPosition)
    yPosition += 5
    doc.text(`Data de exportação: ${new Date().toLocaleString('pt-BR')}`, 20, yPosition)
    yPosition += 10

    // Profile Section
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('1. DADOS DO PERFIL', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    const profileInfo = [
      [`Nome: ${data.profile.full_name || 'N/A'}`],
      [`Email: ${data.profile.email || 'N/A'}`],
      [`Telefone: ${data.profile.phone || 'N/A'}`],
      [`Pontos Totais: ${data.profile.points || 0}`],
      [`Nível: ${data.profile.level_id || 1}`],
      [`Streak: ${data.profile.streak || 0} dias`],
      [`Membro desde: ${data.profile.created_at ? new Date(data.profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}`],
    ]

    profileInfo.forEach(([text]) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      doc.text(text, 20, yPosition)
      yPosition += 5
    })

    yPosition += 5

    // Challenges Section
    doc.setFontSize(12)
    doc.text('2. DESAFIOS COMPLETADOS', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    if (data.challenges.length > 0) {
      doc.text(`Total: ${data.challenges.length} desafios`, 20, yPosition)
      yPosition += 4
      const completed = data.challenges.filter((c: any) => c.completed_at).length
      doc.text(`Completos: ${completed}`, 20, yPosition)
      yPosition += 6
    } else {
      doc.text('Nenhum desafio completado', 20, yPosition)
      yPosition += 6
    }

    // Subscriptions Section
    doc.setFontSize(12)
    doc.text('3. ASSINATURAS', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    if (data.subscriptions.length > 0) {
      data.subscriptions.forEach((sub: any, idx: number) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(
          `${idx + 1}. Status: ${sub.status || 'N/A'}`,
          20,
          yPosition
        )
        yPosition += 4
        if (sub.current_period_start && sub.current_period_end) {
          doc.text(
            `   Período: ${new Date(sub.current_period_start).toLocaleDateString('pt-BR')} até ${new Date(sub.current_period_end).toLocaleDateString('pt-BR')}`,
            20,
            yPosition
          )
          yPosition += 4
        }
      })
      yPosition += 2
    } else {
      doc.text('Nenhuma assinatura ativa', 20, yPosition)
      yPosition += 6
    }

    // Invoices Section
    doc.setFontSize(12)
    doc.text('4. HISTÓRICO DE PAGAMENTOS', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    if (data.invoices.length > 0) {
      doc.text(`Total de transações: ${data.invoices.length}`, 20, yPosition)
      yPosition += 4
      const totalValue = data.invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
      doc.text(`Valor total: R$ ${totalValue.toFixed(2)}`, 20, yPosition)
      yPosition += 6
    } else {
      doc.text('Nenhuma transação registrada', 20, yPosition)
      yPosition += 6
    }

    // Footer with security warning
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      '⚠️ Este arquivo contém seus dados pessoais. Mantenha em local seguro e não o compartilhe.',
      20,
      doc.internal.pageSize.getHeight() - 15
    )
    doc.text(
      'Exportado de acordo com LGPD - Direito de Portabilidade de Dados',
      20,
      doc.internal.pageSize.getHeight() - 10
    )

    // Download
    doc.save(`zayia-dados-${new Date().getTime()}.pdf`)
  }

  const handleExport = async (exportFormat: 'json' | 'pdf') => {
    try {
      setError(null)
      setSuccess(false)
      setLoading(true)
      setFormat(exportFormat)

      const data = await fetchUserData()

      if (!data) {
        throw new Error('Erro ao buscar dados')
      }

      if (exportFormat === 'json') {
        generateJSON(data)
      } else {
        generatePDF(data)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar dados')
      console.error('Export error:', err)
    } finally {
      setLoading(false)
      setFormat(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zayia-deep-violet mb-2">💾 Exportar Meus Dados</h3>
        <p className="text-sm text-zayia-violet-gray mb-4">
          Baixe uma cópia de todos seus dados pessoais conforme seu direito de portabilidade pela LGPD (Artigo 20).
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">✅ Arquivo baixado com sucesso!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* JSON Export */}
        <button
          onClick={() => handleExport('json')}
          disabled={loading}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
            loading && format === 'json'
              ? 'bg-purple-900/30 border-purple-500/30 cursor-not-allowed'
              : 'bg-white border-purple-200 hover:border-purple-400 hover:bg-purple-50'
          }`}
        >
          <FileJson className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-zayia-deep-violet">
              {loading && format === 'json' ? 'Exportando...' : 'Exportar JSON'}
            </p>
            <p className="text-xs text-zayia-violet-gray">Formato estruturado</p>
          </div>
          {!loading && <Download className="w-4 h-4 text-purple-600 ml-auto" />}
        </button>

        {/* PDF Export */}
        <button
          onClick={() => handleExport('pdf')}
          disabled={loading}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${
            loading && format === 'pdf'
              ? 'bg-purple-900/30 border-purple-500/30 cursor-not-allowed'
              : 'bg-white border-purple-200 hover:border-purple-400 hover:bg-purple-50'
          }`}
        >
          <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-zayia-deep-violet">
              {loading && format === 'pdf' ? 'Exportando...' : 'Exportar PDF'}
            </p>
            <p className="text-xs text-zayia-violet-gray">Formato legível</p>
          </div>
          {!loading && <Download className="w-4 h-4 text-purple-600 ml-auto" />}
        </button>
      </div>

      <p className="text-xs text-zayia-violet-gray mt-4 p-3 bg-purple-50 rounded-lg">
        📋 <strong>Sobre esta exportação:</strong> Os arquivos contêm seus dados pessoais e histórico. Mantenha em local seguro e não compartilhe com terceiros.
      </p>
    </div>
  )
}

export default ExportDataSection
