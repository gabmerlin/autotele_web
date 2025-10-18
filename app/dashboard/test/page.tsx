'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('Test dashboard starting...')
    
    const supabase = createClient()
    
    const checkAuth = async () => {
      try {
        console.log('Getting user...')
        const { data: { user }, error } = await supabase.auth.getUser()
        
        console.log('User result:', { user: user?.email, error })
        
        if (error) {
          setError(error.message)
        } else {
          setUser(user)
        }
      } catch (err: any) {
        console.error('Auth error:', err)
        setError(err.message)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Test Dashboard Loading...</div>
          <div className="text-sm text-gray-400">Debug info will appear here</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-8">Test Dashboard</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading.toString()}
        </div>
        <div>
          <strong>User:</strong> {user?.email || 'null'}
        </div>
        <div>
          <strong>Error:</strong> {error || 'none'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'null'}
        </div>
      </div>
    </div>
  )
}
