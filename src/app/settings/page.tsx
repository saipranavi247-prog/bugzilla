"use client"

import { useState } from "react"
import { GitFork, MessageSquare, Code2, Flame, Bell, Moon, Zap, Shield, Key, Keyboard } from "lucide-react"

type NotifKey = "critical" | "sprint" | "team" | "ai" | "weekly"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"night" | "blueprint" | "neon">("night")
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({ critical: true, sprint: true, team: true, ai: false, weekly: true })

  const toggleNotif = (k: NotifKey) => setNotifs(p => ({ ...p, [k]: !p[k] }))

  const INTEGRATIONS = [
    { id: "github", icon: GitFork, name: "GitHub", desc: "Sync commits & PRs", connected: true, color: "#36F097" },
    { id: "slack", icon: MessageSquare, name: "Slack", desc: "Bug alert notifications", connected: false, color: "#FF5A5F" },
    { id: "vscode", icon: Code2, name: "VS Code", desc: "IDE extension support", connected: true, color: "#34E1FF" },
    { id: "firebase", icon: Flame, name: "Firebase", desc: "Auth & Firestore backend", connected: true, color: "#FFA726" },
  ]

  const THEMES = [
    { id: "night", label: "Night Ops", emoji: "🌙" },
    { id: "blueprint", label: "Blueprint", emoji: "🗺️" },
    { id: "neon", label: "Neon Noir", emoji: "⚡" },
  ] as const

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <div className="h-0.5 w-12 bg-[#FFD54A] mb-3 rounded-full shadow-[0_0_8px_rgba(255,213,74,0.8)]" />
        <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">
          Case <span className="text-[#FFD54A]">Preferences</span>
        </h1>
        <p className="font-mono text-[11px] text-[#4A5568] mt-1">Configure your investigation workspace</p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Workspace Theme */}
        <div className="holo-card rounded-2xl p-6">
          <h3 className="font-sans font-bold text-sm text-[#F8FAFC] flex items-center space-x-2 mb-5">
            <Moon className="h-4 w-4 text-[#A78BFA]" /><span>Workspace Theme</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 cursor-pointer transition-all text-xs font-semibold ${
                  theme === t.id
                    ? "bg-[#FFD54A]/15 border-[#FFD54A]/50 text-[#FFD54A] shadow-[0_0_20px_rgba(255,213,74,0.1)]"
                    : "bg-[#121A2E] border-[#1E2D4A] text-[#94A3B8] hover:border-[#94A3B8]/30"
                }`}>
                <span className="text-lg">{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Rules */}
        <div className="holo-card rounded-2xl p-6">
          <h3 className="font-sans font-bold text-sm text-[#F8FAFC] flex items-center space-x-2 mb-5">
            <Bell className="h-4 w-4 text-[#FFD54A]" /><span>Notification Rules</span>
          </h3>
          <div className="space-y-4">
            {([
              { k: "critical", label: "Critical bug alerts", icon: "🔴" },
              { k: "sprint",   label: "Sprint updates",      icon: "📅" },
              { k: "team",     label: "Team mentions",       icon: "💬" },
              { k: "ai",       label: "AI suggestions",      icon: "🤖" },
              { k: "weekly",   label: "Weekly report",       icon: "📋" },
            ] as { k: NotifKey; label: string; icon: string }[]).map(({ k, label, icon }) => (
              <div key={k} className="flex items-center justify-between">
                <span className="font-sans text-xs text-[#94A3B8] flex items-center space-x-2">
                  <span>{icon}</span><span>{label}</span>
                </span>
                <button onClick={() => toggleNotif(k)}
                  className={`relative h-5 w-9 rounded-full border transition-colors cursor-pointer ${notifs[k] ? "bg-[#FFD54A] border-[#FFD54A]/50" : "bg-[#1E2D4A] border-[#1E2D4A]"}`}>
                  <span className={`absolute top-0.5 h-3.5 w-3.5 bg-white rounded-full border border-black/20 transition-all shadow-sm ${notifs[k] ? "left-4" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Integration Stickers */}
      <div className="holo-card rounded-2xl p-6">
        <h3 className="font-sans font-bold text-sm text-[#F8FAFC] flex items-center space-x-2 mb-5">
          <Zap className="h-4 w-4 text-[#FFD54A]" /><span>Integration Stickers</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INTEGRATIONS.map((integ) => {
            const Icon = integ.icon
            return (
              <div key={integ.id} className="holo-card rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:scale-[1.02] transition-all"
                style={{ borderColor: integ.connected ? integ.color + "30" : "#1E2D4A" }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: integ.color + "15", border: `1px solid ${integ.color}30` }}>
                  <Icon className="h-5 w-5" style={{ color: integ.color }} />
                </div>
                <div className="font-sans font-bold text-xs text-[#F8FAFC] mb-0.5">{integ.name}</div>
                <div className="font-mono text-[8px] text-[#4A5568] mb-3">{integ.desc}</div>
                <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                  integ.connected
                    ? "text-[#36F097] border-[#36F097]/30 bg-[#36F097]/10"
                    : "text-[#FF5A5F] border-[#FF5A5F]/30 bg-[#FF5A5F]/10"
                }`}>
                  {integ.connected ? "✓ Connected" : "✗ Disconnected"}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Security + API tokens row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="holo-card rounded-2xl p-6">
          <h3 className="font-sans font-bold text-sm text-[#F8FAFC] flex items-center space-x-2 mb-4">
            <Shield className="h-4 w-4 text-[#36F097]" /><span>Security</span>
          </h3>
          <div className="space-y-3">
            {["Two-factor authentication", "Active sessions", "Login history"].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-[#1E2D4A]">
                <span className="font-sans text-xs text-[#94A3B8]">{item}</span>
                <button className="font-mono text-[9px] text-[#34E1FF] hover:text-[#34E1FF]/80">Manage →</button>
              </div>
            ))}
          </div>
        </div>
        <div className="holo-card rounded-2xl p-6">
          <h3 className="font-sans font-bold text-sm text-[#F8FAFC] flex items-center space-x-2 mb-4">
            <Key className="h-4 w-4 text-[#A78BFA]" /><span>API Tokens</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#121A2E] rounded-xl border border-[#1E2D4A]">
              <div>
                <div className="font-mono text-[9px] text-[#36F097]">dt_live_••••••••••••••kX9f</div>
                <div className="font-mono text-[8px] text-[#4A5568] mt-0.5">Production · Created 2d ago</div>
              </div>
              <button className="font-mono text-[9px] text-[#FF5A5F] hover:text-[#FF5A5F]/80">Revoke</button>
            </div>
            <button className="w-full py-2 border border-dashed border-[#1E2D4A] hover:border-[#34E1FF]/30 rounded-xl font-mono text-[9px] text-[#4A5568] hover:text-[#34E1FF] transition-all">
              + Generate new token
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
