import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BugTable } from "@/components/bugs/shared/BugTable"
import { Save, Download, X, Search as SearchIcon } from "lucide-react"

export default async function SearchPage({ searchParams }: { searchParams: { q?: string, severity?: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const query = searchParams.q || ""
  
  // Simple search implementation
  const issues = await prisma.issue.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { issueKey: { contains: query } },
        { description: { contains: query } }
      ]
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      assignee: true,
      reporter: true,
      project: true,
      _count: { select: { comments: true } }
    }
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <SearchIcon className="mr-3 h-8 w-8 text-primary" />
            Search Results
          </h1>
          <p className="text-muted-foreground mt-1">Found {issues.length} bugs matching your criteria.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Search
          </Button>
          <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-card p-4 rounded-xl border border-border">
        <span className="text-sm font-medium text-muted-foreground mr-2">Active Filters:</span>
        {query && (
          <div className="flex items-center bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium">
            Search: &quot;{query}&quot;
            <button className="ml-2 hover:bg-primary/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
          </div>
        )}
        <div className="flex items-center bg-orange-600/10 text-orange-600 border border-orange-600/20 px-3 py-1 rounded-full text-sm font-medium">
          Severity: Critical
          <button className="ml-2 hover:bg-orange-600/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
        </div>
        <div className="flex items-center bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">
          Status: Open
          <button className="ml-2 hover:bg-blue-500/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground ml-auto">
          Clear All
        </Button>
      </div>

      {/* Table Data */}
      <BugTable issues={issues} />
      
    </div>
  )
}
