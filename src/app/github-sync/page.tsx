import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { RefreshCw, GitCommit, GitPullRequest, AlertCircle } from "lucide-react"

const COMMITS = [
  {
    hash: "abf45ce",
    hashColor: "text-[#FBBF24]",
    message: "feat: integrate Firebase App configuration and login auth handlers",
    author: "Alex Detective",
    time: "Today, 7:14 PM",
    tag: "FEAT",
    tagColor: "bg-blue-900/50 text-blue-300 border-blue-700/40"
  },
  {
    hash: "858aa24",
    hashColor: "text-[#FBBF24]",
    message: "feat: implement Firebase Google popup authentication handlers",
    author: "Alex Detective",
    time: "Today, 7:20 PM",
    tag: "FEAT",
    tagColor: "bg-blue-900/50 text-blue-300 border-blue-700/40"
  },
  {
    hash: "fa73972",
    hashColor: "text-[#34D399]",
    message: "fix: add default fallback values for Firebase configuration properties",
    author: "Alex Detective",
    time: "Today, 7:48 PM",
    tag: "FIX",
    tagColor: "bg-emerald-900/50 text-emerald-300 border-emerald-700/40"
  },
  {
    hash: "7a9aab5",
    hashColor: "text-[#FBBF24]",
    message: "feat: complete Google Auth integration with ProfileDropdown and session persistence",
    author: "Alex Detective",
    time: "Today, 7:38 PM",
    tag: "FEAT",
    tagColor: "bg-blue-900/50 text-blue-300 border-blue-700/40"
  }
]

const REMOTE_ISSUES = [
  {
    id: "#ISSUE-108",
    severity: "HIGH",
    severityColor: "text-[#FBBF24]",
    title: "Page scroll failure when consuming double espresso",
    category: "UI GLITCH"
  },
  {
    id: "#ISSUE-114",
    severity: "CRITICAL",
    severityColor: "text-[#EF4444]",
    title: "Database connection pool leakage logs warning warnings",
    category: "DATABASE"
  },
  {
    id: "#ISSUE-128",
    severity: "LOW",
    severityColor: "text-gray-400",
    title: "BugBot asleep antennas do not wag on focus changes",
    category: "mascot"
  }
]

const PULL_REQUESTS = [
  {
    number: "#42",
    emoji: "🔐",
    title: "Setup Google popup authentication stamps",
    branch: "feat-google-auth",
    author: "Alex Detective",
    status: "APPROVED",
    statusColor: "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
  },
  {
    number: "#43",
    emoji: "☕",
    title: "Fills Productivity Coffee meter soundscapes",
    branch: "feat-coffee-tempo",
    author: "Caffeine Scribe",
    status: "REVIEW",
    statusColor: "bg-yellow-900/40 text-yellow-400 border-yellow-700/40"
  },
  {
    number: "#44",
    emoji: "📸",
    title: "Add Polaroid evidence screenshots container",
    branch: "feat-polaroid-snaps",
    author: "Evidence Collector",
    status: "DRAFT",
    statusColor: "bg-gray-900/40 text-gray-400 border-gray-600/40"
  }
]

const PROJECTS = [
  { name: "Quantum Engine", count: 4, color: "text-[#34D399]", active: true },
  { name: "Aether Distributed DB", count: 2, color: "text-[#3B82F6]", active: false },
  { name: "CryptoVault Security Core", count: 2, color: "text-[#C084FC]", active: false },
  { name: "HyperFlow Developer UI", count: 2, color: "text-[#FBBF24]", active: false }
]

