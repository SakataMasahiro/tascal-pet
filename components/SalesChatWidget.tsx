"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function SalesChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function startChat() {
    if (started) return;
    setStarted(true);
    setLoading(true);
    try {
      const res = await fetch("/api/chat-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([{ role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      console.error("startChat error:", e);
    }
    setLoading(false);
  }

  function handleOpen() {
    setOpen(true);
    if (!started) startChat();
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
      if (data.action) setAction(data.action);
    } catch (e) {
      console.error("sendMessage error:", e);
      setMessages([...newMessages, { role: "assistant", content: "申し訳ありません。もう一度お試しください。" }]);
    }
    setLoading(false);
  }

  return (
    <>
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            position: "fixed", bottom: "80px", right: "28px", zIndex: 9999,
            background: "#2D6A4F", color: "white", border: "none",
            borderRadius: "50px", padding: "14px 22px",
            fontSize: "15px", fontWeight: "bold", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(45,106,79,0.35)",
            display: "flex", alignItems: "center", gap: "8px",
            whiteSpace: "nowrap",
          }}
        >
          🐾 無料相談する
        </button>
      )}

      {open && (
        <div style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
          width: "360px",
          background: "white", borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(45,106,79,0.2)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          maxHeight: "calc(100vh - 56px)",
        }}>
          {/* ヘッダー */}
          <div style={{
            background: "#2D6A4F", padding: "16px 20px", flexShrink: 0,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}>🐾 Tascal Pet</div>
              <div style={{ color: "#b7dfc9", fontSize: "12px", marginTop: "2px" }}>AIアドバイザー（24時間対応）</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "none", border: "none", color: "white",
              fontSize: "22px", cursor: "pointer", lineHeight: 1, padding: "0 4px",
            }}>×</button>
          </div>

          {/* メッセージエリア */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: "10px",
            background: "#f0f9f4", minHeight: "300px", maxHeight: "380px",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "#2D6A4F" : "white",
                  color: m.role === "user" ? "white" : "#222",
                  fontSize: "13.5px", lineHeight: "1.7",
                  boxShadow: "0 1px 4px rgba(45,106,79,0.1)",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "white", borderRadius: "16px 16px 16px 4px",
                  padding: "10px 16px", boxShadow: "0 1px 4px rgba(45,106,79,0.1)",
                  fontSize: "18px", letterSpacing: "4px", color: "#1D9E75",
                }}>●●●</div>
              </div>
            )}

            {(action === "register" || action === "demo") && (
              <a href="https://tascal-pet.vercel.app/register"
                style={{
                  display: "block", textAlign: "center",
                  background: "linear-gradient(135deg, #2D6A4F, #1D9E75)",
                  color: "white", padding: "14px", borderRadius: "10px",
                  textDecoration: "none", fontWeight: "bold", fontSize: "15px",
                  boxShadow: "0 4px 12px rgba(45,106,79,0.3)",
                  marginTop: "4px",
                }}>
                ✅ 30日間無料で申し込む →
              </a>
            )}

            {action === "email" && (
              <div style={{
                background: "#d4edda", borderRadius: "8px",
                padding: "12px", textAlign: "center",
                fontSize: "13px", color: "#155724",
              }}>
                ✅ ご登録ありがとうございます！<br />またいつでもご相談ください。
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* 入力エリア */}
          {action !== "end" && (
            <div style={{
              padding: "12px 16px", borderTop: "1px solid #c3e6cb",
              display: "flex", gap: "8px", background: "white", flexShrink: 0,
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="メッセージを入力..."
                style={{
                  flex: 1, border: "1px solid #b7dfc9",
                  borderRadius: "8px", padding: "9px 12px",
                  fontSize: "13.5px", outline: "none",
                  background: "#f0f9f4",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim() ? "#B0BEC5" : "#2D6A4F",
                  color: "white", border: "none",
                  borderRadius: "8px", padding: "9px 18px",
                  fontSize: "13px", fontWeight: "bold",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  flexShrink: 0,
                }}>
                送信
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
