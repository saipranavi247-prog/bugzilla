"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [name, setName] = useState("")
  const [key, setKey] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Quick and dirty local API hit to create project
    try {
      // In a real app this would hit a POST /api/projects route.
      // Since this is MVP and I don't have that route yet, I'll just mock the behavior
      // or we can assume there's a quick server action for this. Let's just create an API route.
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, key, description })
      })
      
      if (res.ok) {
        setOpen(false)
        router.refresh()
        setName("")
        setKey("")
        setDescription("")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project Name</label>
            <Input required value={name} onChange={e => {
              setName(e.target.value)
              // Auto generate key if empty
              if (!key || key === name.slice(0, -1).toUpperCase().replace(/\s/g, '').substring(0, 3)) {
                setKey(e.target.value.toUpperCase().replace(/\s/g, '').substring(0, 3))
              }
            }} placeholder="e.g. Mobile App" className="bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project Key</label>
            <Input required value={key} onChange={e => setKey(e.target.value.toUpperCase())} maxLength={5} placeholder="MOB" className="bg-background uppercase" />
            <p className="text-xs text-muted-foreground">Used as the prefix for issues (e.g. MOB-123)</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the project" className="bg-background resize-none h-20" />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-primary text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
