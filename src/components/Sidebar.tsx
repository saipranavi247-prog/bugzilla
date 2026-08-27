import { auth, signOut } from "@/auth"
import Link from "next/link"
import { Button } from "./ui/button"
import { Bug, LayoutDashboard, List, Folder } from "lucide-react"

export default async function Sidebar() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <aside className="w-64 flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 text-sidebar-foreground">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 font-bold text-2xl text-primary">
          <Bug className="h-6 w-6" />
          <span>BugRadar</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium text-sm transition-colors">
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link href="/issues" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium text-sm transition-colors">
          <List className="h-4 w-4" />
          <span>Issues</span>
        </Link>
        <Link href="/issues/new" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium text-sm transition-colors text-primary">
          <Bug className="h-4 w-4" />
          <span>Report a Bug</span>
        </Link>
        <Link href="/projects" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium text-sm transition-colors">
          <Folder className="h-4 w-4" />
          <span>Projects</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <div className="px-3 text-sm font-medium text-gray-400 truncate">
          {session.user.email}
        </div>
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/auth" })
        }}>
          <Button variant="secondary" className="w-full justify-start" type="submit">Sign Out</Button>
        </form>
      </div>
    </aside>
  )
}
