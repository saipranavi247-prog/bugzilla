import { auth, signOut } from "@/auth"
import Link from "next/link"
import { Button } from "./ui/button"
import { Bug, LayoutDashboard, List, Folder } from "lucide-react"

import { SidebarNav } from "./SidebarNav"

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

      <SidebarNav />

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
