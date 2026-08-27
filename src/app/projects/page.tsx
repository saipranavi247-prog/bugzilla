import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Folder } from "lucide-react"
import Link from "next/link"
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog"

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { issues: true }
      }
    }
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
            <Folder className="mr-3 h-8 w-8 text-primary" />
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">Manage and view all your software projects.</p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map(project => (
          <Link key={project.id} href={`/issues?project=${project.id}`} className="block">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full flex flex-col">
              <h3 className="text-xl font-bold text-foreground">{project.name}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">{project.key}</p>
              
              <p className="text-muted-foreground mt-4 text-sm flex-1">{project.description}</p>
              
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Issues</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{project._count.issues}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center p-12 border border-dashed border-border rounded-xl mt-8">
          <p className="text-muted-foreground">No projects found. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
