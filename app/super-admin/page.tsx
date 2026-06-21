'use client'

import { useState, useEffect } from 'react'
import { Shield, Eye, EyeOff, Building2, Users, TrendingUp, Heart, Lock, Handshake, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const mockHospitals = [
  { id: '1', name: 'たなか動物病院', email: 'tanaka@clinic.com', plan: 'standard', trial_ends_at: '2026-07-20', pets: 342, appointments: 1240 },
  { id: '2', name: 'やまだペットクリニック', email: 'yamada@clinic.com', plan: 'pro', trial_ends_at: null, pets: 891, appointments: 3200 },
  { id: '3', name: 'すずき動物病院', email: 'suzuki@clinic.com', plan: 'starter', trial_ends_at: '2026-06-25', pets: 120, appointments: 340 },
  { id: '4', name: '佐藤どうぶつ病院', email: 'sato@clinic.com', plan: 'standard', trial_ends_at: null, pets: 456, appointments: 1800 },
]

const mockPartners = [
  { id: '1', name: '田中 太郎', partner_code: 'TANAKA2024', referral_count: 8, total_commission: 384000, created_at: '2024-03-15' },
  { id: '2', name: '山田 花子', partner_code: 'YAMADA2024', referral_count: 5, total_commission: 240000, created_at: '2024-05-22' },
  { id: '3', name: '鈴木 健太', partner_code: 'SUZUKI2025', referral_count: 3, total_commission: 144000, created_at: '2025-01-10' },
  { id: '4', name: '佐藤 美咲', partner_code: 'SATO2025', referral_count: 1, total_commission: 48000, created_at: '2025-04-01' },
]

const planColors = {
  starter: 'bg-gray-100 text-gray-600',
  standard: 'bg-[#1D9E75]/10 text-[#1D9E75]',
  pro: 'bg-[#D4920E]/10 text-[#D4920E]',
}

interface Partner {
  id: string
  name: string
  partner_code: string
  referral_count: number
  total_commission: number
  created_at: string
}

export default function SuperAdminPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [partners, setPartners] = useState<Partner[]>(mockPartners)

  useEffect(() => {
    if (!authenticated) return
    async function fetchPartners() {
      const supabase = createClient()
      const { data: partnerRows } = await supabase
        .from('partners')
        .select('id, name, partner_code, commission_rate, created_at')
        .order('created_at', { ascending: false })

      if (!partnerRows?.length) return

      const { data: referrals } = await supabase
        .from('partner_referrals')
        .select('partner_id, commission_amount')

      const enriched: Partner[] = partnerRows.map(p => {
        const refs = referrals?.filter(r => r.partner_id === p.id) ?? []
        return {
          id: p.id,
          name: p.name,
          partner_code: p.partner_code,
          referral_count: refs.length,
          total_commission: refs.reduce((s, r) => s + (r.commission_amount ?? 0), 0),
          created_at: p.created_at.split('T')[0],
        }
      })
      setPartners(enriched)
    }
    fetchPartners()
  }, [authenticated])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD || password === 'Norikosan1947##') {
      setAuthenticated(true)
      setError('')
    } else {
      setError('パスワードが正しくありません')
    }
  }

  const totalPets = mockHospitals.reduce((s, h) => s + h.pets, 0)
  const totalAppointments = mockHospitals.reduce((s, h) => s + h.appointments, 0)
  const totalCommission = partners.reduce((s, p) => s + p.total_commission, 0)
  const thisMonthCommission = Math.round(totalCommission * 0.15)

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#D4920E]/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#D4920E]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Super Admin</h1>
              <p className="text-gray-400 text-sm">Tascal Pet 管理者専用</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">管理者パスワード</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4920E]/50 focus:border-[#D4920E] placeholder-gray-500"
                    placeholder="パスワードを入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#D4920E] text-white py-3 rounded-xl font-semibold hover:bg-[#b87e0c] transition-colors"
              >
                ログイン
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#D4920E]" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Tascal Pet 全体管理</p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-sm text-gray-400 hover:text-white border border-gray-600 px-3 py-2 rounded-lg transition-colors"
          >
            ログアウト
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: '登録病院数', value: mockHospitals.length, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'ペット総数', value: totalPets.toLocaleString(), icon: Heart, color: 'text-[#1D9E75]', bg: 'bg-[#1D9E75]/10' },
            { label: '総予約数', value: totalAppointments.toLocaleString(), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            { label: '月間収益', value: '¥239,400', icon: TrendingUp, color: 'text-[#D4920E]', bg: 'bg-[#D4920E]/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Hospitals Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-700">
            <h2 className="font-semibold text-white">登録病院一覧</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                  <th className="px-5 py-3">病院名</th>
                  <th className="px-5 py-3">メール</th>
                  <th className="px-5 py-3">プラン</th>
                  <th className="px-5 py-3">トライアル終了</th>
                  <th className="px-5 py-3">ペット数</th>
                  <th className="px-5 py-3">予約数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockHospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white text-sm">{h.name}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{h.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${planColors[h.plan as keyof typeof planColors]}`}>
                        {h.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {h.trial_ends_at ? (
                        <span className="text-yellow-400">{h.trial_ends_at}</span>
                      ) : (
                        <span className="text-green-400">本契約中</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">{h.pets.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-300">{h.appointments.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Partner Performance */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Handshake className="w-5 h-5 text-[#D4920E]" />
            PARTNER PERFORMANCE
          </h2>

          {/* Partner Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold">{partners.length}</p>
              <p className="text-sm text-gray-400 mt-1">総パートナー数</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-[#D4920E]/10 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-[#D4920E]" />
              </div>
              <p className="text-2xl font-bold">¥{thisMonthCommission.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">今月の総コミッション額</p>
            </div>
          </div>

          {/* Partner Table */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-700">
              <h3 className="font-semibold text-white">パートナー一覧</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-700">
                    <th className="px-5 py-3">パートナー名</th>
                    <th className="px-5 py-3">パートナーコード</th>
                    <th className="px-5 py-3">紹介病院数</th>
                    <th className="px-5 py-3">累計コミッション（35%）</th>
                    <th className="px-5 py-3">登録日</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {partners.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-white text-sm">{p.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {p.partner_code}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{p.referral_count}件</td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#D4920E]">
                        ¥{p.total_commission.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400">{p.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {partners.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">
                パートナーデータがありません
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
