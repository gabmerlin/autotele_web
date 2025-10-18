'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  BookOpen,
  MessageCircle,
  Bug
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Subscription } from '@/lib/supabase/types'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [versionInfo, setVersionInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Charger l'utilisateur
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) {
        router.push('/')
        return
      }

      setUser(user)

      // Charger l'abonnement
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      setSubscription(sub)
      setLoading(false)
    })

    // Charger les infos de version
    fetch('/updates/version.json')
      .then(response => response.json())
      .then(data => setVersionInfo(data))
      .catch(() => {})
  }, [router])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isSubscriptionActive = () => {
    if (!subscription) return false
    if (!subscription.expires_at) return true // Lifetime
    return new Date(subscription.expires_at) > new Date()
  }

  const isLifetime = () => {
    return subscription && !subscription.expires_at
  }

  const handleDownload = () => {
    if (versionInfo?.direct_exe_url) {
      window.location.href = versionInfo.direct_exe_url
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Mon <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400 mb-12">
            Bienvenue {user?.email}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Statut de l'abonnement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Abonnement</h2>
                <p className="text-gray-400 text-sm">Statut de votre abonnement</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isSubscriptionActive() ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {isSubscriptionActive() ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
            </div>

            {subscription ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    {isLifetime() ? (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Lifetime Access
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 text-blue-400" />
                        Mensuel
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Statut</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isSubscriptionActive() ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <p className={`font-semibold ${
                      isSubscriptionActive() ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isSubscriptionActive() ? 'Actif' : 'Expiré'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Activé le</p>
                  <p className="text-white">{formatDate(subscription.activated_at)}</p>
                </div>

                {!isLifetime() && (
                  <div>
                    <p className="text-sm text-gray-400">Expire le</p>
                    <p className="text-white">{formatDate(subscription.expires_at)}</p>
                  </div>
                )}

                {isLifetime() && (
                  <div className="glass-panel border-blue-500/30 rounded-lg p-4 mt-4">
                    <p className="text-blue-400 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Vous avez un accès à vie ! Aucun renouvellement nécessaire.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Vous n'avez pas d'abonnement actif</p>
                <Link 
                  href="/pricing"
                  className="btn-premium px-6 py-3 rounded-lg inline-block"
                >
                  Souscrire maintenant
                </Link>
              </div>
            )}
          </motion.div>

          {/* Téléchargement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Téléchargement</h2>
                <p className="text-gray-400 text-sm">Dernière version disponible</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            {isSubscriptionActive() ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400">Version actuelle</p>
                  <p className="text-white font-semibold text-2xl">
                    {versionInfo?.version || '2.1.5'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Taille du fichier</p>
                  <p className="text-white">
                    {versionInfo?.file_size_mb || '~50'} MB
                  </p>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full btn-premium py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" />
                  Télécharger AutoTele
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Compatible avec Windows 10 et supérieur
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-gray-400 mb-4">
                  Vous devez avoir un abonnement actif pour télécharger l'application
                </p>
                <Link 
                  href="/pricing"
                  className="btn-premium px-6 py-3 rounded-lg inline-block"
                >
                  Voir les plans
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Informations additionnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Besoin d'aide ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">Documentation</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Consultez notre guide complet d'utilisation
              </p>
              <a href="#" className="text-blue-400 text-sm hover:underline inline-flex items-center gap-1">
                Voir la documentation →
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Support</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Besoin d'aide ? Contactez notre support
              </p>
              <a 
                href="https://t.me/cob_cob_cob" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:underline inline-flex items-center gap-1"
              >
                Contacter le support →
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Bug className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-semibold text-white">Signaler un bug</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Vous avez trouvé un problème ?
              </p>
              <a 
                href="https://t.me/cob_cob_cob" 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-blue-400 text-sm hover:underline inline-flex items-center gap-1"
              >
                Signaler un bug →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

