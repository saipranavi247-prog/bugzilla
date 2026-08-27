import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const status = searchParams.get("status")
  const severity = searchParams.get("severity")
  const assigneeId = searchParams.get("assigneeId")
  const componentId = searchParams.get("componentId")

  try {
    const issues = await prisma.issue.findMany({
      where: {
        AND: [
          q ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { issueKey: { contains: q } }
            ]
          } : {},
          status ? { status } : {},
          severity ? { severity } : {},
          assigneeId ? { assigneeId } : {},
          componentId ? { componentId } : {}
        ]
      },
      include: {
        assignee: { select: { name: true, email: true } },
        reporter: { select: { name: true, email: true } },
        project: { select: { key: true, name: true } },
        component: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error("Failed to fetch issues:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { 
      title, 
      stepsToReproduce, 
      expectedResult, 
      actualResult, 
      projectId, 
      severity, 
      priority, 
      environment, 
      componentId, 
      versionId, 
      milestoneId 
    } = data

    // Combine structured fields into a rich markdown description
    let description = ""
    if (stepsToReproduce && stepsToReproduce.length > 0) {
      description += "### Steps to Reproduce\n"
      stepsToReproduce.forEach((step: string, i: number) => {
        description += `${i + 1}. ${step}\n`
      })
      description += "\n"
    }
    if (expectedResult) {
      description += "### Expected Result\n" + expectedResult + "\n\n"
    }
    if (actualResult) {
      description += "### Actual Result\n" + actualResult + "\n\n"
    }
    // Fallback if it was created from the old modal
    if (data.description && !stepsToReproduce) {
      description = data.description
    }

    // Generate Issue Key (mock logic: PROJECTKEY-COUNT)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { _count: { select: { issues: true } } }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const nextIssueNumber = project._count.issues + 1
    const issueKey = `${project.key}-${nextIssueNumber}`

    // Fetch initial state for the workflow
    const initialState = await prisma.workflowState.findFirst({
      where: { projectId, isInitial: true }
    })

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        issueKey,
        projectId,
        componentId: componentId && componentId !== "none" ? componentId : null,
        versionId: versionId && versionId !== "none" ? versionId : null,
        milestoneId: milestoneId && milestoneId !== "none" ? milestoneId : null,
        severity: severity || "normal",
        priority: priority || "p2",
        environment: environment || null,
        status: initialState?.name || "NEW",
        reporterId: session.user.id as string,
      }
    })

    // Log the creation
    await prisma.auditLog.create({
      data: {
        issueId: issue.id,
        userId: session.user.id as string,
        action: "CREATED",
        changes: JSON.stringify({ status: issue.status, title, severity, priority, componentId })
      }
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error("Failed to create issue:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
