import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { type, input } = await req.json()

    if (!type || !input) {
      return NextResponse.json({ error: 'type and input are required' }, { status: 400 })
    }

    let systemPrompt = ''
    let userPrompt = ''

    if (type === 'diagnosis') {
      systemPrompt = `あなたは経験豊富な獣医師AIアシスタントです。
症状の説明を受けて、考えられる疾患・鑑別診断・対処法を提示してください。
必ず「これは補助情報であり、必ず実際の診察・検査が必要です」と注記してください。
日本語で回答し、箇条書きで見やすく整理してください。`
      userPrompt = `以下の症状・状況について、考えられる疾患と対処法を教えてください：\n\n${input}`
    } else if (type === 'memo') {
      systemPrompt = `あなたは獣医師の診察メモ作成をサポートするAIアシスタントです。
入力された内容を、カルテに記載する形式の簡潔で正確な診察メモに整形してください。
医療用語を適切に使用し、S（主訴）・O（所見）・A（評価）・P（計画）の形式で整理してください。`
      userPrompt = `以下の診察内容をカルテメモに整形してください：\n\n${input}`
    } else if (type === 'explanation') {
      systemPrompt = `あなたは動物病院で働く獣医師のアシスタントです。
獣医師が入力した診断・治療内容を、飼い主さんにわかりやすく説明する文章を作成してください。
専門用語を避け、温かみのある言葉遣いで、ペットを大切にする気持ちが伝わるよう書いてください。`
      userPrompt = `以下の診断・治療内容を飼い主さんへの説明文にしてください：\n\n${input}`
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    return NextResponse.json({ result: content.text })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
