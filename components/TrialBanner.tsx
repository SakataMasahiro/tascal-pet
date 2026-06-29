'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Clock, AlertTriangle, X } from 'lucide-react'
import Link from 'next/link'

export default function TrialBanner() {
  const [status, setStatus] = useState<'loading' | 'trial' | 'expired' | 'hidden'>('loading')
  const [daysLeft, setDaysLeft] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) { setStatus('hidden'); return }

      const { data: hospital } = await supabase
        .from('hospitals')
        .select('plan, created_at')
        .eq('email', user.email)
        .single()

      if (!hospital) { setStatus('hidden'); return }

      const trialEnd = new Date(hospital.created_at)
      trialEnd.setDate(trialEnd.getDate() + 30)
      const now = new Date()
      const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (days > 0) {
        setDaysLeft(days)
        setStatus('trial')
      } else {
        setStatus('expired')
      }
    }
    load()
  }, [])

  if (status === 'loading' || status === 'hidden' || dismissed) return null

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
          <Link
            href="/pricing"
            className="shrink-0 bg-[#1D9E75] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#178a64] transition-colors"
          >
            プランを選択
          </Link>
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
      <div className="mx-4 mt-4 lg:mx-8 lg:mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800">無料トライアルが終了しました</p>
          <p className="text-xs text-red-600 mt-0.5">引き続きご利用いただくにはプランをお選びください。</p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
        >
          プランを選択
        </Link>
      </div>
    )
  }

  return null
}
