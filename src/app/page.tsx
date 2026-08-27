import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { ShieldAlert, Zap, GitPullRequest, Activity } from "lucide-react"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background -m-8">
      {/* Navbar for Landing Page */}
      <header className="px-8 flex items-center h-20 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-3 text-primary">
          <ShieldAlert className="h-8 w-8" />
          <span className="font-bold text-2xl tracking-tight text-foreground">BugRadar</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center relative overflow-hidden">
          
          {/* Abstract Glow Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 max-w-4xl">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
                Ship software faster with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-cyan-400">
                  BugRadar
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground">
                A modern, structured, and auditable bug tracking platform rebuilt for velocity. Track components, define strict workflows, and exterminate bugs efficiently.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full transition-all hover:scale-105">
                  Launch Workspace
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-muted-foreground/30 hover:bg-secondary">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="w-full py-24 bg-card border-t border-border">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded-2xl text-primary mb-2">
                  <Activity className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Strict Workflows</h3>
                <p className="text-muted-foreground">Define custom state machines for every project. Ensure every bug follows the correct lifecycle before it gets closed.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-purple-500/10 flex items-center justify-center rounded-2xl text-purple-500 mb-2">
                  <GitPullRequest className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Advanced Taxonomy</h3>
                <p className="text-muted-foreground">Categorize issues by specific Products, Components, Versions, and Milestones for pinpoint tracking accuracy.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 bg-cyan-500/10 flex items-center justify-center rounded-2xl text-cyan-500 mb-2">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Developer Fast</h3>
                <p className="text-muted-foreground">Built for speed with a global command palette (Ctrl+K), instant search, and a dark-mode first design philosophy.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
