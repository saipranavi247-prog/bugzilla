import NotebookWorkspace from "@/components/NotebookWorkspace"

export const metadata = {
  title: "BugStudio - Developer Notebook",
  description: "A retro-tactile handcrafted developer notebook for BugRadar.",
}

export default function BugStudioPage() {
  return (
    <div className="-m-8 overflow-hidden min-h-screen">
      <NotebookWorkspace />
    </div>
  )
}
