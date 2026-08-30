import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  ArrowUpRight, Zap, AlertTriangle, CheckCircle, Brain,
  Activity, ChevronRight, Play, Bot
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  let openCount = 10, criticalCount = 3, resolvedCount = 7, aiCount = 5
  try {
    openCount = await prisma.issue.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } })
    criticalCount = await prisma.issue.count({ where: { priority: "CRITICAL" } })
    resolvedCount = await prisma.issue.count({ where: { status: "RESOLVED" } })
  } catch {}

  const metrics = [
    {
      label: "Open Cases",
      value: openCount,
      icon: Activity,
      color: "cyan",
      trend: "+2 today",
      trendUp: true,
      bg: "holo-card-cyan",
      sparkline: [3, 5, 4, 7, 6, 9, openCount]
    },
    {
      label: "Critical Alerts",
      value: criticalCount,
      icon: AlertTriangle,
      color: "red",
      trend: "Needs attention",
      trendUp: false,
      bg: "holo-card-red",
      sparkline: [1, 2, 1, 3, 2, 4, criticalCount]
    },
    {
      label: "Resolved Today",
      value: resolvedCount,
      icon: CheckCircle,
      color: "green",
      trend: "+5 from yesterday",
      trendUp: true,
      bg: "holo-card",
      sparkline: [2, 3, 5, 4, 6, 5, resolvedCount]
    },
    {
      label: "AI Predictions",
      value: aiCount,
      icon: Brain,
      color: "purple",
      trend: "3 new patterns",
      trendUp: true,
      bg: "holo-card-purple",
      sparkline: [1, 2, 3, 2, 4, 3, aiCount]
    },
  ]

  const colorMap: Record<string, string> = {
    cyan:   "text-[#34E1FF] [&>svg]:drop-shadow-[0_0_8px_rgba(52,225,255,0.8)]",
    red:    "text-[#FF5A5F] [&>svg]:drop-shadow-[0_0_8px_rgba(255,90,95,0.8)]",
    green:  "text-[#36F097] [&>svg]:drop-shadow-[0_0_8px_rgba(54,240,151,0.8)]",
    purple: "text-[#A78BFA] [&>svg]:drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]",
  }

  const sparklineColor: Record<string, string> = {
    cyan:   "#34E1FF", red: "#FF5A5F", green: "#36F097", purple: "#A78BFA"
  }

  const recentBugs = [
    { id: "DT-1024", title: "Heap use-after-free in V8-to-DOM wrapper", priority: "P1", status: "CRITICAL", ago: "2h ago" },
    { id: "DT-1030", title: "Subgrid nested track alignment collapses", priority: "P2", status: "MAJOR",    ago: "4h ago" },
    { id: "DT-1045", title: "Raft split-brain candidate state deadlock", priority: "P1", status: "BLOCKER", ago: "6h ago" },
    { id: "DT-1055", title: "HTTP/3 QUIC connection drops UDP stream",   priority: "P2", status: "MAJOR",   ago: "9h ago" },
  ]

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">

      {/* ── WELCOME HERO ── */}
      <div className="relative holo-card overflow-hidden rounded-2xl">
        {/* Animated cyber grid overlay */}
        <div className="absolute inset-0 cyber-grid-dense opacity-60 pointer-events-none" />
        {/* Glowing gradient orb */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#34E1FF]/5 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 h-40 w-40 rounded-full bg-[#8B5CF6]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#36F097] animate-pulse shadow-[0_0_6px_rgba(54,240,151,1)]" />
              <span className="font-mono text-[10px] text-[#36F097] tracking-widest uppercase">System Online · Mission Active</span>
            </div>
            <h1 className="font-sans font-bold text-3xl text-[#F8FAFC] leading-tight mb-2">
              Welcome back, <span className="text-[#FFD54A]">Detective {session.user.name?.split(' ')[0] || "Triveni"}.</span>
            </h1>
            <p className="text-[#94A3B8] font-sans text-sm">
              12 investigations assigned today · 3 critical cases require immediate attention.
            </p>

            <div className="flex items-center gap-3 mt-5">
              <Link href="/issues" className="flex items-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)] hover:shadow-[0_0_40px_rgba(255,213,74,0.5)]">
                <Play className="h-4 w-4 fill-current" />
                <span>Resume Investigation</span>
              </Link>
              <Link href="/analytics" className="flex items-center space-x-2 bg-transparent border border-[#34E1FF]/30 hover:border-[#34E1FF]/60 text-[#34E1FF] font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(52,225,255,0.15)]">
                <Brain className="h-4 w-4" />
                <span>Generate AI Report</span>
              </Link>
            </div>
          </div>

          {/* Holographic AI orb */}
          <div className="relative h-36 w-36 shrink-0 hidden md:flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-[#34E1FF]/20 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border border-[#8B5CF6]/20 animate-[spin_6s_linear_infinite_reverse]" />
            <div className="absolute inset-6 rounded-full border border-[#FFD54A]/15 animate-[spin_4s_linear_infinite]" />
            {/* Core */}
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#34E1FF]/20 to-[#8B5CF6]/20 border border-[#34E1FF]/30 flex items-center justify-center animate-cyber-pulse shadow-[0_0_30px_rgba(52,225,255,0.3)]">
              <Brain className="h-7 w-7 text-[#34E1FF]" />
            </div>
            {/* Mission ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="68" fill="none" stroke="#1E2D4A" strokeWidth="3" />
              <circle cx="72" cy="72" r="68" fill="none" stroke="#FFD54A" strokeWidth="3"
                strokeDasharray="427" strokeDashoffset="136" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className={`${m.bg} p-5 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}>
              {/* Scan line effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[beam-scan_3s_ease-in-out_infinite]" />
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${colorMap[m.color]}`}
                  style={{ background: `${sparklineColor[m.color]}15`, border: `1px solid ${sparklineColor[m.color]}30` }}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#4A5568] group-hover:text-[#94A3B8] transition-colors" />
              </div>

              <div className="font-sans font-bold text-3xl text-[#F8FAFC] mb-1">{m.value}</div>
              <div className="font-sans text-xs text-[#94A3B8] mb-3">{m.label}</div>

              {/* Mini sparkline */}
              <svg className="w-full h-8" viewBox={`0 0 ${(m.sparkline.length - 1) * 20} 30`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${m.color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparklineColor[m.color]} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={sparklineColor[m.color]} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${m.sparkline.map((v, i) => `${i * 20},${30 - (v / Math.max(...m.sparkline)) * 25}`).join(' L ')}`}
                  fill="none" stroke={sparklineColor[m.color]} strokeWidth="1.5" strokeLinecap="round"
                />
                <path
                  d={`M 0,30 L ${m.sparkline.map((v, i) => `${i * 20},${30 - (v / Math.max(...m.sparkline)) * 25}`).join(' L ')} L ${(m.sparkline.length - 1) * 20},30 Z`}
                  fill={`url(#grad-${m.color})`}
                />
              </svg>

              <div className={`font-mono text-[10px] mt-2 ${m.trendUp ? "text-[#36F097]" : "text-[#FF5A5F]"}`}>
                {m.trendUp ? "↑" : "↓"} {m.trend}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM ROW: Recent Investigations + AI Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Investigations */}
        <div className="lg:col-span-2 holo-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans font-bold text-base text-[#F8FAFC] flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#FF5A5F] shadow-[0_0_8px_rgba(255,90,95,1)]" />
              <span>Active Investigations</span>
            </h2>
            <Link href="/issues" className="font-mono text-[10px] text-[#34E1FF] hover:text-[#34E1FF]/80 flex items-center space-x-1">
              <span>View all</span><ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentBugs.map((bug) => (
              <Link key={bug.id} href={`/issues/${bug.id}`}
                className="flex items-center justify-between p-4 bg-[#121A2E] rounded-xl border border-[#1E2D4A] hover:border-[#34E1FF]/20 hover:bg-[#0D1A2E] transition-all group">
                <div className="flex items-center space-x-4 min-w-0">
                  <span className="id-chip shrink-0">{bug.id}</span>
                  <span className="font-sans text-xs text-[#94A3B8] group-hover:text-[#F8FAFC] truncate transition-colors">{bug.title}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <span className={bug.priority === "P1" ? "p1-stamp" : "p2-stamp"}>{bug.priority}</span>
                  <span className={bug.status === "CRITICAL" || bug.status === "BLOCKER" ? "badge-critical" : "badge-warning"}>{bug.status}</span>
                  <span className="font-mono text-[9px] text-[#4A5568]">{bug.ago}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Detective Teaser */}
        <div className="holo-card-cyan rounded-2xl p-6 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#34E1FF]/15 border border-[#34E1FF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(52,225,255,0.2)]">
              <Bot className="h-5 w-5 text-[#34E1FF]" />
            </div>
            <div>
              <div className="font-sans font-bold text-sm text-[#F8FAFC]">BugBot AI</div>
              <div className="font-mono text-[9px] text-[#36F097]">● Active · Scanning</div>
            </div>
          </div>

          <div className="bg-[#050816]/60 rounded-xl p-4 border border-[#34E1FF]/10 mb-4 flex-1">
            <div className="font-mono text-[9px] text-[#34E1FF] mb-2 uppercase tracking-wider">Transmission</div>
            <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
              "I detected <span className="text-[#FFD54A] font-bold">5 recurring crash signatures</span> in the V8 module. Heap corruption pattern matches DT-1024."
            </p>
          </div>

          <div className="space-y-2">
            {["Analyze Stack Trace", "Suggest Root Cause", "Generate Fix PR"].map((action) => (
              <button key={action}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#34E1FF]/5 hover:bg-[#34E1FF]/10 border border-[#34E1FF]/15 hover:border-[#34E1FF]/30 rounded-lg text-[#34E1FF] font-mono text-[10px] font-semibold transition-all group">
                <span>{action}</span>
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          <Link href="/ai-assistant"
            className="mt-4 flex items-center justify-center space-x-2 bg-[#34E1FF]/10 hover:bg-[#34E1FF]/20 border border-[#34E1FF]/20 text-[#34E1FF] font-bold text-xs py-2.5 rounded-xl transition-all">
            <Zap className="h-3.5 w-3.5" />
            <span>Open AI Detective Lab</span>
          </Link>
        </div>

      </div>

    </div>
  )
}
