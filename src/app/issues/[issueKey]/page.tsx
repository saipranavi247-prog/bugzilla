import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import IssueActions from "./IssueActions"
import CommentsList from "./CommentsList"
import AuditLogList from "./AuditLogList"
import { StatusBadge, SeverityBadge } from "@/components/bugs/shared/Badges"
import { User, Eye, Link as LinkIcon, Paperclip } from "lucide-react"

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
      component: true,
      version: true,
      milestone: true,
      project: { include: { workflows: true } },
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      auditLogs: { include: { user: true }, orderBy: { createdAt: "desc" } }
    }
  })

  if (!issue) notFound()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-12">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
            <span className="font-semibold">{issue.project.name}</span>
            <span>/</span>
            <span className="font-semibold text-primary">{issue.issueKey}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground leading-tight">{issue.title}</h1>
        </div>

        <div className="flex items-center space-x-4 pb-4 border-b border-border/50">
          <StatusBadge status={issue.status} />
          <IssueActions issue={issue} currentUser={session.user as any} />
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
             Description
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h3:text-lg prose-h3:mt-6 prose-a:text-primary">
            {/* In a real app, use ReactMarkdown. Since we structured it with ### headings in the API, we can pre-wrap it or use a simple HTML converter. For now, white-space pre-wrap works ok, but let's make it look slightly better by rendering simple markdown manually. */}
            {issue.description.split('\n').map((line, i) => {
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-bold mt-6 mb-2">{line.replace('### ', '')}</h3>
              }
              return <p key={i} className="mb-2 text-muted-foreground">{line}</p>
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
             <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" /> Attachments
          </h3>
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm">
            No attachments yet.
          </div>
        </div>

        <CommentsList issueId={issue.id} comments={issue.comments} currentUser={session.user as any} />
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="bg-muted/50 p-4 border-b border-border font-semibold text-foreground">
            People
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Assignee</span>
              <span className="font-medium flex items-center">
                {issue.assignee ? issue.assignee.name : <span className="italic text-muted-foreground flex items-center"><User className="h-3 w-3 mr-1" /> Unassigned</span>}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Reporter</span>
              <span className="font-medium">{issue.reporter.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Watchers</span>
              <span className="font-medium flex items-center bg-muted px-2 py-1 rounded-md cursor-pointer hover:bg-muted/80">
                <Eye className="h-3 w-3 mr-1" /> 2
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="bg-muted/50 p-4 border-b border-border font-semibold text-foreground">
            Details
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Severity</span>
              <SeverityBadge severity={issue.severity} />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Priority</span>
              <span className="font-bold uppercase tracking-wider text-[10px] bg-muted px-2 py-1 rounded-md">{issue.priority}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Component</span>
              <span className="font-medium">{issue.component?.name || "None"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">{issue.version?.name || "None"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="bg-muted/50 p-4 border-b border-border font-semibold text-foreground flex items-center justify-between">
            <span>Related Bugs</span>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 text-sm text-muted-foreground italic text-center">
            No related issues linked.
          </div>
        </div>

        <AuditLogList logs={issue.auditLogs} />
      </div>
    </div>
  )
}
