import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, key, description } = await req.json()

    if (!name || !key) {
      return NextResponse.json({ error: "Name and Key are required" }, { status: 400 })
    }

    // Check if project key exists
    const existing = await prisma.project.findUnique({
      where: { key }
    })
    
    if (existing) {
      return NextResponse.json({ error: "Project key already exists" }, { status: 409 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        key,
        description: description || "",
      }
    })

    // Seed default workflow states for this project
    await prisma.workflowState.createMany({
      data: [
        { name: "NEW", projectId: project.id, isInitial: true, isFinal: false, color: "blue", order: 0 },
        { name: "ASSIGNED", projectId: project.id, isInitial: false, isFinal: false, color: "purple", order: 1 },
        { name: "IN PROGRESS", projectId: project.id, isInitial: false, isFinal: false, color: "yellow", order: 2 },
        { name: "RESOLVED", projectId: project.id, isInitial: false, isFinal: true, color: "green", order: 3 },
        { name: "VERIFIED", projectId: project.id, isInitial: false, isFinal: true, color: "green", order: 4 },
        { name: "CLOSED", projectId: project.id, isInitial: false, isFinal: true, color: "gray", order: 5 },
      ]
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
