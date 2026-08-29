import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Filter, SortAsc, Plus, Clock, User } from "lucide-react"

const BUGS = [
  {
    id: "DT-1024", priority: "P1", title: "Heap use-after-free in V8-to-DOM wrapper during concurrent GC cycle",
    tag: "V8-Bindings", status: "BLOCKER", assignee: "Alex R.", repo: "chromium-core", due: "Due: Urgent",
    comments: 5, severity: "CRITICAL"
  },
  {
    id: "DT-1030", priority: "P2", title: "Subgrid nested track alignment collapses to zero height on flex child",
    tag: "Layout", status: "MAJOR", assignee: "Priya M.", repo: "css-engine", due: "Due: Friday",
    comments: 3, severity: "MAJOR"
  },
  {
    id: "DT-1045", priority: "P1", title: "Raft split-brain candidate state deadlock on partition recovery in 5-node cluster",
    tag: "Distributed", status: "CRITICAL", assignee: "Jordan K.", repo: "aether-db", due: "Due: Today",
    comments: 8, severity: "CRITICAL"
  },
  {
    id: "DT-1055", priority: "P2", title: "HTTP/3 QUIC connection migration drops UDP stream packets during Wi-Fi to 5G handover",
    tag: "Network", status: "MAJOR", assignee: "Morgan L.", repo: "net-stack", due: "Due: Friday",
    comments: 2, severity: "MAJOR"
  },
  {
    id: "DT-1060", priority: "P1", title: "LSM Compaction worker memory leak during high-throughput ingest workloads",
    tag: "Storage", status: "BLOCKER", assignee: "Alex R.", repo: "aether-db", due: "Due: ASAP",
    comments: 6, severity: "CRITICAL"
  },
  {
    id: "DT-1018", priority: "P1", title: "Thread-safety violation in global isolate handle disposal lock table",
    tag: "Concurrency", status: "CRITICAL", assignee: "Triveni B.", repo: "chromium-core", due: "Due: Today",
    comments: 11, severity: "CRITICAL"
  },
]

const severityBadge: Record<string, string> = {
  CRITICAL: "badge-critical",
  BLOCKER:  "badge-critical",
  MAJOR:    "badge-warning",
  NORMAL:   "badge-info",
}

export default async function IssuesPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">Investigation Files</h1>
          <p className="font-mono text-[11px] text-[#4A5568] mt-0.5">
            {BUGS.length} active cases · Sorted by severity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 bg-[#121A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 text-[#94A3B8] hover:text-[#34E1FF] text-xs font-semibold px-4 py-2 rounded-xl transition-all">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-[#121A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 text-[#94A3B8] hover:text-[#34E1FF] text-xs font-semibold px-4 py-2 rounded-xl transition-all">
            <SortAsc className="h-3.5 w-3.5" />
            <span>Sort</span>
          </button>
          <Link href="/report-bug" className="flex items-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)]">
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>New Case</span>
          </Link>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-4 px-4 text-[9px] font-mono text-[#4A5568] uppercase tracking-[0.1em]">
        <span className="col-span-1">ID</span>
        <span className="col-span-4">Title</span>
        <span className="col-span-1">Priority</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-1">Repo</span>
        <span className="col-span-2">Assignee</span>
        <span className="col-span-1">Due</span>
      </div>

      <div className="cyber-divider" />

      {/* Bug rows */}
      <div className="space-y-2">
        {BUGS.map((bug) => (
          <Link
            key={bug.id}
            href={`/issues/${bug.id}`}
            className="grid grid-cols-12 gap-4 items-center p-4 holo-card rounded-xl hover:border-[#34E1FF]/20 hover:shadow-[0_0_20px_rgba(52,225,255,0.05)] transition-all group cursor-pointer"
          >
            {/* ID */}
            <div className="col-span-1">
              <span className="id-chip">{bug.id}</span>
            </div>

            {/* Title + tag */}
            <div className="col-span-4 flex flex-col gap-1 min-w-0">
              <span className="font-sans text-xs text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors truncate leading-snug">
                {bug.title}
              </span>
              <span className="font-mono text-[8px] text-[#34E1FF] bg-[#34E1FF]/8 border border-[#34E1FF]/15 rounded px-1.5 py-0.5 w-fit">
                {bug.tag}
              </span>
            </div>

            {/* Priority */}
            <div className="col-span-1">
              <span className={bug.priority === "P1" ? "p1-stamp" : bug.priority === "P2" ? "p2-stamp" : "p3-stamp"}>
                {bug.priority}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={severityBadge[bug.status] || "badge-info"}>{bug.status}</span>
            </div>

            {/* Repo */}
            <div className="col-span-1">
              <span className="font-mono text-[9px] text-[#4A5568] truncate">{bug.repo}</span>
            </div>

            {/* Assignee */}
            <div className="col-span-2 flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#34E1FF]/40 to-[#8B5CF6]/40 border border-[#34E1FF]/20 flex items-center justify-center text-[8px] font-bold text-[#34E1FF]">
                {bug.assignee[0]}
              </div>
              <span className="font-sans text-[10px] text-[#94A3B8]">{bug.assignee}</span>
            </div>

            {/* Due */}
            <div className="col-span-1 flex items-center space-x-1">
              <Clock className="h-3 w-3 text-[#4A5568]" />
              <span className={`font-mono text-[9px] ${bug.due.includes("Urgent") || bug.due.includes("ASAP") || bug.due.includes("Today") ? "text-[#FF5A5F]" : "text-[#94A3B8]"}`}>
                {bug.due.replace("Due: ", "")}
              </span>
            </div>

          </Link>
        ))}
      </div>

    </div>
  )
}
