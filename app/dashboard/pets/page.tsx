'use client'

import { useState } from 'react'
import { Heart, Search, Plus, Dog, Cat, Filter, Rainbow } from 'lucide-react'
import Link from 'next/link'

type Species = 'all' | 'dog' | 'cat' | 'other'

const mockPets = [
  { id: '1', name: 'ポチ', species: 'dog', breed: 'ゴールデンレトリバー', owner_name: '田中様', age: 3, is_deceased: false },
  { id: '2', name: 'ミケ', species: 'cat', breed: '三毛猫', owner_name: '山田様', age: 7, is_deceased: false },
  { id: '3', name: 'ラブ', species: 'dog', breed: 'ラブラドールレトリバー', owner_name: '鈴木様', age: 5, is_deceased: false },
  { id: '4', name: 'モカ', species: 'cat', breed: 'スコティッシュフォールド', owner_name: '佐藤様', age: 2, is_deceased: false },
  { id: '5', name: 'ハナ', species: 'dog', breed: 'ポメラニアン', owner_name: '伊藤様', age: 4, is_deceased: false },
  { id: '6', name: 'シロ', species: 'dog', breed: '柴犬', owner_name: '中村様', age: 8, is_deceased: false },
  { id: '7', name: 'クロ', species: 'cat', breed: 'ロシアンブルー', owner_name: '小林様', age: 6, is_deceased: false },
  { id: '8', name: 'レオ', species: 'dog', breed: 'チワワ', owner_name: '加藤様', age: 2, is_deceased: false },
  { id: '9', name: 'コテツ', species: 'other', breed: 'ウサギ（ミニレッキス）', owner_name: '吉田様', age: 1, is_deceased: false },
  { id: '10', name: 'そら', species: 'dog', breed: 'ビーグル', owner_name: '松本様', age: 10, is_deceased: true },
]

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

export default function PetsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Species>('all')
  const [showDeceased, setShowDeceased] = useState(false)

  const filtered = mockPets.filter((p) => {
    const matchSearch = p.name.includes(search) || p.owner_name.includes(search) || p.breed.includes(search)
    const matchFilter = filter === 'all' || p.species === filter
    const matchDeceased = showDeceased ? p.is_deceased : !p.is_deceased
    return matchSearch && matchFilter && matchDeceased
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ペットカルテ</h1>
          <p className="text-sm text-gray-500 mt-1">全{mockPets.filter(p => !p.is_deceased).length}件の患者</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#178a64] transition-colors">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((pet) => (
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
              <p className="text-sm text-gray-500">{pet.breed}</p>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400">{pet.owner_name}</p>
                <p className="text-xs text-gray-400">{pet.age}歳</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>該当するペットが見つかりませんでした</p>
        </div>
      )}
    </div>
  )
}
