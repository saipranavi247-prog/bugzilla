"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bugFormSchema, BugFormValues } from "@/lib/validations/bug"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrainCircuit, Loader2 } from "lucide-react"

import StepsInput from "./StepsInput"
import SeveritySelector from "./SeveritySelector"
import AttachmentUploader from "./AttachmentUploader"
import DuplicateSuggestions from "./DuplicateSuggestions"

export default function BugForm({ projects }: { projects: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<BugFormValues>({
    resolver: zodResolver(bugFormSchema),
    defaultValues: {
      title: "",
      projectId: projects[0]?.id || "",
      stepsToReproduce: [""],
      expectedResult: "",
      actualResult: "",
      severity: "normal",
      priority: "p2"
    }
  })

  // Watch for smart-detect
  const title = watch("title")
  const projectId = watch("projectId")

  // Auto-save logic (Mocked via local storage)
  useEffect(() => {
    const draft = localStorage.getItem("bug_draft")
    if (draft) {
      // For a real app, populate default values here
    }
    const interval = setInterval(() => {
      // localStorage.setItem("bug_draft", JSON.stringify(watch()))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Derive taxonomy
  const selectedProject = projects.find(p => p.id === projectId)
  const components = selectedProject?.components || []
  const versions = selectedProject?.versions || []

  // Pre-fill environment on mount
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setValue("environment", navigator.userAgent)
    }
  }, [setValue])

  const handleAIAssist = () => {
    // Mock AI categorization
    if (title.toLowerCase().includes("crash")) {
      setValue("severity", "critical")
      setValue("priority", "p0")
    }
  }

  const onSubmit = async (data: BugFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        const json = await res.json()
        setSuccessId(json.issueKey)
        localStorage.removeItem("bug_draft")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-border text-center space-y-6">
        <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-2xl">✓</div>
        <h2 className="text-2xl font-bold text-foreground">Bug Reported Successfully</h2>
        <p className="text-muted-foreground">Issue <strong className="text-foreground">{successId}</strong> has been logged.</p>
        <div className="flex space-x-4">
          <Button onClick={() => router.push(`/issues/${successId}`)}>View Bug</Button>
          <Button variant="outline" onClick={() => { setSuccessId(null); setValue("title", ""); setValue("stepsToReproduce", [""]) }}>Report Another</Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      
      {/* 1. Basics */}
      <section className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">1. Basics</h2>
          <Button type="button" variant="outline" size="sm" onClick={handleAIAssist} className="text-primary border-primary/50 hover:bg-primary/10">
            <BrainCircuit className="h-4 w-4 mr-2" />
            AI Assist
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Summary</label>
          <div className="relative">
            <Input {...register("title")} placeholder="Short, descriptive summary of the issue" className={`pr-16 ${errors.title ? "border-destructive" : ""}`} />
            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">{title?.length || 0}/100</span>
          </div>
          {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
        </div>

        <DuplicateSuggestions title={title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>
            <Select onValueChange={v => setValue("projectId", v)} defaultValue={watch("projectId")}>
              <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
              <SelectContent>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.projectId && <p className="text-destructive text-sm">{errors.projectId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Component</label>
            <Select onValueChange={v => setValue("componentId", v)}>
              <SelectTrigger><SelectValue placeholder="Select Component" /></SelectTrigger>
              <SelectContent>
                {components.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Affected Version</label>
            <Select onValueChange={v => setValue("versionId", v)}>
              <SelectTrigger><SelectValue placeholder="Select Version" /></SelectTrigger>
              <SelectContent>
                {versions.map((v: any) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* 2. Repro Steps */}
      <section className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border">
        <h2 className="text-xl font-bold text-foreground">2. Reproduction</h2>
        
        <StepsInput control={control} />
        {errors.stepsToReproduce && <p className="text-destructive text-sm">{errors.stepsToReproduce.message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expected Result</label>
            <Textarea {...register("expectedResult")} placeholder="What should happen?" className="h-24" />
            {errors.expectedResult && <p className="text-destructive text-sm">{errors.expectedResult.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Actual Result</label>
            <Textarea {...register("actualResult")} placeholder="What actually happened?" className="h-24" />
            {errors.actualResult && <p className="text-destructive text-sm">{errors.actualResult.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Environment (Auto-detected)</label>
          <Input {...register("environment")} className="font-mono text-xs text-muted-foreground" />
        </div>
      </section>

      {/* 3. Classification */}
      <section className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border">
        <h2 className="text-xl font-bold text-foreground">3. Classification</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SeveritySelector setValue={setValue} watch={watch} />
          <div className="space-y-3">
            <label className="text-sm font-medium">Priority</label>
            <div className="flex gap-2">
              {["p0", "p1", "p2", "p3", "p4"].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setValue("priority", p as any)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors
                    ${watch("priority") === p ? "bg-primary text-white" : "bg-background border border-border text-muted-foreground hover:bg-secondary"}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Attachments */}
      <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
        <AttachmentUploader />
      </section>

      <div className="flex justify-end space-x-4 pb-12">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" size="lg" disabled={isSubmitting} className="px-8 bg-primary hover:bg-primary/90 text-white font-bold">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Bug Report
        </Button>
      </div>
    </form>
  )
}
