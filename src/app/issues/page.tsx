import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Search, TableProperties, KanbanSquare, Save } from "lucide-react"
import { BugTable } from "@/components/bugs/shared/BugTable"
import { Input } from "@/components/ui/input"

export default async function IssuesPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  const issues = await prisma.issue.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      assignee: true,
      reporter: true,
      project: true,
      _count: { select: { comments: true } }
    },
    take: 50 // Pagination placeholder
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Issues</h1>
          <p className="text-muted-foreground">View and manage all tracked bugs.</p>
        </div>
        <Link href="/issues/new">
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Report a Bug
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex flex-1 items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search issues..." className="pl-9 bg-background border-border" />
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex border-border text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground">
            <Save className="mr-2 h-4 w-4" /> Save View
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 bg-background border border-border p-1 rounded-lg">
          <Button variant="ghost" size="sm" className="bg-muted text-foreground px-3 h-7 rounded-md">
            <TableProperties className="h-4 w-4 mr-2" /> Table
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-3 h-7 rounded-md">
            <KanbanSquare className="h-4 w-4 mr-2" /> Kanban
          </Button>
        </div>
      </div>

      {/* Table Data */}
      <BugTable issues={issues} />
      
    </div>
  )
}
