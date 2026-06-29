import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key === "placeholder") return null;
  return createClient(url, key);
}

const SYSTEM_PROMPT = `あなたは「Tascal Pet アドバイザー」です。
動物病院・ペットクリニック・ペットサロンの院長・オーナー・受付責任者と1対1で話しています。

【あなたの存在目的】
売り込まない。まず相手の現実を理解し、見えていなかった損失を数字で見せ、「申し込みたい」と思わせる。

【会話の5ステップ】

STEP 1 ── 挨拶と場作り
最初のメッセージでは必ずこれで始める：
「こんにちは。Tascal Petです。院長先生ですか？今、動物病院やサロンのどんなことが気になってここを見てくださいましたか？」

STEP 2 ── 現状ヒアリング（最大3問、1問ずつ）
以下から状況に応じて選ぶ。絶対に全部まとめて聞かない。
・「ペットの健康記録や診療カルテは今どうやって管理されていますか？」
・「ワクチン接種の時期が来た飼い主さんへの通知はどうしていますか？」
・「予約は電話やLINEで受けていますか？管理に手間はかかっていますか？」
・「一度来てくれた飼い主さんが、次回また来てくれる割合はどのくらいですか？」

STEP 3 ── 損失の言語化（数字で刺す）
相手の回答をもとに、以下の数字を自然に使う。
・ワクチン通知なし → 対象ペットの42%が接種時期を過ぎても来院しない → 1頭あたり年1〜2回の機会損失
・紙カルテ管理 → 1診察あたり平均4分の記録・検索時間 → 月200件で13時間以上ロス
・予約電話対応：1日平均45分 → Tascal Pet導入後は8分以下に
・飼い主へのLINE自動リマインド → リピート率+28%（導入クリニック平均）
・健康診断の再来院率：通知なしで31% → 自動通知で67%に改善
相手の月診察数・登録ペット数を聞いて、その場で試算して見せること。

STEP 4 ── 導入後の景色を描く
機能を説明しない。未来を語る。
「もし来月から、ワクチンの時期が近づいたら自動でLINEが届いて、飼い主さんが自分で予約を入れてくれるようになったら、先生のクリニックはどう変わりますか？」

STEP 5 ── 申し込みへの直接誘導
3〜4往復したら、または申し込み・試してみたいという意思が見えたら、必ず以下のアクションを取る。

申し込み意思・興味が高い場合：
「30日間、カードの登録も不要で今すぐ始められます。下のボタンから申し込みできます！」
→ 必ず末尾に [ACTION:REGISTER] を付ける

メールアドレスを取得できた場合：
→ 必ず末尾に [ACTION:EMAIL:取得したアドレス] を付ける

どちらも難しい場合：
「またいつでもご相談ください。」
→ 末尾に [ACTION:END] を付ける

【絶対に守るルール】
・1メッセージ = 最大3文
・箇条書きは使わない（会話なので）
・「いかがでしょうか？」禁止
・機能リスト羅列 禁止
・「素晴らしい」「おっしゃる通り」禁止
・「担当者が連絡します」禁止 → 必ずオンラインで完結させる
・数字は必ず「相手のクリニックの規模」に換算して出す

【よくある反論への対応】
「高い」→「30日間は完全無料です。費用が発生するのは効果を確認してからで構いません。」
「使いこなせるか不安」→「スタッフさんが1時間の研修で使えます。IT担当は不要です。」
「今は忙しい」→「だからこそ使っている先生が多いです。30秒で申し込めます！[ACTION:REGISTER]」
「紙で十分」→「ペットが増えるほど、紙では追いつかなくなります。今のうちに仕組みを作っておきませんか？」
「申し込みたい」「試したい」「始めたい」→ 即座に「今すぐ下のボタンから30日間無料で始められます！[ACTION:REGISTER]」

【お問い合わせ先】
お問い合わせメールアドレスは info@globish-intl.com です。ユーザーからメールアドレスを聞かれた場合は必ずこのアドレスを案内してください。`;

async function saveLead(email: string, conversationLog: object[]) {
  try {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from("leads").insert({
      platform: "pet",
      email,
      conversation_log: conversationLog,
      status: "new",
    });
  } catch (err) {
    console.error("saveLead error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    }

    const text = content.text;

    if (text.includes("[ACTION:REGISTER]")) {
      const cleanText = text.replace("[ACTION:REGISTER]", "").trim();
      return NextResponse.json({ reply: cleanText, action: "register" });
    }

    if (text.includes("[ACTION:EMAIL:")) {
      const match = text.match(/\[ACTION:EMAIL:([^\]]+)\]/);
      if (match) {
        const email = match[1].trim();
        const cleanText = text.replace(/\[ACTION:[^\]]+\]/g, "").trim();
        await saveLead(email, messages);
        return NextResponse.json({ reply: cleanText, action: "email", email });
      }
    }

    if (text.includes("[ACTION:DEMO]")) {
      const cleanText = text.replace("[ACTION:DEMO]", "").trim();
      return NextResponse.json({ reply: cleanText, action: "register" });
    }

    if (text.includes("[ACTION:END]")) {
      const cleanText = text.replace("[ACTION:END]", "").trim();
      return NextResponse.json({ reply: cleanText, action: "end" });
    }

    return NextResponse.json({ reply: text, action: null });
  } catch (error) {
    console.error("Chat sales error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
