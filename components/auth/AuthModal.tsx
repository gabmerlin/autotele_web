'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: 'login' | 'signup'
  onSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login', onSuccess }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView)

  // Désactiver le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup au démontage du composant
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-32"
      onClick={onClose}
    >
      {/* Modal sans backdrop visible */}
      <div 
        className="relative rounded-2xl p-8 w-full max-w-md max-h-[85vh] overflow-y-auto z-[101] mt-4 bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="gradient-text">
              {view === 'login' ? 'Connexion' : 'Créer un compte'}
            </span>
          </h2>
          <p className="text-gray-400">
            {view === 'login' 
              ? 'Accédez à votre espace membre' 
              : 'Rejoignez AutoTele dès aujourd\'hui'}
          </p>
        </div>

        {/* Forms */}
        {view === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <SignupForm onSuccess={handleSuccess} />
        )}

        {/* Switch View */}
        <div className="mt-6 text-center text-gray-400">
          {view === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setView('signup')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                S'inscrire
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button
                onClick={() => setView('login')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

