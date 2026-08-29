"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Bug,
  KanbanSquare,
  FileBarChart2,
  BarChart3,
  Bot,
  Users,
  Settings,
  Palette,
  GitFork,
  Shield,
  Crosshair,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Overview",       icon: LayoutDashboard, color: "cyan" },
  { href: "/issues",       label: "Investigations",  icon: Bug,             color: "red",  badge: 10 },
  { href: "/board",        label: "Evidence Board",  icon: KanbanSquare,    color: "yellow" },
  { href: "/reports",      label: "Reports",         icon: FileBarChart2,   color: "purple" },
  { href: "/analytics",    label: "Analytics Lab",   icon: BarChart3,       color: "cyan" },
  { href: "/ai-assistant", label: "AI Detective",    icon: Bot,             color: "green" },
  { href: "/team",         label: "Squad",           icon: Users,           color: "purple" },
  { href: "/github-sync",  label: "Integrations",    icon: GitFork,         color: "cyan" },
  { href: "/settings",     label: "Settings",        icon: Settings,        color: "yellow" },
  { href: "/doodle-canvas",label: "Doodle Canvas",   icon: Palette,         color: "purple" },
]

const colorMap: Record<string, string> = {
  cyan:   "text-[#34E1FF] bg-[#34E1FF]/10 border-[#34E1FF]/20",
  yellow: "text-[#FFD54A] bg-[#FFD54A]/10 border-[#FFD54A]/20",
  red:    "text-[#FF5A5F] bg-[#FF5A5F]/10 border-[#FF5A5F]/20",
  purple: "text-[#A78BFA] bg-[#8B5CF6]/10 border-[#8B5CF6]/20",
  green:  "text-[#36F097] bg-[#36F097]/10 border-[#36F097]/20",
}

const projectItems = [
  { name: "Quantum Engine",        count: 4, color: "#36F097" },
  { name: "Aether Distributed DB", count: 2, color: "#34E1FF" },
  { name: "CryptoVault Core",      count: 2, color: "#A78BFA" },
  { name: "HyperFlow Dev UI",      count: 2, color: "#FFD54A" },
]

export default function Sidebar() {
  const pathname = usePathname()

  if (pathname === "/" || pathname === "/auth" || pathname === "/bugstudio") return null

  return (
    <aside className="w-[220px] bg-[#0D1324] border-r border-[#1E2D4A] flex flex-col h-full shrink-0 select-none overflow-y-auto">

      {/* Section label */}
      <div className="px-4 pt-5 pb-2">
        <span className="font-mono text-[9px] font-bold text-[#4A5568] uppercase tracking-[0.15em]">
          Workspace Views
        </span>
      </div>

      {/* Main nav */}
      <nav className="px-3 space-y-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon
          const iconClass = colorMap[item.color]

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "sidebar-active"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#121A2E]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  isActive ? "bg-[#FFD54A]/20 border-[#FFD54A]/40 text-[#FFD54A]" : `${iconClass} border`
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className={isActive ? "text-[#FFD54A] font-bold" : ""}>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  isActive ? "bg-[#FFD54A]/20 text-[#FFD54A]" : "bg-[#FF5A5F]/15 text-[#FF5A5F] border border-[#FF5A5F]/30"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 cyber-divider" />

      {/* Components / Projects section */}
      <div className="px-4 pb-2">
        <span className="font-mono text-[9px] font-bold text-[#4A5568] uppercase tracking-[0.15em]">
          Components
        </span>
      </div>
      <div className="px-3 space-y-0.5 pb-3">
        <Link
          href="/issues"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#121A2E] transition-all"
        >
          <div className="h-7 w-7 rounded-lg border border-[#1E2D4A] bg-[#121A2E] flex items-center justify-center shrink-0">
            <Crosshair className="h-3.5 w-3.5 text-[#4A5568]" />
          </div>
          <span>All Projects</span>
        </Link>

        {projectItems.map((proj) => (
          <div
            key={proj.name}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#121A2E] transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: proj.color, boxShadow: `0 0 6px ${proj.color}66` }} />
              <span className="truncate">{proj.name}</span>
            </div>
            <span className="font-mono text-[9px] shrink-0 ml-1 text-[#4A5568] bg-[#121A2E] px-1.5 py-0.5 rounded-md">{proj.count}</span>
          </div>
        ))}
      </div>

      {/* XP Card at bottom */}
      <div className="mx-3 mb-4 p-3 holo-card-yellow rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-3.5 w-3.5 text-[#FFD54A]" />
          <span className="font-sans font-bold text-[10px] text-[#FFD54A]">Sprint Detective</span>
        </div>
        <div className="font-mono text-[10px] text-[#94A3B8] mb-2">Level 7 · 2,340 XP</div>
        <div className="w-full h-1 bg-[#1E2D4A] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FFD54A] to-[#F59E0B] rounded-full" style={{ width: "68%" }} />
        </div>
        <div className="font-mono text-[8px] text-[#4A5568] mt-1">680 / 1000 XP to Level 8</div>
      </div>

    </aside>
  )
}
