import Link from "next/link"
import { ArrowRight, Play, Zap, Brain, GitFork } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden flex flex-col">

      {/* Ambient glow orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 bg-[#34E1FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 h-64 w-64 bg-[#FFD54A]/4 rounded-full blur-[100px] pointer-events-none" />

      {/* Top navbar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-[#1E2D4A]/50 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FFD54A] to-[#F59E0B] flex items-center justify-center shadow-[0_0_20px_rgba(255,213,74,0.5)]">
            <span className="text-[#050816] font-black text-sm font-mono">BR</span>
          </div>
          <span className="font-sans font-bold text-lg text-[#F8FAFC] tracking-tight">BugRadar</span>
          <span className="font-mono text-[9px] text-[#FFD54A]/60 border border-[#FFD54A]/20 px-1.5 py-0.5 rounded bg-[#FFD54A]/5">
            BETA
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="https://github.com" className="flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors">
            <GitFork className="h-4 w-4" /><span>GitHub</span>
          </Link>
          <Link href="/auth" className="font-sans font-bold text-sm text-[#050816] bg-[#FFD54A] hover:bg-[#FFE07A] px-5 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)]">
            Access Board →
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex items-center relative z-10 px-8 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#36F097] shadow-[0_0_8px_rgba(54,240,151,1)] animate-pulse" />
              <span className="font-mono text-[10px] text-[#36F097] uppercase tracking-[0.2em]">
                Trusted by Open Source Teams
              </span>
            </div>

            <div>
              <h1 className="font-sans font-black text-5xl md:text-6xl leading-[1.05] tracking-tight">
                <span className="text-[#F8FAFC]">EVERY BUG</span>
                <br />
                <span className="text-[#F8FAFC]">LEAVES A </span>
                <span className="text-[#FFD54A] drop-shadow-[0_0_30px_rgba(255,213,74,0.5)]">TRACE.</span>
              </h1>
            </div>

            <p className="font-sans text-[#94A3B8] text-lg leading-relaxed max-w-lg">
              AI-powered collaborative bug tracking and investigation workspace for modern engineering teams. Every crash becomes a solvable case.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth"
                className="flex items-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-bold px-7 py-3.5 rounded-xl transition-all shadow-[0_0_30px_rgba(255,213,74,0.3)] hover:shadow-[0_0_50px_rgba(255,213,74,0.5)] text-sm">
                <Zap className="h-4 w-4 fill-current stroke-0" />
                <span>Start Investigation</span>
              </Link>
              <Link href="/dashboard"
                className="flex items-center space-x-2 border border-[#34E1FF]/30 hover:border-[#34E1FF]/60 text-[#34E1FF] font-bold px-7 py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(52,225,255,0.15)] text-sm">
                <Play className="h-4 w-4 fill-current" />
                <span>View Live Workspace</span>
              </Link>
              <Link href="https://github.com"
                className="flex items-center space-x-2 border border-[#1E2D4A] hover:border-[#94A3B8]/30 text-[#94A3B8] hover:text-[#F8FAFC] font-bold px-7 py-3.5 rounded-xl transition-all text-sm">
                <GitFork className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["AI Root Cause Analysis", "Evidence Board", "Real-time Collaboration", "GitHub Sync", "Sprint Analytics"].map((feat) => (
                <span key={feat} className="font-mono text-[9px] text-[#4A5568] border border-[#1E2D4A] rounded-full px-3 py-1">
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Holographic Investigation Board */}
          <div className="relative h-[520px] hidden lg:flex items-center justify-center">
            {/* Outer radar ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute h-[480px] w-[480px] rounded-full border border-[#34E1FF]/10" />
              <div className="absolute h-[380px] w-[380px] rounded-full border border-[#34E1FF]/8" />
              <div className="absolute h-[280px] w-[280px] rounded-full border border-[#34E1FF]/6" />
              {/* Rotating scan line */}
              <div className="absolute h-[480px] w-[480px] rounded-full animate-[spin_4s_linear_infinite]">
                <div className="absolute top-0 left-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t from-[#34E1FF]/40 to-transparent" />
              </div>
            </div>

            {/* Floating bug evidence cards */}
            {/* Card 1 – top right */}
            <div className="absolute top-8 right-8 holo-card-red rounded-xl p-3 w-48 animate-float shadow-[0_0_20px_rgba(255,90,95,0.15)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="id-chip text-[#FF5A5F] border-[#FF5A5F]/20 bg-[#FF5A5F]/8">DT-1024</span>
                <span className="p1-stamp">P1</span>
              </div>
              <p className="font-sans text-[9px] text-[#94A3B8] leading-snug">Heap use-after-free in V8 GC cycle</p>
              <div className="mt-2 flex items-center space-x-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F] animate-pulse" />
                <span className="font-mono text-[8px] text-[#FF5A5F]">CRITICAL</span>
              </div>
            </div>

            {/* Card 2 – bottom left */}
            <div className="absolute bottom-16 left-4 holo-card-yellow rounded-xl p-3 w-44 animate-[float-up_4s_ease-in-out_1s_infinite] shadow-[0_0_20px_rgba(255,213,74,0.1)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="id-chip">DT-1030</span>
                <span className="p2-stamp">P2</span>
              </div>
              <p className="font-sans text-[9px] text-[#94A3B8] leading-snug">Subgrid alignment collapses</p>
              <div className="mt-2 flex items-center space-x-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#FFA726] animate-pulse" />
                <span className="font-mono text-[8px] text-[#FFA726]">MAJOR</span>
              </div>
            </div>

            {/* Card 3 – top left */}
            <div className="absolute top-24 left-0 holo-card-purple rounded-xl p-3 w-44 animate-[float-up_3.5s_ease-in-out_0.5s_infinite] shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="id-chip text-[#A78BFA] border-[#A78BFA]/20 bg-[#A78BFA]/8">DT-1045</span>
                <span className="p1-stamp">P1</span>
              </div>
              <p className="font-sans text-[9px] text-[#94A3B8] leading-snug">Raft split-brain deadlock</p>
              <div className="mt-2 flex items-center space-x-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
                <span className="font-mono text-[8px] text-[#A78BFA]">BLOCKER</span>
              </div>
            </div>

            {/* Center: AI orb */}
            <div className="relative h-28 w-28 flex items-center justify-center z-10">
              <div className="absolute inset-0 rounded-full border border-[#34E1FF]/30 animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-[#8B5CF6]/20 animate-[spin_4s_linear_infinite_reverse]" />
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#34E1FF]/15 to-[#8B5CF6]/15 border border-[#34E1FF]/30 flex items-center justify-center animate-cyber-pulse shadow-[0_0_40px_rgba(52,225,255,0.25)]">
                <Brain className="h-9 w-9 text-[#34E1FF]" />
              </div>
            </div>

            {/* SVG connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="50%" x2="75%" y2="15%" stroke="#34E1FF" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
              <line x1="50%" y1="50%" x2="20%" y2="35%" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
              <line x1="50%" y1="50%" x2="25%" y2="80%" stroke="#FFD54A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            </svg>

            {/* Bottom: AI chat bubble */}
            <div className="absolute bottom-4 right-4 holo-card-cyan rounded-xl p-3 max-w-[160px] shadow-[0_0_20px_rgba(52,225,255,0.1)]">
              <div className="font-mono text-[8px] text-[#34E1FF] mb-1 uppercase tracking-wider">BugBot AI</div>
              <p className="font-sans text-[9px] text-[#94A3B8]">"5 crash signatures detected in V8 module."</p>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom feature bar */}
      <div className="border-t border-[#1E2D4A]/50 py-5 px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: "🕵️", label: "Detective Workspace" },
            { icon: "⚡", label: "AI-Powered Analysis" },
            { icon: "🔗", label: "GitHub Integration" },
            { icon: "📊", label: "Sprint Analytics" },
            { icon: "🤖", label: "BugBot Assistant" },
          ].map((f) => (
            <div key={f.label} className="flex items-center space-x-2 text-[#4A5568] hover:text-[#94A3B8] transition-colors">
              <span className="text-sm">{f.icon}</span>
              <span className="font-sans text-xs font-semibold">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
