import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { setGithubIssueState } from "@/lib/github"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { issueId } = await params

  try {
    const data = await req.json()
    const { status } = data

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: { include: { workflows: true } } }
    })

    if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 })

    if (issue.githubIssueNumber && issue.project.githubOwner && issue.project.githubRepo) {
      const newStateDef = issue.project.workflows.find(w => w.name === status)
      if (newStateDef?.isTerminal || newStateDef?.isInitial) {
        const connector = issue.project.githubConnectedById
          ? await prisma.user.findUnique({ where: { id: issue.project.githubConnectedById } })
          : null
        if (connector?.githubAccessToken) {
          try {
            await setGithubIssueState(
              connector.githubAccessToken,
              issue.project.githubOwner,
              issue.project.githubRepo,
              issue.githubIssueNumber,
              newStateDef.isTerminal ? "closed" : "open"
            )
          } catch (err) {
            console.error("Failed to sync issue state to GitHub:", err)
          }
        }
      }
    }

    const currentStateDef = issue.project.workflows.find(w => w.name === issue.status)
    if (currentStateDef) {
      const allowed = JSON.parse(currentStateDef.allowedTransitions || "[]")
      if (!allowed.includes(status)) {
        return NextResponse.json({ error: "Invalid transition" }, { status: 400 })
      }
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { status }
    })

    await prisma.auditLog.create({
      data: {
        issueId,
        userId: session.user.id as string,
        action: "TRANSITION",
        changes: JSON.stringify({ status: updatedIssue.status, previousStatus: issue.status })
      }
    })

    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error("Failed to transition issue:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
