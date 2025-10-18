'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  CreditCard,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SubscriptionWithUser {
  id: string
  user_id: string
  invoice_id: string
  status: string
  activated_at: string | null
  expires_at: string | null
  auto_renew: boolean
  created_at: string
  user_email?: string
}

interface Stats {
  totalUsers: number
  activeSubscriptions: number
  lifetimeSubscriptions: number
  monthlySubscriptions: number
  totalRevenue: number
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    lifetimeSubscriptions: 0,
    monthlySubscriptions: 0,
    totalRevenue: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Vérifier l'authentification et le rôle admin
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) {
        router.push('/')
        return
      }

      setUser(user)

      // Vérifier si l'utilisateur est admin (via email)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
      if (user.email !== adminEmail) {
        alert('Accès non autorisé')
        router.push('/')
        return
      }

      setIsAdmin(true)

      // Charger les données admin
      await loadAdminData(supabase)
    })
  }, [router])

  const loadAdminData = async (supabase: any) => {
    try {
      // Charger toutes les souscriptions
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (subsError) throw subsError

      // Pour chaque souscription, récupérer l'email de l'utilisateur
      const subsWithEmails = await Promise.all(
        subs.map(async (sub: any) => {
          const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id)
          return {
            ...sub,
            user_email: userData?.user?.email || 'Email inconnu'
          }
        })
      )

      setSubscriptions(subsWithEmails)

      // Calculer les statistiques
      const activeCount = subs.filter((s: any) => 
        s.status === 'active' && (!s.expires_at || new Date(s.expires_at) > new Date())
      ).length

      const lifetimeCount = subs.filter((s: any) => 
        s.status === 'active' && !s.expires_at
      ).length

      const monthlyCount = subs.filter((s: any) => 
        s.status === 'active' && s.expires_at && new Date(s.expires_at) > new Date()
      ).length

      // Récupérer le nombre total d'utilisateurs
      const { count: userCount } = await supabase
        .from('subscriptions')
        .select('user_id', { count: 'exact', head: true })

      // Calculer le revenu total (estimation)
      const revenue = (lifetimeCount * 399.99) + (monthlyCount * 39.99)

      setStats({
        totalUsers: userCount || subs.length,
        activeSubscriptions: activeCount,
        lifetimeSubscriptions: lifetimeCount,
        monthlySubscriptions: monthlyCount,
        totalRevenue: revenue,
      })

      setLoading(false)
    } catch (error) {
      console.error('Error loading admin data:', error)
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Lifetime'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isActive = (sub: SubscriptionWithUser) => {
    if (sub.status !== 'active') return false
    if (!sub.expires_at) return true // Lifetime
    return new Date(sub.expires_at) > new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Dashboard <span className="gradient-text">Admin</span>
          </h1>
          <p className="text-gray-400 mb-12">
            Vue d'ensemble des abonnements et utilisateurs
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Abonnements Actifs</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.activeSubscriptions}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Lifetime / Mensuel</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.lifetimeSubscriptions} / {stats.monthlySubscriptions}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Revenu Total (est.)</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subscriptions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Tous les abonnements</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 text-sm font-semibold pb-4">Email</th>
                  <th className="text-left text-gray-400 text-sm font-semibold pb-4">Type</th>
                  <th className="text-left text-gray-400 text-sm font-semibold pb-4">Statut</th>
                  <th className="text-left text-gray-400 text-sm font-semibold pb-4">Activé le</th>
                  <th className="text-left text-gray-400 text-sm font-semibold pb-4">Expire le</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, idx) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 text-white text-sm">{sub.user_email}</td>
                    <td className="py-4 text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        {sub.expires_at ? (
                          <>
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>Mensuel</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Lifetime</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {isActive(sub) ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-green-400 text-sm">Actif</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-red-400 text-sm">Expiré</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {formatDate(sub.activated_at)}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {formatDate(sub.expires_at)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {subscriptions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucun abonnement pour le moment</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

