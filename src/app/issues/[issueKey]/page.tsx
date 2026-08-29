import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Terminal, AlertTriangle, Shield, CheckCircle,
  GitBranch, MessagesSquare, FileText, Bot, Camera
} from "lucide-react"

export default async function IssueCaseFile({ params }: { params: { issueKey: string } }) {
  const session = await auth()
  if (!session?.user) redirect("/auth")

  const { issueKey: id } = params
  
  // Simulated data based on the ID
  const isCritical = id === "DT-1024" || id === "DT-1045"
  const title = isCritical 
    ? "Heap use-after-free in V8-to-DOM wrapper during concurrent GC cycle" 
    : "Subgrid nested track alignment collapses to zero height on flex child"
  
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Link href="/issues" className="flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-xs">Back to Files</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="id-chip text-lg px-3 py-1 bg-[#34E1FF]/10">{id}</span>
            <h1 className="font-sans font-bold text-2xl text-[#F8FAFC] leading-tight max-w-2xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button className="bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 text-[#FF5A5F] hover:bg-[#FF5A5F]/20 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(255,90,95,0.2)]">
            ESCALATE
          </button>
          <button className="bg-[#36F097]/10 border border-[#36F097]/30 text-[#36F097] hover:bg-[#36F097]/20 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(54,240,151,0.2)]">
            MARK RESOLVED
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Investigation Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Analysis Panel */}
          <div className="holo-card-cyan rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot className="h-24 w-24 text-[#34E1FF]" />
            </div>
            <div className="flex items-center space-x-3 mb-4 relative z-10">
              <div className="h-8 w-8 rounded-lg bg-[#34E1FF]/20 border border-[#34E1FF]/40 flex items-center justify-center animate-cyber-pulse">
                🤖
              </div>
              <div>
                <h3 className="font-sans font-bold text-sm text-[#F8FAFC]">BugBot Root Cause Analysis</h3>
                <p className="font-mono text-[9px] text-[#34E1FF]">CONFIDENCE: 94% · SCANNED 324 TRACES</p>
              </div>
            </div>
            <p className="font-sans text-sm text-[#94A3B8] leading-relaxed relative z-10">
              The heap use-after-free error is triggered when the GC sweeps an isolate concurrently while the DOM wrapper still holds a raw pointer. 
              <br/><br/>
              <strong className="text-[#34E1FF]">Recommendation:</strong> Upgrade to traced references <code>v8::TracedReference</code> which are GC-aware.
            </p>
            <div className="mt-4 flex gap-2 relative z-10">
              <button className="font-mono text-[10px] text-[#34E1FF] bg-[#34E1FF]/10 border border-[#34E1FF]/20 px-3 py-1.5 rounded-lg hover:bg-[#34E1FF]/20">
                GENERATE FIX PR
              </button>
              <button className="font-mono text-[10px] text-[#94A3B8] bg-[#121A2E] border border-[#1E2D4A] px-3 py-1.5 rounded-lg hover:bg-[#1E2D4A]">
                EXPLAIN STACK TRACE
              </button>
            </div>
          </div>

          {/* Evidence / Stack Trace */}
          <div className="holo-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="h-4 w-4 text-[#FFD54A]" />
              <h3 className="font-sans font-bold text-sm text-[#F8FAFC]">Crash Logs & Stack Trace</h3>
            </div>
            <div className="bg-[#050816] rounded-xl border border-[#1E2D4A] p-4 overflow-x-auto relative group">
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-[#121A2E] border border-[#1E2D4A] text-[#94A3B8] text-[9px] font-mono px-2 py-1 rounded">COPY</button>
              </div>
              <pre className="font-mono text-[11px] text-[#36F097] leading-relaxed">
{`FATAL ERROR: Scavenger: semi-space copy
Allocation failed - JavaScript heap out of memory
 1: 0x10129a005 node::Abort() [/usr/local/bin/node]
 2: 0x10129a188 node::OnFatalError(char const*, char const*) [/usr/local/bin/node]
 3: 0x101402db7 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool)
 4: 0x101402d53 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool)
 5: 0x1015949d5 v8::internal::Heap::FatalProcessOutOfMemory(char const*)
 6: 0x101594f8a v8::internal::Heap::RehydrateReadOnlySpace()
 7: 0x10159812b v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags)
 8: 0x1015a510c v8::internal::Heap::AllocateRawWithRetryOrFail(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment)
`}
              </pre>
            </div>
          </div>

          {/* User Comments */}
          <div className="holo-card rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MessagesSquare className="h-4 w-4 text-[#8B5CF6]" />
              <h3 className="font-sans font-bold text-sm text-[#F8FAFC]">Investigation Log</h3>
            </div>
            
            <div className="space-y-6">
              {/* Comment 1 */}
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FFD54A] to-[#F59E0B] shrink-0 flex items-center justify-center font-bold text-xs text-[#050816]">T</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-sans font-bold text-sm text-[#F8FAFC]">Triveni B.</span>
                    <span className="font-mono text-[9px] text-[#4A5568]">2 HOURS AGO</span>
                  </div>
                  <p className="font-sans text-xs text-[#94A3B8]">
                    I've managed to reproduce this locally. It only happens when the renderer process is under heavy load and a GC cycle is forced mid-render.
                  </p>
                </div>
              </div>
              
              {/* Comment 2 */}
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-lg bg-[#34E1FF]/20 border border-[#34E1FF]/40 shrink-0 flex items-center justify-center font-bold text-xs text-[#34E1FF]">A</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-sans font-bold text-sm text-[#F8FAFC]">Alex Rivera</span>
                    <span className="font-mono text-[9px] text-[#4A5568]">30 MINUTES AGO</span>
                  </div>
                  <p className="font-sans text-xs text-[#94A3B8]">
                    Looking at the memory dump, BugBot is right. The DOM wrapper is dangling. I'll open a PR with the <code>TracedReference</code> upgrade shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="mt-6 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF5A5F] to-[#8B5CF6] shrink-0 flex items-center justify-center font-bold text-xs text-white">T</div>
              <div className="flex-1 bg-[#050816] border border-[#1E2D4A] focus-within:border-[#34E1FF]/40 rounded-xl p-3 transition-all">
                <textarea 
                  className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder-[#4A5568] outline-none resize-none h-16 font-mono"
                  placeholder="Add evidence or comment to the case file..."
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <button className="text-[#4A5568] hover:text-[#34E1FF]"><Camera className="h-4 w-4" /></button>
                    <button className="text-[#4A5568] hover:text-[#34E1FF]"><FileText className="h-4 w-4" /></button>
                  </div>
                  <button className="bg-[#34E1FF]/10 text-[#34E1FF] border border-[#34E1FF]/20 px-4 py-1.5 rounded-lg font-mono text-[9px] hover:bg-[#34E1FF]/20">
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="space-y-6">
          
          {/* Properties */}
          <div className="holo-card rounded-2xl p-5">
            <h3 className="font-mono text-[10px] text-[#4A5568] uppercase tracking-widest mb-4">Case Properties</h3>
            
            <div className="space-y-4">
              <div>
                <div className="font-mono text-[9px] text-[#4A5568] mb-1">ASSIGNEE</div>
                <div className="flex items-center space-x-2 bg-[#121A2E] border border-[#1E2D4A] rounded-lg p-2">
                  <div className="h-6 w-6 rounded border border-[#34E1FF]/30 bg-[#34E1FF]/10 flex items-center justify-center text-[10px] font-bold text-[#34E1FF]">A</div>
                  <span className="font-sans text-xs text-[#F8FAFC]">Alex Rivera</span>
                </div>
              </div>
              
              <div>
                <div className="font-mono text-[9px] text-[#4A5568] mb-1">PRIORITY & SEVERITY</div>
                <div className="flex gap-2">
                  <span className="p1-stamp">P1</span>
                  <span className="badge-critical">CRITICAL</span>
                </div>
              </div>
              
              <div>
                <div className="font-mono text-[9px] text-[#4A5568] mb-1">LABELS</div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-mono text-[9px] text-[#FFD54A] bg-[#FFD54A]/10 border border-[#FFD54A]/20 px-2 py-0.5 rounded">V8-Bindings</span>
                  <span className="font-mono text-[9px] text-[#A78BFA] bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-2 py-0.5 rounded">Memory-Leak</span>
                  <span className="font-mono text-[9px] text-[#34E1FF] bg-[#34E1FF]/10 border border-[#34E1FF]/20 px-2 py-0.5 rounded">C++</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integrations & Links */}
          <div className="holo-card rounded-2xl p-5">
            <h3 className="font-mono text-[10px] text-[#4A5568] uppercase tracking-widest mb-4">Integrations</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#121A2E] border border-[#1E2D4A] rounded-xl hover:border-[#34E1FF]/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-4 w-4 text-[#94A3B8] group-hover:text-[#34E1FF]" />
                  <div>
                    <div className="font-sans font-bold text-xs text-[#F8FAFC]">fix/v8-traced-ref</div>
                    <div className="font-mono text-[9px] text-[#4A5568]">Branch · chromium-core</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[#121A2E] border border-[#1E2D4A] rounded-xl hover:border-[#36F097]/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#94A3B8] group-hover:text-[#36F097]" />
                  <div>
                    <div className="font-sans font-bold text-xs text-[#F8FAFC]">PR #442 Open</div>
                    <div className="font-mono text-[9px] text-[#4A5568]">Review requested</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
