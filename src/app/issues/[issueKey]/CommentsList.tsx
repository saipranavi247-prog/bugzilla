"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CommentsList({ issueId, comments, currentUser }: { issueId: string, comments: any[], currentUser: any }) {
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment })
      })
      if (res.ok) {
        setNewComment("")
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Comments</h3>
      <div className="space-y-4">
        {comments.map(comment => (
          <Card key={comment.id}>
            <CardHeader className="py-3 px-4 bg-gray-50 flex flex-row items-center space-y-0 space-x-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-sm font-medium">{comment.author.name}</div>
              <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <div className="whitespace-pre-wrap text-sm">{comment.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="pt-4 space-y-2">
        <Textarea 
          placeholder="Add a comment..." 
          value={newComment} 
          onChange={e => setNewComment(e.target.value)} 
        />
        <Button onClick={handleSubmit} disabled={loading || !newComment.trim()}>Post Comment</Button>
      </div>
    </div>
  )
}
