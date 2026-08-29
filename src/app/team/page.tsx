import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserPlus } from "lucide-react"

const SQUAD = [
  { initial: "T", name: "Triveni B.",    role: "Lead Detective",     level: 12, bugs: 14, xp: 86, color: "#FFD54A", status: "active",   investigation: "DT-1018 · Thread-safety violation" },
  { initial: "A", name: "Alex Rivera",   role: "Senior Clue Analyst",level: 9,  bugs: 8,  xp: 74, color: "#34E1FF", status: "active",   investigation: "DT-1024 · V8 heap UAF" },
  { initial: "P", name: "Priya Menon",   role: "Evidence Specialist",level: 6,  bugs: 5,  xp: 56, color: "#36F097", status: "active",   investigation: "DT-1045 · Raft split-brain" },
  { initial: "J", name: "Jordan Kim",    role: "Junior Inspector",   level: 3,  bugs: 3,  xp: 32, color: "#A78BFA", status: "idle",     investigation: "On standby" },
  { initial: "M", name: "Morgan Lee",    role: "Design Sleuth",      level: 7,  bugs: 6,  xp: 61, color: "#A78BFA", status: "offline",  investigation: "UI regression audit" },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: "ACTIVE",  color: "#36F097", bg: "rgba(54,240,151,0.12)" },
  idle:    { label: "STANDBY", color: "#FFD54A", bg: "rgba(255,213,74,0.12)" },
  offline: { label: "OFFLINE", color: "#4A5568", bg: "rgba(74,85,104,0.12)" },
}

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">Detective Squad</h1>
          <p className="font-mono text-[11px] text-[#4A5568] mt-0.5">Your investigation team · case assignments &amp; XP progress</p>
        </div>
        <button className="flex items-center space-x-2 bg-[#121A2E] border border-[#34E1FF]/20 hover:border-[#34E1FF]/50 text-[#34E1FF] font-bold text-xs px-4 py-2 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(52,225,255,0.1)]">
          <UserPlus className="h-3.5 w-3.5" />
          <span>Invite Detective</span>
        </button>
      </div>

      {/* Squad cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SQUAD.slice(0, 4).map((member) => {
          const st = statusMap[member.status]
          return (
            <div key={member.name} className="holo-card rounded-2xl p-5 hover:scale-[1.01] transition-all group cursor-pointer relative overflow-hidden">
              {/* Corner glow */}
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ backgroundColor: member.color }} />

              {/* Status indicator */}
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{ color: st.color, background: st.bg, border: `1px solid ${st.color}40` }}>
                <span className="h-1.5 w-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: st.color }} />
                {st.label}
              </div>

              {/* Avatar */}
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-sans font-black text-xl mb-3 relative"
                style={{
                  background: `linear-gradient(135deg, ${member.color}25, ${member.color}10)`,
                  border: `2px solid ${member.color}40`,
                  boxShadow: `0 0 20px ${member.color}25`,
                  color: member.color
                }}>
                {member.initial}
              </div>

              <h3 className="font-sans font-bold text-sm text-[#F8FAFC] leading-tight">{member.name}</h3>
              <p className="font-mono text-[9px] mt-0.5 mb-3" style={{ color: member.color }}>{member.role}</p>

              {/* Stats */}
              <div className="flex justify-between text-xs font-mono mb-3">
                <div>
                  <div className="font-bold text-base" style={{ color: member.color }}>Lv{member.level}</div>
                  <div className="text-[8px] text-[#4A5568] uppercase">Level</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-[#F8FAFC]">{member.bugs}</div>
                  <div className="text-[8px] text-[#4A5568] uppercase">Bugs</div>
                </div>
              </div>

              {/* XP bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[8px] font-mono text-[#4A5568] mb-1">
                  <span>XP Progress</span><span style={{ color: member.color }}>{member.xp}%</span>
                </div>
                <div className="h-1.5 bg-[#1E2D4A] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${member.xp}%`, backgroundColor: member.color, boxShadow: `0 0 6px ${member.color}80` }} />
                </div>
              </div>

              {/* Current investigation */}
              <div className="pt-2 border-t border-[#1E2D4A]">
                <p className="font-mono text-[8px] text-[#4A5568] truncate">{member.investigation}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 5th member */}
      <div className="w-64">
        {SQUAD.slice(4).map((member) => {
          const st = statusMap[member.status]
          return (
            <div key={member.name} className="holo-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ backgroundColor: member.color }} />
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{ color: st.color, background: st.bg, border: `1px solid ${st.color}40` }}>
                <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ backgroundColor: st.color }} />
                {st.label}
              </div>
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-sans font-black text-xl mb-3"
                style={{ background: `${member.color}20`, border: `2px solid ${member.color}40`, color: member.color }}>
                {member.initial}
              </div>
              <h3 className="font-sans font-bold text-sm text-[#F8FAFC]">{member.name}</h3>
              <p className="font-mono text-[9px] mt-0.5 mb-3" style={{ color: member.color }}>{member.role}</p>
              <div className="flex justify-between text-xs font-mono mb-3">
                <div><div className="font-bold text-base" style={{ color: member.color }}>Lv{member.level}</div><div className="text-[8px] text-[#4A5568] uppercase">Level</div></div>
                <div className="text-right"><div className="font-bold text-base text-[#F8FAFC]">{member.bugs}</div><div className="text-[8px] text-[#4A5568] uppercase">Bugs</div></div>
              </div>
              <div className="h-1.5 bg-[#1E2D4A] rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full" style={{ width: `${member.xp}%`, backgroundColor: member.color }} />
              </div>
              <p className="font-mono text-[8px] text-[#4A5568] truncate border-t border-[#1E2D4A] pt-2">{member.investigation}</p>
            </div>
          )
        })}
      </div>

    </div>
  )
}
