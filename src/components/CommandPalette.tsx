"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search } from "lucide-react"

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      fetch(`/api/issues?q=${query}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setResults(data)
        })
    } else {
      setResults([])
    }
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200">
        <Command label="Command Menu" className="w-full flex flex-col" shouldFilter={false}>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input 
              value={query}
              onValueChange={setQuery}
              placeholder="Search issues (type at least 3 chars)..." 
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            {query.length > 2 && results.length === 0 && <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>}
            
            {results.length > 0 && (
              <Command.Group heading="Issues" className="px-2 text-xs font-medium text-gray-500">
                {results.map(issue => (
                  <Command.Item 
                    key={issue.id} 
                    onSelect={() => {
                      setOpen(false)
                      router.push(`/issues/${issue.issueKey}`)
                    }}
                    className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 aria-selected:bg-gray-100 aria-selected:text-gray-900"
                  >
                    <span className="font-semibold mr-2">{issue.issueKey}</span>
                    <span className="truncate">{issue.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
      {/* Background overlay click to close */}
      <div className="absolute inset-0 -z-10" onClick={() => setOpen(false)}></div>
    </div>
  )
}
