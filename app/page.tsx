'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Heart, Calendar, Brain, Users, Settings, BarChart3,
  CheckCircle, Star, ArrowRight, Shield, Zap, Clock, Loader2
} from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'ペットカルテ管理',
    description: '診療記録・ワクチン歴・アレルギー・性格メモまで、すべての情報を一元管理。虹の橋メモリアルで大切な命を永遠に記録。',
  },
  {
    icon: Calendar,
    title: '予約管理',
    description: 'カレンダービューで予約を直感的に管理。LINE通知で飼い主への自動リマインドも。',
  },
  {
    icon: Brain,
    title: 'AI獣医師アシスタント',
    description: '症状を入力するだけで考えられる疾患・対処法を提示。診察メモや飼い主向け説明文を自動生成。',
  },
  {
    icon: Users,
    title: '地域コミュニティ',
    description: '健康イベント・お知らせの作成、地域の飼い主へのLINE一斉配信で地域に根ざした動物病院へ。',
  },
  {
    icon: BarChart3,
    title: '経営ダッシュボード',
    description: '今日の予約・患者数・売上・ワクチン期限アラートをひと目で確認。データドリブンな病院経営を支援。',
  },
  {
    icon: Settings,
    title: '柔軟な設定・連携',
    description: 'LINE・Stripe・スタッフ管理など、病院の規模に合わせた柔軟な設定が可能。',
  },
]

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
    color: 'border-gray-200',
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
    color: 'border-[#1D9E75]',
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
    color: 'border-[#D4920E]',
    btnClass: 'bg-[#D4920E] hover:bg-[#b87e0c] text-white',
    popular: false,
  },
]

const testimonials = [
  {
    name: '田中 誠一 先生',
    clinic: 'たなか動物病院（東京都世田谷区）',
    comment: 'AIアシスタントのおかげで、診察メモ作成の時間が半分になりました。飼い主さんへの説明文も自動生成されるので、コミュニケーションの質が上がりました。',
    rating: 5,
  },
  {
    name: '山田 花子 先生',
    clinic: 'やまだペットクリニック（大阪府吹田市）',
    comment: 'ワクチン期限アラートが本当に助かります。電話でのリマインドが減り、スタッフの業務負担が大幅に軽減されました。',
    rating: 5,
  },
  {
    name: '鈴木 健太 先生',
    clinic: 'すずき動物病院（愛知県名古屋市）',
    comment: '地域コミュニティ機能で健康セミナーの集客が3倍に。地域の飼い主さんとの絆が深まっています。',
    rating: 5,
  },
]

export default function HomePage() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  async function handleCheckout(planKey: string) {
    setCheckoutLoading(planKey)
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
      if (data.url) window.location.href = data.url
    } catch {
      window.location.href = `/auth/login?plan=${planKey}`
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Tascal Pet</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-[#1D9E75] text-sm transition-colors">機能</a>
            <a href="#pricing" className="text-gray-600 hover:text-[#1D9E75] text-sm transition-colors">料金</a>
            <a href="#testimonials" className="text-gray-600 hover:text-[#1D9E75] text-sm transition-colors">お客様の声</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-[#1D9E75] transition-colors">
              ログイン
            </Link>
            <Link href="/auth/login" className="text-sm bg-[#1D9E75] text-white px-4 py-2 rounded-lg hover:bg-[#178a64] transition-colors font-medium">
              無料トライアル
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-white via-green-50/30 to-yellow-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#1D9E75]/10 text-[#1D9E75] px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              30日間無料トライアル実施中
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              ペットは家族。
              <br />
              <span className="text-[#1D9E75]">その命に寄り添う、</span>
              <br />
              すべての人へ。
            </h1>
            <p className="text-xl text-gray-600 mb-4 leading-relaxed max-w-2xl">
              動物病院のDXを、もっと人間的に。カルテ管理から予約・AI診察サポートまで、
              獣医師が本当に大切にしたいことに集中できる環境を提供します。
            </p>
            <p className="text-sm text-gray-400 mb-10 italic">— 透徹した誠実さと深い思いやり — Tascal</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 bg-[#1D9E75] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#178a64] transition-all shadow-lg shadow-[#1D9E75]/25"
              >
                30日間無料で始める
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-all"
              >
                機能を見る
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1D9E75]" />
                クレジットカード不要
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#1D9E75]" />
                自動課金なし
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1D9E75]" />
                医療グレードセキュリティ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              獣医師が本当に必要な機能、すべて揃っています
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              煩雑な事務作業を自動化して、動物たちと向き合う時間を増やしましょう
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:border-[#1D9E75]/30 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center mb-6 group-hover:bg-[#1D9E75]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#1D9E75]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">シンプルな料金プラン</h2>
            <p className="text-xl text-gray-600">すべてのプランに30日間無料トライアル付き。自動課金は一切ありません。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 ${plan.color} ${plan.popular ? 'shadow-xl' : 'shadow-sm'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-sm font-semibold px-4 py-1 rounded-full">
                    人気No.1
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 mb-1">{plan.period}</span>
                  </div>
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
          <p className="text-center text-sm text-gray-400 mt-8">
            ※ トライアル終了後は自動的にサービスが停止します。課金には別途お申し込みが必要です。
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-[#1D9E75]/5 to-[#D4920E]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">先生たちの声</h2>
            <p className="text-xl text-gray-600">全国の動物病院でご活用いただいています</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4920E] text-[#D4920E]" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.comment}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.clinic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1D9E75]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            今すぐ、動物たちとの時間を増やしましょう
          </h2>
          <p className="text-xl text-white/80 mb-10">
            30日間、完全無料でお試しいただけます。クレジットカード不要。自動課金なし。
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#1D9E75] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg"
          >
            無料トライアルを始める
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              導入5分で開始可能
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              データは完全暗号化
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1D9E75] flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
              <span className="text-white font-semibold">Tascal Pet</span>
            </div>
            <p className="text-sm text-gray-500 italic">
              透徹した誠実さと深い思いやり — Tascal
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/auth/login" className="hover:text-white transition-colors">ログイン</Link>
              <Link href="/partner" className="hover:text-white transition-colors">パートナー</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2026 Tascal Pet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
