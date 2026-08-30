"use client"

import { useState } from "react"
import { Camera, FileText, Paperclip } from "lucide-react"

export default function CommentsSection({ issueId, initialComments }: { issueId: string, initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  // Parse mentions in text
  const renderContent = (text: string) => {
    return text.split(/(@\w+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-[#34E1FF] font-bold bg-[#34E1FF]/10 px-1 rounded">{part}</span>
      }
      return part
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        setContent(prev => prev + `\n[Attachment: ${data.filename}](${data.url})`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) return

    // Optimistic comment addition
    const newComment = {
      id: Math.random().toString(),
      content,
      createdAt: new Date(),
      author: { name: "You" }
    }
    setComments(prev => [...prev, newComment])
    setContent("")

    // In a real app, POST to /api/issues/:id/comments
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <div className="h-8 w-8 rounded-lg bg-[#34E1FF]/20 border border-[#34E1FF]/40 shrink-0 flex items-center justify-center font-bold text-xs text-[#34E1FF]">
            {comment.author.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-sans font-bold text-sm text-[#F8FAFC]">{comment.author.name}</span>
              <span className="font-mono text-[9px] text-[#4A5568]">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="font-sans text-xs text-[#94A3B8] whitespace-pre-wrap">
              {renderContent(comment.content)}
            </p>
          </div>
        </div>
      ))}

      {/* Input */}
      <div className="mt-6 flex items-start gap-3">
        <div className="flex-1 bg-[#050816] border border-[#1E2D4A] focus-within:border-[#34E1FF]/40 rounded-xl p-3 transition-all relative">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder-[#4A5568] outline-none resize-none h-16 font-mono"
            placeholder="Use @username to mention or attach files..."
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <label className="text-[#4A5568] hover:text-[#34E1FF] cursor-pointer">
                <Paperclip className="h-4 w-4" />
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={!content.trim() || isUploading}
              className="bg-[#34E1FF]/10 text-[#34E1FF] border border-[#34E1FF]/20 px-4 py-1.5 rounded-lg font-mono text-[9px] hover:bg-[#34E1FF]/20 disabled:opacity-50"
            >
              {isUploading ? "UPLOADING..." : "SUBMIT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
