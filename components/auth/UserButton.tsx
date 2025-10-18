'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, LogOut, CreditCard, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AuthModal from './AuthModal'

export default function UserButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    // Récupérer l'utilisateur actuel
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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
        className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-white hidden md:block">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl overflow-hidden z-50 border border-white/10">
            <div className="p-4 border-b border-white/10">
              <p className="text-sm font-medium text-white">{user.email}</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  setShowMenu(false)
                  router.push('/dashboard')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Mon abonnement
              </button>
              
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

