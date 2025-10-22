'use client'

import { usePathname } from 'next/navigation'

export default function StructuredData() {
  const pathname = usePathname()
  
  const baseUrl = 'https://autotele.qgchatting.com'
  const currentUrl = `${baseUrl}${pathname}`
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AutoTele",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Automatisez l'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "French"
    },
    "sameAs": [
      "https://t.me/cob_cob_cob"
    ]
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AutoTele",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Windows",
    "description": "Automatisez l'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification. Multicomptes, programmation avancée, messagerie intégrée.",
    "url": baseUrl,
    "downloadUrl": `${baseUrl}/updates/latest/AutoTele-Setup-v2.1.6.exe`,
    "softwareVersion": "2.1.6",
    "fileSize": "50MB",
    "screenshot": `${baseUrl}/images/menu.png`,
    "offers": {
      "@type": "Offer",
      "price": "9.99",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "AutoTele Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AutoTele",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "featureList": [
      "Automatisation native Telegram",
      "Gestion multi-comptes",
      "Programmation avancée",
      "Messagerie intégrée",
      "Gestion intelligente des envois",
      "Sécurité maximale"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AutoTele",
    "url": baseUrl,
    "description": "Automatisez l'envoi de vos messages Telegram en toute sécurité grâce aux fonctions natives de planification.",
    "publisher": {
      "@type": "Organization",
      "name": "AutoTele",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": baseUrl
      },
      ...(pathname !== '/' ? [{
        "@type": "ListItem",
        "position": 2,
        "name": pathname === '/pricing' ? 'Tarifs' : 
               pathname === '/dashboard' ? 'Tableau de bord' : 'Page',
        "item": currentUrl
      }] : [])
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Est-ce que je risque un ban avec AutoTele ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Non, absolument aucun risque ! AutoTele utilise exclusivement les fonctions natives de planification de Telegram. Vous ne faites rien de différent qu'un utilisateur normal qui programme ses messages manuellement. Aucune API non officielle n'est utilisée."
        }
      },
      {
        "@type": "Question",
        "name": "Puis-je utiliser plusieurs comptes Telegram ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui ! AutoTele supporte la gestion multi-comptes. Vous pouvez ajouter autant de comptes que vous le souhaitez et basculer entre eux facilement depuis l'interface principale."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps à l'avance puis-je programmer mes messages ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vous pouvez programmer vos messages jusqu'à 2 semaines (14 jours) à l'avance. Cette limite est imposée par Telegram lui-même et non par AutoTele."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      {pathname === '/' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}
    </>
  )
}
