"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Zap, ChevronRight } from "lucide-react"

interface Message { id: string; sender: "user" | "bot"; text: string }

const CLUES = [
  { label: "Explain Error",    icon: "🔍", prompt: "Explain Error: V8 heap use-after-free" },
  { label: "Find Duplicate",   icon: "🔎", prompt: "Find Duplicate: DT-1024" },
  { label: "Suggest Fix",      icon: "⚡", prompt: "Suggest Fix: memory leak" },
  { label: "Test Cases",       icon: "📋", prompt: "Generate test cases for DT-1030" },
  { label: "Assign Dev",       icon: "👤", prompt: "Assign developer to DT-1045" },
]

const BOT_RESPONSES: Record<string, string> = {
  "Explain Error: V8 heap use-after-free": "The heap use-after-free error in DT-1024 is triggered when the GC sweeps an isolate concurrently while the DOM wrapper still holds a raw pointer. The fix is to upgrade to traced references (v8::TracedReference) which are GC-aware.",
  "Find Duplicate: DT-1024": "Duplicate analysis complete. DT-1024 shares a 91% crash signature fingerprint with DT-0988 (closed). The V8 binding disposal pattern is identical — recommend reopening DT-0988 as a blocker dependency.",
  "Suggest Fix: memory leak": "Recommended patch:\n```cpp\n// audio_player.cc - line 247\nvoid AudioPlayer::Destroy() {\n  if (audio_ctx_) {\n    audio_ctx_->close();\n    audio_ctx_.reset(); // GC-safe release\n  }\n}\n```\nThis eliminates the leak by resetting the unique_ptr before isolate disposal.",
  "Generate test cases for DT-1030": "Generated 4 test cases:\n1. flex container with subgrid → child height=0 assertion\n2. nested flex-subgrid with overflow:hidden\n3. dynamic height recalculation on resize\n4. subgrid in absolutely positioned parent\nAll assertions use getComputedStyle() to verify rendered height > 0.",
  "Assign developer to DT-1045": "Analyzing squad load...\nAlex Rivera: 2 active cases, 74% XP — best match for distributed systems expertise.\nRecommendation: Assign DT-1045 to Alex Rivera · ETA 2 days.",
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "I am BugBot, your silicon debugging assistant. I detected 5 recurring crash signatures in the V8 module. How can I assist with your investigation?"
    }
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    setMessages(p => [...p, { id: `u-${Date.now()}`, sender: "user", text }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const response = BOT_RESPONSES[text] || "Analyzing traces... The pattern suggests a race condition in the async disposal chain. Run the memory profiler with `--expose-gc` flag to isolate the exact allocation point."
      setMessages(p => [...p, { id: `b-${Date.now()}`, sender: "bot", text: response }])
      setTyping(false)
    }, 1000)
  }

  return (
    <div className="p-8 h-full flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">

      {/* Left: BugBot Profile + Clue Stickers */}
      <div className="w-full md:w-64 shrink-0 space-y-5">

        {/* Profile card */}
        <div className="holo-card-cyan rounded-2xl p-5 text-center">
          <div className="relative h-20 w-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border border-[#34E1FF]/20 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-[#8B5CF6]/20 animate-[spin_4s_linear_infinite_reverse]" />
            <div className="absolute inset-4 rounded-full bg-[#34E1FF]/10 border border-[#34E1FF]/30 flex items-center justify-center animate-cyber-pulse">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
          <h2 className="font-sans font-bold text-sm text-[#F8FAFC]">BugBot Assistant</h2>
          <p className="font-mono text-[9px] text-[#36F097] mt-1">● Crawling traces…</p>
        </div>

        {/* Clue Stickers */}
        <div>
          <div className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest mb-3">Clue Stickers</div>
          <div className="space-y-2">
            {CLUES.map((clue) => (
              <button
                key={clue.label}
                onClick={() => sendMessage(clue.prompt)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-[#121A2E] hover:bg-[#0D1A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{clue.icon}</span>
                  <span className="font-sans text-xs text-[#94A3B8] group-hover:text-[#34E1FF] font-semibold transition-colors">{clue.label}</span>
                </div>
                <ChevronRight className="h-3 w-3 text-[#4A5568] group-hover:text-[#34E1FF] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Chat Interface */}
      <div className="flex-1 holo-card rounded-2xl flex flex-col overflow-hidden min-h-[500px]">

        {/* Chat header */}
        <div className="px-6 py-4 border-b border-[#1E2D4A] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-[#36F097] shadow-[0_0_6px_rgba(54,240,151,1)] animate-pulse" />
            <span className="font-sans font-bold text-sm text-[#F8FAFC]">BugBot Silicon</span>
          </div>
          <span className="font-mono text-[9px] text-[#4A5568]">TRANSMISSION CHANNEL · SECURE</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" && (
                <div className="h-7 w-7 rounded-xl bg-[#34E1FF]/15 border border-[#34E1FF]/30 flex items-center justify-center shrink-0 mr-3 mt-1 text-sm">
                  🤖
                </div>
              )}
              <div className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-[#FFD54A] text-[#050816] font-semibold rounded-tr-sm"
                  : "bg-[#121A2E] text-[#94A3B8] border border-[#1E2D4A] rounded-tl-sm font-mono"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-xl bg-[#34E1FF]/15 border border-[#34E1FF]/30 flex items-center justify-center text-sm">🤖</div>
              <div className="bg-[#121A2E] border border-[#1E2D4A] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#34E1FF] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-[#1E2D4A]">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
            className="flex items-center space-x-3 bg-[#121A2E] border border-[#1E2D4A] focus-within:border-[#FFD54A]/40 rounded-xl px-4 py-3 transition-all">
            <span className="font-mono text-xs text-[#FFD54A] font-bold shrink-0">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scribe your query or drag trace details here…"
              className="flex-1 bg-transparent text-xs text-[#F8FAFC] placeholder-[#4A5568] outline-none font-mono"
            />
            <button type="submit"
              className="h-7 w-7 bg-[#FFD54A] text-[#050816] rounded-lg flex items-center justify-center hover:bg-[#FFE07A] transition-all shrink-0 shadow-[0_0_10px_rgba(255,213,74,0.4)]">
              <Send className="h-3.5 w-3.5 fill-current stroke-0" />
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
