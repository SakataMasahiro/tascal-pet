'use client'

import { useState } from 'react'
import { Shield, Eye, EyeOff, Building2, Users, TrendingUp, Heart, Lock } from 'lucide-react'

const mockHospitals = [
  { id: '1', name: 'たなか動物病院', email: 'tanaka@clinic.com', plan: 'standard', trial_ends_at: '2026-07-20', pets: 342, appointments: 1240 },
  { id: '2', name: 'やまだペットクリニック', email: 'yamada@clinic.com', plan: 'pro', trial_ends_at: null, pets: 891, appointments: 3200 },
  { id: '3', name: 'すずき動物病院', email: 'suzuki@clinic.com', plan: 'starter', trial_ends_at: '2026-06-25', pets: 120, appointments: 340 },
  { id: '4', name: '佐藤どうぶつ病院', email: 'sato@clinic.com', plan: 'standard', trial_ends_at: null, pets: 456, appointments: 1800 },
]

const planColors = {
  starter: 'bg-gray-100 text-gray-600',
  standard: 'bg-[#1D9E75]/10 text-[#1D9E75]',
  pro: 'bg-[#D4920E]/10 text-[#D4920E]',
}

export default function SuperAdminPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

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
      </div>
    </div>
  )
}
