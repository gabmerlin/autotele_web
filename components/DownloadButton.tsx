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

    // Charger les informations de version
    fetch('/updates/version.json')
      .then(response => response.json())
      .then(data => {
        setVersionInfo(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la version:', error)
        setLoading(false)
      })

    // Vérifier l'utilisateur et son abonnement
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

        if (subscription) {
          // Vérifier si l'abonnement n'est pas expiré
          if (!subscription.expires_at || new Date(subscription.expires_at) > new Date()) {
            setHasSubscription(true)
          }
        }
      }
      
      setCheckingSubscription(false)
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
      
      setCheckingSubscription(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleDownloadClick = () => {
    if (!user) {
      // Rediriger vers la page de pricing avec message
      router.push('/pricing')
      return
    }

    if (!hasSubscription) {
      // Rediriger vers la page de pricing
      router.push('/pricing')
      return
    }

    // Si l'utilisateur a un abonnement, permettre le téléchargement
    if (versionInfo?.direct_exe_url) {
      window.location.href = versionInfo.direct_exe_url
    }
  }

  if (loading || checkingSubscription) {
    return (
      <button disabled className={`${className} opacity-50 cursor-not-allowed`}>
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          Chargement...
        </span>
      </button>
    )
  }

  // Si l'utilisateur n'est pas connecté ou n'a pas d'abonnement
  if (!user || !hasSubscription) {
    return (
      <button 
        onClick={handleDownloadClick}
        className={`${className} relative`}
      >
        <span className="flex items-center gap-3">
          <Lock className="w-6 h-6" />
          {!user ? 'Se connecter pour télécharger' : 'Souscrire pour télécharger'}
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
