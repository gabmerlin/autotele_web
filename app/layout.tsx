import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AutoTele - Automatisation intelligente pour Telegram',
  description: 'Automatisez l\'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification. Multicomptes, programmation avancée, messagerie intégrée.',
  keywords: 'AutoTele, Telegram, automatisation, messages programmés, multicomptes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  )
}

