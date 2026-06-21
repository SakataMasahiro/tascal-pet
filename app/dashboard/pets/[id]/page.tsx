'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Heart, Dog, Cat, Edit, Plus, Syringe,
  FileText, Weight, AlertCircle, Sparkles, Rainbow,
  BookOpen, Star, Zap, CheckCircle, AlertTriangle
} from 'lucide-react'

const mockPet = {
  id: '1',
  name: 'ポチ',
  species: 'dog',
  breed: 'ゴールデンレトリバー',
  birth_date: '2023-03-15',
  weight: 28.5,
  owner_name: '田中 誠一',
  owner_phone: '090-1234-5678',
  owner_email: 'tanaka@example.com',
  allergies: '特になし',
  medical_history: '2024年に右前足の骨折（完治）',
  personality_memo: '人懐っこく、検診時も穏やか。注射は少し苦手。お気に入りのおもちゃはぬいぐるみ。',
  is_deceased: false,
  memorial_message: '',
}

const mockRecords = [
  {
    id: '1',
    visit_date: '2026-06-15',
    diagnosis: '定期健診',
    treatment: '身体検査、血液検査（異常なし）',
    prescription: 'なし',
    vet_name: '田中 先生',
    has_gratitude: false,
  },
  {
    id: '2',
    visit_date: '2026-03-10',
    diagnosis: '皮膚炎',
    treatment: '投薬処置、シャンプー療法指導',
    prescription: 'ステロイド軟膏（1週間）',
    vet_name: '田中 先生',
    has_gratitude: true,
  },
  {
    id: '3',
    visit_date: '2025-12-05',
    diagnosis: 'ワクチン接種',
    treatment: '混合ワクチン8種接種',
    prescription: 'なし',
    vet_name: '田中 先生',
    has_gratitude: false,
  },
]

const mockVaccines = [
  { id: '1', vaccine_name: '混合ワクチン8種', administered_date: '2025-12-05', next_due_date: '2026-12-05' },
  { id: '2', vaccine_name: '狂犬病ワクチン', administered_date: '2026-04-10', next_due_date: '2027-04-10' },
]

interface VetNote {
  id: string
  mode: 'breakthrough' | 'steady' | 'concern'
  content: string
  created_at: string
}

interface StarParticle {
  id: number
  left: string
  delay: string
  duration: string
  emoji: string
}

