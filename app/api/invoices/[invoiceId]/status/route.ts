import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const invoiceId = params.invoiceId

    // Vérifier l'authentification
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer le statut de l'invoice depuis la base de données
    const serviceRoleClient = createServiceRoleClient()
    const { data: invoice, error: invoiceError } = await serviceRoleClient
      .from('btcpay_invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .eq('user_id', user.id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Facture introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: invoice.status,
      paidAt: invoice.paid_at,
      amount: invoice.amount_usd,
    })
  } catch (error: any) {
    console.error('Error fetching invoice status:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

