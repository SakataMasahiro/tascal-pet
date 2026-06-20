'use client'

import { useState } from 'react'
import { Brain, Send, Loader2, FileText, MessageSquare, Stethoscope, Sparkles } from 'lucide-react'

type AssistantMode = 'diagnosis' | 'memo' | 'explanation'

const modes = [
  {
    key: 'diagnosis' as AssistantMode,
    label: '症状診断サポート',
    icon: Stethoscope,
    placeholder: '例：3歳のゴールデンレトリバー。昨日から食欲不振で元気がない。嘔吐2回。体温38.9度。腹部を触ると少し嫌がる。',
    description: '症状を入力すると、考えられる疾患・鑑別診断・対処法を提示します',
  },
  {
    key: 'memo' as AssistantMode,
    label: '診察メモ自動生成',
    icon: FileText,
    placeholder: '例：ミックス犬5歳。飼い主が2日前から咳が続くと来院。聴診で軽度の気管支炎の所見。抗生剤処方。1週間後再診。',
    description: '診察内容を入力するとSOAP形式のカルテメモを自動生成します',
  },
  {
    key: 'explanation' as AssistantMode,
    label: '飼い主向け説明文',
    icon: MessageSquare,
    placeholder: '例：慢性腎臓病ステージ2。腎臓の機能が低下しており、療法食への切り替えと定期的な血液検査が必要。',
    description: '医療内容を入力すると、飼い主さんにわかりやすい説明文を生成します',
  },
]

export default function AIAssistantPage() {
  const [mode, setMode] = useState<AssistantMode>('diagnosis')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentMode = modes.find(m => m.key === mode)!

  async function handleSubmit() {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult('')

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: mode, input }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setResult(data.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#1D9E75]" />
          AI獣医師アシスタント
        </h1>
        <p className="text-sm text-gray-500 mt-1">Claude AIが診察をサポートします。最終判断は必ず獣医師が行ってください。</p>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setInput(''); setResult(''); setError('') }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              mode === m.key
                ? 'border-[#1D9E75] bg-[#1D9E75]/5'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <m.icon className={`w-5 h-5 mb-2 ${mode === m.key ? 'text-[#1D9E75]' : 'text-gray-400'}`} />
            <p className={`font-medium text-sm ${mode === m.key ? 'text-[#1D9E75]' : 'text-gray-700'}`}>{m.label}</p>
            <p className="text-xs text-gray-400 mt-1">{m.description}</p>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {currentMode.label}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentMode.placeholder}
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Claude Sonnet 4.6 powered
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 bg-[#1D9E75] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#178a64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />処理中...</>
            ) : (
              <><Send className="w-4 h-4" />送信</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-[#1D9E75]/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#1D9E75]/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-[#1D9E75]" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">AIアシスタントの回答</p>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              ⚠️ この情報は補助目的のものです。診断・治療の最終判断は必ず獣医師が行ってください。
            </p>
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => navigator.clipboard?.writeText(result)}
              className="text-xs text-[#1D9E75] hover:underline"
            >
              コピー
            </button>
            <button
              onClick={() => { setResult(''); setInput('') }}
              className="text-xs text-gray-400 hover:underline"
            >
              クリア
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
