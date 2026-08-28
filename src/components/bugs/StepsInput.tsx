"use client"
import { useFieldArray, Control } from "react-hook-form"
import { BugFormValues } from "@/lib/validations/bug"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

export default function StepsInput({ control }: { control: Control<BugFormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore - RHF types restrict useFieldArray to arrays of objects, but it works with primitives in simple cases
    name: "stepsToReproduce",
  })

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Steps to Reproduce</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start space-x-2">
          <div className="mt-2 text-sm text-muted-foreground w-6 font-mono">{index + 1}.</div>
          <Input 
            {...control.register(`stepsToReproduce.${index}` as const)} 
            placeholder={`Step ${index + 1}`}
            className="flex-1"
          />
          {fields.length > 1 && (
            <Button variant="ghost" size="icon" onClick={() => remove(index)} className="mt-0.5 text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={() => append("")}
        className="mt-2 border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Step
      </Button>
    </div>
  )
}
