import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  standard: process.env.STRIPE_PRICE_STANDARD!,
  pro: process.env.STRIPE_PRICE_PRO!,
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json()

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: hospital } = await supabase
      .from('hospitals')
      .select('id, stripe_customer_id')
      .eq('email', user.email)
      .single()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: hospital?.stripe_customer_id ? undefined : user.email,
      customer: hospital?.stripe_customer_id || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          hospital_id: hospital?.id ?? '',
          plan_type: plan,
          user_email: user.email,
        },
      },
      metadata: {
        hospital_id: hospital?.id ?? '',
        plan_type: plan,
        user_email: user.email,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?plan=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      locale: 'ja',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 })
  }
}
