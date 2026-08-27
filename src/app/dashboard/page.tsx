import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardCharts from "./DashboardCharts"
import BugAgingWidget from "./BugAgingWidget"
import { Calendar } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const issues = await prisma.issue.findMany({
    include: { assignee: true, project: true }
  })

  // Basic stats
  const total = issues.length
  const open = issues.filter(i => !['RESOLVED', 'CLOSED', 'VERIFIED'].includes(i.status)).length
  const critical = issues.filter(i => i.severity === 'critical').length

  // Generate Status data for pie chart
  const statusMap = issues.reduce((acc: any, cur) => {
    acc[cur.status] = (acc[cur.status] || 0) + 1
    return acc
  }, {})
  const statusData = Object.keys(statusMap).map(k => ({ name: k, value: statusMap[k] }))

  // Generate Severity data for bar chart
  const severityMap = issues.reduce((acc: any, cur) => {
    acc[cur.severity] = (acc[cur.severity] || 0) + 1
    return acc
  }, {})
  const severityData = Object.keys(severityMap).map(k => ({ name: k, count: severityMap[k] }))

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session.user.name || session.user.email}. Here's the current state of BugRadar.</p>
        </div>
        <div className="flex items-center space-x-2 bg-card border border-border px-4 py-2 rounded-lg text-sm text-muted-foreground cursor-pointer hover:bg-muted/50">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Last 30 Days</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Issues</h3>
          <div className="text-3xl font-bold text-foreground">{total}</div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Open Issues</h3>
          <div className="text-3xl font-bold text-blue-500">{open}</div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Critical Bugs</h3>
          <div className="text-3xl font-bold text-red-500">{critical}</div>
        </div>
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Resolution Rate</h3>
          <div className="text-3xl font-bold text-green-500">{total > 0 ? Math.round(((total - open) / total) * 100) : 0}%</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <DashboardCharts statusData={statusData} severityData={severityData} />
        </div>
        <div className="col-span-1">
          <BugAgingWidget bugs={issues} />
        </div>
      </div>
    </div>
  )
}
