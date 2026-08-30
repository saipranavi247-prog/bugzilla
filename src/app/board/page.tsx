import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

import { prisma } from "@/lib/prisma"
import KanbanClient from "./KanbanClient"

export default async function BoardPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  // Fetch issues
  const issues = await prisma.issue.findMany({
    include: {
      component: true,
      assignee: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  // Map to the shape expected by KanbanClient
  const formattedIssues = issues.map(issue => ({
    id: issue.id,
    issueKey: issue.issueKey,
    title: issue.title,
    status: issue.status,
    priority: issue.priority,
    severity: issue.severity,
    component: issue.component ? { name: issue.component.name } : null,
    assignee: issue.assignee ? { name: issue.assignee.name } : null,
  }))

  return (
    <div className="p-8 space-y-6 max-w-[95%] mx-auto h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">Evidence Board</h1>
          <p className="font-mono text-[11px] text-[#4A5568] mt-0.5">Drag cases between investigation stages</p>
        </div>
        <Link href="/report-bug" className="flex items-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)] hover:shadow-[0_0_30px_rgba(255,213,74,0.5)]">
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Add Case</span>
        </Link>
      </div>

      {/* Kanban Board */}
      <KanbanClient initialIssues={formattedIssues} />
    </div>
  )
}
