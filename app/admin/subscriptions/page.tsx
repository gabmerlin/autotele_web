'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react'

interface Invoice {
  id: string
  invoice_id: string
  user_id: string
  plan_id: string
  amount_usd: number
  status: string
  created_at: string
  paid_at: string | null
  expires_at: string | null
  user_email?: string
  plan_name?: string
}

export default function AdminSubscriptions() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('btcpay_invoices')
      .select(`
        *,
        user:user_id(email),
        plan:plan_id(name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading invoices:', error)
    } else {
      setInvoices(data || [])
    }
    setLoading(false)
  }

  const activateSubscription = async (invoiceId: string) => {
    setActivating(invoiceId)
    
    try {
      const response = await fetch('/api/admin/activate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Abonnement activé avec succès !')
        loadInvoices() // Recharger la liste
      } else {
        alert('Erreur: ' + result.error)
      }
    } catch (error) {
      console.error('Error activating subscription:', error)
      alert('Erreur lors de l\'activation')
    } finally {
      setActivating(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé'
      case 'expired':
        return 'Expiré'
      case 'pending':
        return 'En attente'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des abonnements</h1>
          <p className="text-gray-400">Gérez les abonnements et activez manuellement les paiements</p>
        </div>

        <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4">Invoice ID</th>
                  <th className="text-left py-4 px-4">Utilisateur</th>
                  <th className="text-left py-4 px-4">Plan</th>
                  <th className="text-left py-4 px-4">Montant</th>
                  <th className="text-left py-4 px-4">Statut</th>
                  <th className="text-left py-4 px-4">Date</th>
                  <th className="text-left py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <code className="text-sm text-blue-400">{invoice.invoice_id}</code>
                    </td>
                    <td className="py-4 px-4">
                      {invoice.user_email || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      {invoice.plan_name || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      ${invoice.amount_usd}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.status)}
                        <span>{getStatusText(invoice.status)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => activateSubscription(invoice.invoice_id)}
                          disabled={activating === invoice.invoice_id}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          {activating === invoice.invoice_id ? 'Activation...' : 'Activer'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
