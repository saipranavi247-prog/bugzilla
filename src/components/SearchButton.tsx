"use client"

import { Search } from "lucide-react"

export default function SearchButton() {
  const openCommandPalette = () => {
    document.dispatchEvent(new CustomEvent("open-command-palette"))
  }

  return (
    <button
      onClick={openCommandPalette}
      className="flex-1 max-w-xs flex items-center space-x-3 bg-[#121A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 rounded-xl px-4 py-2 text-sm text-[#4A5568] hover:text-[#94A3B8] transition-all group"
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-[#34E1FF]/40 group-hover:text-[#34E1FF]/70" />
      <span>Search sketchnotes, bug IDs, tags…</span>
      <div className="ml-auto flex items-center space-x-1 hidden sm:flex">
        <kbd className="font-mono text-[9px] bg-[#050816] border border-[#1E2D4A] text-[#94A3B8] px-1.5 py-0.5 rounded">⌘</kbd>
        <kbd className="font-mono text-[9px] bg-[#050816] border border-[#1E2D4A] text-[#94A3B8] px-1.5 py-0.5 rounded">K</kbd>
      </div>
    </button>
  )
}
