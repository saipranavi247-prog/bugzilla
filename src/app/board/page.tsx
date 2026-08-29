import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

interface KanbanCard {
  id: string; key: string; priority: "P1" | "P2" | "P3"
  title: string; tag: string; status: string
  due: string; assignee: string
}

const COLUMNS: { id: string; label: string; emoji: string; color: string; glow: string; cards: KanbanCard[] }[] = [
  {
    id: "backlog", label: "Open Cases", emoji: "📂", color: "#94A3B8", glow: "rgba(148,163,184,0.2)",
    cards: []
  },
  {
    id: "todo", label: "Investigating", emoji: "🔍", color: "#FFD54A", glow: "rgba(255,213,74,0.2)",
    cards: [
      { id: "kb-1", key: "DT-1030", priority: "P2", title: "Subgrid nested track alignment collapses to zero height on flex child", tag: "Layout", status: "MAJOR", due: "Due Friday", assignee: "P" },
      { id: "kb-2", key: "DT-1055", priority: "P2", title: "HTTP/3 QUIC connection migration drops UDP stream packets", tag: "Network", status: "MAJOR", due: "Due Friday", assignee: "M" },
    ]
  },
  {
    id: "inprogress", label: "Under Review", emoji: "⚡", color: "#34E1FF", glow: "rgba(52,225,255,0.2)",
    cards: [
      { id: "kb-3", key: "DT-1024", priority: "P1", title: "Heap use-after-free in V8-to-DOM wrapper during concurrent GC cycle", tag: "V8-Bindings", status: "BLOCKER", due: "Due Urgent", assignee: "A" },
    ]
  },
  {
    id: "review", label: "Solved", emoji: "✅", color: "#36F097", glow: "rgba(54,240,151,0.2)",
    cards: []
  },
]

const statusColor: Record<string, string> = {
  BLOCKER: "badge-critical",
  CRITICAL: "badge-critical",
  MAJOR: "badge-warning",
  NORMAL: "badge-info",
}

export default async function BoardPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">Evidence Board</h1>
          <p className="font-mono text-[11px] text-[#4A5568] mt-0.5">Drag cases between investigation stages</p>
        </div>
        <Link href="/report-bug" className="flex items-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)]">
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>Add Case</span>
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 min-h-[500px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            {/* Column header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color, boxShadow: `0 0 6px ${col.color}` }} />
                <span className="font-sans font-bold text-sm" style={{ color: col.color }}>
                  {col.label}
                </span>
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border" style={{
                color: col.color,
                borderColor: col.color + "40",
                background: col.color + "15"
              }}>
                {col.cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 rounded-2xl p-3 space-y-3 min-h-[400px]"
              style={{ background: "#0D1324", border: `1px solid ${col.color}20` }}>

              {col.cards.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="font-mono text-[10px] text-[#1E2D4A] mb-1">CLEAR COLUMN</div>
                  <div className="font-mono text-[9px] text-[#1E2D4A]">No active cases</div>
                </div>
              ) : (
                col.cards.map((card) => (
                  <Link key={card.id} href={`/issues/${card.key}`}
                    className="block p-4 rounded-xl border transition-all group cursor-pointer hover:scale-[1.01]"
                    style={{
                      background: "#121A2E",
                      borderColor: "#1E2D4A",
                    }}
                  >
                    {/* ID + priority */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="id-chip">{card.key}</span>
                      <span className={card.priority === "P1" ? "p1-stamp" : card.priority === "P2" ? "p2-stamp" : "p3-stamp"}>
                        {card.priority}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="font-sans text-[11px] text-[#94A3B8] group-hover:text-[#F8FAFC] leading-snug mb-3 transition-colors">
                      {card.title}
                    </p>

                    {/* Tag */}
                    <div className="flex items-center mb-3">
                      <span className="font-mono text-[8px] text-[#34E1FF] bg-[#34E1FF]/8 border border-[#34E1FF]/15 rounded px-1.5 py-0.5">
                        {card.tag}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-[#1E2D4A] pt-3">
                      <span className={statusColor[card.status] || "badge-info"}>{card.status}</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#34E1FF]/30 to-[#8B5CF6]/30 border border-[#34E1FF]/20 flex items-center justify-center text-[8px] font-bold text-[#34E1FF]">
                          {card.assignee}
                        </div>
                        <span className="font-mono text-[8px] text-[#FF5A5F]">{card.due}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
