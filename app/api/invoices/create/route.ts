import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createBTCPayInvoice } from '@/lib/btcpay'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID requis' },
        { status: 400 }
      )
    }

    // Récupérer les détails du plan
    const serviceRoleClient = createServiceRoleClient()
    const { data: plan, error: planError } = await serviceRoleClient
      .from('plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single()

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Plan introuvable' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur n'a pas déjà un abonnement actif
    const { data: existingSubscription } = await serviceRoleClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingSubscription && (!existingSubscription.expires_at || new Date(existingSubscription.expires_at) > new Date())) {
      return NextResponse.json(
        { error: 'Vous avez déjà un abonnement actif' },
        { status: 400 }
      )
    }

    // Créer une invoice BTCPay
    const orderId = `${user.id}-${Date.now()}`
    const btcpayInvoice = await createBTCPayInvoice({
      amount: plan.price_usd,
      currency: 'USD',
      orderId,
      buyerEmail: user.email,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      notificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/btcpay`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
      },
    })

    // Enregistrer l'invoice dans la base de données
    const { error: insertError } = await serviceRoleClient
      .from('btcpay_invoices')
      .insert({
        user_id: user.id,
        invoice_id: btcpayInvoice.id,
        plan_id: plan.id,
        amount_usd: plan.price_usd,
        status: 'pending',
        btcpay_url: btcpayInvoice.checkoutLink,
        metadata: {
          orderId,
          planName: plan.name,
        },
      })

    if (insertError) {
      console.error('Error inserting invoice:', insertError)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la facture' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      invoiceId: btcpayInvoice.id,
      checkoutUrl: btcpayInvoice.checkoutLink,
      amount: plan.price_usd,
      currency: 'USD',
    })
  } catch (error: any) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

