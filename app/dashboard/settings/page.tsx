'use client'

import { useState } from 'react'
import {
  Settings, Building2, MessageSquare, CreditCard, Users,
  Save, CheckCircle, AlertCircle, Plus, Trash2
} from 'lucide-react'

const mockStaff = [
  { id: '1', name: '田中 誠一', email: 'tanaka@clinic.com', role: '院長' },
  { id: '2', name: '山田 花子', email: 'yamada@clinic.com', role: '獣医師' },
  { id: '3', name: '鈴木 太郎', email: 'suzuki@clinic.com', role: '動物看護師' },
]

type SettingsTab = 'hospital' | 'line' | 'stripe' | 'staff'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('hospital')
  const [saved, setSaved] = useState(false)
  const [hospitalForm, setHospitalForm] = useState({
    name: '田中動物病院',
    email: 'tanaka@clinic.com',
    phone: '03-1234-5678',
    address: '東京都世田谷区○○町1-2-3',
    license: 'V-12345',
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { key: 'hospital', label: '病院情報', icon: Building2 },
    { key: 'line', label: 'LINE連携', icon: MessageSquare },
    { key: 'stripe', label: 'Stripe連携', icon: CreditCard },
    { key: 'staff', label: 'スタッフ管理', icon: Users },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#1D9E75]" />
          設定
        </h1>
        <p className="text-sm text-gray-500 mt-1">病院情報・外部サービス連携・スタッフ管理</p>
      </div>

      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#1D9E75] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hospital' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">病院情報</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">病院名</label>
                <input
                  value={hospitalForm.name}
                  onChange={e => setHospitalForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                  value={hospitalForm.email}
                  onChange={e => setHospitalForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                <input
                  value={hospitalForm.phone}
                  onChange={e => setHospitalForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">獣医師免許番号</label>
                <input
                  value={hospitalForm.license}
                  onChange={e => setHospitalForm(f => ({ ...f, license: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
              <input
                value={hospitalForm.address}
                onChange={e => setHospitalForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#1D9E75] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#178a64] transition-colors"
            >
              <Save className="w-4 h-4" />
              保存する
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#1D9E75]">
                <CheckCircle className="w-4 h-4" />
                保存しました
              </span>
            )}
          </div>
        </div>
      )}

      {activeTab === 'line' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">LINE連携</h2>
          <p className="text-sm text-gray-500 mb-5">LINE Official Accountと連携して、予約リマインド・お知らせ配信が可能になります。</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Channel Access Token</label>
              <input
                type="password"
                placeholder="未設定"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Channel Secret</label>
              <input
                type="password"
                placeholder="未設定"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
              />
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                LINE Developersでビジネスアカウントを作成し、MessagingAPIのChannel Access TokenとChannel Secretを取得してください。
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="mt-5 flex items-center gap-2 bg-[#1D9E75] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#178a64] transition-colors">
            <Save className="w-4 h-4" />
            保存する
          </button>
        </div>
      )}

      {activeTab === 'stripe' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Stripe連携</h2>
          <p className="text-sm text-gray-500 mb-5">Stripeと連携してオンライン決済・請求書発行が可能になります。</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
              <input
                type="password"
                placeholder="pk_live_..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <input
                type="password"
                placeholder="sk_live_..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                現在のプランでは自動課金は行いません。トライアル終了後のプラン更新時のみ課金が発生します。
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="mt-5 flex items-center gap-2 bg-[#1D9E75] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#178a64] transition-colors">
            <Save className="w-4 h-4" />
            保存する
          </button>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">スタッフ管理</h2>
            <button className="flex items-center gap-2 text-sm bg-[#1D9E75] text-white px-3 py-2 rounded-lg hover:bg-[#178a64] transition-colors">
              <Plus className="w-4 h-4" />
              スタッフ招待
            </button>
          </div>
          <div className="space-y-3">
            {mockStaff.map((staff) => (
              <div key={staff.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-[#1D9E75]">{staff.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{staff.name}</p>
                  <p className="text-xs text-gray-500">{staff.email}</p>
                </div>
                <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600">
                  {staff.role}
                </span>
                <button className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
