import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json()
    
    if (!invoiceId) {
      return NextResponse.json(
        { error: 'invoiceId is required' },
        { status: 400 }
      )
    }

    const serviceRoleClient = createServiceRoleClient()

    // Récupérer l'invoice depuis la base de données
    const { data: invoice, error: invoiceError } = await serviceRoleClient
      .from('btcpay_invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Récupérer le plan
    const { data: plan } = await serviceRoleClient
      .from('plans')
      .select('*')
      .eq('id', invoice.plan_id)
      .single()

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    // Calculer la date d'expiration
    let expiresAt: string | null = null
    if (plan.duration_days) {
      const expDate = new Date()
      expDate.setDate(expDate.getDate() + plan.duration_days)
      expiresAt = expDate.toISOString()
    }

    // Mettre à jour le statut de l'invoice
    await serviceRoleClient
      .from('btcpay_invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('invoice_id', invoiceId)

    // Créer l'abonnement
    const { error: subscriptionError } = await serviceRoleClient
      .from('subscriptions')
      .insert({
        user_id: invoice.user_id,
        invoice_id: invoiceId,
        plan_id: invoice.plan_id,
        status: 'active',
        activated_at: new Date().toISOString(),
        expires_at: expiresAt,
        auto_renew: false,
      })

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Subscription activated successfully',
      subscription: {
        user_id: invoice.user_id,
        invoice_id: invoiceId,
        plan_id: invoice.plan_id,
        expires_at: expiresAt
      }
    })
  } catch (error: any) {
    console.error('Error activating subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
