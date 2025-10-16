'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

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

  useEffect(() => {
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
  }, [])

  if (loading) {
    return (
      <a href="#" className={`${className} opacity-50 cursor-not-allowed`}>
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          Chargement...
        </span>
      </a>
    )
  }

  if (!versionInfo) {
    // Fallback si le fichier version.json n'est pas accessible
    return (
      <a href="/updates/latest/AutoTele-Setup-v2.1.1.exe" download className={className}>
        <span className="flex items-center gap-3">
          <Download className="w-6 h-6" />
          {children}
        </span>
      </a>
    )
  }

  return (
    <a 
      href={versionInfo.direct_exe_url} 
      download 
      className={className}
      title={`Version ${versionInfo.version} - ${versionInfo.file_size_mb}MB`}
    >
      <span className="flex items-center gap-3">
        <Download className="w-6 h-6" />
        {children}
        {showVersion && (
          <span className="text-sm opacity-75">
            v{versionInfo.version}
          </span>
        )}
      </span>
    </a>
  )
}
