"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateIssueDialog({ projects }: { projects: any[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: projects[0]?.id || "",
    componentId: "none",
    versionId: "none",
    milestoneId: "none",
    severity: "normal",
    priority: "medium"
  })

  // Derive available components, versions, milestones based on selected project
  const selectedProject = projects.find(p => p.id === formData.projectId)
  const components = selectedProject?.components || []
  const versions = selectedProject?.versions || []
  const milestones = selectedProject?.milestones || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Convert "none" back to empty/null for API payload
    const payload = { ...formData }
    if (payload.componentId === "none") delete (payload as any).componentId
    if (payload.versionId === "none") delete (payload as any).versionId
    if (payload.milestoneId === "none") delete (payload as any).milestoneId

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setOpen(false)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAITriage = async () => {
    if (!formData.description) return
    setFormData(prev => ({
      ...prev,
      severity: prev.description.toLowerCase().includes("crash") ? "critical" : "normal",
      priority: prev.description.toLowerCase().includes("urgent") ? "high" : "medium",
      title: prev.title || "Auto-generated title from description..."
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Issue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Issue</DialogTitle>
            <DialogDescription>
              Report a bug or feature request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select value={formData.projectId} onValueChange={v => setFormData({...formData, projectId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.key})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Description</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAITriage}>
                  ✨ AI Triage Suggest
                </Button>
              </div>
              <Textarea 
                className="h-32"
                placeholder="Describe the issue..." 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required 
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Component</label>
                <Select value={formData.componentId} onValueChange={v => setFormData({...formData, componentId: v})}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {components.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Version</label>
                <Select value={formData.versionId} onValueChange={v => setFormData({...formData, versionId: v})}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {versions.map((v: any) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Milestone</label>
                <Select value={formData.milestoneId} onValueChange={v => setFormData({...formData, milestoneId: v})}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {milestones.map((m: any) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={formData.severity} onValueChange={v => setFormData({...formData, severity: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>Create Issue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
