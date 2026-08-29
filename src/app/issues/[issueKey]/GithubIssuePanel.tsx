"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GitBranch, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GithubIssuePanel({
  issueId,
  projectConnected,
  githubIssueNumber,
  githubIssueUrl,
}: {
  issueId: string
  projectConnected: boolean
  githubIssueNumber: number | null
  githubIssueUrl: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!projectConnected && !githubIssueNumber) return null

  const handlePush = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/issues/${issueId}/github`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to push to GitHub")
        return
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="bg-muted/50 p-4 border-b border-border font-semibold text-foreground flex items-center">
        <GitBranch className="h-4 w-4 mr-2" /> GitHub
      </div>
      <div className="p-4 space-y-3">
        {githubIssueNumber && githubIssueUrl ? (
          <a
            href={githubIssueUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-sm text-primary hover:underline font-medium"
          >
            <span>Issue #{githubIssueNumber}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Not linked to a GitHub issue yet.</p>
            <Button size="sm" variant="outline" className="w-full" disabled={loading} onClick={handlePush}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <GitBranch className="h-3.5 w-3.5 mr-2" />}
              Push to GitHub
            </Button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
