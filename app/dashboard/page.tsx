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
    let mounted = true
    const supabase = createClient()
    
    console.log('Dashboard useEffect starting...')
    
    // Fonction pour vérifier l'abonnement
    const checkSubscription = async (userId: string) => {
      console.log('Checking subscription for user:', userId)
      try {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single()

        console.log('Subscription data:', sub)

        if (mounted) {
          if (sub && (!sub.expires_at || new Date(sub.expires_at) > new Date())) {
            setHasSubscription(true)
            setSubscription(sub)
            console.log('Subscription active')
          } else {
            setHasSubscription(false)
            setSubscription(null)
            console.log('No active subscription')
          }
        }
      } catch (err) {
        console.error('Error checking subscription:', err)
        if (mounted) {
          setHasSubscription(false)
          setSubscription(null)
        }
      }
    }

    // Vérifier l'authentification initiale
    const checkAuth = async () => {
      console.log('Checking auth...')
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('User from getuser:', user?.email)
        
        if (!user) {
          console.log('No user, redirecting to home')
          if (mounted) {
            router.push('/')
          }
          return
        }
        
        if (mounted) {
          setUser(user)
          await checkSubscription(user.id)
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      } finally {
        console.log('Setting loading to false')
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Dashboard auth state change:', event, session?.user?.email)
      
      if (!mounted) return
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting')
        router.push('/')
      } else if (session?.user) {
        console.log('User session found:', session.user.email)
        setUser(session.user)
        await checkSubscription(session.user.id)
      } else {
        console.log('No session user')
        setUser(null)
        setHasSubscription(false)
        setSubscription(null)
      }
      
      console.log('Setting loading to false from auth change')
      setLoading(false)
    })

    return () => {
      console.log('Dashboard useEffect cleanup')
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
      
      // Forcer le rechargement pour s'assurer que l'état est mis à jour
      window.location.href = '/'
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
      // En cas d'erreur, forcer quand même le rechargement
      window.location.href = '/'
    }
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
          <div className="text-xs text-gray-500 mt-4">
            Debug: loading={loading.toString()}, user={user?.email || 'null'}
          </div>
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