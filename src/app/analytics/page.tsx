import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  const burndown = [12, 10, 9, 8, 7, 6, 5, 4, 3]
  const actual   = [12, 11, 10, 8, 7, 5, 4, 3, 2]
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"]

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">Analytics Lab</h1>
          <p className="font-mono text-[11px] text-[#4A5568] mt-0.5">Intelligence dashboard · Quantum Engine project</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#121A2E] border border-[#1E2D4A] text-[#94A3B8] text-xs rounded-xl px-4 py-2 outline-none">
            <option>Quantum Engine</option>
            <option>Aether Distributed DB</option>
          </select>
          <select className="bg-[#121A2E] border border-[#1E2D4A] text-[#94A3B8] text-xs rounded-xl px-4 py-2 outline-none">
            <option>All Levels</option>
            <option>Critical</option>
            <option>Major</option>
          </select>
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Mean Resolution", value: "4.8 hrs", sub: "Avg file to merge fix", color: "#34E1FF", bg: "holo-card-cyan" },
          { label: "Alert Glitch Count", value: "4", sub: "Blockers / Criticals", color: "#FF5A5F", bg: "holo-card-red" },
          { label: "Bug Velocity", value: "2.3/day", sub: "Sprint average rate", color: "#36F097", bg: "holo-card" },
          { label: "Developer XP", value: "LEVEL 14", sub: "700 / 1000 XP", color: "#FFD54A", bg: "holo-card-yellow" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} p-5 rounded-2xl`}>
            <div className="font-mono text-[9px] text-[#4A5568] uppercase tracking-widest mb-2">{s.label}</div>
            <div className="font-sans font-bold text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="font-mono text-[10px] text-[#94A3B8]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Burndown Chart */}
        <div className="lg:col-span-2 holo-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sans font-bold text-sm text-[#F8FAFC]">Bug Burndown Trail</h3>
            <div className="flex items-center space-x-4 text-[9px] font-mono">
              <span className="flex items-center space-x-1.5"><span className="h-2 w-6 bg-[#FF5A5F] rounded inline-block" /> Expected</span>
              <span className="flex items-center space-x-1.5"><span className="h-2 w-6 bg-[#34E1FF] rounded inline-block" /> Actual</span>
            </div>
          </div>

          <div className="relative h-48 w-full">
            <svg className="w-full h-full" viewBox="0 0 480 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="burnActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34E1FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#34E1FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="burnExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5A5F" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FF5A5F" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0, 40, 80, 120, 160].map(y => (
                <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#1E2D4A" strokeWidth="1" />
              ))}
              {weekdays.map((_, i) => (
                <line key={i} x1={i * 60} y1="0" x2={i * 60} y2="160" stroke="#1E2D4A" strokeWidth="1" strokeDasharray="2 4" />
              ))}
              {/* Expected line */}
              <path
                d={`M ${burndown.map((v, i) => `${i * 60},${160 - (v / 12) * 140}`).join(' L ')}`}
                fill="none" stroke="#FF5A5F" strokeWidth="2" strokeDasharray="4 4" opacity="0.7"
              />
              {/* Actual line */}
              <path
                d={`M ${actual.map((v, i) => `${i * 60},${160 - (v / 12) * 140}`).join(' L ')}`}
                fill="none" stroke="#34E1FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d={`M 0,160 L ${actual.map((v, i) => `${i * 60},${160 - (v / 12) * 140}`).join(' L ')} L 480,160 Z`}
                fill="url(#burnActual)"
              />
              {/* Data points */}
              {actual.map((v, i) => (
                <circle key={i} cx={i * 60} cy={160 - (v / 12) * 140} r="3.5" fill="#050816" stroke="#34E1FF" strokeWidth="2" />
              ))}
            </svg>
            <div className="flex justify-between mt-2 px-1">
              {weekdays.map((d, i) => (
                <span key={i} className="font-mono text-[8px] text-[#4A5568]">{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column widgets */}
        <div className="space-y-5">

          {/* Severity donut */}
          <div className="holo-card rounded-2xl p-5">
            <h3 className="font-sans font-bold text-sm text-[#F8FAFC] mb-4">Severity Distribution</h3>
            <div className="flex items-center justify-between">
              <svg className="w-24 h-24" viewBox="0 0 80 80">
                {/* Donut segments: Blockers 25%, Majors 40%, Normals 35% */}
                <circle cx="40" cy="40" r="32" fill="none" stroke="#FF5A5F" strokeWidth="12"
                  strokeDasharray="50.3 150.8" transform="rotate(-90 40 40)" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#FFA726" strokeWidth="12"
                  strokeDasharray="80.4 120.6" transform="rotate(0 40 40)" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#36F097" strokeWidth="12"
                  strokeDasharray="70.4 130.7" transform="rotate(144 40 40)" />
              </svg>
              <div className="space-y-1.5 text-[9px] font-mono">
                <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-[#FF5A5F]" /><span className="text-[#94A3B8]">Blockers 25%</span></div>
                <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-[#FFA726]" /><span className="text-[#94A3B8]">Majors 40%</span></div>
                <div className="flex items-center space-x-1.5"><span className="h-2 w-2 rounded-full bg-[#36F097]" /><span className="text-[#94A3B8]">Normals 35%</span></div>
              </div>
            </div>
          </div>

          {/* Chaos dial */}
          <div className="holo-card rounded-2xl p-5">
            <h3 className="font-sans font-bold text-sm text-[#F8FAFC] mb-3">System Stability</h3>
            <div className="relative w-full h-20 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 80">
                <path d="M 20 70 A 80 80 0 0 1 180 70" fill="none"
                  stroke="url(#dialGrad)" strokeWidth="10" strokeLinecap="round" />
                <defs>
                  <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#36F097" />
                    <stop offset="50%" stopColor="#FFA726" />
                    <stop offset="100%" stopColor="#FF5A5F" />
                  </linearGradient>
                </defs>
                {/* Needle at 80% */}
                <line x1="100" y1="70" x2="156" y2="32" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="70" r="5" fill="#F8FAFC" />
              </svg>
              <div className="absolute bottom-0 font-mono text-[10px] text-[#FF5A5F] font-bold">CHAOS: 80%</div>
            </div>
          </div>

        </div>
      </div>

      {/* Hotspot modules */}
      <div className="holo-card rounded-2xl p-6">
        <h3 className="font-sans font-bold text-sm text-[#F8FAFC] mb-4">Module Hotspots</h3>
        <div className="space-y-3">
          {[
            { name: "V8-Bindings", bugs: 4, pct: 80, color: "#FF5A5F" },
            { name: "Network Stack", bugs: 3, pct: 60, color: "#FFA726" },
            { name: "CSS Layout Engine", bugs: 2, pct: 40, color: "#FFD54A" },
            { name: "Storage / LSM", bugs: 2, pct: 40, color: "#34E1FF" },
            { name: "Distributed Consensus", bugs: 1, pct: 20, color: "#A78BFA" },
          ].map((mod) => (
            <div key={mod.name} className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-[#94A3B8] w-40 shrink-0">{mod.name}</span>
              <div className="flex-1 h-2 bg-[#1E2D4A] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${mod.pct}%`, backgroundColor: mod.color, boxShadow: `0 0 8px ${mod.color}80` }} />
              </div>
              <span className="font-mono text-[10px] text-[#4A5568] w-12 text-right">{mod.bugs} bugs</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
