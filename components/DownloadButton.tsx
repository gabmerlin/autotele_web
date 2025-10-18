'use client'

import { useState, useEffect } from 'react'
import { Download, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface VersionInfo {
  version: string
  download_url: string
  direct_exe_url: string
  file_size_mb: number
  release_date: string
}

export default function DownloadButton({ 
  className = "btn-premium group",
  children = "Télécharger AutoTele",
  showVersion = false 
}: {
  className?: string
  children?: string
  showVersion?: boolean
}) {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Charger les informations de version
    fetch('/updates/version.json')
      .then(response => response.json())
      .then(data => {
        if (mounted) {
          setVersionInfo(data)
          setLoading(false)
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la version:', error)
        if (mounted) {
          setLoading(false)
        }
      })

    // Fonction pour vérifier l'abonnement
    const checkSubscription = async (userId: string) => {
      try {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single()

        if (mounted) {
          if (subscription && (!subscription.expires_at || new Date(subscription.expires_at) > new Date())) {
            setHasSubscription(true)
          } else {
            setHasSubscription(false)
          }
        }
      } catch (err) {
        if (mounted) {
          setHasSubscription(false)
        }
      }
    }

    // Vérifier l'utilisateur initial
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (mounted) {
        setUser(user)
        if (user) {
          await checkSubscription(user.id)
        }
        setCheckingSubscription(false)
      }
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await checkSubscription(session.user.id)
        } else {
          setHasSubscription(false)
        }
        setCheckingSubscription(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleDownloadClick = () => {
    if (!user) {
      // Rediriger vers la page de pricing pour se connecter
      router.push('/pricing?message=connect')
      return
    }

    if (!hasSubscription) {
      // Rediriger vers la page de pricing pour s'abonner
      router.push('/pricing?message=subscribe')
      return
    }

    // Si l'utilisateur a un abonnement, permettre le téléchargement
    if (versionInfo?.direct_exe_url) {
      window.location.href = versionInfo.direct_exe_url
    }
  }

  if (loading) {
    return (
      <button disabled className={`${className} opacity-50 cursor-not-allowed`}>
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          Chargement...
        </span>
      </button>
    )
  }

  // Si on vérifie encore l'abonnement, afficher un bouton temporaire
  if (checkingSubscription) {
    return (
      <button 
        onClick={handleDownloadClick}
        className={className}
        title="Vérification en cours..."
      >
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          {children}
          {showVersion && versionInfo && (
            <span className="text-sm opacity-75">
              v{versionInfo.version}
            </span>
          )}
        </span>
      </button>
    )
  }

  // Si l'utilisateur n'est pas connecté ou n'a pas d'abonnement
  if (!user || !hasSubscription) {
    return (
      <button 
        onClick={handleDownloadClick}
        className={className}
        title={!user ? 'Connectez-vous pour télécharger' : 'Souscrivez à un abonnement pour télécharger'}
      >
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          {children}
          {showVersion && versionInfo && (
            <span className="text-sm opacity-75">
              v{versionInfo.version}
            </span>
          )}
        </span>
      </button>
    )
  }

  // L'utilisateur a un abonnement actif
  return (
    <button 
      onClick={handleDownloadClick}
      className={className}
      title={versionInfo ? `Version ${versionInfo.version} - ${versionInfo.file_size_mb}MB` : undefined}
    >
      <span className="flex items-center gap-3">
        <Download className="w-6 h-6" />
        {children}
        {showVersion && versionInfo && (
          <span className="text-sm opacity-75">
            v{versionInfo.version}
          </span>
        )}
      </span>
    </button>
  )
}
