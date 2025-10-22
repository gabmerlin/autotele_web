import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs AutoTele - Abonnements Premium',
  description: 'Découvrez nos tarifs pour AutoTele. Abonnements premium avec toutes les fonctionnalités d\'automatisation Telegram. Téléchargement inclus.',
  keywords: ['tarifs AutoTele', 'prix AutoTele', 'abonnement AutoTele', 'premium AutoTele', 'coût AutoTele'],
  openGraph: {
    title: 'Tarifs AutoTele - Abonnements Premium',
    description: 'Découvrez nos tarifs pour AutoTele. Abonnements premium avec toutes les fonctionnalités d\'automatisation Telegram.',
    url: 'https://autotele.qgchatting.com/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
