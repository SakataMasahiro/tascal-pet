'use client'

import { useState } from 'react'
import { Gift, Heart, Plus, X, Star } from 'lucide-react'

interface GratitudeMessage {
  id: string
  pet_name: string
  owner_name: string
  message: string
  created_at: string
}

const mockMessages: GratitudeMessage[] = [
  {
    id: '1',
    pet_name: 'ポチ',
    owner_name: '田中 誠一',
    message: '先生のおかげでポチが元気になりました。本当にありがとうございます。家族全員で感謝しています。',
    created_at: '2026-06-20',
  },
  {
    id: '2',
    pet_name: 'ミケ',
    owner_name: '山田 花子',
    message: 'ミケの手術、無事成功してよかったです。先生の丁寧な説明で安心できました。',
    created_at: '2026-06-18',
  },
  {
    id: '3',
    pet_name: 'ラブ',
    owner_name: '鈴木 一郎',
    message: '夜遅くにも関わらず診ていただきありがとうございました。ラブも回復しています。',
    created_at: '2026-06-15',
  },
  {
    id: '4',
    pet_name: 'モカ',
    owner_name: '佐藤 美咲',
    message: 'いつも親身に相談に乗っていただき、ありがとうございます。モカのことが大好きな先生に出会えて幸せです。',
    created_at: '2026-06-10',
  },
]

export default function GratitudePage() {
  const [messages, setMessages] = useState<GratitudeMessage[]>(mockMessages)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pet_name: '', owner_name: '', message: '' })

  function handleAdd() {
    if (!form.message.trim()) return
    const newMsg: GratitudeMessage = {
      id: Date.now().toString(),
      pet_name: form.pet_name || '—',
      owner_name: form.owner_name || '匿名',
      message: form.message,
      created_at: new Date().toISOString().split('T')[0],
    }
    setMessages([newMsg, ...messages])
    setForm({ pet_name: '', owner_name: '', message: '' })
    setShowForm(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-[#D4920E] to-[#c07e0b] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">感謝の宝箱</h1>
        </div>
        <p className="text-white/90 text-sm">飼い主さんから届いた感謝の言葉を大切に保存しています。</p>
        <div className="mt-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span className="text-white/80 text-sm">{messages.length}件の感謝メッセージ — 運指数に加算中</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm bg-[#D4920E] text-white px-4 py-2 rounded-lg hover:bg-[#c07e0b] transition-colors"
        >
          <Plus className="w-4 h-4" />
          感謝を記録
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-[#D4920E]/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#D4920E]" />
              新しい感謝を記録
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ペット名</label>
                <input
                  value={form.pet_name}
                  onChange={e => setForm({ ...form, pet_name: e.target.value })}
                  placeholder="例: ポチ"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4920E]/30"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">飼い主名</label>
                <input
                  value={form.owner_name}
                  onChange={e => setForm({ ...form, owner_name: e.target.value })}
                  placeholder="例: 田中様"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4920E]/30"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">感謝メッセージ *</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="飼い主さんからいただいた言葉を記録してください..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4920E]/30 resize-none"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!form.message.trim()}
              className="w-full bg-[#D4920E] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#c07e0b] transition-colors disabled:opacity-40"
            >
              宝箱に追加
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-[#D4920E]/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D4920E]/10 flex items-center justify-center shrink-0">
                <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '💛'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 text-sm">{msg.owner_name}</span>
                  <span className="text-gray-400 text-xs">より</span>
                  <span className="text-[#1D9E75] text-xs font-medium bg-[#1D9E75]/10 px-2 py-0.5 rounded-full">
                    {msg.pet_name}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-2">{msg.created_at}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">まだ感謝メッセージがありません</p>
        </div>
      )}
    </div>
  )
}
