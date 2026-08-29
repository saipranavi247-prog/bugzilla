import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyWebhookSignature } from "@/lib/github"

async function findProject(owner: string, repo: string) {
  return prisma.project.findFirst({
    where: {
      githubOwner: { equals: owner },
      githubRepo: { equals: repo }
    },
    include: { workflows: true }
  })
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-hub-signature-256")
  const event = req.headers.get("x-github-event")

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const owner = payload.repository?.owner?.login
  const repo = payload.repository?.name
  if (!owner || !repo) {
    return NextResponse.json({ error: "Missing repository info" }, { status: 400 })
  }

  const project = await findProject(owner, repo)
  if (!project || !project.githubWebhookSecret) {
    return NextResponse.json({ error: "Unknown repository" }, { status: 404 })
  }

  if (!verifyWebhookSignature(rawBody, signature, project.githubWebhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  if (event === "ping") {
    return NextResponse.json({ ok: true })
  }

  const systemUserId = project.githubConnectedById

  try {
    if (event === "issues") {
      const action = payload.action
      const ghIssue = payload.issue

      if (action === "opened") {
        const existing = await prisma.issue.findFirst({
          where: { projectId: project.id, githubIssueNumber: ghIssue.number }
        })
        if (!existing && systemUserId) {
          const count = await prisma.issue.count({ where: { projectId: project.id } })
          const initialState = project.workflows.find(w => w.isInitial)
          await prisma.issue.create({
            data: {
              issueKey: `${project.key}-${count + 1}`,
              title: ghIssue.title,
              description: ghIssue.body || "",
              status: initialState?.name || "NEW",
              projectId: project.id,
              reporterId: systemUserId,
              githubIssueNumber: ghIssue.number,
              githubIssueUrl: ghIssue.html_url
            }
          })
        }
      } else if (action === "edited") {
        await prisma.issue.updateMany({
          where: { projectId: project.id, githubIssueNumber: ghIssue.number },
          data: { title: ghIssue.title, description: ghIssue.body || "" }
        })
      } else if (action === "closed" || action === "reopened") {
        const targetState = action === "closed"
          ? project.workflows.find(w => w.isTerminal)?.name || "CLOSED"
          : project.workflows.find(w => w.isInitial)?.name || "NEW"
        await prisma.issue.updateMany({
          where: { projectId: project.id, githubIssueNumber: ghIssue.number },
          data: { status: targetState }
        })
      }
    } else if (event === "issue_comment") {
      const action = payload.action
      const ghIssue = payload.issue
      const ghComment = payload.comment

      if (action === "created" && systemUserId) {
        const localIssue = await prisma.issue.findFirst({
          where: { projectId: project.id, githubIssueNumber: ghIssue.number }
        })
        if (localIssue) {
          const alreadySynced = await prisma.comment.findFirst({
            where: { issueId: localIssue.id, githubCommentId: String(ghComment.id) }
          })
          if (!alreadySynced) {
            await prisma.comment.create({
              data: {
                issueId: localIssue.id,
                userId: systemUserId,
                content: `**@${ghComment.user.login}** commented on GitHub:\n\n${ghComment.body}`,
                githubCommentId: String(ghComment.id)
              }
            })
          }
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to process GitHub webhook:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
