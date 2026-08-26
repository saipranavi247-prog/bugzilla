import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Bugzilla (Modern)</h1>
        <p className="text-xl text-gray-500 text-center max-w-2xl">
          A structured, auditable, collaborative bug tracking platform rebuilt for modern teams with AI-assisted triage and developer-first ergonomics.
        </p>
        <Link href="/login">
          <Button size="lg">Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {session.user.name || session.user.email}. Here's what's happening.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Open Issues</h3>
          </div>
          <div className="text-2xl font-bold">12</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Assigned to Me</h3>
          </div>
          <div className="text-2xl font-bold">4</div>
        </div>
      </div>
    </div>
  )
}
