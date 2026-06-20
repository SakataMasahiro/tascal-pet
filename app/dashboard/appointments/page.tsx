'use client'

import { useState } from 'react'
import {
  Calendar, Plus, ChevronLeft, ChevronRight, Clock,
  CheckCircle, XCircle, MessageSquare
} from 'lucide-react'

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  type: string
  status: AppointmentStatus
  date: string
}

const mockAppointments: Appointment[] = [
  { id: '1', date: '2026-06-20', time: '09:00', petName: 'ポチ', ownerName: '田中様', type: '定期健診', status: 'completed' },
  { id: '2', date: '2026-06-20', time: '10:30', petName: 'ミケ', ownerName: '山田様', type: 'ワクチン接種', status: 'completed' },
  { id: '3', date: '2026-06-20', time: '13:00', petName: 'ラブ', ownerName: '鈴木様', type: '皮膚炎治療', status: 'scheduled' },
  { id: '4', date: '2026-06-20', time: '14:30', petName: 'モカ', ownerName: '佐藤様', type: '健康診断', status: 'scheduled' },
  { id: '5', date: '2026-06-21', time: '09:30', petName: 'ハナ', ownerName: '伊藤様', type: '歯科処置', status: 'scheduled' },
  { id: '6', date: '2026-06-21', time: '11:00', petName: 'シロ', ownerName: '中村様', type: '狂犬病ワクチン', status: 'scheduled' },
  { id: '7', date: '2026-06-22', time: '10:00', petName: 'レオ', ownerName: '加藤様', type: '健康診断', status: 'scheduled' },
  { id: '8', date: '2026-06-22', time: '14:00', petName: 'クロ', ownerName: '小林様', type: '爪切り・グルーミング', status: 'cancelled' },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const statusConfig = {
  scheduled: { label: '予定', color: 'bg-[#1D9E75]/10 text-[#1D9E75]', icon: Clock },
  completed: { label: '完了', color: 'bg-gray-100 text-gray-500', icon: CheckCircle },
  cancelled: { label: 'キャンセル', color: 'bg-red-50 text-red-500', icon: XCircle },
}

export default function AppointmentsPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0])
  const [showModal, setShowModal] = useState(false)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const selectedAppointments = mockAppointments.filter(a => a.date === selectedDate)

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  function hasAppointment(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return mockAppointments.some(a => a.date === dateStr)
  }

  function selectDay(day: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
  }

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">予約管理</h1>
          <p className="text-sm text-gray-500 mt-1">今月の予約: {mockAppointments.length}件</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1D9E75] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#178a64] transition-colors"
        >
          <Plus className="w-4 h-4" />
          予約追加
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="font-semibold text-gray-900">{currentYear}年 {monthNames[currentMonth]}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((d, i) => (
              <div key={d} className={`text-center text-xs font-medium py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isToday = dateStr === today.toISOString().split('T')[0]
              const isSelected = dateStr === selectedDate
              const hasAppt = hasAppointment(day)
              const dayOfWeek = (firstDay + i) % 7

              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`relative aspect-square flex flex-col items-center justify-center text-sm rounded-xl m-0.5 transition-all ${
                    isSelected
                      ? 'bg-[#1D9E75] text-white font-semibold'
                      : isToday
                      ? 'bg-[#1D9E75]/10 text-[#1D9E75] font-semibold'
                      : 'hover:bg-gray-100'
                  } ${dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : ''}`}
                >
                  {day}
                  {hasAppt && (
                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#1D9E75]'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1D9E75]" />
              {selectedDate}
            </h3>
            <p className="text-sm text-gray-500">{selectedAppointments.length}件の予約</p>
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {selectedAppointments.length > 0 ? (
              selectedAppointments.map((appt) => {
                const config = statusConfig[appt.status]
                return (
                  <div key={appt.id} className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{appt.petName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{appt.ownerName} · {appt.time}</p>
                    <p className="text-xs text-gray-400 mt-1">{appt.type}</p>
                    {appt.status === 'scheduled' && (
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs text-[#1D9E75] hover:underline">LINE通知</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-xs text-red-400 hover:underline">キャンセル</button>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">予約なし</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LINE Notice */}
      <div className="bg-[#06C755]/10 rounded-xl p-4 flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-[#06C755] shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900">LINE通知連携</p>
          <p className="text-xs text-gray-500">予約の確認・リマインドをLINEで自動送信。設定から連携してください。</p>
        </div>
        <button className="ml-auto text-xs text-[#06C755] font-medium hover:underline shrink-0">設定する</button>
      </div>

      {/* Add Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">予約を追加</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ペット名</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="例: ポチ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">飼い主名</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="例: 田中様" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">時間</label>
                  <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">診察内容</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" placeholder="例: ワクチン接種" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#1D9E75] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#178a64] transition-colors"
              >
                追加する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
