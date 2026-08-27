"use client"
import { AlertCircle } from "lucide-react"

export default function DuplicateSuggestions({ title }: { title: string }) {
  // Mock client-side heuristic to find duplicates based on title keywords
  const showWarning = title.toLowerCase().includes("crash") || title.toLowerCase().includes("login")

  if (!showWarning || title.length < 5) return null

  return (
    <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4 flex items-start space-x-3 mb-6">
      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-orange-500">Possible Duplicates Found</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Before you submit, please check if this issue has already been reported:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <a href="#" className="text-primary hover:underline font-medium">BUG-142</a>
            <span className="text-muted-foreground ml-2">App crashes on login screen after update</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
