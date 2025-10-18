'use client'

import { useState } from 'react'
import { User, LogOut, CreditCard, ChevronDown, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'
import { useAuth } from '@/lib/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function UserButton2() {
  const { user, hasSubscription, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setShowMenu(false)
      window.location.reload()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
      window.location.reload()
    }
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
        className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-105 border border-white/20"
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
          <div className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-[60] border border-white/20 shadow-2xl bg-black/90 backdrop-blur-xl">
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
                onClick={() => { setShowMenu(false); router.push('/dashboard') }}
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
                  onClick={() => { setShowMenu(false); router.push('/pricing') }}
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
