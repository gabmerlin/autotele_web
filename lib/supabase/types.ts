export interface Plan {
  id: string
  name: string
  price_usd: number
  duration_days: number | null
  is_active: boolean
  description: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  invoice_id: string
  status: 'active' | 'expired' | 'cancelled'
  activated_at: string | null
  expires_at: string | null
  auto_renew: boolean
  created_at: string
  updated_at: string
}

export interface BTCPayInvoice {
  id: string
  user_id: string
  invoice_id: string
  plan_id: string
  amount_usd: number
  status: 'pending' | 'paid' | 'expired' | 'invalid'
  btcpay_url: string | null
  created_at: string
  paid_at: string | null
  metadata: any
}

export interface UserProfile {
  id: string
  email: string
  created_at: string
}

