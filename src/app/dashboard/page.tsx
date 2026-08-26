import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import DashboardCharts from "./DashboardCharts"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const totalIssues = await prisma.issue.count()
  const openIssues = await prisma.issue.count({
    where: { status: { not: "CLOSED" } }
  })
  
  // Group by status for a pie chart
  const issuesByStatus = await prisma.issue.groupBy({
    by: ['status'],
    _count: { status: true }
  })
  
  const statusData = issuesByStatus.map(s => ({
    name: s.status,
    value: s._count.status
  }))

  // Group by severity for a bar chart
  const issuesBySeverity = await prisma.issue.groupBy({
    by: ['severity'],
    _count: { severity: true }
  })

  const severityData = issuesBySeverity.map(s => ({
    name: s.severity,
    count: s._count.severity
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-500">Component health, throughput, and bug aging.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIssues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalIssues > 0 ? Math.round(((totalIssues - openIssues) / totalIssues) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts statusData={statusData} severityData={severityData} />
    </div>
  )
}
