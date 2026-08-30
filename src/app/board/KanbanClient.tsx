"use client"

import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/components/ToastProvider"

type Issue = {
  id: string
  issueKey: string
  title: string
  status: string
  priority: string
  severity: string
  component: { name: string } | null
  assignee: { name: string } | null
}

const COLUMNS = [
  { id: "OPEN", label: "Open Cases", color: "#94A3B8" },
  { id: "IN_PROGRESS", label: "Investigating", color: "#FFD54A" },
  { id: "REVIEW", label: "Under Review", color: "#34E1FF" },
  { id: "RESOLVED", label: "Solved", color: "#36F097" },
  { id: "CLOSED", label: "Closed", color: "#FF5A5F" }
]

export default function KanbanClient({ initialIssues }: { initialIssues: Issue[] }) {
  const [issues, setIssues] = useState(initialIssues)
  const { addToast } = useToast()
  
  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    e.dataTransfer.setData("issueId", issueId)
  }

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const issueId = e.dataTransfer.getData("issueId")
    if (!issueId) return

    const issue = issues.find(i => i.id === issueId)
    if (!issue || issue.status === status) return

    // Optimistic update
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status } : i))

    try {
      const res = await fetch(`/api/issues/${issueId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (!res.ok) {
        throw new Error("Failed to transition issue")
      }
      
      addToast({
        title: "CASE UPDATED",
        message: `${issue.issueKey} moved to ${status.replace("_", " ")}`,
        type: "info"
      })
    } catch (err) {
      console.error(err)
      // Revert on failure
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: issue.status } : i))
      addToast({
        title: "UPDATE FAILED",
        message: "Could not move issue. Verify workflow transitions.",
        type: "critical"
      })
    }
  }

  // Group issues by column
  const groupedIssues = COLUMNS.map(col => ({
    ...col,
    cards: issues.filter(i => {
      // Map unknown statuses to OPEN
      const known = COLUMNS.find(c => c.id === i.status)
      if (!known && col.id === "OPEN") return true
      return i.status === col.id
    })
  }))

  return (
    <div className="flex-1 overflow-x-auto pb-4">
      <div className="flex space-x-5 min-h-[500px]" style={{ minWidth: "1200px" }}>
        {groupedIssues.map((col) => (
          <div 
            key={col.id} 
            className="flex flex-col flex-1"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.id)}
          >
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
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className="block p-4 rounded-xl border transition-all group cursor-grab active:cursor-grabbing hover:scale-[1.01]"
                    style={{
                      background: "#121A2E",
                      borderColor: "#1E2D4A",
                    }}
                  >
                    <Link href={`/issues/${card.issueKey}`}>
                      {/* ID + priority */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E2D4A]/50 text-[#94A3B8]">{card.issueKey}</span>
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#FF5A5F]/30 text-[#FF5A5F] bg-[#FF5A5F]/10">
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
                          {card.component?.name || "General"}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-[#1E2D4A] pt-3">
                        <span className="font-mono text-[9px] text-[#FFD54A] border border-[#FFD54A]/30 bg-[#FFD54A]/10 px-2 py-0.5 rounded-full">{card.severity.toUpperCase()}</span>
                        <div className="flex items-center space-x-2">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#34E1FF]/30 to-[#8B5CF6]/30 border border-[#34E1FF]/20 flex items-center justify-center text-[8px] font-bold text-[#34E1FF]" title={card.assignee?.name || "Unassigned"}>
                            {card.assignee?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
