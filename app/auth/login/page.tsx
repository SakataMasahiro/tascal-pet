'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D9E75]/5 via-white to-[#D4920E]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1D9E75] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            トップページへ
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#1D9E75] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tascal Pet</h1>
            <p className="text-gray-500 text-sm">ペットは家族。その命に寄り添う、すべての人へ。</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#1D9E75]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#1D9E75]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">メールを送信しました</h2>
              <p className="text-gray-600 text-sm mb-4">
                <strong>{email}</strong> にログインリンクを送信しました。
                メールを確認してリンクをクリックしてください。
              </p>
              <p className="text-xs text-gray-400">
                メールが届かない場合は迷惑メールフォルダをご確認ください。
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-6 text-sm text-[#1D9E75] hover:underline"
              >
                別のメールアドレスで試す
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">ログイン / 新規登録</h2>
                <p className="text-sm text-gray-500">
                  メールアドレスを入力するとMagic Linkを送信します。
                  パスワード不要で安全にログインできます。
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="clinic@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] transition-all text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#1D9E75] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#178a64] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '送信中...' : 'Magic Linkを送信'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 text-center">
                  ログインすることで、利用規約とプライバシーポリシーに同意したものとみなします。
                  <br />
                  初めての方は自動的に30日間無料トライアルが開始されます。
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          透徹した誠実さと深い思いやり — Tascal
        </p>
      </div>
    </div>
  )
}
