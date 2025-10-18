// Fonctions pour interagir avec BTCPay Server

interface CreateInvoiceParams {
  amount: number
  currency: string
  orderId: string
  buyerEmail?: string
  notificationUrl?: string
  redirectUrl?: string
  metadata?: any
}

export async function createBTCPayInvoice(params: CreateInvoiceParams) {
  const url = `${process.env.BTCPAY_SERVER_URL}/api/v1/stores/${process.env.BTCPAY_STORE_ID}/invoices`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${process.env.BTCPAY_API_KEY}`,
    },
    body: JSON.stringify({
      amount: params.amount.toString(),
      currency: params.currency,
      orderId: params.orderId,
      checkout: {
        redirectUrl: params.redirectUrl,
        speedPolicy: 'HighSpeed',
      },
      buyer: params.buyerEmail ? {
        email: params.buyerEmail,
      } : undefined,
      metadata: params.metadata,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`BTCPay API Error: ${error}`)
  }

  return response.json()
}

export async function getInvoiceStatus(invoiceId: string) {
  const url = `${process.env.BTCPAY_SERVER_URL}/api/v1/stores/${process.env.BTCPAY_STORE_ID}/invoices/${invoiceId}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `token ${process.env.BTCPAY_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch invoice status')
  }

  return response.json()
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require('crypto')
  const secret = process.env.BTCPAY_WEBHOOK_SECRET!
  
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const expectedSignature = hmac.digest('hex')
  
  return signature === `sha256=${expectedSignature}`
}

