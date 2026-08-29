import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { createWebhook, deleteWebhook, getRepo, GithubApiError } from "@/lib/github"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  try {
    const { owner, repo } = await req.json()
    if (!owner || !repo) {
      return NextResponse.json({ error: "owner and repo are required" }, { status: 400 })
    }

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id as string } })
    if (!dbUser?.githubAccessToken) {
      return NextResponse.json(
        { error: "Connect your GitHub account first (sign in with GitHub) before linking a repo." },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Verify the repo exists and is accessible with this token
    await getRepo(dbUser.githubAccessToken, owner, repo)

    const webhookSecret = crypto.randomBytes(32).toString("hex")
    const hook = await createWebhook(dbUser.githubAccessToken, owner, repo, webhookSecret)

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        githubOwner: owner,
        githubRepo: repo,
        githubWebhookId: String(hook.id),
        githubWebhookSecret: webhookSecret,
        githubConnectedById: dbUser.id
      }
    })

    return NextResponse.json({
      githubOwner: updated.githubOwner,
      githubRepo: updated.githubRepo
    })
  } catch (error) {
    console.error("Failed to connect GitHub repo:", error)
    if (error instanceof GithubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status === 404 ? 404 : 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.githubOwner && project.githubRepo && project.githubWebhookId) {
      const connector = project.githubConnectedById
        ? await prisma.user.findUnique({ where: { id: project.githubConnectedById } })
        : null
      if (connector?.githubAccessToken) {
        await deleteWebhook(connector.githubAccessToken, project.githubOwner, project.githubRepo, project.githubWebhookId)
      }
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        githubOwner: null,
        githubRepo: null,
        githubWebhookId: null,
        githubWebhookSecret: null,
        githubConnectedById: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to disconnect GitHub repo:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
