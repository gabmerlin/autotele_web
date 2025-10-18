'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultView?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(defaultView)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-panel rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
          <LoginForm onSuccess={onClose} />
        ) : (
          <SignupForm onSuccess={onClose} />
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

