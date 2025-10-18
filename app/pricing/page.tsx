'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plan } from '@/lib/supabase/types'
import PricingCard from '@/components/pricing/PricingCard'
import BTCPayModal from '@/components/pricing/BTCPayModal'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Shield, Zap, Award, Headphones } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/auth/AuthModal'

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showBTCPayModal, setShowBTCPayModal] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Charger les plans
    supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price_usd', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setPlans(data)
        }
        setLoading(false)
      })

    // Vérifier l'utilisateur
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleSubscribe = async (planId: string) => {
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      setShowAuthModal(true)
      return
    }

    try {
      // Créer la facture BTCPay via l'API
      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create invoice')
      }

      const data = await response.json()
      setCheckoutUrl(data.checkoutUrl)
      setInvoiceId(data.invoiceId)
      setShowBTCPayModal(true)
    } catch (error: any) {
      alert('Erreur lors de la création de la facture: ' + error.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 glass-panel px-6 py-3 rounded-full mb-6">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Paiement 100% sécurisé en Bitcoin</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Choisissez votre <span className="gradient-text">plan</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Accédez à toutes les fonctionnalités d'AutoTele et commencez à automatiser vos messages Telegram dès maintenant
          </p>
        </motion.div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                <PricingCard
                  plan={plan}
                  onSubscribe={handleSubscribe}
                  isPopular={plan.name === 'Monthly'}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-500 text-sm mb-6">Pourquoi choisir AutoTele ?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: 'Paiement Bitcoin sécurisé', color: 'text-blue-400' },
              { icon: Zap, text: 'Activation instantanée', color: 'text-yellow-400' },
              { icon: Award, text: 'Garantie satisfaction', color: 'text-purple-400' },
              { icon: Headphones, text: 'Support premium inclus', color: 'text-green-400' },
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (idx * 0.1) }}
                className="flex flex-col items-center gap-3 glass-panel p-4 rounded-xl"
              >
                <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${badge.color}`}>
                  <badge.icon className="w-6 h-6" />
                </div>
                <p className="text-gray-300 text-sm text-center">{badge.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />
      
      <BTCPayModal
        isOpen={showBTCPayModal}
        onClose={() => setShowBTCPayModal(false)}
        checkoutUrl={checkoutUrl}
        invoiceId={invoiceId}
      />
    </main>
  )
}

