'use client'

import { useEffect, useState } from 'react'
import { X, Bitcoin, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface BTCPayModalProps {
  isOpen: boolean
  onClose: () => void
  checkoutUrl: string | null
  invoiceId: string | null
}

export default function BTCPayModal({ isOpen, onClose, checkoutUrl, invoiceId }: BTCPayModalProps) {
  const [status, setStatus] = useState<'loading' | 'pending' | 'paid' | 'expired'>('loading')

  useEffect(() => {
    if (!isOpen || !invoiceId) return

    setStatus('pending')

    // Vérifier le statut de l'invoice toutes les 5 secondes
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}/status`)
        const data = await response.json()
        
        if (data.status === 'paid') {
          setStatus('paid')
          clearInterval(interval)
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 3000)
        } else if (data.status === 'expired' || data.status === 'invalid') {
          setStatus('expired')
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Error checking invoice status:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isOpen, invoiceId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => status !== 'paid' && onClose()}
      />
      
      {/* Modal */}
      <div className="relative glass-panel rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        {status !== 'paid' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
            <p className="text-gray-300">Création de la facture...</p>
          </div>
        )}

        {status === 'pending' && checkoutUrl && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
              <Bitcoin className="w-8 h-8 text-orange-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Paiement Bitcoin</h3>
            <p className="text-gray-400 text-center mb-8">
              Scannez le QR code ou cliquez sur le bouton ci-dessous pour effectuer le paiement
            </p>

            {/* iFrame BTCPay */}
            <div className="w-full bg-black/40 rounded-xl overflow-hidden mb-6" style={{ height: '500px' }}>
              <iframe
                src={checkoutUrl}
                className="w-full h-full border-0"
                allow="payment"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              En attente du paiement...
            </div>
          </div>
        )}

        {status === 'paid' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Paiement confirmé !</h3>
            <p className="text-gray-400 text-center mb-4">
              Votre abonnement a été activé avec succès
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers votre dashboard...
            </p>
          </div>
        )}

        {status === 'expired' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Facture expirée</h3>
            <p className="text-gray-400 text-center mb-6">
              Cette facture a expiré. Veuillez réessayer.
            </p>
            <button
              onClick={onClose}
              className="btn-premium px-8 py-3 rounded-lg"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

