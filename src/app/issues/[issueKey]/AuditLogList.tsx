"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export default function AuditLogList({ logs }: { logs: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map(log => {
            const changes = JSON.parse(log.changes || "{}")
            return (
              <div key={log.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{log.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  {log.action === "CREATED" ? (
                    <span>Created the issue</span>
                  ) : log.action === "TRANSITION" ? (
                    <span>Changed status to <span className="font-semibold">{changes.status}</span></span>
                  ) : (
                    <span>Updated issue fields</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
