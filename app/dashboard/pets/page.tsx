'use client'

import { useState, useEffect } from 'react'
import { Heart, Search, Plus, Dog, Cat, Filter, Rainbow, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Pet } from '@/lib/types'

type Species = 'all' | 'dog' | 'cat' | 'other'

interface PetFormData {
  name: string
  species: 'dog' | 'cat' | 'other'
  breed: string
  birth_date: string
  weight: string
  owner_name: string
  owner_phone: string
  owner_email: string
  allergies: string
  personality_memo: string
}

const INITIAL_FORM: PetFormData = {
  name: '',
  species: 'dog',
  breed: '',
  birth_date: '',
  weight: '',
  owner_name: '',
  owner_phone: '',
  owner_email: '',
  allergies: '',
  personality_memo: '',
}

function SpeciesIcon({ species }: { species: string }) {
  if (species === 'dog') return <Dog className="w-4 h-4" />
  if (species === 'cat') return <Cat className="w-4 h-4" />
  return <Heart className="w-4 h-4" />
}

function speciesLabel(s: string) {
  if (s === 'dog') return '犬'
  if (s === 'cat') return '猫'
  return 'その他'
}

function calcAge(birthDate?: string): number | null {
  if (!birthDate) return null
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [hospitalId, setHospitalId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Species>('all')
  const [showDeceased, setShowDeceased] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<PetFormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) { setLoading(false); return }

      const { data: hospital } = await supabase
        .from('hospitals')
        .select('id')
        .eq('email', user.email)
        .single()

      if (!hospital) { setLoading(false); return }
      setHospitalId(hospital.id)

      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('hospital_id', hospital.id)
        .order('created_at', { ascending: false })

      setPets(petsData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit() {
    if (!hospitalId || !form.name.trim() || !form.owner_name.trim()) return
    setSaving(true)
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.from('pets').insert({
      hospital_id: hospitalId,
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || null,
      birth_date: form.birth_date || null,
      weight: form.weight ? parseFloat(form.weight) : null,
      owner_name: form.owner_name.trim(),
      owner_phone: form.owner_phone.trim() || null,
      owner_email: form.owner_email.trim() || null,
      allergies: form.allergies.trim() || null,
      personality_memo: form.personality_memo.trim() || null,
    })

    if (error) {
      setErrorMsg('保存に失敗しました。もう一度お試しください。')
      setSaving(false)
      return
    }

    const { data: updated } = await supabase
      .from('pets')
      .select('*')
      .eq('hospital_id', hospitalId)
      .order('created_at', { ascending: false })

    setPets(updated || [])
    const petName = form.name
    setForm(INITIAL_FORM)
    setShowForm(false)
    setSuccessMsg(`${petName}を登録しました！`)
    setTimeout(() => setSuccessMsg(''), 3000)
    setSaving(false)
  }

  const filtered = pets.filter((p) => {
    const matchSearch =
      p.name.includes(search) ||
      p.owner_name.includes(search) ||
      (p.breed || '').includes(search)
    const matchFilter = filter === 'all' || p.species === filter
    const matchDeceased = showDeceased ? p.is_deceased : !p.is_deceased
    return matchSearch && matchFilter && matchDeceased
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {successMsg && (
        <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-[#1D9E75] rounded-xl px-4 py-3 text-sm font-medium">
          ✓ {successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ペットカルテ</h1>
          <p className="text-sm text-gray-500 mt-1">全{pets.filter(p => !p.is_deceased).length}件の患者</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#178a64] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規登録
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="名前・飼い主・品種で検索..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
          </div>
          {(['all', 'dog', 'cat', 'other'] as Species[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s
                  ? 'bg-[#1D9E75] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'すべて' : s === 'dog' ? '犬' : s === 'cat' ? '猫' : 'その他'}
            </button>
          ))}
          <button
            onClick={() => setShowDeceased(!showDeceased)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
              showDeceased
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Rainbow className="w-3 h-3" />
            虹の橋メモリアル
          </button>
        </div>
      </div>

      {/* Pet Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
          <p className="text-sm">読み込み中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pet) => {
            const age = calcAge(pet.birth_date)
            return (
              <Link key={pet.id} href={`/dashboard/pets/${pet.id}`}>
                <div className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md hover:border-[#1D9E75]/30 cursor-pointer ${
                  pet.is_deceased ? 'opacity-75 border-purple-100' : 'border-gray-100'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      pet.species === 'dog' ? 'bg-amber-100 text-amber-600' :
                      pet.species === 'cat' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <SpeciesIcon species={pet.species} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        pet.species === 'dog' ? 'bg-amber-50 text-amber-700' :
                        pet.species === 'cat' ? 'bg-purple-50 text-purple-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {speciesLabel(pet.species)}
                      </span>
                      {pet.is_deceased && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 flex items-center gap-1">
                          <Rainbow className="w-2.5 h-2.5" />虹の橋
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed || '—'}</p>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{pet.owner_name}</p>
                    <p className="text-xs text-gray-400">{age !== null ? `${age}歳` : '—'}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>該当するペットが見つかりませんでした</p>
        </div>
      )}

      {/* Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">新規ペット登録</h2>
              <button
                onClick={() => { setShowForm(false); setForm(INITIAL_FORM); setErrorMsg('') }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* ペット情報 */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#1D9E75]" />
                  ペット情報
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      名前 <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="例: ポチ"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      種類 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {([['dog', '🐕 犬'], ['cat', '🐈 猫'], ['other', '🐾 その他']] as const).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, species: val }))}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                            form.species === val
                              ? 'border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75]'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">品種</label>
                      <input
                        value={form.breed}
                        onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                        placeholder="例: ゴールデンレトリバー"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">体重 (kg)</label>
                      <input
                        value={form.weight}
                        onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="例: 28.5"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">生年月日</label>
                    <input
                      value={form.birth_date}
                      onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
                      type="date"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                    />
                  </div>
                </div>
              </section>

              {/* 飼い主情報 */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Dog className="w-4 h-4 text-blue-500" />
                  飼い主情報
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      飼い主名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.owner_name}
                      onChange={e => setForm(f => ({ ...f, owner_name: e.target.value }))}
                      placeholder="例: 田中 誠一"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">電話番号</label>
                      <input
                        value={form.owner_phone}
                        onChange={e => setForm(f => ({ ...f, owner_phone: e.target.value }))}
                        type="tel"
                        placeholder="例: 090-1234-5678"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">メール</label>
                      <input
                        value={form.owner_email}
                        onChange={e => setForm(f => ({ ...f, owner_email: e.target.value }))}
                        type="email"
                        placeholder="例: tanaka@example.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 医療情報 */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-base">🩺</span>
                  医療情報
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">アレルギー</label>
                    <input
                      value={form.allergies}
                      onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))}
                      placeholder="例: チキン系フード、特定の薬剤"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">性格・特徴メモ</label>
                    <textarea
                      value={form.personality_memo}
                      onChange={e => setForm(f => ({ ...f, personality_memo: e.target.value }))}
                      placeholder="例: 人懐っこく穏やか。注射が苦手。お気に入りのおもちゃはぬいぐるみ。"
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="p-6 pt-0 flex gap-3 sticky bottom-0 bg-white border-t border-gray-50">
              <button
                onClick={() => { setShowForm(false); setForm(INITIAL_FORM); setErrorMsg('') }}
                className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !form.name.trim() || !form.owner_name.trim()}
                className="flex-1 bg-[#1D9E75] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#178a64] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />保存中...</>
                ) : (
                  '登録する'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
