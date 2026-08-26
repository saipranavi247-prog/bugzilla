import { auth, signOut } from "@/auth"
import Link from "next/link"
import { Button } from "./ui/button"

export default async function Navbar() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Bugzilla
        </Link>
        <Link href="/projects" className="text-sm font-medium hover:text-blue-600">
          Projects
        </Link>
        <Link href="/issues" className="text-sm font-medium hover:text-blue-600">
          Issues
        </Link>
        <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
          Dashboard
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">{session.user.email}</span>
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}>
          <Button variant="outline" size="sm" type="submit">Sign Out</Button>
        </form>
      </div>
    </nav>
  )
}
