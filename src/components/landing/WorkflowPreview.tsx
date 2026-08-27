"use client"
import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const WORKFLOW_STATES = ["NEW", "ASSIGNED", "IN PROGRESS", "RESOLVED", "VERIFIED"]

export default function WorkflowPreview() {
  const [activeStateIndex, setActiveStateIndex] = useState(0)

  // Simple animation loop for the workflow states
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStateIndex((prev) => (prev + 1) % WORKFLOW_STATES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="preview" className="w-full py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Strict, Project-Specific Workflows</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bugs don't just disappear. Ensure every defect follows a rigorous lifecycle from triage to verification.
          </p>
        </div>

        <div className="relative p-6 md:p-12 rounded-3xl bg-card border border-border">
          {/* Animated Bug Card moving through states */}
          <div className="flex flex-row items-center justify-start md:justify-between gap-4 relative z-10 overflow-x-auto pb-6 -mb-6 hide-scrollbar">
            {WORKFLOW_STATES.map((state, index) => {
              const isActive = index === activeStateIndex
              const isPast = index < activeStateIndex
              
              return (
                <div key={state} className="flex flex-row items-center shrink-0">
                  <div className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-500 min-w-[120px]
                    ${isActive ? 'border-primary bg-primary/10 scale-105 shadow-lg shadow-primary/20' : 
                      isPast ? 'border-green-500/50 bg-green-500/5 text-muted-foreground' : 
                      'border-border bg-background text-muted-foreground'}
                  `}>
                    <span className={`text-xs font-bold mb-1 ${isActive ? 'text-primary' : isPast ? 'text-green-500' : ''}`}>
                      {state}
                    </span>
                    {isActive && (
                      <div className="mt-2 w-full h-1 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
                      </div>
                    )}
                    {isPast && <CheckCircle2 className="mt-2 h-5 w-5 text-green-500" />}
                  </div>
                  
                  {index < WORKFLOW_STATES.length - 1 && (
                    <ArrowRight className={`
                      mx-2 md:mx-4 h-5 w-5 md:h-6 md:w-6 transition-colors duration-500 shrink-0
                      ${isActive ? 'text-primary' : isPast ? 'text-green-500' : 'text-muted-foreground/30'}
                    `} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