export default async function GitHubSyncPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-white font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gray-800 pb-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight">
            GitHub Sync Station
          </h1>
          <span className="text-xl">🐙</span>
          <span className="font-cursive text-sm text-[#FBBF24] font-bold italic hidden sm:block">
            Repository Integration Portal
          </span>
        </div>

        <button className="flex items-center space-x-2 bg-[#FBBF24] text-black font-mono text-xs font-bold border-2 border-black px-4 py-2 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Sync Repository Issues</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Commits Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Branch Commits Trail */}
          <div className="bg-[#111827] border-2 border-gray-700/50 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <h3 className="font-mono text-[10px] font-bold text-[#FBBF24] uppercase tracking-widest mb-5">
              BRANCH COMMITS TRAIL
            </h3>

            <div className="relative space-y-0">
              {/* Dashed vertical line */}
              <div className="absolute left-[9px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-[#FBBF24]/40 pointer-events-none" />

              {COMMITS.map((commit, i) => (
                <div key={i} className="relative flex items-start space-x-4 py-3">
                  {/* Dot on timeline */}
                  <div className="shrink-0 h-5 w-5 rounded-full bg-[#FBBF24] border-2 border-black flex items-center justify-center z-10 mt-0.5">
                    <GitCommit className="h-2.5 w-2.5 text-black stroke-[3]" />
                  </div>

                  <div className="flex-1 bg-[#0D1521] border border-gray-700/40 rounded-xl p-4 flex items-start justify-between gap-3 hover:border-gray-600 transition-colors">
                    <div>
                      <div className={`font-mono text-[10px] font-bold mb-1 ${commit.hashColor}`}>
                        commit {commit.hash}
                      </div>
                      <p className="font-sans text-xs font-bold text-white leading-snug">{commit.message}</p>
                      <p className="font-mono text-[9px] text-gray-500 mt-1.5">{commit.author} &bull; {commit.time}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] font-mono font-black border ${commit.tagColor}`}>
                      {commit.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pull Request Binder Logs */}
          <div className="bg-[#111827] border-2 border-gray-700/50 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <h3 className="font-mono text-[10px] font-bold text-[#FBBF24] uppercase tracking-widest mb-5">
              PULL REQUEST BINDER LOGS
            </h3>

            <div className="space-y-3">
              {PULL_REQUESTS.map((pr, i) => (
                <div
                  key={i}
                  className="bg-white text-black border-2 border-black rounded-xl p-4 flex items-start justify-between hover:scale-[1.01] transition-transform cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    <div className="font-mono text-[9px] text-gray-400 mb-0.5">PR {pr.number}</div>
                    <p className="font-sans font-black text-sm leading-snug">
                      {pr.emoji} {pr.title}
                    </p>
                    <p className="font-cursive text-[10px] font-bold text-gray-500 mt-1 italic">
                      branch: {pr.branch} &bull; by {pr.author}
                    </p>
                  </div>
                  <span className={`shrink-0 mt-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-black border ${pr.statusColor}`}>
                    {pr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: Status + Issues (1/3 width) */}
        <div className="space-y-6">

          {/* Synced Status sticky */}
          <div className="relative bg-[#F9F5E9] text-black border-2 border-black rounded-2xl p-5 shadow-[2px_2px_0px_rgba(0,0,0,1)] rotate-[-0.5deg]">
            {/* Tape strip */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-gray-400/30 border border-gray-300/40 rounded-sm" />
            <div className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              SYNCED STATUS
            </div>
            <h3 className="font-sans font-black text-base leading-tight">
              Connected to Dev-Trace-
            </h3>
            <p className="font-cursive text-xs font-bold text-gray-500 mt-1.5 italic">
              Synced Issues Count: 0 cases resolved today.
            </p>
          </div>

          {/* Remote Repository Issues */}
          <div className="bg-[#111827] border-2 border-gray-700/50 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <h3 className="font-mono text-[10px] font-bold text-[#FBBF24] uppercase tracking-widest mb-4 flex items-center space-x-2">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>REMOTE REPOSITORY ISSUES (3)</span>
            </h3>

            <div className="space-y-3">
              {REMOTE_ISSUES.map((issue, i) => (
                <div key={i} className="bg-[#0D1521] border border-gray-700/40 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-gray-500">{issue.id}</span>
                    <span className={`font-mono text-[9px] font-black ${issue.severityColor}`}>{issue.severity}</span>
                  </div>
                  <p className="font-sans text-xs font-bold text-white leading-snug">{issue.title}</p>
                  <p className="font-mono text-[8px] text-gray-600 mt-1.5 uppercase">Category: {issue.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project breakdown */}
          <div className="bg-[#111827] border-2 border-gray-700/50 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <h3 className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Components</h3>
            <div className="space-y-2">
              {PROJECTS.map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                    p.active
                      ? "bg-[#34D399]/10 border-[#34D399] text-white"
                      : "border-transparent hover:bg-[#1A2233] text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${p.active ? "bg-[#34D399]" : "bg-gray-600"}`} />
                    <span>{p.name}</span>
                  </div>
                  <span className="font-mono text-[9px] bg-black/30 px-1.5 py-0.5 rounded-md">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
