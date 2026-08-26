import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

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
