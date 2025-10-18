'use client'

import { Check, Loader2 } from 'lucide-react'
import { Plan } from '@/lib/supabase/types'
import { useState } from 'react'

interface PricingCardProps {
  plan: Plan
  onSubscribe: (planId: string) => Promise<void>
  isPopular?: boolean
}

export default function PricingCard({ plan, onSubscribe, isPopular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      await onSubscribe(plan.id)
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = plan.name === 'Lifetime' ? [
    'Accès illimité à AutoTele',
    'Gestion multi-comptes',
    'Programmation avancée',
    'Messagerie intégrée (Beta)',
    'Support prioritaire',
    'Mises à jour à vie',
    'Aucun renouvellement',
    'Meilleur rapport qualité-prix',
  ] : [
    'Accès complet à AutoTele',
    'Gestion multi-comptes',
    'Programmation avancée',
    'Messagerie intégrée (Beta)',
    'Support technique',
    'Mises à jour incluses',
    'Renouvellement chaque mois',
    'Annulation à tout moment',
  ]

  return (
    <div className={`relative glass-panel rounded-2xl p-8 ${isPopular ? 'border-2 border-blue-500 glow-effect' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
            LE PLUS POPULAIRE
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <span className="text-5xl font-bold gradient-text">${plan.price_usd}</span>
          {plan.duration_days && (
            <span className="text-gray-400">/mois</span>
          )}
        </div>
        <p className="text-gray-400">{plan.description}</p>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-semibold mb-8 flex items-center justify-center gap-2 transition-all duration-300 ${
          isPopular 
            ? 'btn-premium hover:scale-105' 
            : 'glass-panel hover:bg-white/10 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Traitement...
          </>
        ) : (
          'Souscrire maintenant'
        )}
      </button>

      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

