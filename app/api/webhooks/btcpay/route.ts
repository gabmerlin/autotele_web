import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { verifyWebhookSignature } from '@/lib/btcpay'

export async function POST(request: NextRequest) {
  try {
    // Récupérer le payload et la signature
    const rawBody = await request.text()
    const signature = request.headers.get('btcpay-sig') || ''

    // Vérifier la signature du webhook
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody)
    const { type, invoiceId, metadata } = payload

    console.log('BTCPay Webhook received:', { type, invoiceId })

    const serviceRoleClient = createServiceRoleClient()

    // Récupérer l'invoice depuis la base de données
    const { data: invoice, error: invoiceError } = await serviceRoleClient
      .from('btcpay_invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single()

    if (invoiceError || !invoice) {
      console.error('Invoice not found:', invoiceId)
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Traiter selon le type d'événement
    if (type === 'InvoiceSettled' || payload.status === 'Settled') {
      // Paiement confirmé - créer/activer l'abonnement
      console.log('Payment confirmed for invoice:', invoiceId)

      // Mettre à jour le statut de l'invoice
      await serviceRoleClient
        .from('btcpay_invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('invoice_id', invoiceId)

      // Récupérer le plan
      const { data: plan } = await serviceRoleClient
        .from('plans')
        .select('*')
        .eq('id', invoice.plan_id)
        .single()

      if (!plan) {
        console.error('Plan not found:', invoice.plan_id)
        return NextResponse.json({ success: true })
      }

      // Calculer la date d'expiration
      let expiresAt: string | null = null
      if (plan.duration_days) {
        const expDate = new Date()
        expDate.setDate(expDate.getDate() + plan.duration_days)
        expiresAt = expDate.toISOString()
      }

      // Créer l'abonnement
      const { error: subscriptionError } = await serviceRoleClient
        .from('subscriptions')
        .insert({
          user_id: invoice.user_id,
          invoice_id: invoiceId,
          status: 'active',
          activated_at: new Date().toISOString(),
          expires_at: expiresAt,
          auto_renew: false,
        })

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
        // Ne pas retourner d'erreur pour ne pas que BTCPay revoie le webhook
      } else {
        console.log('Subscription created successfully for user:', invoice.user_id)
      }

    } else if (type === 'InvoiceExpired' || payload.status === 'Expired') {
      // Facture expirée
      console.log('Invoice expired:', invoiceId)

      await serviceRoleClient
        .from('btcpay_invoices')
        .update({
          status: 'expired',
        })
        .eq('invoice_id', invoiceId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

