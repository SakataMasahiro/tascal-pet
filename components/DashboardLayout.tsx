'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Heart, LayoutDashboard, Calendar, Brain, Users, Settings,
  LogOut, Menu, X, ChevronRight, Gift, BookOpen
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TrialBanner from '@/components/TrialBanner'

const navItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/dashboard/pets', label: 'ペットカルテ', icon: Heart },
  { href: '/dashboard/appointments', label: '予約管理', icon: Calendar },
  { href: '/dashboard/ai-assistant', label: 'AIアシスタント', icon: Brain },
  { href: '/dashboard/community', label: 'コミュニティ', icon: Users },
  { href: '/dashboard/gratitude', label: '感謝の宝箱', icon: Gift },
  { href: '/dashboard/adversity-timeline', label: '先生の心の記録', icon: BookOpen },
  { href: '/dashboard/settings', label: '設定', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Tascal Pet</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1D9E75] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 w-full transition-all"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
        <p className="text-xs text-gray-400 mt-3 px-3">透徹した誠実さと深い思いやり</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1D9E75] flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900">Tascal Pet</span>
          </div>
          <div className="w-9" />
        </header>

        <TrialBanner />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
