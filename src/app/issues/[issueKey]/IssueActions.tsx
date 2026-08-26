"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function IssueActions({ issue, currentUser }: { issue: any, currentUser: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const currentStateDef = issue.project.workflows.find((w: any) => w.name === issue.status)
  let allowedTransitions: string[] = []
  
  if (currentStateDef) {
    try {
      allowedTransitions = JSON.parse(currentStateDef.allowedTransitions || "[]")
    } catch (e) {}
  }

  const handleTransition = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/issues/${issue.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (allowedTransitions.length === 0) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          {loading ? "Updating..." : "Transition State"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {allowedTransitions.map(status => (
          <DropdownMenuItem key={status} onClick={() => handleTransition(status)}>
            Mark as {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
