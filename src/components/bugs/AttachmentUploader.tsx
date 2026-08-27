"use client"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, File } from "lucide-react"

export default function AttachmentUploader() {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Attachments (Optional)</label>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40 bg-card'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2 text-muted-foreground">
          <UploadCloud className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">Drag & drop files here, or click to select</p>
          <p className="text-xs">Supports Images, Logs, Patches (Max 10MB)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {files.map((file, i) => (
            <div key={i} className="relative group bg-card border border-border rounded-lg p-2 flex items-center space-x-2">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="h-10 w-10 object-cover rounded" />
              ) : (
                <div className="h-10 w-10 bg-muted flex items-center justify-center rounded">
                  <File className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 truncate text-xs text-foreground">
                {file.name}
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
