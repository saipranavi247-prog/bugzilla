import { Badge } from "@/components/ui/badge"

export const STATUS_COLORS: Record<string, string> = {
  "NEW": "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  "ASSIGNED": "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20",
  "IN PROGRESS": "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  "RESOLVED": "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  "VERIFIED": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20",
  "CLOSED": "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20",
}

export const SEVERITY_COLORS: Record<string, string> = {
  "blocker": "bg-red-600/10 text-red-600 border-red-600/20 hover:bg-red-600/20",
  "critical": "bg-orange-600/10 text-orange-600 border-orange-600/20 hover:bg-orange-600/20",
  "major": "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  "normal": "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  "minor": "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20",
  "trivial": "bg-slate-400/10 text-slate-400 border-slate-400/20 hover:bg-slate-400/20",
}

export function StatusBadge({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status.toUpperCase()] || "bg-primary/10 text-primary border-primary/20"
  return (
    <Badge variant="outline" className={`font-semibold uppercase tracking-wider text-[10px] ${colorClass}`}>
      {status}
    </Badge>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const colorClass = SEVERITY_COLORS[severity.toLowerCase()] || "bg-primary/10 text-primary border-primary/20"
  return (
    <Badge variant="outline" className={`font-semibold capitalize tracking-wider text-[10px] ${colorClass}`}>
      {severity}
    </Badge>
  )
}
