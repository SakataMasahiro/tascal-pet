'use client'

import { useState } from 'react'
import { Handshake, Eye, EyeOff, Building2, TrendingUp, Users, Lock, Heart } from 'lucide-react'
import Link from 'next/link'

const mockReferrals = [
  { id: '1', hospital_name: 'すずき動物病院', plan: 'standard', referred_at: '2026-05-10', status: 'active', commission: 3960 },
  { id: '2', hospital_name: 'みやび動物クリニック', plan: 'starter', referred_at: '2026-05-22', status: 'active', commission: 1960 },
  { id: '3', hospital_name: '北野ペット病院', plan: 'pro', referred_at: '2026-06-01', status: 'trial', commission: 0 },
]

export default function PartnerPage() {
  const [partnerCode, setPartnerCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

  const mockPartner = {
    name: '山田 健太',
    code: 'PARTNER-001',
    commission_rate: 20,
    total_commission: 5920,
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (partnerCode === 'PARTNER-001' || partnerCode === 'DEMO') {
      setAuthenticated(true)
      setError('')
    } else {
      setError('パートナーコードが正しくありません')
    }
  }

  const planLabels: Record<string, string> = {
    starter: 'スターター',
    standard: 'スタンダード',
    pro: 'プロ',
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#D4920E]/5 via-white to-[#1D9E75]/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Tascal Pet</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#D4920E]/10 flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-[#D4920E]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Partner Portal</h1>
              <p className="text-gray-500 text-sm">パートナーコードでログインしてください</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">パートナーコード</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showCode ? 'text' : 'password'}
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    placeholder="例: PARTNER-001"
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4920E]/50 focus:border-[#D4920E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#D4920E] text-white py-3 rounded-xl font-semibold hover:bg-[#b87e0c] transition-colors"
              >
                ログイン
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              パートナープログラムへの参加については<br />
              <a href="mailto:partner@tascal-pet.com" className="text-[#D4920E] hover:underline">partner@tascal-pet.com</a> までお問い合わせください
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4920E] flex items-center justify-center">
              <Handshake className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Partner Portal</p>
              <p className="text-xs text-gray-400">{mockPartner.name} · {mockPartner.code}</p>
            </div>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-[#D4920E]/10 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-[#D4920E]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockReferrals.filter(r => r.status === 'active').length}</p>
            <p className="text-sm text-gray-500">紹介中の病院（本契約）</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-[#1D9E75]/10 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-[#1D9E75]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockReferrals.length}</p>
            <p className="text-sm text-gray-500">紹介総数</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">¥{mockPartner.total_commission.toLocaleString()}</p>
            <p className="text-sm text-gray-500">累計コミッション</p>
          </div>
        </div>

        {/* Commission Rate */}
        <div className="bg-[#D4920E]/10 rounded-xl p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#D4920E] shrink-0" />
          <p className="text-sm text-gray-700">
            あなたのコミッション率: <strong className="text-[#D4920E]">{mockPartner.commission_rate}%</strong>
            （紹介病院の月額料金の{mockPartner.commission_rate}%を毎月お支払いします）
          </p>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">紹介病院一覧</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {mockReferrals.map((r) => (
              <div key={r.id} className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-[#1D9E75]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{r.hospital_name}</p>
                  <p className="text-xs text-gray-400">{planLabels[r.plan]} · 紹介日: {r.referred_at}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  r.status === 'active' ? 'bg-[#1D9E75]/10 text-[#1D9E75]' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {r.status === 'active' ? '本契約' : 'トライアル'}
                </span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">
                    {r.commission > 0 ? `¥${r.commission.toLocaleString()}` : '—'}
                  </p>
                  <p className="text-xs text-gray-400">月額コミッション</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Link */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">あなたの紹介リンク</h3>
          <div className="flex items-center gap-3">
            <input
              readOnly
              value={`https://tascal-pet.vercel.app/?ref=${mockPartner.code}`}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
            />
            <button
              onClick={() => navigator.clipboard?.writeText(`https://tascal-pet.vercel.app/?ref=${mockPartner.code}`)}
              className="bg-[#D4920E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b87e0c] transition-colors"
            >
              コピー
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">このリンクから登録した病院は自動的にあなたの紹介として記録されます</p>
        </div>
      </div>
    </div>
  )
}
