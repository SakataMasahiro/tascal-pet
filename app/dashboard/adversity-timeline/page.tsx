'use client'

import { useState } from 'react'
import { BookOpen, Plus, X, Sparkles, Loader2, Heart, Clock } from 'lucide-react'

interface AdversityRecord {
  id: string
  pet_name?: string
  content: string
  recorded_at: string
  ai_reflection?: string
  is_memorial?: boolean
}

const mockRecords: AdversityRecord[] = [
  {
    id: '1',
    pet_name: 'ハナ',
    content: 'ハナとの最後の日。8年間一緒に戦った腫瘍との闘いが終わった。飼い主の田中さんが泣きながら「先生、ありがとうございました」と言ってくれた。なのに私は何もできなかった気がして、帰り道に涙が止まらなかった。',
    recorded_at: '2025-06-15',
    ai_reflection: 'あの日から一年が経ちました。ハナとともに過ごした8年間は、命の重さを教えてくれる時間でした。あなたが流した涙は、無力感ではなく深い愛情の証です。田中さんの「ありがとう」という言葉は、医療の限界を超えたところにある、命への誠実な向き合い方への感謝でした。あの別れがあったからこそ、今日のあなたは一層深く命と向き合えています。ハナはあなたの中に生き続けています。',
    is_memorial: true,
  },
  {
    id: '2',
    content: '今日の手術は予想外に難航した。術中に出血が増え、1時間半延長。幸い回復したが、自分の判断に自信が持てなくなった。もっと勉強しなければ。',
    recorded_at: '2025-12-03',
    ai_reflection: undefined,
  },
]

export default function AdversityTimelinePage() {
  const [records, setRecords] = useState<AdversityRecord[]>(mockRecords)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pet_name: '', content: '' })
  const [loadingReflectionId, setLoadingReflectionId] = useState<string | null>(null)

  async function handleAdd() {
    if (!form.content.trim()) return
    const newRecord: AdversityRecord = {
      id: Date.now().toString(),
      pet_name: form.pet_name || undefined,
      content: form.content,
      recorded_at: new Date().toISOString().split('T')[0],
      ai_reflection: undefined,
    }
    setRecords([newRecord, ...records])
    setForm({ pet_name: '', content: '' })
    setShowForm(false)
  }

  async function generateReflection(id: string, content: string) {
    setLoadingReflectionId(id)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'adversity_reflection', input: content }),
      })
      const data = await res.json()
      setRecords(prev =>
        prev.map(r => r.id === id ? { ...r, ai_reflection: data.result } : r)
      )
    } catch {
      // silent fail
    } finally {
      setLoadingReflectionId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">逆境タイムライン</h1>
        </div>
        <p className="text-white/80 text-sm">
          辛かった経験を記録してください。1年後、AIがその経験の意味を物語として届けます。
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-300 fill-red-300" />
          <span className="text-white/60 text-sm">すべての経験は、あなたを深くする</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          経験を記録
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-600" />
              経験を記録する
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">関連するペット（任意）</label>
              <input
                value={form.pet_name}
                onChange={e => setForm({ ...form, pet_name: e.target.value })}
                placeholder="例: ハナ（この経験に関連するペット）"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">その日の経験 *</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="辛かったこと、悔しかったこと、看取りの経験など、正直な気持ちを記録してください..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              />
            </div>
            <p className="text-xs text-gray-400">
              ※ 1年後にAIがこの経験の意味を生成し、通知します。
            </p>
            <button
              onClick={handleAdd}
              disabled={!form.content.trim()}
              className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
            >
              タイムラインに記録
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
        {records.map((record) => (
          <div key={record.id} className="relative pl-6 pb-8">
            <div className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full border-2 border-white ${
              record.is_memorial ? 'bg-purple-400' : 'bg-gray-500'
            }`} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {record.is_memorial && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                        🌈 虹の橋
                      </span>
                    )}
                    {record.pet_name && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {record.pet_name}との経験
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    {record.recorded_at}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{record.content}</p>
              </div>

              {record.ai_reflection ? (
                <div className="border-t border-gray-100 bg-gradient-to-r from-[#1D9E75]/5 to-[#D4920E]/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#D4920E]" />
                    <span className="text-xs font-semibold text-[#D4920E]">AIからの振り返り（1年後）</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">{record.ai_reflection}</p>
                </div>
              ) : (
                <div className="border-t border-gray-100 p-4 flex items-center justify-between">
                  <p className="text-xs text-gray-400">1年後にAIが振り返りを届けます</p>
                  <button
                    onClick={() => generateReflection(record.id, record.content)}
                    disabled={loadingReflectionId === record.id}
                    className="flex items-center gap-1.5 text-xs text-[#1D9E75] hover:text-[#178a64] font-medium disabled:opacity-50"
                  >
                    {loadingReflectionId === record.id ? (
                      <><Loader2 className="w-3 h-3 animate-spin" />生成中...</>
                    ) : (
                      <><Sparkles className="w-3 h-3" />今すぐ振り返る</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">まだ記録がありません</p>
        </div>
      )}
    </div>
  )
}
