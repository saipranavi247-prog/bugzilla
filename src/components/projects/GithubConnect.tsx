"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GitBranch, Loader2, Unlink } from "lucide-react"

export function GithubConnect({
  projectId,
  githubOwner,
  githubRepo,
}: {
  projectId: string
  githubOwner: string | null
  githubRepo: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [owner, setOwner] = useState("")
  const [repo, setRepo] = useState("")

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to connect repo")
        return
      }
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      await fetch(`/api/projects/${projectId}/github`, { method: "DELETE" })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (githubOwner && githubRepo) {
    return (
      <a
        href={`https://github.com/${githubOwner}/${githubRepo}`}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between text-xs bg-muted px-2 py-1.5 rounded-md group/gh hover:bg-muted/80"
      >
        <span className="flex items-center font-medium text-foreground truncate">
          <GitBranch className="h-3.5 w-3.5 mr-1.5 shrink-0" />
          {githubOwner}/{githubRepo}
        </span>
        <button
          type="button"
          disabled={loading}
          onClick={handleDisconnect}
          className="opacity-0 group-hover/gh:opacity-100 text-muted-foreground hover:text-destructive ml-2 shrink-0"
          title="Disconnect"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
        </button>
      </a>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        }
      >
        <GitBranch className="h-3.5 w-3.5 mr-1.5" /> Connect GitHub repo
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-card border-border" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-foreground">Connect a GitHub repo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleConnect} className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Requires your account to be signed in with GitHub. A webhook will be created on the repo so
            issues and comments stay in sync live.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Owner</label>
              <Input required value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="octocat" className="bg-background" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Repo</label>
              <Input required value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="my-repo" className="bg-background" />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-primary text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Connect
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
