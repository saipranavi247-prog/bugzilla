export default function Stats() {
  return (
    <section className="w-full py-24 bg-primary/5 border-t border-border">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-foreground">10,000+</h4>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bugs Tracked</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-foreground">45%</h4>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faster Resolution</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-foreground">99.9%</h4>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Uptime</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl font-extrabold text-foreground">5M+</h4>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Transitions Logged</p>
          </div>
        </div>
      </div>
    </section>
  )
}
