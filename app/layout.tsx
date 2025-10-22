import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import StructuredData from '@/components/StructuredData'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AutoTele - Automatisation intelligente pour Telegram',
    template: '%s | AutoTele'
  },
  description: 'Automatisez l\'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification. Multicomptes, programmation avancée, messagerie intégrée. Téléchargement gratuit.',
  keywords: [
    'AutoTele',
    'Telegram automatisation',
    'messages programmés Telegram',
    'multicomptes Telegram',
    'automatisation Telegram',
    'planification messages',
    'bot Telegram',
    'outil Telegram',
    'productivité Telegram',
    'messagerie automatique',
    'programmation messages',
    'gestion multicomptes',
    'automatisation native',
    'sécurité Telegram',
    'outil professionnel'
  ],
  authors: [{ name: 'AutoTele Team' }],
  creator: 'AutoTele',
  publisher: 'AutoTele',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://autotele.qgchatting.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://autotele.qgchatting.com',
    title: 'AutoTele - Automatisation intelligente pour Telegram',
    description: 'Automatisez l\'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification. Multicomptes, programmation avancée, messagerie intégrée.',
    siteName: 'AutoTele',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'AutoTele - Logo officiel',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoTele - Automatisation intelligente pour Telegram',
    description: 'Automatisez l\'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification.',
    images: ['/logo.png'],
    creator: '@autotele',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#0088cc" />
      </head>
      <body className={poppins.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <StructuredData />
      </body>
    </html>
  )
}

