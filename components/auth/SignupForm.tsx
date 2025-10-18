'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface SignupFormProps {
  onSuccess: () => void
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      // Vérifier si Supabase nécessite une confirmation email
      if (data?.user && !data?.session) {
        // Email de confirmation envoyé
        setNeedsEmailConfirmation(true)
        setSuccess(true)
      } else {
        // Compte créé et connecté directement (confirmation email désactivée)
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          window.location.reload()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && !needsEmailConfirmation && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400 text-sm">
          Compte créé avec succès ! Connexion en cours...
        </div>
      )}

      {success && needsEmailConfirmation && (
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 font-semibold mb-2">Email de confirmation envoyé !</p>
              <p className="text-sm text-gray-300">
                Nous avons envoyé un email de confirmation à <strong className="text-white">{email}</strong>.
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.
              </p>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pensez à vérifier vos spams si vous ne voyez pas l'email.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Minimum 6 caractères"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Confirmez votre mot de passe"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className="w-full btn-premium py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Création du compte...
          </>
        ) : success && needsEmailConfirmation ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Email envoyé !
          </>
        ) : success ? (
          'Compte créé !'
        ) : (
          'Créer mon compte'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        En créant un compte, vous devez souscrire à un abonnement pour accéder au téléchargement.
      </p>
    </form>
  )
}

