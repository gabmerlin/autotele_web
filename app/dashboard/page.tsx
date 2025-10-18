'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, CreditCard, Calendar, Download, LogOut, Sparkles, MessageCircle } from 'lucide-react'
import DownloadButton from '@/components/DownloadButton'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    // Fonction pour vérifier l'abonnement
    const checkSubscription = async (userId: string) => {
      try {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single()

        if (sub && (!sub.expires_at || new Date(sub.expires_at) > new Date())) {
          setHasSubscription(true)
          setSubscription(sub)
        } else {
          setHasSubscription(false)
          setSubscription(null)
        }
      } catch (err) {
        console.error('Error checking subscription:', err)
        setHasSubscription(false)
        setSubscription(null)
      }
    }

    // Vérifier l'authentification initiale
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      await checkSubscription(user.id)
      setLoading(false)
    }

    checkAuth()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/')
      } else if (session?.user) {
        setUser(session.user)
        await checkSubscription(session.user.id)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-white text-xl font-semibold">Chargement de votre espace...</div>
          <div className="text-gray-400 mt-2">Veuillez patienter</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header avec navigation */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/')}
                className="text-white hover:text-blue-400 transition-colors font-semibold"
              >
                ← Retour à l'accueil
              </button>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Mon Compte</h1>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 hover:scale-105 border border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Statut</p>
                <p className="text-2xl font-bold text-white">
                  {hasSubscription ? 'Actif' : 'Inactif'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasSubscription ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                <CreditCard className={`w-6 h-6 ${hasSubscription ? 'text-green-400' : 'text-yellow-400'}`} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Type</p>
                <p className="text-2xl font-bold text-white">
                  {subscription?.plan_id ? 'Premium' : 'Standard'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Expire le</p>
                <p className="text-lg font-bold text-white">
                  {subscription?.expires_at ? new Date(subscription.expires_at).toLocaleDateString('fr-FR') : 'Jamais'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Abonnement */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Gestion de l'abonnement</h2>
                  <p className="text-gray-400">Gérez votre abonnement AutoTele</p>
                </div>
              </div>

              {hasSubscription ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 text-green-400 bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-semibold text-lg">Abonnement actif</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Download className="w-6 h-6 text-blue-400" />
                      Télécharger AutoTele
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Votre abonnement est actif ! Vous pouvez maintenant télécharger et utiliser AutoTele.
                    </p>
                    <DownloadButton className="btn-premium px-8 py-4 text-lg hover:scale-105 transition-transform duration-200" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                    <CreditCard className="w-12 h-12 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Aucun abonnement actif</h3>
                  <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                    Souscrivez à un abonnement pour accéder au téléchargement d'AutoTele et profiter de toutes les fonctionnalités.
                  </p>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="btn-premium px-10 py-4 text-lg hover:scale-105 transition-transform duration-200"
                  >
                    Voir les tarifs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Support Telegram */}
          <div className="space-y-6">
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-green-500/10 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </div>
                Support client
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => window.open('https://t.me/cob_cob_cob', '_blank')}
                  className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Contacter le support</span>
                    <span className="text-xs text-gray-500 group-hover:text-white">→</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.open('https://t.me/cob_cob_cob', '_blank')}
                  className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Signaler un bug</span>
                    <span className="text-xs text-gray-500 group-hover:text-white">→</span>
                  </div>
                </button>
                <button 
                  onClick={() => window.open('https://t.me/cob_cob_cob', '_blank')}
                  className="w-full text-left p-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white border border-white/5 hover:border-white/20 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Suggestions</span>
                    <span className="text-xs text-gray-500 group-hover:text-white">→</span>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-green-400 text-center">
                  💬 Tous les messages vont vers <strong>@cob_cob_cob</strong> sur Telegram
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}