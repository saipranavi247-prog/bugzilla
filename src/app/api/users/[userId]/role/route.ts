import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = await params
  const { role } = await req.json()

  if (!["admin", "developer", "reporter"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
