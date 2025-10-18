'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, CreditCard, Settings, ChevronDown, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'

export default function UserButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    // Récupérer l'utilisateur actuel
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      
      if (user) {
        // Vérifier si l'utilisateur a un abonnement actif
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (subscription && (!subscription.expires_at || new Date(subscription.expires_at) > new Date())) {
          setHasSubscription(true)
        }
      }
      
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .single()

        if (sub && (!sub.expires_at || new Date(sub.expires_at) > new Date())) {
          setHasSubscription(true)
        } else {
          setHasSubscription(false)
        }
      } else {
        setHasSubscription(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="btn-premium px-6 py-2 rounded-full text-sm font-semibold"
        >
          Se connecter
        </button>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-105"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-white hidden md:block">
          {user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 glass-panel rounded-xl overflow-hidden z-50 border border-white/10 shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <p className="text-xs text-gray-400 mb-1">Connecté en tant que</p>
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              {!hasSubscription && (
                <div className="mt-2 flex items-center gap-2 text-xs text-yellow-400">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  Aucun abonnement actif
                </div>
              )}
              {hasSubscription && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  Abonnement actif
                </div>
              )}
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  setShowMenu(false)
                  router.push('/dashboard')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
              >
                <CreditCard className="w-5 h-5 text-blue-400" />
                <div className="text-left flex-1">
                  <div className="text-sm">Mon compte</div>
                  <div className="text-xs text-gray-400">Gérer mon abonnement</div>
                </div>
              </button>
              
              {!hasSubscription && (
                <button
                  onClick={() => {
                    setShowMenu(false)
                    router.push('/pricing')
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all mt-2 font-semibold"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <div className="text-left flex-1">
                    <div className="text-sm">Souscrire maintenant</div>
                    <div className="text-xs opacity-90">Accéder au téléchargement</div>
                  </div>
                </button>
              )}
              
              <div className="border-t border-white/10 my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

