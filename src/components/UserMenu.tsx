"use client"

import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import { 
  ChevronDown, 
  User, 
  ClipboardList, 
  History, 
  Settings, 
  SunMoon, 
  LogOut,
  CheckCircle2,
  ShieldCheck
} from "lucide-react"

interface UserMenuProps {
  session: any
}

export default function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const userName = session?.user?.name || "Triveni Reddy"
  const userEmail = session?.user?.email || "trivenib238@gmail.com"
  const userInitial = userName.charAt(0).toUpperCase()

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Badge Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-card-midnight-light border-2 border-black p-1.5 px-3 rounded-xl flat-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
      >
        <div className="h-7 w-7 rounded-lg bg-orange-600 border border-black flex items-center justify-center font-bold text-white text-sm">
          {userInitial}
        </div>
        <span className="font-sans font-bold text-sm text-white hidden sm:inline-block">
          {userName.split(" ")[0]}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Pinned Sticky Note Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 ruled-paper border-4 border-black p-5 rounded-2xl flat-shadow-lg z-50 text-paper-ink rotate-[-0.5deg]">
          
          {/* Pinned tape strip at top */}
          <div className="absolute top-[-10px] left-1/3 right-1/3 h-5 tape-strip flex items-center justify-center rotate-1 select-none pointer-events-none">
            <span className="font-mono text-[8px] text-gray-500 font-semibold">Triveni Session</span>
          </div>

          <div className="flex flex-col items-center border-b border-black/10 pb-4 mb-4 mt-2">
            {/* Large user avatar circle */}
            <div className="h-16 w-16 rounded-full bg-orange-600 border-3 border-black flex items-center justify-center text-white text-2xl font-bold flat-shadow select-none mb-3">
              {userInitial}
            </div>
            
            {/* User credentials */}
            <h3 className="font-sans font-bold text-lg leading-tight">{userName}</h3>
            <span className="font-mono text-xs text-gray-600 truncate max-w-full">{userEmail}</span>

            {/* Stamp Badges */}
            <div className="flex items-center space-x-2 mt-3 select-none">
              <span className="flex items-center text-[10px] font-sans font-bold bg-[#34D399] text-emerald-950 border border-black px-2 py-0.5 rounded-full rotate-[-1.5deg]">
                <CheckCircle2 className="h-3 w-3 mr-1 shrink-0 text-emerald-950" /> Google Verified
              </span>
              <span className="flex items-center text-[10px] font-sans font-bold bg-[#FBBF24] text-yellow-950 border border-black px-2 py-0.5 rounded-full rotate-[1deg]">
                <ShieldCheck className="h-3 w-3 mr-1 shrink-0 text-yellow-950" /> Sprint Detective
              </span>
            </div>
          </div>

          {/* Action Links */}
          <ul className="space-y-1 font-cursive text-lg font-bold mb-4">
            <li>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg hover:bg-black/5 text-left cursor-pointer"
              >
                <User className="h-4 w-4 text-paper-ink" />
                <span>My Workspace</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg hover:bg-black/5 text-left cursor-pointer"
              >
                <ClipboardList className="h-4 w-4 text-paper-ink" />
                <span>Assigned Bugs</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg hover:bg-black/5 text-left cursor-pointer"
              >
                <History className="h-4 w-4 text-paper-ink" />
                <span>Activity Timeline</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg hover:bg-black/5 text-left cursor-pointer"
              >
                <Settings className="h-4 w-4 text-paper-ink" />
                <span>Settings</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-lg hover:bg-black/5 text-left cursor-pointer"
              >
                <SunMoon className="h-4 w-4 text-paper-ink" />
                <span>Theme Toggle</span>
              </button>
            </li>
          </ul>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/auth" })}
            className="w-full flex items-center justify-center space-x-2 bg-card-midnight text-white border-2 border-black py-2 rounded-xl flat-shadow hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all font-sans font-bold text-xs uppercase cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout Session</span>
          </button>

        </div>
      )}
    </div>
  )
}
