import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Search, ZoomIn, ZoomOut, RotateCcw, ArrowRight } from "lucide-react"

interface GraphNode {
  id: string
  key: string
  priority: string
  title: string
  status: "CRITICAL" | "MAJOR" | "BLOCKER" | "NORMAL"
  bgColorClass: string
  borderColorClass: string
  x: string // left percentage
  y: string // top percentage
}

const NODES: GraphNode[] = [
  {
    id: "n1",
    key: "DT-1018",
    priority: "P1",
    title: "Thread-safety violation in global isolate handle disposal lock table",
    status: "CRITICAL",
    bgColorClass: "bg-[#3B82F6]/25",
    borderColorClass: "border-[#3B82F6] text-blue-300",
    x: "5%",
    y: "45%"
  },
  {
    id: "n2",
    key: "DT-1024",
    priority: "P1",
    title: "Heap use-after-free in V8-to-DOM wrapper during concurrent GC cycle",
    status: "BLOCKER",
    bgColorClass: "bg-[#FCE7E7]/10",
    borderColorClass: "border-[#EF4444]/60 text-red-300",
    x: "34%",
    y: "45%"
  },
  {
    id: "n3",
    key: "DT-1045",
    priority: "P1",
    title: "Raft split-brain candidate state deadlock on partition recovery in 5...",
    status: "CRITICAL",
    bgColorClass: "bg-[#1A2233]",
    borderColorClass: "border-[#EF4444]/60 text-orange-300",
    x: "63%",
    y: "35%"
  },
  {
    id: "n4",
    key: "DT-1030",
    priority: "P2",
    title: "Subgrid nested track alignment collapses to zero height on flex child",
    status: "MAJOR",
    bgColorClass: "bg-[#3B82F6]/25",
    borderColorClass: "border-[#3B82F6] text-blue-300",
    x: "63%",
    y: "60%"
  },
  {
    id: "n5",
    key: "DT-1060",
    priority: "P1",
    title: "LSM Compaction worker memory leak during high-throughput ingest...",
    status: "CRITICAL",
    bgColorClass: "bg-[#3B82F6]/25",
    borderColorClass: "border-[#3B82F6] text-blue-300",
    x: "88%",
    y: "45%"
  }
]

export default async function ReportsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-white font-sans select-none h-full flex flex-col justify-start">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-gray-800 pb-4 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-xl text-accent-gold">⚯</span>
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">
            Dependency Graph
          </h1>
          <span className="font-cursive text-sm text-gray-400 font-bold">
            5 nodes &bull; 4 edges
          </span>
        </div>

        {/* Graph controls */}
        <div className="flex items-center space-x-3 text-xs">
          <button className="h-9 w-9 bg-card-midnight-light hover:bg-card-midnight border-2 border-black flex items-center justify-center rounded-xl flat-shadow cursor-pointer select-none">
            <Search className="h-4 w-4 text-gray-400" />
          </button>
          <button className="h-9 w-9 bg-card-midnight-light hover:bg-card-midnight border-2 border-black flex items-center justify-center rounded-xl flat-shadow cursor-pointer select-none">
            <ZoomIn className="h-4 w-4 text-gray-400" />
          </button>
          <button className="h-9 w-9 bg-card-midnight-light hover:bg-card-midnight border-2 border-black flex items-center justify-center rounded-xl flat-shadow cursor-pointer select-none">
            <ZoomOut className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex items-center space-x-1.5 bg-card-midnight-light hover:bg-card-midnight border-2 border-black px-3.5 py-1.5 rounded-xl flat-shadow cursor-pointer select-none">
            <RotateCcw className="h-4 w-4 text-gray-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Legends */}
      <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono text-gray-400 uppercase tracking-wider shrink-0 select-none pb-2">
        <span className="font-bold">STATUS</span>
        <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-gray-500 rounded-full" /> <span>UNCONFIRMED</span></span>
        <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-blue-500 rounded-full" /> <span>CONFIRMED</span></span>
        <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-orange-500 rounded-full" /> <span>IN PROGRESS</span></span>
        <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-emerald-500 rounded-full" /> <span>RESOLVED</span></span>
        <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-teal-500 rounded-full" /> <span>VERIFIED</span></span>
        <span className="flex items-center space-x-1.5"><span className="h-2 w-2 bg-indigo-500 rounded-full" /> <span>CLOSED</span></span>
        
        <span className="mx-2 text-gray-600">|</span>
        <span className="text-accent-coral flex items-center"><ArrowRight className="h-3 w-3 mr-1" /> Blocks &rarr;</span>
        <span className="font-cursive text-xs text-gray-500 lowercase">Drag to pan &bull; Scroll to zoom &bull; Click node to open</span>
      </div>

      {/* Graph Board */}
      <div className="flex-1 bg-[#0b0f19] border-4 border-black rounded-3xl min-h-[460px] relative overflow-hidden flat-shadow">
        
        {/* Connection flow lines overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500" preserveAspectRatio="none">
          {/* Arrow paths from Node positions */}
          {/* Line 1: n1 (x=50, y=250) -> n2 (x=340, y=250) */}
          <path d="M 180 250 H 330" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 330 250 L 324 246 V 254 Z" fill="#EF4444" />
          
          {/* Line 2: n2 (x=340, y=250) -> n3 (x=630, y=200) */}
          <path d="M 470 240 Q 550 200 620 200" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 620 200 L 614 196 V 204 Z" fill="#EF4444" />

          {/* Line 3: n2 (x=340, y=250) -> n4 (x=630, y=300) */}
          <path d="M 470 260 Q 550 300 620 300" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 620 300 L 614 296 V 304 Z" fill="#EF4444" />

          {/* Line 4: n3 (x=630, y=200) -> n5 (x=880, y=250) */}
          <path d="M 760 200 Q 820 200 870 240" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 870 240 L 864 236 V 244 Z" fill="#EF4444" />

          {/* Line 5: n4 (x=630, y=300) -> n5 (x=880, y=250) */}
          <path d="M 760 300 Q 820 300 870 260" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 870 260 L 864 256 V 264 Z" fill="#EF4444" />
        </svg>

        {/* Nodes Grid */}
        <div className="absolute inset-0 w-full h-full">
          {NODES.map((node) => (
            <div
              key={node.id}
              style={{ left: node.x, top: node.y }}
              className={`absolute -translate-y-1/2 w-48 border-3 border-black p-4 rounded-xl flat-shadow transition-all hover:scale-105 duration-200 cursor-pointer ${node.bgColorClass} ${node.borderColorClass}`}
            >
              {/* Node top info */}
              <div className="flex justify-between items-center mb-2 font-mono text-[9px] font-bold">
                <span className="bg-black/20 px-1.5 rounded">{node.key}</span>
                <span className="text-[#EF4444] border border-[#EF4444]/40 px-1 rounded">{node.priority}</span>
              </div>
              
              {/* Title */}
              <h3 className="font-sans font-bold text-[10px] leading-tight mb-2 h-7 overflow-hidden text-ellipsis">
                {node.title}
              </h3>

              {/* Status stamp */}
              <div className="flex justify-between items-center text-[9px] font-mono border-t border-black/10 pt-1.5">
                <span className="font-bold text-[#FBBF24]">{node.status}</span>
                <span className="text-gray-400">quantum</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
