'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Clock, AlertTriangle, CheckCircle, CreditCard, X } from 'lucide-react'

export default function TrialBanner() {
  const [status, setStatus] = useState<'loading' | 'trial' | 'expired' | 'active' | 'hidden'>('loading')
  const [daysLeft, setDaysLeft] = useState(0)
  const [plan, setPlan] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) { setStatus('hidden'); return }

      const { data: hospital } = await supabase
        .from('hospitals')
        .select('plan, trial_ends_at')
        .eq('email', user.email)
        .single()

      if (!hospital) { setStatus('hidden'); return }

      setPlan(hospital.plan)

      if (hospital.trial_ends_at) {
        const trialEnd = new Date(hospital.trial_ends_at)
        const now = new Date()
        const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (days > 0) {
          setDaysLeft(days)
          setStatus('trial')
        } else {
          setStatus('expired')
        }
      } else {
        setStatus('hidden')
      }
    }
    load()
  }, [])

  async function handleCheckout(planType: string) {
    setCheckoutLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planType }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
    setCheckoutLoading(false)
  }

  if (status === 'loading' || status === 'hidden' || dismissed) return null

  if (status === 'active') return null

  if (status === 'trial') {
    const urgency = daysLeft <= 7
    return (
      <div className={`mx-4 mt-4 lg:mx-8 lg:mt-6 rounded-xl border px-4 py-3 flex items-center gap-3 ${
        urgency
          ? 'bg-amber-50 border-amber-200'
          : 'bg-[#1D9E75]/5 border-[#1D9E75]/20'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          urgency ? 'bg-amber-100' : 'bg-[#1D9E75]/10'
        }`}>
          <Clock className={`w-4 h-4 ${urgency ? 'text-amber-600' : 'text-[#1D9E75]'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${urgency ? 'text-amber-800' : 'text-[#1D9E75]'}`}>
            無料トライアル残り <strong>{daysLeft}日</strong>
          </p>
          <p className={`text-xs mt-0.5 ${urgency ? 'text-amber-600' : 'text-gray-500'}`}>
            {urgency
              ? 'トライアル期間まもなく終了です。プランを選択してサービスを継続してください。'
              : 'トライアル中はすべての機能を無料でご利用いただけます。'}
          </p>
        </div>
        {urgency && (
          <button
            onClick={() => handleCheckout(plan || 'starter')}
            disabled={checkoutLoading}
            className="shrink-0 bg-[#1D9E75] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#178a64] transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <CreditCard className="w-3 h-3" />
            {checkoutLoading ? '処理中...' : 'プランを選択'}
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="mx-4 mt-4 lg:mx-8 lg:mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">無料トライアルが終了しました</p>
            <p className="text-xs text-red-600 mt-0.5">引き続きご利用いただくにはプランをお選びください。</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { key: 'starter', label: 'スターター ¥9,800/月' },
                { key: 'standard', label: 'スタンダード ¥19,800/月' },
                { key: 'pro', label: 'プロ ¥29,800/月' },
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => handleCheckout(p.key)}
                  disabled={checkoutLoading}
                  className="text-xs font-medium bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle className="w-3 h-3" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