const MODE_CONFIG = {
  breakthrough: { label: '素晴らしい回復！', icon: Zap, color: 'text-[#D4920E]', bg: 'bg-[#D4920E]/10', border: 'border-[#D4920E]' },
  steady: { label: '順調', icon: CheckCircle, color: 'text-[#1D9E75]', bg: 'bg-[#1D9E75]/10', border: 'border-[#1D9E75]' },
  concern: { label: '要注意', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-400' },
}

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const pet = mockPet
  const [activeTab, setActiveTab] = useState<'records' | 'vaccines' | 'notes' | 'memorial'>('records')
  const [records, setRecords] = useState(mockRecords)
  const [vetNotes, setVetNotes] = useState<VetNote[]>([])
  const [noteMode, setNoteMode] = useState<'breakthrough' | 'steady' | 'concern'>('steady')
  const [noteContent, setNoteContent] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [stars, setStars] = useState<StarParticle[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  const launchStars = useCallback(() => {
    const emojis = ['⭐', '✨', '🌟', '💫', '🎉', '🎊', '⭐', '✨']
    const newStars: StarParticle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
      duration: `${1.2 + Math.random() * 1.5}s`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setStars(newStars)
    setShowCelebration(true)
    setTimeout(() => {
      setStars([])
      setShowCelebration(false)
    }, 3000)
  }, [])

  function handleAddNote() {
    if (!noteContent.trim()) return
    const newNote: VetNote = {
      id: Date.now().toString(),
      mode: noteMode,
      content: noteContent,
      created_at: new Date().toISOString(),
    }
    setVetNotes(prev => [newNote, ...prev])
    setNoteContent('')
    setShowNoteForm(false)
    if (noteMode === 'breakthrough') {
      launchStars()
    }
  }

  function toggleGratitude(recordId: string) {
    setRecords(prev =>
      prev.map(r => r.id === recordId ? { ...r, has_gratitude: !r.has_gratitude } : r)
    )
  }

  const age = pet.birth_date
    ? Math.floor((Date.now() - new Date(pet.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  useEffect(() => {
    void id
  }, [id])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Star celebration overlay */}
      {stars.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {stars.map(star => (
            <span
              key={star.id}
              className="star-particle"
              style={{
                left: star.left,
                animationDelay: star.delay,
                animationDuration: star.duration,
                top: '100vh',
              }}
            >
              {star.emoji}
            </span>
          ))}
          {showCelebration && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="celebration-card bg-white/95 rounded-2xl px-8 py-6 shadow-2xl text-center border-2 border-[#D4920E]">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-xl font-bold text-[#D4920E]">素晴らしい回復！</p>
                <p className="text-sm text-gray-500 mt-1">{pet.name}の快復を記録しました</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link href="/dashboard/pets" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
          <p className="text-sm text-gray-500">{pet.breed} · {pet.owner_name}様</p>
        </div>
        <button className="ml-auto flex items-center gap-2 text-sm text-gray-600 hover:text-[#1D9E75] border border-gray-200 px-3 py-2 rounded-lg hover:border-[#1D9E75] transition-all">
          <Edit className="w-4 h-4" />
          編集
        </button>
      </div>

      {/* Basic Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
            pet.species === 'dog' ? 'bg-amber-100' : pet.species === 'cat' ? 'bg-purple-100' : 'bg-green-100'
          }`}>
            {pet.species === 'dog' ? (
              <Dog className="w-8 h-8 text-amber-600" />
            ) : pet.species === 'cat' ? (
              <Cat className="w-8 h-8 text-purple-600" />
            ) : (
              <Heart className="w-8 h-8 text-green-600" />
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">年齢</p>
              <p className="font-semibold text-gray-900">{age !== null ? `${age}歳` : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Weight className="w-3 h-3" />体重</p>
              <p className="font-semibold text-gray-900">{pet.weight}kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">飼い主</p>
              <p className="font-semibold text-gray-900">{pet.owner_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">電話番号</p>
              <p className="font-semibold text-gray-900 text-sm">{pet.owner_phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">メール</p>
              <p className="font-semibold text-gray-900 text-sm truncate">{pet.owner_email}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-red-50/50 rounded-lg p-4">
            <p className="text-xs font-medium text-red-600 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />アレルギー
            </p>
            <p className="text-sm text-gray-700">{pet.allergies || 'なし'}</p>
          </div>
          <div className="bg-blue-50/50 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" />既往症
            </p>
            <p className="text-sm text-gray-700">{pet.medical_history || 'なし'}</p>
          </div>
        </div>

        {pet.personality_memo && (
          <div className="mt-4 bg-[#1D9E75]/5 rounded-lg p-4">
            <p className="text-xs font-medium text-[#1D9E75] mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />この子の特徴・性格メモ
            </p>
            <p className="text-sm text-gray-700">{pet.personality_memo}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            { key: 'records', label: '診療記録', icon: FileText },
            { key: 'vaccines', label: 'ワクチン', icon: Syringe },
            { key: 'notes', label: '気づき日誌', icon: BookOpen },
            { key: 'memorial', label: '虹の橋', icon: Rainbow },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap px-3 ${
                activeTab === tab.key
                  ? 'border-[#1D9E75] text-[#1D9E75]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 text-sm bg-[#1D9E75] text-white px-3 py-2 rounded-lg hover:bg-[#178a64] transition-colors">
                  <Plus className="w-4 h-4" />
                  記録追加
                </button>
              </div>
              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
                {records.map((record) => (
                  <div key={record.id} className="relative pl-6 pb-6">
                    <div className="absolute left-[-4px] top-0 w-2.5 h-2.5 rounded-full bg-[#1D9E75] border-2 border-white" />
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{record.diagnosis}</p>
                          <p className="text-xs text-gray-400">{record.visit_date}</p>
                        </div>
                        <button
                          onClick={() => toggleGratitude(record.id)}
                          title="感謝フラグ"
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all shrink-0 ${
                            record.has_gratitude
                              ? 'bg-[#D4920E]/10 border-[#D4920E] text-[#D4920E]'
                              : 'border-gray-200 text-gray-400 hover:border-[#D4920E] hover:text-[#D4920E]'
                          }`}
                        >
                          <Star className={`w-3 h-3 ${record.has_gratitude ? 'fill-[#D4920E]' : ''}`} />
                          感謝
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-1"><span className="text-gray-400">処置：</span>{record.treatment}</p>
                      {record.prescription && record.prescription !== 'なし' && (
                        <p className="text-xs text-gray-600"><span className="text-gray-400">処方：</span>{record.prescription}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{record.vet_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vaccines' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 text-sm bg-[#1D9E75] text-white px-3 py-2 rounded-lg hover:bg-[#178a64] transition-colors">
                  <Plus className="w-4 h-4" />
                  接種記録追加
                </button>
              </div>
              {mockVaccines.map((v) => (
                <div key={v.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                    <Syringe className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{v.vaccine_name}</p>
                    <p className="text-xs text-gray-500">接種日: {v.administered_date}</p>
                  </div>
                  {v.next_due_date && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">次回</p>
                      <p className="text-sm font-medium text-[#D4920E]">{v.next_due_date}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">獣医師の気づきを記録します。運指数に加算されます。</p>
                <button
                  onClick={() => setShowNoteForm(true)}
                  className="flex items-center gap-2 text-sm bg-[#1D9E75] text-white px-3 py-2 rounded-lg hover:bg-[#178a64] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  気づきを記録
                </button>
              </div>

              {showNoteForm && (
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">今日の{pet.name}への気づき</p>

                  {/* Mode selection */}
                  <div className="flex gap-2">
                    {(Object.keys(MODE_CONFIG) as Array<keyof typeof MODE_CONFIG>).map(mode => {
                      const cfg = MODE_CONFIG[mode]
                      const Icon = cfg.icon
                      return (
                        <button
                          key={mode}
                          onClick={() => setNoteMode(mode)}
                          className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                            noteMode === mode
                              ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                              : 'border-gray-200 text-gray-400 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {cfg.label}
                        </button>
                      )
                    })}
                  </div>

                  {noteMode === 'breakthrough' && (
                    <div className="bg-[#D4920E]/10 rounded-lg p-3 text-xs text-[#D4920E] font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 shrink-0" />
                      「breakthrough」を記録すると祝福アニメーションが発動します！
                    </div>
                  )}

                  <textarea
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="今日気づいたこと、回復の様子、変化など..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowNoteForm(false); setNoteContent('') }}
                      className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!noteContent.trim()}
                      className="flex-1 bg-[#1D9E75] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#178a64] transition-colors disabled:opacity-40"
                    >
                      記録する
                    </button>
                  </div>
                </div>
              )}

              {vetNotes.length === 0 && !showNoteForm && (
                <div className="text-center py-10 text-gray-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">気づきを記録してみましょう</p>
                </div>
              )}

              <div className="space-y-3">
                {vetNotes.map(note => {
                  const cfg = MODE_CONFIG[note.mode]
                  const Icon = cfg.icon
                  return (
                    <div key={note.id} className={`rounded-xl p-4 border-l-4 ${cfg.border} ${cfg.bg}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                        <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(note.created_at).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'memorial' && (
            <div className="text-center py-8">
              {pet.is_deceased ? (
                <div>
                  <Rainbow className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pet.name}へ</h3>
                  <p className="text-gray-600 max-w-md mx-auto">{pet.memorial_message || '大切な命の記録がここに残ります。'}</p>
                  <Link
                    href="/dashboard/adversity-timeline"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    逆境タイムラインに記録
                  </Link>
                </div>
              ) : (
                <div>
                  <Rainbow className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    {pet.name}は現在も元気に過ごしています。
                    <br />
                    このページは虹の橋を渡った後、大切な命の記念として残ります。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
