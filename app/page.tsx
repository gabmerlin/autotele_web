'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { SparklesCore } from '@/components/ui/sparkles'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Spotlight } from '@/components/ui/spotlight'
import { FloatingNav } from '@/components/ui/floating-navbar'
import { 
  Download, 
  Shield, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Lock,
  Rocket,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react'
import ImageGallery from '@/components/ImageGallery'
import DownloadButton from '@/components/DownloadButton'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [versionInfo, setVersionInfo] = useState<any>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  useEffect(() => {
    // Charger les informations de version pour le footer
    fetch('/updates/version.json')
      .then(response => response.json())
      .then(data => setVersionInfo(data))
      .catch(() => setVersionInfo(null))
  }, [])

  const navItems = [
    { name: "Fonctionnalités", link: "#features", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Sécurité", link: "#security", icon: <Shield className="w-4 h-4" /> },
    { name: "Aperçu", link: "#screenshots", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "FAQ", link: "#faq", icon: <ChevronDown className="w-4 h-4" /> },
    { name: "Télécharger", link: "#download", icon: <Download className="w-4 h-4" /> },
  ]

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Automatisation Native',
      description: 'Utilisez les fonctions de planification intégrées de Telegram pour programmer vos messages en toute sécurité. Aucune API tierce, juste du natif.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Multi-Comptes',
      description: 'Gérez plusieurs comptes Telegram simultanément depuis une seule interface intuitive. Basculez entre vos comptes en un clic.',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Programmation Avancée',
      description: 'Planifiez vos messages jusqu\'à 2 semaines à l\'avance avec une précision à la minute près. Organisation optimale garantie.',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Messagerie Intégrée',
      description: 'Consultez et répondez à vos messages directement depuis l\'application sans basculer vers Telegram. Version Beta disponible.',
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Gestion Intelligente',
      description: 'Contrôlez finement vos envois pour respecter les limites de Telegram et éviter toute restriction. Intelligence artificielle intégrée.',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Sécurité Maximale',
      description: 'Aucune API tierce, aucun risque de ban. Tout se fait via les fonctionnalités officielles de Telegram. Tranquillité assurée.',
    }
  ]

  const faqs = [
    {
      question: 'Est-ce que je risque un ban avec AutoTele ?',
      answer: 'Non, absolument aucun risque ! AutoTele utilise exclusivement les fonctions natives de planification de Telegram. Vous ne faites rien de différent qu\'un utilisateur normal qui programme ses messages manuellement. Aucune API non officielle n\'est utilisée.'
    },
    {
      question: 'Puis-je utiliser plusieurs comptes Telegram ?',
      answer: 'Oui ! AutoTele supporte la gestion multi-comptes. Vous pouvez ajouter autant de comptes que vous le souhaitez et basculer entre eux facilement depuis l\'interface principale.'
    },
    {
      question: 'Combien de temps à l\'avance puis-je programmer mes messages ?',
      answer: 'Vous pouvez programmer vos messages jusqu\'à 2 semaines (14 jours) à l\'avance. Cette limite est imposée par Telegram lui-même et non par AutoTele.'
    },
    {
      question: 'Ai-je besoin de créer un compte pour utiliser AutoTele ?',
      answer: 'Non ! AutoTele ne nécessite aucune inscription, aucun login, aucune base de données externe. Vous téléchargez l\'application, vous vous connectez avec vos comptes Telegram, et c\'est tout. Simple et direct.'
    },
    {
      question: 'Comment fonctionne la gestion des limites d\'envoi ?',
      answer: 'AutoTele intègre un système intelligent qui respecte automatiquement les limitations de Telegram. Vous pouvez également personnaliser les délais entre les envois pour un contrôle total et éviter toute restriction.'
    },
    {
      question: 'La messagerie intégrée est-elle disponible ?',
      answer: 'Oui, mais elle est actuellement en version Beta. Elle vous permet de consulter et répondre à vos messages sans quitter AutoTele. Cette fonctionnalité est en cours d\'amélioration continue.'
    }
  ]

  const screenshots = [
    { src: '/images/menu.png', title: 'Menu principal' },
    { src: '/images/comptes .png', title: 'Gestion des comptes' },
    { src: '/images/parametre comptes.png', title: 'Paramètres des comptes' },
    { src: '/images/étape 1.png', title: 'Étape 1 - Configuration' },
    { src: '/images/étape 2.png', title: 'Étape 2 - Sélection' },
    { src: '/images/étape 3.png', title: 'Étape 3 - Programmation' },
    { src: '/images/étape 4.png', title: 'Étape 4 - Validation' },
    { src: '/images/message programmée.png', title: 'Messages programmés' },
    { src: '/images/messagerie.png', title: 'Messagerie intégrée' },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Floating Navigation */}
      <FloatingNav navItems={navItems} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <SparklesCore />
          <Spotlight className="absolute -top-40 left-0 md:left-60 md:-top-20" fill="white" />
          <BackgroundBeams />
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Hero Content */}
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          {/* Logo with Float Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex justify-center mb-12 animate-float"
          >
            <Image 
              src="/logo.png" 
              alt="AutoTele Logo" 
              width={150} 
              height={150}
              className="drop-shadow-2xl glow-effect"
            />
          </motion.div>
          
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-glow">
              <span className="gradient-text">AutoTele</span>
              <span className="block text-4xl md:text-5xl mt-4 text-gray-300">2.1.1</span>
            </h1>
          </motion.div>
          
          {/* Subtitle with Shimmer Effect */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-3xl mb-6 font-light text-gray-300 max-w-4xl mx-auto"
          >
            Automatisez vos messages <span className="gradient-text font-semibold">Telegram</span> en toute sécurité
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Programmez, gérez et envoyez vos messages sur plusieurs comptes sans aucun risque de ban. 
            Utilisez les fonctions natives de Telegram pour une automatisation 100% sécurisée.
          </motion.p>
          
          {/* CTA Button with Glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <DownloadButton />
            <a 
              href="#features" 
              className="glass-panel px-8 py-4 rounded-full text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 border-blue-500/30 hover:border-blue-500/50"
            >
              Découvrir les fonctionnalités
            </a>
          </motion.div>
          
          {/* Features Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            {['Téléchargement Gratuit', 'Paiement en BTC', 'Windows compatible', 'Aucun risque de ban'].map((badge, idx) => (
              <div key={idx} className="glass-panel px-6 py-3 rounded-full flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-gray-200">{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
          >
            <motion.div className="w-1 h-2 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Fonctionnalités</span> Principales
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Découvrez tout ce qu'AutoTele peut faire pour optimiser votre utilisation de Telegram
            </p>
          </motion.div>

          <BentoGrid>
            {features.map((feature, idx) => (
              <BentoGridItem
                key={idx}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={idx}
                className={idx === 0 || idx === 3 ? "md:col-span-2" : ""}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative py-32 px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel rounded-3xl p-12 md:p-20"
          >
            <div className="flex justify-center mb-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-8xl"
          >
            <Shield className="w-24 h-24 text-blue-400" />
          </motion.div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-8">
              Pourquoi AutoTele est <span className="gradient-text">100% sécurisé</span> ?
            </h2>
            
            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <strong className="text-blue-400 text-xl">Aucun risque de ban.</strong> C'est notre garantie principale. 
                AutoTele ne fait rien d'autre que ce que vous feriez manuellement sur Telegram : programmer des messages 
                via la fonction native de planification.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Contrairement aux bots ou aux outils qui utilisent des API non officielles, <strong className="text-white">AutoTele 
                respecte à 100% les règles de Telegram</strong>. Vous restez dans un cadre d'utilisation totalement 
                légitime et autorisé par la plateforme.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                De plus, AutoTele intègre une <strong className="text-white">gestion intelligente des envois</strong> qui respecte 
                automatiquement les limitations imposées par Telegram (nombre de messages par période, délais 
                entre les envois, etc.). Vous pouvez même personnaliser ces paramètres pour un contrôle maximal.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="glass-panel border-l-4 border-blue-500 p-8 rounded-r-2xl mt-8"
              >
                <p className="text-white font-semibold flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <span>
                    <strong>En résumé :</strong> AutoTele agit comme si vous programmiez vos messages à la main, 
                    mais de manière plus rapide et organisée. Telegram ne voit aucune différence avec une utilisation normale.
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="relative py-32 px-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Aperçu de <span className="gradient-text">l'interface</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Une interface moderne, intuitive et pensée pour votre productivité
            </p>
          </motion.div>

          <ImageGallery images={screenshots} />

          {/* Interface Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-10 mt-16"
          >
            <h3 className="text-3xl font-bold mb-8 gradient-text text-center">
              Une interface pensée pour l'efficacité
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Menu principal intuitif : Accédez à toutes les fonctionnalités en un clic',
                'Gestion multi-comptes simplifiée : Ajoutez, modifiez et basculez entre vos comptes facilement',
                'Processus en 4 étapes : Configuration, sélection, programmation, validation - tout est guidé',
                'Vue d\'ensemble des messages programmés : Suivez et gérez tous vos envois planifiés',
                'Messagerie intégrée (Beta) : Consultez vos conversations sans quitter l\'application',
                'Design moderne et responsive : Interface optimisée pour tous les écrans'
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Check className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-32 px-6">
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Questions <span className="gradient-text">Fréquentes</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur AutoTele
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                  className="faq-item"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left p-8 flex justify-between items-center group"
                  >
                    <span className="font-semibold text-lg text-white pr-8 group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </span>
                <motion.div
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-blue-400" />
                </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 pt-2 text-gray-300 leading-relaxed border-t border-white/10">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative py-32 px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent" />
          <BackgroundBeams />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel rounded-3xl p-12 md:p-20 text-center glow-effect-strong"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              <Rocket className="w-24 h-24 text-blue-400 mx-auto" />
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Prêt à <span className="gradient-text">optimiser</span> votre Telegram ?
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Téléchargez AutoTele 2.1.1 maintenant et commencez à automatiser vos messages 
              en toute sécurité. Aucune inscription requise.
            </p>
            
            <DownloadButton 
              className="btn-premium group inline-flex mb-12"
              children="Télécharger pour Windows"
              showVersion={true}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Téléchargement Gratuit', icon: <Check /> },
                { label: 'Sans inscription', icon: <Check /> },
                { label: 'Installation rapide', icon: <Check /> },
                { label: 'Mises à jour gratuites', icon: <Check /> },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                Configuration requise
              </h3>
              <ul className="text-left max-w-md mx-auto space-y-3 text-gray-300">
                {[
                  'Windows 10 ou supérieur',
                  '4 GB de RAM minimum',
                  '200 MB d\'espace disque',
                  'Connexion Internet active',
                  'Compte(s) Telegram valide(s)'
                ].map((req, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">AutoTele 2.1.1</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatisez vos messages Telegram en toute sécurité avec les fonctions natives de planification.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a 
                    href={versionInfo?.direct_exe_url || "/updates/latest/AutoTele-Setup-v2.1.1.exe"} 
                    download 
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Télécharger
                  </a>
                </li>
                {['Documentation', 'Tutoriels', 'Notes de version'].map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">Contact & Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:support@autotele.app" className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-2">
                    <span>📧</span> support@autotele.app
                  </a>
                </li>
                {['Support Telegram', 'Signaler un bug', 'Suggérer une fonctionnalité'].map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p className="mb-4">© 2024 AutoTele. Tous droits réservés.</p>
            <p className="text-sm">
              AutoTele n'est pas affilié à Telegram. Toutes les marques sont la propriété de leurs propriétaires respectifs.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
