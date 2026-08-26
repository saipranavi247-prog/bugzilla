import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import IssueActions from "./IssueActions"
import CommentsList from "./CommentsList"
import AuditLogList from "./AuditLogList"

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ issueKey: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { issueKey } = await params

  const issue = await prisma.issue.findUnique({
    where: { issueKey },
    include: {
      assignee: true,
      reporter: true,
      project: { include: { workflows: true } },
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      auditLogs: { include: { user: true }, orderBy: { createdAt: "desc" } }
    }
  })

  if (!issue) notFound()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>{issue.project.name}</span>
            <span>/</span>
            <span>{issue.issueKey}</span>
          </div>
          <h1 className="text-3xl font-bold">{issue.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant="outline">{issue.status}</Badge>
          <IssueActions issue={issue} currentUser={session.user as any} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            {/* In a real app, use a Markdown renderer like ReactMarkdown here */}
            <div className="whitespace-pre-wrap">{issue.description}</div>
          </CardContent>
        </Card>

        <CommentsList issueId={issue.id} comments={issue.comments} currentUser={session.user as any} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Assignee</span>
              <span>{issue.assignee?.name || "Unassigned"}</span>
              
              <span className="text-gray-500">Reporter</span>
              <span>{issue.reporter.name}</span>

              <span className="text-gray-500">Severity</span>
              <span>{issue.severity}</span>

              <span className="text-gray-500">Priority</span>
              <span>{issue.priority}</span>

              <span className="text-gray-500">Created</span>
              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <AuditLogList logs={issue.auditLogs} />
      </div>
    </div>
  )
}
