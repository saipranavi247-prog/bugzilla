import Link from "next/link"
import { Award, Target, Terminal, Bug, Activity, Shield, GitCommit, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const stats = [
    { label: "Bugs Squashed", value: 432, color: "#36F097" },
    { label: "Criticals Resolved", value: 89, color: "#FF5A5F" },
    { label: "AI Assist Rate", value: "94%", color: "#34E1FF" },
    { label: "Current Streak", value: "14 Days", color: "#FFD54A" },
  ]

  const timeline = [
    { type: "resolve", title: "Resolved DT-1024", desc: "Heap use-after-free fixed with TracedReference", time: "2h ago", color: "#36F097" },
    { type: "assign", title: "Assigned to DT-1045", desc: "Raft split-brain candidate state deadlock", time: "5h ago", color: "#FFA726" },
    { type: "commit", title: "Merged PR #442", desc: "fix: Subgrid nested track alignment", time: "1d ago", color: "#A78BFA" },
    { type: "award", title: "Earned Badge: Memory Hunter", desc: "Resolve 10 critical memory leak bugs", time: "3d ago", color: "#FFD54A" },
  ]

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header Profile Card */}
      <div className="holo-card rounded-2xl p-8 relative overflow-hidden">
        {/* Glow behind profile */}
        <div className="absolute -top-20 -left-20 h-64 w-64 bg-[#34E1FF]/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          {/* Avatar Ring */}
          <div className="relative h-32 w-32 shrink-0">
            <div className="absolute inset-0 rounded-2xl border-2 border-[#34E1FF]/30 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 rounded-2xl border-2 border-[#FFD54A]/20 animate-[spin_6s_linear_infinite_reverse]" />
            <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-[#FF5A5F] to-[#8B5CF6] flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_30px_rgba(255,90,95,0.4)]">
              T
            </div>
            
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#050816] border border-[#34E1FF] rounded-lg px-2 py-1 shadow-[0_0_15px_rgba(52,225,255,0.4)]">
              <span className="font-mono text-[10px] text-[#34E1FF] font-bold">LVL 42</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="font-sans font-black text-3xl text-[#F8FAFC]">Triveni B.</h1>
                <p className="font-mono text-xs text-[#34E1FF] uppercase tracking-widest mt-1">Lead Cyber Detective</p>
              </div>
              <button className="bg-[#121A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 text-[#94A3B8] hover:text-[#34E1FF] px-4 py-2 rounded-xl text-xs font-bold transition-all w-full md:w-auto">
                EDIT PROFILE
              </button>
            </div>
            
            <p className="font-sans text-sm text-[#94A3B8] max-w-xl mb-6">
              Specializes in V8 engine internals, concurrent garbage collection bugs, and front-end layout engine collapses.
            </p>

            {/* XP Bar */}
            <div className="max-w-md">
              <div className="flex justify-between font-mono text-[9px] text-[#94A3B8] mb-1.5">
                <span>XP PROGRESS TO LVL 43</span>
                <span className="text-[#34E1FF]">8,420 / 10,000</span>
              </div>
              <div className="h-2 bg-[#1E2D4A] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#34E1FF] to-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(52,225,255,0.5)]" style={{ width: '84%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Stats & Badges */}
        <div className="space-y-6">
          
          <div className="holo-card rounded-2xl p-6">
            <h3 className="font-mono text-[10px] text-[#4A5568] uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Target className="h-4 w-4 text-[#FFD54A]" /> <span>Career Stats</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-[#121A2E] border border-[#1E2D4A] rounded-xl p-3 text-center">
                  <div className="font-sans font-black text-xl mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="font-mono text-[8px] text-[#4A5568] uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="holo-card rounded-2xl p-6">
            <h3 className="font-mono text-[10px] text-[#4A5568] uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Award className="h-4 w-4 text-[#A78BFA]" /> <span>Earned Badges</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Memory Hunter", icon: "🧠", color: "#FFD54A" },
                { label: "Raft Expert", icon: "⛵", color: "#34E1FF" },
                { label: "100 Bugs", icon: "💯", color: "#FF5A5F" },
                { label: "Night Owl", icon: "🦉", color: "#8B5CF6" },
              ].map(badge => (
                <div key={badge.label} className="flex flex-col items-center gap-2 group">
                  <div className="h-12 w-12 rounded-full border border-[#1E2D4A] bg-[#121A2E] flex items-center justify-center text-xl group-hover:scale-110 transition-transform cursor-pointer"
                    style={{ borderColor: `${badge.color}40`, boxShadow: `0 0 15px ${badge.color}15` }}>
                    {badge.icon}
                  </div>
                  <span className="font-mono text-[8px] text-[#94A3B8]">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Col: Activity Timeline */}
        <div className="lg:col-span-2">
          <div className="holo-card rounded-2xl p-6 h-full">
            <h3 className="font-mono text-[10px] text-[#4A5568] uppercase tracking-widest mb-6 flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#36F097]" /> <span>Activity Transmission Log</span>
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#1E2D4A] before:via-[#1E2D4A] before:to-transparent">
              
              {timeline.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050816] bg-[#121A2E] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_1px_#1E2D4A] group-hover:shadow-[0_0_15px_var(--tw-shadow-color)] transition-all z-10"
                    style={{ '--tw-shadow-color': item.color } as React.CSSProperties}>
                    {item.type === 'resolve' && <CheckCircle className="h-4 w-4" style={{ color: item.color }} />}
                    {item.type === 'assign' && <Bug className="h-4 w-4" style={{ color: item.color }} />}
                    {item.type === 'commit' && <GitCommit className="h-4 w-4" style={{ color: item.color }} />}
                    {item.type === 'award' && <Award className="h-4 w-4" style={{ color: item.color }} />}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-[#121A2E] border border-[#1E2D4A] p-4 rounded-xl hover:border-[#34E1FF]/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-sans font-bold text-sm text-[#F8FAFC]">{item.title}</span>
                      <span className="font-mono text-[9px] text-[#4A5568]">{item.time}</span>
                    </div>
                    <p className="font-sans text-xs text-[#94A3B8]">{item.desc}</p>
                  </div>
                </div>
              ))}

            </div>

            <div className="mt-8 text-center">
              <button className="font-mono text-[9px] text-[#34E1FF] hover:text-[#34E1FF]/80 transition-colors uppercase tracking-widest">
                LOAD OLDER TRANSMISSIONS ↓
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
