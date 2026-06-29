'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart, CheckCircle, Loader2, ArrowLeft,
  Star, Shield, Clock, Zap,
} from 'lucide-react'

const plans = [
  {
    name: 'スターター',
    planKey: 'starter',
    price: '¥9,800',
    period: '/月',
    description: '小規模クリニック向け',
    features: [
      'ペットカルテ管理（〜100件）',
      '予約管理',
      'AIアシスタント（月50回）',
      'メールサポート',
    ],
    border: 'border-gray-200',
    btnClass: 'bg-gray-700 hover:bg-gray-800 text-white',
    popular: false,
  },
  {
    name: 'スタンダード',
    planKey: 'standard',
    price: '¥19,800',
    period: '/月',
    description: '中規模クリニック向け',
    features: [
      'ペットカルテ管理（〜500件）',
      '予約管理 + LINE通知',
      'AIアシスタント（月200回）',
      '地域コミュニティ機能',
      'チャットサポート',
    ],
    border: 'border-[#1D9E75]',
    btnClass: 'bg-[#1D9E75] hover:bg-[#178a64] text-white',
    popular: true,
  },
  {
    name: 'プロ',
    planKey: 'pro',
    price: '¥29,800',
    period: '/月',
    description: '多院展開・大規模向け',
    features: [
      'ペットカルテ管理（無制限）',
      '予約管理 + LINE通知',
      'AIアシスタント（無制限）',
      '地域コミュニティ機能',
      'スタッフ複数アカウント',
      '専任サポート',
    ],
    border: 'border-[#D4920E]',
    btnClass: 'bg-[#D4920E] hover:bg-[#b87e0c] text-white',
    popular: false,
  },
]

export default function PricingPage() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleCheckout(planKey: string) {
    setCheckoutLoading(planKey)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      if (res.status === 401) {
        window.location.href = `/auth/login?plan=${planKey}`
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('決済セッションの作成に失敗しました。もう一度お試しください。')
      }
    } catch {
      window.location.href = `/auth/login?plan=${planKey}`
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">戻る</span>
            </Link>
            <div className="w-px h-5 bg-gray-200" />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Tascal Pet</span>
            </Link>
          </div>
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-[#1D9E75] transition-colors"
          >
            ログイン
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1D9E75]/10 text-[#1D9E75] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            30日間無料トライアル実施中
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            シンプルな料金プラン
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            すべてのプランに30日間無料トライアル付き。
            <br />
            自動課金は一切ありません。
          </p>
        </div>

        {error && (
          <div className="mb-8 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.planKey}
              className={`relative rounded-2xl border-2 p-8 bg-white ${plan.border} ${
                plan.popular ? 'shadow-xl' : 'shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-sm font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                  人気No.1
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-[#1D9E75] font-medium mt-2">30日間無料トライアル</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.planKey)}
                disabled={checkoutLoading === plan.planKey}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-colors ${plan.btnClass} disabled:opacity-70`}
              >
                {checkoutLoading === plan.planKey ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />処理中...</>
                ) : (
                  '30日間無料で試す'
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mb-12">
          ※ トライアル終了後は自動的にサービスが停止します。課金には別途お申し込みが必要です。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#1D9E75]" />
            医療グレードセキュリティ
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1D9E75]" />
            導入5分で開始可能
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#D4920E] fill-[#D4920E]" />
            全国の動物病院で導入実績
          </div>
        </div>
      </main>
    </div>
  )
}
