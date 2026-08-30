import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import UsersClient from "./UsersClient"

export default async function UsersSettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")
  if ((session.user as any).role !== "admin") {
    return <div className="p-8 text-white font-mono text-center mt-20">ACCESS DENIED. ADMIN ONLY.</div>
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, githubUsername: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="h-0.5 w-12 bg-[#FF5A5F] mb-3 rounded-full shadow-[0_0_8px_rgba(255,90,95,0.8)]" />
        <h1 className="font-sans font-bold text-2xl text-[#F8FAFC]">
          User <span className="text-[#FF5A5F]">Management</span>
        </h1>
        <p className="font-mono text-[11px] text-[#4A5568] mt-1">Manage team roles and system access</p>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  )
}
