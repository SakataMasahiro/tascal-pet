'use client'

import { useState } from 'react'
import { Users, Plus, Calendar, MapPin, Megaphone, MessageSquare, Bell } from 'lucide-react'

const mockEvents = [
  {
    id: '1',
    title: '春の健康セミナー〜ペットの予防医学〜',
    description: '地域の飼い主さんを対象にした健康セミナーです。予防接種・フィラリア・ノミダニ対策についてわかりやすく解説します。',
    event_date: '2026-07-05',
    location: '田中動物病院 2F セミナールーム',
    max_participants: 30,
    current_participants: 18,
  },
  {
    id: '2',
    title: 'ペット歯科ケア体験会',
    description: '歯ブラシの使い方から始まる、楽しい歯科ケア体験会。参加ペット全員に歯磨きキットをプレゼント！',
    event_date: '2026-07-19',
    location: '田中動物病院 待合室',
    max_participants: 15,
    current_participants: 7,
  },
]

const mockNotices = [
  {
    id: '1',
    title: '夏のフィラリア予防のご案内',
    content: 'フィラリア症は予防で100%防げる病気です。毎月1回の投薬をお忘れなく。6月〜11月が予防期間です。',
    created_at: '2026-06-15',
  },
  {
    id: '2',
    title: '7月の休診日のお知らせ',
    content: '7月20日（月）は院内研修のため休診いたします。緊急の場合は◯◯救急動物病院（TEL: 03-xxxx-xxxx）をご利用ください。',
    created_at: '2026-06-10',
  },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'notices'>('events')
  const [showEventModal, setShowEventModal] = useState(false)
  const [showNoticeModal, setShowNoticeModal] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#1D9E75]" />
            地域コミュニティ
          </h1>
          <p className="text-sm text-gray-500 mt-1">健康イベント・お知らせで地域の飼い主さんとつながる</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'events' ? (
            <button
              onClick={() => setShowEventModal(true)}
              className="flex items-center gap-2 bg-[#1D9E75] text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#178a64] transition-colors"
            >
              <Plus className="w-4 h-4" />
              イベント作成
            </button>
          ) : (
            <button
              onClick={() => setShowNoticeModal(true)}
              className="flex items-center gap-2 bg-[#1D9E75] text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#178a64] transition-colors"
            >
              <Plus className="w-4 h-4" />
              お知らせ作成
            </button>
          )}
        </div>
      </div>

      {/* LINE Blast Banner */}
      <div className="bg-[#06C755] rounded-xl p-4 flex items-center gap-4 text-white">
        <MessageSquare className="w-8 h-8 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">LINE一斉配信</p>
          <p className="text-sm text-white/80">地域の飼い主さん全員にLINEでお知らせを送信できます</p>
        </div>
        <button className="bg-white text-[#06C755] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shrink-0">
          配信する
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'events', label: '健康イベント', icon: Calendar },
          { key: 'notices', label: 'お知らせ', icon: Megaphone },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
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

      {activeTab === 'events' && (
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{event.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.event_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.current_participants}/{event.max_participants}名
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="text-right mb-2">
                    <span className="text-xs text-[#1D9E75] font-medium">
                      残り{(event.max_participants ?? 0) - event.current_participants}席
                    </span>
                  </div>
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#1D9E75] h-1.5 rounded-full"
                      style={{ width: `${(event.current_participants / (event.max_participants ?? 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs text-[#06C755] border border-[#06C755]/30 px-3 py-1.5 rounded-lg hover:bg-[#06C755]/5 transition-colors">
                  <Bell className="w-3 h-3" />
                  LINE告知
                </button>
                <button className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  編集
                </button>
                <button className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="space-y-4">
          {mockNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                <span className="text-xs text-gray-400 shrink-0">{notice.created_at}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{notice.content}</p>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs text-[#06C755] border border-[#06C755]/30 px-3 py-1.5 rounded-lg hover:bg-[#06C755]/5 transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  LINE配信
                </button>
                <button className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  編集
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">イベントを作成</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="例：ペット健康セミナー" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開催日</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">定員</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">場所</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="例：院内セミナールーム" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEventModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={() => setShowEventModal(false)} className="flex-1 bg-[#1D9E75] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#178a64]">
                作成する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">お知らせを作成</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="例：休診日のお知らせ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 resize-none" rows={5} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNoticeModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={() => setShowNoticeModal(false)} className="flex-1 bg-[#1D9E75] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#178a64]">
                投稿する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
