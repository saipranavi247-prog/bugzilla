import Link from "next/link"
import { Bell, Zap, Terminal, Wifi } from "lucide-react"
import { auth } from "@/auth"
import SearchButton from "./SearchButton"

export default async function Navbar() {
  let session = null
  try {
    session = await auth()
  } catch (e) {
    console.error("Navbar auth error:", e)
  }

  return (
    <header className="h-16 bg-[#0D1324]/90 backdrop-blur-xl border-b border-[#1E2D4A] flex items-center px-6 gap-4 z-50 relative shrink-0">
      
      {/* Left: Logo */}
      <Link href="/" className="flex items-center space-x-3 shrink-0 group">
        <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-[#FFD54A] to-[#F59E0B] flex items-center justify-center shadow-[0_0_20px_rgba(255,213,74,0.4)]">
          <span className="text-[#050816] font-bold text-sm font-mono">BR</span>
        </div>
        <span className="font-sans font-bold text-base text-[#F8FAFC] tracking-tight group-hover:text-[#FFD54A] transition-colors">
          BugRadar
        </span>
        <span className="font-mono text-[9px] text-[#FFD54A]/60 border border-[#FFD54A]/20 px-1.5 py-0.5 rounded bg-[#FFD54A]/5">
          T-02
        </span>
      </Link>

      {/* Divider */}
      <div className="h-5 w-px bg-[#1E2D4A] shrink-0" />

      {/* Center: Search (Client Component) */}
      <SearchButton />

      {/* Right actions */}
      <div className="ml-auto flex items-center space-x-3">
        {session?.user ? (
          <>
            {/* New Bug button */}
            <Link
              href="/report-bug"
              className="flex items-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)] hover:shadow-[0_0_30px_rgba(255,213,74,0.5)] hover:scale-[1.02]"
            >
              <Zap className="h-3.5 w-3.5 stroke-[3]" />
              <span className="hidden sm:inline">+ New Case</span>
            </Link>

            {/* Terminal icon */}
            <button className="h-8 w-8 rounded-lg bg-[#121A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 flex items-center justify-center text-[#94A3B8] hover:text-[#34E1FF] transition-all">
              <Terminal className="h-3.5 w-3.5" />
            </button>

            {/* Live sync status */}
            <div className="hidden md:flex items-center space-x-1.5 bg-[#121A2E] border border-[#1E2D4A] rounded-xl px-3 py-1.5">
              <Wifi className="h-3 w-3 text-[#36F097]" />
              <span className="font-mono text-[9px] text-[#36F097]">LIVE</span>
            </div>

            {/* Notifications */}
            <button className="relative h-8 w-8 rounded-lg bg-[#121A2E] border border-[#1E2D4A] hover:border-[#FFD54A]/30 flex items-center justify-center text-[#94A3B8] hover:text-[#FFD54A] transition-all">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#FF5A5F] rounded-full text-white font-mono text-[8px] flex items-center justify-center border border-[#050816]">3</span>
            </button>

            {/* Profile chip */}
            <Link href="/profile" className="flex items-center space-x-2.5 bg-gradient-to-r from-[#121A2E] to-[#0D1324] border border-[#1E2D4A] hover:border-[#FFD54A]/40 rounded-xl px-3 py-1.5 transition-all group cursor-pointer">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#FF5A5F] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(255,90,95,0.4)] uppercase">
                {session.user.name ? session.user.name[0] : "D"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-sans font-bold text-xs text-[#F8FAFC] leading-none group-hover:text-[#FFD54A] transition-colors">
                  Profile
                </div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-[#36F097] shadow-[0_0_6px_rgba(54,240,151,0.8)]" />
            </Link>
          </>
        ) : (
          <Link
            href="/auth"
            className="flex items-center space-x-2 bg-[#34E1FF]/10 border border-[#34E1FF]/30 hover:border-[#34E1FF]/60 text-[#34E1FF] font-bold text-xs px-5 py-2 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(52,225,255,0.2)]"
          >
            Access Desk →
          </Link>
        )}
      </div>
    </header>
  )
}
