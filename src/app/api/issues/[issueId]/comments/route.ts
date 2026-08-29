import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { createGithubIssueComment } from "@/lib/github"

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
    const { content } = data

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        issueId,
        userId: session.user.id as string
      },
      include: {
        author: true
      }
    })

    // Best-effort sync to the linked GitHub issue, if this project/issue is connected
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true }
    })

    if (issue?.githubIssueNumber && issue.project.githubOwner && issue.project.githubRepo) {
      const author = await prisma.user.findUnique({ where: { id: session.user.id as string } })
      const connector = issue.project.githubConnectedById
        ? await prisma.user.findUnique({ where: { id: issue.project.githubConnectedById } })
        : null
      const token = author?.githubAccessToken || connector?.githubAccessToken

      if (token) {
        try {
          const ghComment = await createGithubIssueComment(
            token,
            issue.project.githubOwner,
            issue.project.githubRepo,
            issue.githubIssueNumber,
            `**${author?.name || "BugRadar user"}** commented on BugRadar [${issue.issueKey}]:\n\n${content}`
          )
          await prisma.comment.update({
            where: { id: comment.id },
            data: { githubCommentId: String(ghComment.id) }
          })
        } catch (err) {
          console.error("Failed to sync comment to GitHub:", err)
        }
      }
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Failed to create comment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
