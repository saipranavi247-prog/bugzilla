"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, Bug, Terminal, Settings, Users, LineChart, Brain, Palette, CheckCircle, Crosshair } from "lucide-react"

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    
    // Also listen for custom events from Navbar
    const handleOpen = () => setOpen(true)
    document.addEventListener("open-command-palette", handleOpen)
    
    return () => {
      document.removeEventListener("keydown", down)
      document.removeEventListener("open-command-palette", handleOpen)
    }
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  // Pre-defined routes and actions
  const routes = [
    { name: "Dashboard", href: "/dashboard", icon: LineChart, shortcut: "O" },
    { name: "Investigations", href: "/issues", icon: Bug, shortcut: "I" },
    { name: "Evidence Board", href: "/board", icon: Crosshair, shortcut: "B" },
    { name: "AI Detective", href: "/ai-assistant", icon: Brain, shortcut: "A" },
    { name: "Squad", href: "/team", icon: Users, shortcut: "S" },
    { name: "Settings", href: "/settings", icon: Settings, shortcut: "," },
    { name: "Doodle Canvas", href: "/doodle-canvas", icon: Palette, shortcut: "D" },
  ]

  const mockBugs = [
    { id: "DT-1024", title: "Heap use-after-free in V8-to-DOM wrapper", status: "CRITICAL" },
    { id: "DT-1030", title: "Subgrid nested track alignment collapses", status: "MAJOR" },
    { id: "DT-1045", title: "Raft split-brain candidate state deadlock", status: "CRITICAL" },
    { id: "DT-1055", title: "HTTP/3 QUIC connection migration drops UDP", status: "MAJOR" },
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-[#050816]/80 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
      
      <div className="relative bg-[#0D1324] border border-[#34E1FF]/30 rounded-2xl shadow-[0_0_50px_rgba(52,225,255,0.15)] w-full max-w-2xl overflow-hidden holo-card-cyan">
        
        <Command label="Global Command Menu" className="w-full flex flex-col" shouldFilter={true}>
          
          <div className="flex items-center border-b border-[#1E2D4A] px-4 py-3" cmdk-input-wrapper="">
            <Terminal className="mr-3 h-5 w-5 shrink-0 text-[#34E1FF]" />
            <Command.Input 
              value={query}
              onValueChange={setQuery}
              placeholder="Search cases, developers, or run commands..." 
              className="flex h-8 w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#4A5568] outline-none font-mono"
              autoFocus
            />
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <span className="font-mono text-[9px] bg-[#121A2E] text-[#94A3B8] border border-[#1E2D4A] px-1.5 py-0.5 rounded">ESC</span>
            </div>
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-3 scrollbar-thin">
            <Command.Empty className="py-10 text-center text-sm font-mono text-[#4A5568]">
              NO MATCHES FOUND IN DATABASE.
            </Command.Empty>
            
            <Command.Group heading="NAVIGATION" className="px-2 text-[9px] font-mono font-bold text-[#4A5568] uppercase tracking-widest mb-2">
              {routes.map(route => {
                const Icon = route.icon
                return (
                  <Command.Item 
                    key={route.name}
                    value={route.name}
                    onSelect={() => runCommand(() => router.push(route.href))}
                    className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm text-[#94A3B8] hover:bg-[#34E1FF]/10 hover:text-[#34E1FF] transition-all aria-selected:bg-[#34E1FF]/10 aria-selected:text-[#34E1FF] group mt-1"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4" />
                      <span className="font-sans font-semibold">{route.name}</span>
                    </div>
                    {route.shortcut && (
                      <div className="flex items-center space-x-1">
                        <span className="font-mono text-[9px] bg-[#050816] text-[#4A5568] border border-[#1E2D4A] group-hover:border-[#34E1FF]/30 px-1.5 py-0.5 rounded">⌘</span>
                        <span className="font-mono text-[9px] bg-[#050816] text-[#4A5568] border border-[#1E2D4A] group-hover:border-[#34E1FF]/30 px-1.5 py-0.5 rounded">{route.shortcut}</span>
                      </div>
                    )}
                  </Command.Item>
                )
              })}
            </Command.Group>

            <div className="my-2 h-px bg-[#1E2D4A]" />

            <Command.Group heading="ACTIVE INVESTIGATIONS" className="px-2 text-[9px] font-mono font-bold text-[#4A5568] uppercase tracking-widest mb-2">
              {mockBugs.map(bug => (
                <Command.Item 
                  key={bug.id} 
                  value={`${bug.id} ${bug.title}`}
                  onSelect={() => runCommand(() => router.push(`/issues/${bug.id}`))}
                  className="flex cursor-pointer flex-col justify-center rounded-xl px-3 py-2 text-sm hover:bg-[#121A2E] transition-all aria-selected:bg-[#121A2E] mt-1 border border-transparent aria-selected:border-[#1E2D4A]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#34E1FF] font-bold">{bug.id}</span>
                    <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                      bug.status === "CRITICAL" ? "text-[#FF5A5F] bg-[#FF5A5F]/10 border-[#FF5A5F]/30" : "text-[#FFA726] bg-[#FFA726]/10 border-[#FFA726]/30"
                    }`}>
                      {bug.status}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-[#F8FAFC] truncate">{bug.title}</span>
                </Command.Item>
              ))}
            </Command.Group>

          </Command.List>
        </Command>

      </div>
    </div>
  )
}
