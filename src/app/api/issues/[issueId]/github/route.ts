import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { createGithubIssue, GithubApiError } from "@/lib/github"

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
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true }
    })

    if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    if (issue.githubIssueNumber) {
      return NextResponse.json({ error: "Issue is already linked to GitHub" }, { status: 409 })
    }
    if (!issue.project.githubOwner || !issue.project.githubRepo) {
      return NextResponse.json({ error: "Project is not connected to a GitHub repo" }, { status: 400 })
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id as string } })
    if (!dbUser?.githubAccessToken) {
      return NextResponse.json(
        { error: "Connect your GitHub account first (sign in with GitHub) to push issues." },
        { status: 400 }
      )
    }

    const body = `${issue.description}\n\n---\n_Synced from BugRadar [${issue.issueKey}]_`
    const ghIssue = await createGithubIssue(
      dbUser.githubAccessToken,
      issue.project.githubOwner,
      issue.project.githubRepo,
      `[${issue.issueKey}] ${issue.title}`,
      body
    )

    const updated = await prisma.issue.update({
      where: { id: issueId },
      data: {
        githubIssueNumber: ghIssue.number,
        githubIssueUrl: ghIssue.html_url
      }
    })

    await prisma.auditLog.create({
      data: {
        issueId,
        userId: session.user.id as string,
        action: "GITHUB_PUSHED",
        changes: JSON.stringify({ githubIssueNumber: ghIssue.number, githubIssueUrl: ghIssue.html_url })
      }
    })

    return NextResponse.json({ githubIssueNumber: updated.githubIssueNumber, githubIssueUrl: updated.githubIssueUrl })
  } catch (error) {
    console.error("Failed to push issue to GitHub:", error)
    if (error instanceof GithubApiError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
