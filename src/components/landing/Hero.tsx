"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowRight, Play } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Radar Animation Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20">
        <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute inset-16 rounded-full border border-primary/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
        <div className="absolute inset-32 rounded-full border border-primary/10 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]" />
        {/* Radar sweep */}
        <div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent to-primary origin-left animate-spin [animation-duration:3s]" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
          <ShieldAlert className="mr-2 h-4 w-4" />
          <span>BugRadar 2.0 is now live</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
            Exterminate bugs. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
              Accelerate delivery.
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground">
            Structured, collaborative, fast bug tracking for dev teams. Escape the chaos of generic issue boards with a tool built specifically for software defects.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Link href="/auth" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full transition-all hover:scale-105">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#preview" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full h-14 px-8 text-lg rounded-full border-muted-foreground/30 hover:bg-secondary">
              <Play className="mr-2 h-5 w-5" />
              See it in action
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
