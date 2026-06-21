import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { hospital_id, plan_type, user_email } = session.metadata ?? {}

      if (!plan_type) return NextResponse.json({ received: true })

      if (hospital_id) {
        await supabaseAdmin
          .from('hospitals')
          .update({
            plan: plan_type,
            stripe_customer_id: session.customer as string,
          })
          .eq('id', hospital_id)
      } else if (user_email) {
        await supabaseAdmin
          .from('hospitals')
          .update({
            plan: plan_type,
            stripe_customer_id: session.customer as string,
          })
          .eq('email', user_email)
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription
      const { hospital_id, plan_type, user_email } = sub.metadata ?? {}

      if (!plan_type) return NextResponse.json({ received: true })

      const update = {
        plan: sub.status === 'active' || sub.status === 'trialing' ? plan_type : 'starter',
        stripe_customer_id: sub.customer as string,
      }

      if (hospital_id) {
        await supabaseAdmin.from('hospitals').update(update).eq('id', hospital_id)
      } else if (user_email) {
        await supabaseAdmin.from('hospitals').update(update).eq('email', user_email)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription
      const { hospital_id, user_email } = sub.metadata ?? {}

      if (hospital_id) {
        await supabaseAdmin.from('hospitals').update({ plan: 'starter' }).eq('id', hospital_id)
      } else if (user_email) {
        await supabaseAdmin.from('hospitals').update({ plan: 'starter' }).eq('email', user_email)
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
