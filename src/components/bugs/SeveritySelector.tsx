"use client"
import { BugFormValues } from "@/lib/validations/bug"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { ShieldAlert, AlertTriangle, AlertCircle, Info, Hash } from "lucide-react"

const SEVERITIES = [
  { id: "blocker", label: "Blocker", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-600/10", border: "border-red-600" },
  { id: "critical", label: "Critical", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-600/10", border: "border-orange-600" },
  { id: "major", label: "Major", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500" },
  { id: "normal", label: "Normal", icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500" },
  { id: "minor", label: "Minor", icon: Hash, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500" },
  { id: "trivial", label: "Trivial", icon: Hash, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400" },
]

export default function SeveritySelector({ 
  setValue, 
  watch 
}: { 
  setValue: UseFormSetValue<BugFormValues>, 
  watch: UseFormWatch<BugFormValues> 
}) {
  const currentSeverity = watch("severity")

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Severity</label>
      <div className="flex flex-wrap gap-3">
        {SEVERITIES.map((sev) => {
          const isSelected = currentSeverity === sev.id
          return (
            <button
              key={sev.id}
              type="button"
              onClick={() => setValue("severity", sev.id as any)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                ${isSelected ? `${sev.border} ${sev.bg} scale-[1.02]` : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/40'}
              `}
            >
              <sev.icon className={`h-4 w-4 ${isSelected ? sev.color : ''}`} />
              <span className={`text-sm font-semibold ${isSelected ? sev.color : ''}`}>
                {sev.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
