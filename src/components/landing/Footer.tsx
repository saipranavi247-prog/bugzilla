import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-background border-t border-border">
      <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center space-x-2 text-primary">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-bold text-lg text-foreground">BugRadar</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Built for the modern development workflow. <br className="hidden md:inline"/>
            Not just another clone.
          </p>
        </div>
        
        <div className="flex items-center space-x-6 text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            Product
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="https://github.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            GitHub
          </Link>
          <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Twitter
          </Link>
        </div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} BugRadar Inc. All rights reserved. Built for the Google Agentic Hackathon.
      </div>
    </footer>
  )
}
