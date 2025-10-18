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
      const supabase = createClient()
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Subscription check error:', error)
      }

      if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) {
        setSubscription(data)
        setHasSubscription(true)
      } else {
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

    // Charger l'utilisateur initial avec getSession
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
        }

        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            await checkSubscription(session.user.id)
          } else {
            setUser(null)
            setSubscription(null)
            setHasSubscription(false)
          }
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

        console.log('AuthContext - Auth change:', event)

        if (session?.user) {
          setUser(session.user)
          await checkSubscription(session.user.id)
        } else {
          setUser(null)
          setSubscription(null)
          setHasSubscription(false)
        }

        setLoading(false)
      }
    )

    return () => {
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

