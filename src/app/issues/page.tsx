import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import CreateIssueDialog from "./CreateIssueDialog"

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const { q, status } = await searchParams

  const issues = await prisma.issue.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { title: { contains: q } },
            { issueKey: { contains: q } }
          ]
        } : {},
        status ? { status } : {}
      ]
    },
    include: {
      assignee: true,
      reporter: true,
      project: true,
    },
    orderBy: { createdAt: "desc" }
  })

  const projects = await prisma.project.findMany({
    include: {
      components: true,
      versions: true,
      milestones: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
          <p className="text-gray-500">Manage and track software defects.</p>
        </div>
        <CreateIssueDialog projects={projects} />
      </div>

      <div className="flex items-center space-x-2">
        <form className="flex items-center space-x-2 w-full max-w-sm">
          <Input name="q" placeholder="Search issues..." defaultValue={q} />
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Key</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                  No issues found.
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <Link href={`/issues/${issue.issueKey}`} className="text-blue-600 hover:underline">
                      {issue.issueKey}
                    </Link>
                  </TableCell>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        issue.status === "RESOLVED" || issue.status === "VERIFIED" || issue.status === "CLOSED" 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }
                    >
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        issue.severity === "critical" 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      }
                    >
                      {issue.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.reporter.name}</TableCell>
                  <TableCell>{issue.assignee?.name || "Unassigned"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
