"use client"
import { formatDistanceToNow } from "date-fns"
import { AlertTriangle, Clock } from "lucide-react"

export default function BugAgingWidget({ bugs }: { bugs: any[] }) {
  // Simple "aging bugs" logic: open bugs sorted oldest first
  const openBugs = bugs.filter(b => !["RESOLVED", "VERIFIED", "CLOSED"].includes(b.status))
  const agingBugs = [...openBugs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, 5)

  if (agingBugs.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5 text-orange-500" />
          Aging Bugs
        </h3>
        <span className="text-xs font-medium bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
          Needs Attention
        </span>
      </div>
      
      <div className="space-y-4 flex-1">
        {agingBugs.map(bug => {
          const daysOld = Math.floor((new Date().getTime() - new Date(bug.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          return (
            <div key={bug.id} className="flex flex-col justify-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <a href={`/issues/${bug.issueKey}`} className="text-sm font-medium hover:underline hover:text-primary truncate pr-4">
                  {bug.issueKey}: {bug.title}
                </a>
                <span className={`text-xs font-bold whitespace-nowrap ${daysOld > 30 ? 'text-red-500' : 'text-orange-500'}`}>
                  {daysOld} days old
                </span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-3">
                <span>Assignee: {bug.assignee?.name || "Unassigned"}</span>
                <span className="uppercase text-[10px] bg-muted px-1.5 py-0.5 rounded">{bug.status}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
