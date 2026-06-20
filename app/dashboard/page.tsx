'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Calendar, Heart, TrendingUp, AlertTriangle, CheckCircle,
  Clock, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface StatCard {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bgColor: string
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('')
  const [userName, setUserName] = useState('')
  const [stats] = useState({
    todayAppointments: 8,
    totalPets: 342,
    monthlyRevenue: 1240000,
    vaccineAlerts: 5,
  })

  const todayAppointments = [
    { time: '09:00', petName: 'ポチ', ownerName: '田中様', type: '定期健診', status: 'completed' },
    { time: '10:30', petName: 'ミケ', ownerName: '山田様', type: 'ワクチン接種', status: 'completed' },
    { time: '13:00', petName: 'ラブ', ownerName: '鈴木様', type: '皮膚炎治療', status: 'scheduled' },
    { time: '14:30', petName: 'モカ', ownerName: '佐藤様', type: '健康診断', status: 'scheduled' },
    { time: '16:00', petName: 'ハナ', ownerName: '伊藤様', type: '歯科処置', status: 'scheduled' },
  ]

  const vaccineAlerts = [
    { petName: 'シロ', ownerName: '中村様', vaccine: '狂犬病', dueDate: '2026-06-22' },
    { petName: 'クロ', ownerName: '小林様', vaccine: '混合ワクチン', dueDate: '2026-06-24' },
    { petName: 'タマ', ownerName: '加藤様', vaccine: '混合ワクチン', dueDate: '2026-06-25' },
  ]

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('おはようございます')
    else if (hour < 18) setGreeting('こんにちは')
    else setGreeting('お疲れ様です')

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserName(data.user.email.split('@')[0])
      }
    })
  }, [])

  const statCards: StatCard[] = [
    {
      label: '今日の予約',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'ペット患者数',
      value: `${stats.totalPets}件`,
      icon: Heart,
      color: 'text-[#1D9E75]',
      bgColor: 'bg-[#1D9E75]/10',
    },
    {
      label: '今月の売上',
      value: `¥${stats.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-[#D4920E]',
      bgColor: 'bg-[#D4920E]/10',
    },
    {
      label: 'ワクチン期限アラート',
      value: `${stats.vaccineAlerts}件`,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-[#1D9E75] to-[#178a64] rounded-2xl p-6 text-white">
        <p className="text-white/80 text-sm mb-1">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        <h1 className="text-2xl font-bold mb-2">
          {greeting}{userName ? `、${userName}先生` : ''}！
        </h1>
        <p className="text-white/90">
          今日も動物たちのために、よろしくお願いします。
          本日の予約は <strong>{stats.todayAppointments}件</strong> です。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1D9E75]" />
              今日の予約
            </h2>
            <Link href="/dashboard/appointments" className="text-xs text-[#1D9E75] hover:underline flex items-center gap-1">
              すべて見る <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {todayAppointments.map((appt) => (
              <div key={`${appt.time}-${appt.petName}`} className="p-4 flex items-center gap-4">
                <div className="text-center w-14">
                  <p className="text-sm font-semibold text-gray-900">{appt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{appt.petName} <span className="text-gray-400 font-normal">({appt.ownerName})</span></p>
                  <p className="text-xs text-gray-500">{appt.type}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  appt.status === 'completed'
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-[#1D9E75]/10 text-[#1D9E75]'
                }`}>
                  {appt.status === 'completed' ? (
                    <><CheckCircle className="w-3 h-3" />完了</>
                  ) : (
                    <><Clock className="w-3 h-3" />予定</>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccine Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D4920E]" />
              ワクチン期限アラート（直近7日）
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {vaccineAlerts.map((alert) => (
              <div key={`${alert.petName}-${alert.vaccine}`} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{alert.petName} <span className="text-gray-400 font-normal">({alert.ownerName})</span></p>
                  <p className="text-xs text-gray-500">{alert.vaccine}</p>
                </div>
                <p className="text-xs font-medium text-red-500 shrink-0">{alert.dueDate}</p>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Link href="/dashboard/pets" className="text-sm text-[#1D9E75] hover:underline flex items-center gap-1">
              ペットカルテを見る <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
