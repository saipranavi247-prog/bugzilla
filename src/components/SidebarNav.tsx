"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bug, LayoutDashboard, List, Folder } from "lucide-react"

export function SidebarNav() {
  const pathname = usePathname()

  const links = [
    { href: "/projects", label: "Projects", icon: Folder },
    { href: "/report-bug", label: "Report a Bug", icon: Bug },
    { href: "/issues", label: "Issues", icon: List },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]

  return (
    <nav className="flex-1 px-4 space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
        const Icon = link.icon
        
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-sm transition-colors
              ${isActive 
                ? "bg-sidebar-accent text-primary" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
