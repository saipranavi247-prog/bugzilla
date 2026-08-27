import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BugForm from "@/components/bugs/BugForm"
import { Bug } from "lucide-react"

export default async function ReportBugPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const projects = await prisma.project.findMany({
    include: {
      components: true,
      versions: true,
      milestones: true
    }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-xl text-primary">
          <Bug className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Report a Bug</h1>
          <p className="text-muted-foreground">Log a new defect into BugRadar.</p>
        </div>
      </div>

      <BugForm projects={projects} />
    </div>
  )
}
