import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"

import Hero from "@/components/landing/Hero"
import ValueProps from "@/components/landing/ValueProps"
import WorkflowPreview from "@/components/landing/WorkflowPreview"
import Stats from "@/components/landing/Stats"
import Footer from "@/components/landing/Footer"

export default async function Home() {
  const session = await auth()

  // Redirect authenticated users to the dashboard instead of the marketing page
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background -m-8">
      {/* Fixed Navbar for Landing Page */}
      <header className="px-6 lg:px-8 flex items-center h-20 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center space-x-3 text-primary">
          <ShieldAlert className="h-8 w-8" />
          <span className="font-bold text-2xl tracking-tight text-foreground">BugRadar</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/auth" className="hidden sm:inline-block">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Hero />
        <WorkflowPreview />
        <ValueProps />
        <Stats />
      </main>

      <Footer />
    </div>
  )
}
