'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Subscription {
  id: string
  user_id: string
  invoice_id: string
  status: string
  activated_at: string
  expires_at: string | null
  auto_renew: boolean
  created_at: string
  updated_at: string
  plan_id: string | null
}

interface AuthContextType {
  user: User | null
  subscription: Subscription | null
  hasSubscription: boolean
  loading: boolean
  refreshSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkSubscription = async (userId: string) => {
    try {
      console.log('AuthContext - Checking subscription for:', userId)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      console.log('AuthContext - Subscription result:', { data, error })

      if (error && error.code !== 'PGRST116') {
        console.error('Subscription check error:', error)
      }

      if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) {
        console.log('AuthContext - Subscription active')
        setSubscription(data)
        setHasSubscription(true)
      } else {
        console.log('AuthContext - No active subscription')
        setSubscription(null)
        setHasSubscription(false)
      }
    } catch (err) {
      console.error('Error checking subscription:', err)
      setSubscription(null)
      setHasSubscription(false)
    }
  }

  const refreshSubscription = async () => {
    if (user) {
      await checkSubscription(user.id)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    console.log('AuthContext - Initializing...')

    // Charger l'utilisateur initial avec getSession
    const initAuth = async () => {
      try {
        console.log('AuthContext - Getting session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
        }

        console.log('AuthContext - Session:', session?.user?.email || 'No user')

        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            // Vérifier l'abonnement en arrière-plan (non bloquant)
            checkSubscription(session.user.id).catch(err => {
              console.error('Subscription check failed:', err)
            })
          } else {
            setUser(null)
            setSubscription(null)
            setHasSubscription(false)
          }
          // Toujours finir le loading après avoir vérifié la session
          console.log('AuthContext - Setting loading to false')
          setLoading(false)
        }
      } catch (err) {
        console.error('Init auth error:', err)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    // Écouter les changements d'authentification
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('AuthContext - Auth change:', event, session?.user?.email)

        if (session?.user) {
          setUser(session.user)
          // Vérifier l'abonnement en arrière-plan
          checkSubscription(session.user.id).catch(err => {
            console.error('Subscription check failed:', err)
          })
        } else {
          setUser(null)
          setSubscription(null)
          setHasSubscription(false)
        }

        setLoading(false)
      }
    )

    return () => {
      console.log('AuthContext - Cleanup')
      mounted = false
      authSubscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        hasSubscription,
        loading,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

