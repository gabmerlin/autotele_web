import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('btcpay-sig') || ''
    const contentType = request.headers.get('content-type') || ''
    const userAgent = request.headers.get('user-agent') || ''
    
    console.log('=== BTCPay Webhook Debug ===')
    console.log('Headers:', {
      'btcpay-sig': signature,
      'content-type': contentType,
      'user-agent': userAgent,
      'host': request.headers.get('host'),
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
    })
    console.log('Raw Body:', rawBody)
    
    let payload
    try {
      payload = JSON.parse(rawBody)
      console.log('Parsed Payload:', JSON.stringify(payload, null, 2))
    } catch (e) {
      console.log('Failed to parse JSON:', e)
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Debug webhook received',
      debug: {
        hasSignature: !!signature,
        signatureLength: signature.length,
        bodyLength: rawBody.length,
        contentType,
        userAgent,
        payload: payload ? 'Valid JSON' : 'Invalid JSON'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Debug webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'BTCPay webhook debug endpoint is working',
    timestamp: new Date().toISOString()
  })
}
