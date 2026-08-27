import { z } from "zod"

export const bugFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be under 100 characters"),
  projectId: z.string().min(1, "Please select a product"),
  componentId: z.string().optional(),
  versionId: z.string().optional(),
  
  stepsToReproduce: z.array(z.string().min(1, "Step cannot be empty")).min(1, "At least one step is required"),
  expectedResult: z.string().min(5, "Expected result is required"),
  actualResult: z.string().min(5, "Actual result is required"),
  
  severity: z.enum(["blocker", "critical", "major", "normal", "minor", "trivial"]).default("normal"),
  priority: z.enum(["p0", "p1", "p2", "p3", "p4"]).default("p2"),
  
  environment: z.string().optional(),
  
  labels: z.array(z.string()).optional(),
  assigneeId: z.string().optional(),
  relatedBugId: z.string().optional(),

  attachments: z.array(z.any()).optional() // In a real app, this would validate files
})

export type BugFormValues = z.infer<typeof bugFormSchema>

// The API payload shape sent to POST /api/bugs (or /api/issues)
// Note: We flatten the rich text fields into a single Markdown description for backwards compatibility with our schema,
// or we can store them natively if we migrate the DB. For now, the payload matches exactly this shape.
export type CreateBugPayload = BugFormValues
