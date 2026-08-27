"use client"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge, SeverityBadge } from "./Badges"
import { User, MessageSquare } from "lucide-react"

export function BugTable({ issues, selectedIds, onSelect, onSelectAll }: { 
  issues: any[], 
  selectedIds?: string[], 
  onSelect?: (id: string, checked: boolean) => void,
  onSelectAll?: (checked: boolean) => void
}) {
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-border border-dashed text-center">
        <p className="text-muted-foreground text-lg">No bugs found.</p>
      </div>
    )
  }

  const allSelected = issues.length > 0 && selectedIds?.length === issues.length

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {onSelectAll && (
              <TableHead className="w-12 text-center">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)} 
                />
              </TableHead>
            )}
            <TableHead className="w-24 font-bold text-foreground">Bug ID</TableHead>
            <TableHead className="font-bold text-foreground">Summary</TableHead>
            <TableHead className="w-32 font-bold text-foreground">Status</TableHead>
            <TableHead className="w-32 font-bold text-foreground">Severity</TableHead>
            <TableHead className="w-40 font-bold text-foreground">Assignee</TableHead>
            <TableHead className="w-32 text-right font-bold text-foreground">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
              {onSelect && (
                <TableCell className="w-12 text-center" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedIds?.includes(issue.id)} 
                    onCheckedChange={(checked) => onSelect(issue.id, checked as boolean)} 
                  />
                </TableCell>
              )}
              <TableCell className="font-mono text-xs font-semibold text-primary">
                <Link href={`/issues/${issue.issueKey}`} className="hover:underline">
                  {issue.issueKey}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Link href={`/issues/${issue.issueKey}`} className="font-medium text-foreground hover:text-primary transition-colors truncate max-w-md">
                    {issue.title}
                  </Link>
                  <div className="flex items-center space-x-2 mt-1 opacity-60">
                    <span className="text-[10px] uppercase tracking-wider">{issue.project?.name || "Unknown"}</span>
                    {issue._count?.comments > 0 && (
                      <span className="flex items-center text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" /> {issue._count.comments}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={issue.status} />
              </TableCell>
              <TableCell>
                <SeverityBadge severity={issue.severity} />
              </TableCell>
              <TableCell>
                {issue.assignee ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {issue.assignee.name?.[0] || issue.assignee.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                      {issue.assignee.name || issue.assignee.email.split('@')[0]}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic flex items-center">
                    <User className="h-3 w-3 mr-1 opacity-50" /> Unassigned
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
