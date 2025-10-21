'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

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
  const [loadingVersion, setLoadingVersion] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, hasSubscription, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Charger les informations de version
    fetch('/updates/version.json')
      .then(response => response.json())
      .then(data => {
        setVersionInfo(data)
        setLoadingVersion(false)
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la version:', error)
        setLoadingVersion(false)
      })
  }, [])

  const handleDownloadClick = () => {
    if (!user) {
      // Ouvrir le modal de connexion/inscription
      setShowAuthModal(true)
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
    } else {
      alert('Le téléchargement n\'est pas disponible pour le moment. Veuillez réessayer plus tard.')
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // Après connexion réussie, rediriger vers pricing pour l'abonnement
    router.push('/pricing?message=subscribe')
  }

  if (loadingVersion) {
    return (
      <button disabled className={`${className} opacity-50 cursor-not-allowed`}>
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          Chargement...
        </span>
      </button>
    )
  }

  return (
    <>
      <button 
        onClick={handleDownloadClick}
        className={className}
        disabled={authLoading}
        title={
          authLoading 
            ? 'Vérification en cours...' 
            : !user 
              ? 'Connectez-vous pour télécharger' 
              : !hasSubscription 
                ? 'Souscrivez à un abonnement pour télécharger'
                : versionInfo 
                  ? `Version ${versionInfo.version} - ${versionInfo.file_size_mb}MB` 
                  : undefined
        }
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

      {/* Modal d'authentification */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  )
}
