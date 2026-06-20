'use client'

import { use } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Heart, Dog, Cat, Edit, Plus, Syringe,
  FileText, Weight, AlertCircle, Sparkles, Rainbow
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
  },
  {
    id: '2',
    visit_date: '2026-03-10',
    diagnosis: '皮膚炎',
    treatment: '投薬処置、シャンプー療法指導',
    prescription: 'ステロイド軟膏（1週間）',
    vet_name: '田中 先生',
  },
  {
    id: '3',
    visit_date: '2025-12-05',
    diagnosis: 'ワクチン接種',
    treatment: '混合ワクチン8種接種',
    prescription: 'なし',
    vet_name: '田中 先生',
  },
]

const mockVaccines = [
  { id: '1', vaccine_name: '混合ワクチン8種', administered_date: '2025-12-05', next_due_date: '2026-12-05' },
  { id: '2', vaccine_name: '狂犬病ワクチン', administered_date: '2026-04-10', next_due_date: '2027-04-10' },
]

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const pet = mockPet
  const [activeTab, setActiveTab] = useState<'records' | 'vaccines' | 'memorial'>('records')

  const age = pet.birth_date
    ? Math.floor((Date.now() - new Date(pet.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Allergies & History */}
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

        {/* Personality Memo */}
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
        <div className="flex border-b border-gray-100">
          {[
            { key: 'records', label: '診療記録', icon: FileText },
            { key: 'vaccines', label: 'ワクチン', icon: Syringe },
            { key: 'memorial', label: '虹の橋', icon: Rainbow },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${
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
                {mockRecords.map((record) => (
                  <div key={record.id} className="relative pl-6 pb-6">
                    <div className="absolute left-[-4px] top-0 w-2.5 h-2.5 rounded-full bg-[#1D9E75] border-2 border-white" />
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">{record.diagnosis}</p>
                        <p className="text-xs text-gray-400">{record.visit_date}</p>
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

          {activeTab === 'memorial' && (
            <div className="text-center py-8">
              {pet.is_deceased ? (
                <div>
                  <Rainbow className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pet.name}へ</h3>
                  <p className="text-gray-600 max-w-md mx-auto">{pet.memorial_message || '大切な命の記録がここに残ります。'}</p>
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

      {/* Suppress unused variable warning for id */}
      <span className="hidden">{id}</span>
    </div>
  )
}
