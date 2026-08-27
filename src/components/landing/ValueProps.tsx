import { Layers, Users, Search, BrainCircuit } from "lucide-react"

const features = [
  {
    title: "Structured Issue Tracking",
    description: "Go beyond free-text. Capture severity, priority, components, and milestones with strict data models that prevent missing context.",
    icon: Layers,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Real-time Collaboration",
    description: "Keep the whole team aligned with threaded comments, @mentions, and granular watcher subscriptions on components or issues.",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Command Palette & Search",
    description: "Hit Ctrl+K to jump anywhere. Build and save complex queries to instantly access the exact slice of bugs you care about.",
    icon: Search,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    title: "AI-Assisted Triage",
    description: "Stop manually labeling. BugRadar's AI automatically suggests severity and priority based on the bug's description and stack trace.",
    icon: BrainCircuit,
    color: "text-primary",
    bg: "bg-primary/10"
  }
]

export default function ValueProps() {
  return (
    <section className="w-full py-24 bg-card border-y border-border">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">A tracking platform that understands code</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We extracted the battle-tested primitives of legacy issue trackers and wrapped them in a lightning-fast, developer-first interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col p-6 bg-background rounded-2xl border border-border hover:border-primary/50 transition-colors">
              <div className={`h-12 w-12 ${feature.bg} ${feature.color} flex items-center justify-center rounded-xl mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
