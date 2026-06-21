import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { partner_code } = await req.json()

  if (!partner_code?.trim()) {
    return NextResponse.json({ error: 'partner_code is required' }, { status: 400 })
  }

  const code = partner_code.trim()
  console.log('[partner/auth] 照合開始 partner_code:', code)

  // サービスロールキーで RLS をバイパスして照合
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: partnerData, error: partnerError } = await supabase
    .from('partners')
    .select('id, name, partner_code, commission_rate')
    .eq('partner_code', code)
    .single()

  console.log('[partner/auth] partners クエリ結果:', { partnerData, partnerError })

  if (partnerError || !partnerData) {
    console.log('[partner/auth] 照合失敗 - コードが見つからない')
    return NextResponse.json({ error: 'パートナーコードが正しくありません' }, { status: 401 })
  }

  const { data: referralData, error: referralError } = await supabase
    .from('partner_referrals')
    .select('id, referred_at, status, commission_amount, hospitals(name, plan)')
    .eq('partner_id', partnerData.id)
    .order('referred_at', { ascending: false })

  console.log('[partner/auth] referrals クエリ結果:', { count: referralData?.length, referralError })

  const totalCommission = referralData?.reduce(
    (s, r) => s + (r.commission_amount ?? 0), 0
  ) ?? 0

  const referrals = (referralData ?? []).map(r => {
    const hospital = r.hospitals as { name?: string; plan?: string } | null
    return {
      id: r.id,
      hospital_name: hospital?.name ?? '—',
      plan: hospital?.plan ?? 'starter',
      referred_at: r.referred_at ? r.referred_at.split('T')[0] : '—',
      status: r.status,
      commission: r.commission_amount ?? 0,
    }
  })

  console.log('[partner/auth] 照合成功:', partnerData.name)

  return NextResponse.json({
    partner: {
      id: partnerData.id,
      name: partnerData.name,
      code: partnerData.partner_code,
      commission_rate: partnerData.commission_rate,
      total_commission: totalCommission,
    },
    referrals,
  })
}
