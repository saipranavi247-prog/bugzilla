"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { 
  Play, 
  Pause, 
  Coffee, 
  Droplet, 
  Check, 
  Activity, 
  Fingerprint, 
  Sparkles
} from "lucide-react"

// Types for our Mock Bug system
interface MockBug {
  id: string
  key: string
  title: string
  status: "RESOLVED" | "IN_PROGRESS" | "CRITICAL"
  severity: "low" | "medium" | "high" | "critical"
  notes: string
  date: string
}

const INITIAL_BUGS: MockBug[] = [
  {
    id: "1",
    key: "BUG-404",
    title: "Ghost in the Machine (Memory Leak)",
    status: "CRITICAL",
    severity: "critical",
    notes: "Heap size climbs 12MB/sec when cassette widget plays. Needs debugging.",
    date: "Aug 29, 2026"
  },
  {
    id: "2",
    key: "BUG-200",
    title: "Coffee tracker incrementing double on click",
    status: "IN_PROGRESS",
    severity: "medium",
    notes: "Race condition due to double touch start event triggers. Fix event.preventDefault().",
    date: "Aug 28, 2026"
  },
  {
    id: "3",
    key: "BUG-101",
    title: "Floating plant doodle overlapping sidebar menu",
    status: "RESOLVED",
    severity: "low",
    notes: "Z-index was set to 999. Reduced to 10. CSS overflow issue fixed.",
    date: "Aug 27, 2026"
  }
]

export default function NotebookWorkspace() {
  // Navigation tabs inside the notebook
  const [activeTab, setActiveTab] = useState<"bugs" | "evidence" | "scratchpad">("bugs")
  const [bugs, setBugs] = useState<MockBug[]>(INITIAL_BUGS)
  
  // Fingerprint Scanner states
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Caffeine and Water trackers
  const [coffeeCount, setCoffeeCount] = useState(3)
  const [waterCount, setWaterCount] = useState(4)

  // Cassette Radio states
  const [isRadioPlaying, setIsRadioPlaying] = useState(false)
  const [radioVolume, setRadioVolume] = useState(0.4)
  const [radioFreq, setRadioFreq] = useState(250) // filter frequency
  const [radioTime, setRadioTime] = useState(0) // custom radio elapsed timer
  
  // Web Audio synth synthesizer objects
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterVolumeRef = useRef<GainNode | null>(null)
  const filterNodeRef = useRef<BiquadFilterNode | null>(null)
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null)
  const synthBeatStep = useRef(0)

  // Scratchpad drawing/doodle state
  const [scratchpadText, setScratchpadText] = useState(
    `// TODO: Check database security keys.\n// Remember: Don't hardcode AUTH_SECRET.\n// P.S. Coffee makes code go brrr.`
  )

  // Cleanup radio synthesizer on unmount
  useEffect(() => {
    return () => {
      stopSynthEngine()
    }
  }, [])

  // Web Audio Synth Logic
  const startSynthEngine = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      // Create Nodes
      masterVolumeRef.current = ctx.createGain()
      masterVolumeRef.current.gain.value = radioVolume

      filterNodeRef.current = ctx.createBiquadFilter()
      filterNodeRef.current.type = "lowpass"
      filterNodeRef.current.frequency.value = radioFreq
      filterNodeRef.current.Q.value = 4

      // Connect Nodes
      filterNodeRef.current.connect(masterVolumeRef.current)
      masterVolumeRef.current.connect(ctx.destination)

      // Sequencer Loop
      const beatInterval = 300 // ms per step (approx 100 BPM)
      
      const playStep = () => {
        if (!ctx || !masterVolumeRef.current || !filterNodeRef.current) return

        const now = ctx.currentTime
        const step = synthBeatStep.current

        // Simple retro 8-bit drum kick on beat 0 and 2
        if (step % 2 === 0) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "sine"
          
          // Pitch sweep for kick
          osc.frequency.setValueAtTime(150, now)
          osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.2)
          
          // Volume decay
          gain.gain.setValueAtTime(0.8, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
          
          osc.connect(gain)
          gain.connect(masterVolumeRef.current) // bypass main filter to keep kick deep
          
          osc.start(now)
          osc.stop(now + 0.22)
        }

        // Play cozy chords on step 0, 4, 8, 12
        if (step % 4 === 0) {
          // Em7: E3 (164.81), G3 (196.00), B3 (246.94), D4 (293.66)
          // Am7: A3 (220.00), C4 (261.63), E4 (329.63), G4 (392.00)
          const isAChord = step % 8 === 0
          const frequencies = isAChord 
            ? [220.00, 261.63, 329.63, 392.00] // Am7
            : [164.81, 196.00, 246.94, 293.66] // Em7
            
          frequencies.forEach((freq, idx) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            
            osc.type = "triangle"
            osc.frequency.setValueAtTime(freq, now)
            
            // Soft attack, slow release (lo-fi style pad)
            gain.gain.setValueAtTime(0.0, now)
            gain.gain.linearRampToValueAtTime(0.12 - idx * 0.01, now + 0.1) // varied velocity
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
            
            osc.connect(gain)
            gain.connect(filterNodeRef.current!)
            
            osc.start(now)
            osc.stop(now + 0.9)
          })
        }

        // Rhythmic lo-fi crackle/noise
        if (Math.random() > 0.4) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "sine"
          osc.frequency.setValueAtTime(1000 + Math.random() * 4000, now)
          
          gain.gain.setValueAtTime(0.003, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
          
          osc.connect(gain)
          gain.connect(masterVolumeRef.current)
          
          osc.start(now)
          osc.stop(now + 0.06)
        }

        synthBeatStep.current = (step + 1) % 16
        setRadioTime(prev => (prev + 1) % 100)
      }

      // Start timer loop
      synthTimerRef.current = setInterval(playStep, beatInterval)
      setIsRadioPlaying(true)
    } catch (e) {
      console.error("Web Audio Init failed:", e)
    }
  }

  const stopSynthEngine = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current)
      synthTimerRef.current = null
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.suspend()
      } catch (err) {}
    }
    setIsRadioPlaying(false)
  }

  const toggleRadio = () => {
    if (isRadioPlaying) {
      stopSynthEngine()
    } else {
      startSynthEngine()
    }
  }

  // Handle radio parameter changes
  useEffect(() => {
    if (masterVolumeRef.current) {
      masterVolumeRef.current.gain.value = radioVolume
    }
  }, [radioVolume])

  useEffect(() => {
    if (filterNodeRef.current) {
      filterNodeRef.current.frequency.value = radioFreq
    }
  }, [radioFreq])

  // Fingerprint Scanner holding logic
  const startScanning = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (scanSuccess) return
    setIsScanning(true)
    setScanProgress(0)

    // Play a low frequency scan buzz tone
    playBeep(120, "sawtooth", 0.05)

    scanIntervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current!)
          setIsScanning(false)
          setScanSuccess(true)
          triggerSuccessConfetti()
          playBeep(523.25, "sine", 0.2) // Success high pitch C5
          setTimeout(() => playBeep(659.25, "sine", 0.2), 150) // E5 chord beep
          return 100
        }
        // Crackling sound while scanning
        if (prev % 10 === 0) {
          playBeep(240 + prev * 2, "sine", 0.02, 0.05)
        }
        return prev + 4
      })
    }, 50)
  }

  const stopScanning = () => {
    if (scanSuccess) return
    setIsScanning(false)
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setScanProgress(0)
  }

  // Simple Synthesizer Sound Creator
  const playBeep = (freq: number, type: OscillatorType = "sine", duration = 0.1, gainVal = 0.1) => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)()
      if (!audioCtxRef.current) audioCtxRef.current = ctx
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = type
      osc.frequency.value = freq
      
      gain.gain.setValueAtTime(gainVal, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + duration + 0.05)
    } catch (e) {}
  }

  const triggerSuccessConfetti = () => {
    // Left side burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ["#FBBF24", "#EFE8FF", "#34D399", "#EF4444"]
    })
    // Right side burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ["#FBBF24", "#EFE8FF", "#34D399", "#EF4444"]
    })
  }

  const exterminateBug = (id: string) => {
    setBugs(prev => prev.map(b => b.id === id ? { ...b, status: "RESOLVED" } : b))
    // Trigger tick sound and confetti
    playBeep(880, "sine", 0.08, 0.08)
    setTimeout(() => playBeep(1320, "sine", 0.15, 0.05), 50)
    
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.6 },
      colors: ["#34D399", "#EFE8FF", "#FBBF24"]
    })
  }

  // Draw coffee tick marks (e.g. groups of 5 with strike)
  const renderTicks = (count: number) => {
    const bundles = Math.floor(count / 5)
    const remainder = count % 5
    const bundlesArr = Array.from({ length: bundles })
    const remainderArr = Array.from({ length: remainder })

    return (
      <div className="flex items-center space-x-3 font-cursive text-2xl text-paper-ink font-bold tracking-widest">
        {bundlesArr.map((_, i) => (
          <span key={i} className="relative inline-block px-1 select-none">
            ||||
            <span className="absolute left-0 right-0 top-1/2 h-[3px] bg-accent-coral -rotate-12 transform -translate-y-1/2"></span>
          </span>
        ))}
        {remainderArr.map((_, i) => (
          <span key={i} className="inline-block select-none">|</span>
        ))}
        {count === 0 && <span className="text-gray-400 font-normal text-lg">None</span>}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full notebook-grid flex flex-col items-center justify-start p-6 overflow-hidden relative font-sans text-white select-none">
      
      {/* Decorative Pencil / Mug / Plants Sketches floating in desk background */}
      <div className="absolute top-8 left-12 opacity-30 select-none pointer-events-none hidden lg:block hover:opacity-80 transition-opacity">
        {/* Plant Sketch */}
        <svg width="120" height="150" viewBox="0 0 120 150">
          <path d="M 40 100 Q 20 60 50 20 Q 80 60 60 100" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 60 100 Q 90 70 80 40 Q 50 70 60 100" fill="none" stroke="#34D399" strokeWidth="2" />
          <path d="M 50 100 L 50 140 M 35 140 L 65 140" fill="none" stroke="#F9F5E9" strokeWidth="3" />
          {/* Pot */}
          <polygon points="35,100 65,100 60,140 40,140" fill="none" stroke="#F9F5E9" strokeWidth="3" />
        </svg>
        <span className="font-cursive text-sm text-gray-500 block text-center mt-2">🌱 silicon ficus</span>
      </div>

      <div className="absolute bottom-10 left-12 opacity-35 select-none pointer-events-none hidden xl:block hover:opacity-80 transition-opacity">
        {/* Headphones Sketch */}
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M 20 60 A 30 30 0 0 1 80 60" fill="none" stroke="#F9F5E9" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="12" y="55" width="14" height="24" rx="5" fill="none" stroke="#EFE8FF" strokeWidth="3" />
          <rect x="74" y="55" width="14" height="24" rx="5" fill="none" stroke="#EFE8FF" strokeWidth="3" />
        </svg>
        <span className="font-cursive text-sm text-gray-500 block text-center mt-1">🎧 caffeine-proof pads</span>
      </div>

      <div className="absolute top-12 right-12 opacity-25 select-none pointer-events-none hidden lg:block hover:opacity-80 transition-opacity">
        {/* Desk Pencil Sketch */}
        <svg width="80" height="120" viewBox="0 0 80 120" className="rotate-12">
          <rect x="25" y="40" width="30" height="60" fill="none" stroke="#F9F5E9" strokeWidth="2.5" />
          <line x1="30" y1="10" x2="30" y2="40" stroke="#FBBF24" strokeWidth="3" />
          <polygon points="30,10 27,20 33,20" fill="#111827" stroke="#FBBF24" strokeWidth="1" />
          <line x1="40" y1="5" x2="40" y2="40" stroke="#EF4444" strokeWidth="3" />
          <polygon points="40,5 37,15 43,15" fill="#111827" stroke="#EF4444" strokeWidth="1" />
          <line x1="50" y1="15" x2="50" y2="40" stroke="#34D399" strokeWidth="3" />
          <polygon points="50,15 47,25 53,25" fill="#111827" stroke="#34D399" strokeWidth="1" />
        </svg>
        <span className="font-cursive text-sm text-gray-500 block text-center mt-1">✏️ trace locker</span>
      </div>

      {/* Main Grid Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between border-4 border-black bg-card-midnight p-6 flat-shadow rounded-2xl mb-8 relative">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent-gold border-2 border-black flex items-center justify-center rounded-xl flat-shadow rotate-[-2deg]">
            <Activity className="h-6 w-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-sans text-white flex items-center">
              BugRadar <span className="ml-2 text-xs font-mono px-2 py-0.5 border border-accent-gold text-accent-gold rounded uppercase">BUGSTUDIO v2.0</span>
            </h1>
            <p className="text-sm text-gray-400 font-mono">WORKSPACE COORDINATES: 47° N, 122° W (desk-04)</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="font-cursive text-lg text-accent-purple tracking-wide flex items-center bg-card-midnight-light border-2 border-black px-4 py-2 rounded-xl flat-shadow">
            <span className="animate-pulse mr-2 h-2.5 w-2.5 rounded-full bg-accent-mint inline-block" />
            ★ evidence locker active
          </div>
        </div>
      </header>

      {/* Main Workspace Grid (Desk Surface) */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The Interactive Desk Widgets (5 cols) */}
        <div className="lg:col-span-5 space-y-8 flex flex-col">
          
          {/* WIDGET 1: Biometric Fingerprint Access Scan */}
          <div className="border-4 border-black bg-card-midnight rounded-3xl p-6 flat-shadow relative overflow-hidden transition-all duration-300">
            <div className="absolute top-2 right-2 border-2 border-dashed border-gray-700 font-mono text-xs px-2 py-0.5 text-gray-500">
              SECURE DOOR
            </div>
            
            <h2 className="text-xl font-bold font-sans text-white mb-2 flex items-center">
              <span className="text-accent-gold mr-2">✦</span> BIOMETRIC LOCKER ACCESS
            </h2>
            <p className="text-xs text-gray-400 font-mono mb-4">DECRYPT SENSITIVE EVIDENCE ARCHIVE</p>

            <div className="flex flex-col items-center justify-center p-6 border-4 border-black bg-card-midnight-light rounded-2xl relative">
              {/* Progress Ring Background */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#1f2937"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke={scanSuccess ? "var(--color-accent-mint)" : "var(--color-accent-gold)"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={376.99}
                    strokeDashoffset={376.99 - (376.99 * scanProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Fingerprint Interactive Button */}
                <button
                  onMouseDown={startScanning}
                  onMouseUp={stopScanning}
                  onMouseLeave={stopScanning}
                  onTouchStart={startScanning}
                  onTouchEnd={stopScanning}
                  className={`w-28 h-28 rounded-full border-4 border-black flex flex-col items-center justify-center transition-all duration-150 relative z-10 flat-shadow active:scale-95 ${
                    scanSuccess
                      ? "bg-accent-mint text-black cursor-default"
                      : isScanning
                      ? "bg-accent-gold/20 text-accent-gold scale-105"
                      : "bg-card-midnight hover:bg-card-midnight/80 text-accent-gold animate-[bounce_5s_infinite]"
                  }`}
                >
                  {scanSuccess ? (
                    <Check className="h-14 w-14 stroke-[3] animate-[bounce_0.5s_ease-out]" />
                  ) : (
                    <Fingerprint className={`h-14 w-14 stroke-[2] ${isScanning ? "animate-pulse" : ""}`} />
                  )}
                </button>
              </div>

              {/* Scan Status Label */}
              <div className="mt-4 text-center">
                <div className="font-mono text-sm font-bold">
                  {scanSuccess ? (
                    <span className="text-accent-mint flex items-center justify-center">
                      <Sparkles className="h-4 w-4 mr-1 animate-spin" /> ACCESS GRANTED
                    </span>
                  ) : isScanning ? (
                    <span className="text-accent-gold animate-pulse">DECRYPTING... {scanProgress}%</span>
                  ) : (
                    <span className="text-gray-400">HOLD PRINT TO UNLOCK CLUES</span>
                  )}
                </div>
                <div className="text-[10px] text-gray-500 font-mono mt-1">INTEGRITY MATRIX: ACTIVE</div>
              </div>
            </div>

            {/* Evidence details displayed when unlocked */}
            <AnimatePresence>
              {scanSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 border-2 border-black bg-paper-beige text-paper-ink rounded-xl flat-shadow font-cursive rotate-[0.5deg]"
                >
                  <div className="font-bold text-accent-coral text-lg flex items-center justify-between">
                    <span>★ DECLASSIFIED INK CLUE:</span>
                    <button 
                      onClick={() => setScanSuccess(false)}
                      className="font-mono text-xs border border-paper-ink/30 px-2 py-0.5 rounded hover:bg-paper-ink/10"
                    >
                      LOCK
                    </button>
                  </div>
                  <p className="mt-2 text-md leading-snug">
                    "Decrypted memory address <span className="font-mono text-sm px-1 bg-paper-ink/10 rounded">0x3F2D991</span> points to a stack overflow within the custom synthesized instrument routine inside `AudioContext`. If audio output glitches, check filters."
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WIDGET 2: Cozy Lo-fi Radio Cassette Player */}
          <div className="border-4 border-black bg-card-midnight rounded-3xl p-6 flat-shadow relative">
            <div className="absolute top-2 right-2 border-2 border-dashed border-gray-700 font-mono text-xs px-2 py-0.5 text-gray-500">
              AUDIO COMPONENT
            </div>

            <h2 className="text-xl font-bold font-sans text-white mb-2 flex items-center">
              <span className="text-accent-mint mr-2">✦</span> LO-FI RADIO LOOP
            </h2>
            <p className="text-xs text-gray-400 font-mono mb-4">SYNTHESIZE BEATS NATIVELY</p>

            <div className="border-4 border-black bg-card-midnight-light p-4 rounded-2xl flex flex-col space-y-4">
              
              {/* Spinning Cassette Vector Art */}
              <div className="w-full bg-[#111] border-4 border-black p-4 rounded-xl relative flex items-center justify-center overflow-hidden">
                {/* Cassette Shell Body */}
                <div className="w-full max-w-[240px] h-32 bg-accent-gold border-4 border-black rounded-lg p-2 flex flex-col justify-between relative shadow-inner">
                  {/* Cassette Top sticker label */}
                  <div className="w-full h-8 bg-paper-beige border-2 border-black rounded flex items-center justify-between px-2 text-paper-ink">
                    <span className="font-mono text-[9px] font-bold">BUGRADAR TAPE-1</span>
                    <span className="font-cursive text-xs font-bold leading-none select-all">cozy-vibes.hex</span>
                  </div>

                  {/* Tape Spool Wheels */}
                  <div className="w-full flex justify-around items-center h-12 relative px-4">
                    {/* Left Spool */}
                    <div className="w-10 h-10 rounded-full border-4 border-black bg-card-midnight-light flex items-center justify-center relative">
                      <div 
                        className={`w-6 h-6 border border-dashed border-accent-gold rounded-full flex items-center justify-center ${
                          isRadioPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                        }`}
                      >
                        <div className="w-2 h-2 bg-black rounded-full" />
                      </div>
                    </div>

                    {/* Right Spool */}
                    <div className="w-10 h-10 rounded-full border-4 border-black bg-card-midnight-light flex items-center justify-center relative">
                      <div 
                        className={`w-6 h-6 border border-dashed border-accent-gold rounded-full flex items-center justify-center ${
                          isRadioPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                        }`}
                      >
                        <div className="w-2 h-2 bg-black rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Tape Bottom Center details */}
                  <div className="w-full flex justify-center text-black font-mono text-[8px] font-bold select-none">
                    ★ A / B SYNTH SIDE ★
                  </div>
                </div>
              </div>

              {/* Radio Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleRadio}
                  className={`flex items-center px-4 py-2 border-4 border-black rounded-xl font-bold flat-shadow hover:-translate-y-0.5 transition-transform ${
                    isRadioPlaying ? "bg-accent-coral text-white" : "bg-accent-mint text-black"
                  }`}
                >
                  {isRadioPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2 fill-current" /> PAUSE LOOP
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2 fill-current" /> PLAY COZY BEAT
                    </>
                  )}
                </button>

                {/* Synth active state light */}
                <div className="flex items-center space-x-2 font-mono text-[10px] text-gray-400">
                  <span 
                    className={`w-2.5 h-2.5 rounded-full border border-black ${
                      isRadioPlaying ? "bg-accent-mint animate-pulse" : "bg-gray-700"
                    }`}
                  />
                  <span>{isRadioPlaying ? "ANALOG SYNTH ACTIVE" : "SYNTH READY"}</span>
                </div>
              </div>

              {/* Tweakable Sliders (Volume, Frequency filter) */}
              <div className="space-y-2 pt-2 border-t border-gray-800 font-mono text-xs">
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>LFO GAIN / VOLUME:</span>
                    <span>{Math.round(radioVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={radioVolume}
                    onChange={(e) => setRadioVolume(parseFloat(e.target.value))}
                    className="w-full accent-accent-gold cursor-pointer"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>LOWPASS TONE FILTER:</span>
                    <span>{radioFreq} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="1200"
                    step="20"
                    value={radioFreq}
                    onChange={(e) => setRadioFreq(parseInt(e.target.value))}
                    className="w-full accent-accent-mint cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* WIDGET 3: Caffeine Tracker & Paper Sticky Note */}
          <div className="ruled-paper-pink border-4 border-black rounded-3xl p-6 flat-shadow relative text-paper-ink rotate-[-1deg]">
            {/* Transparent Tape strip at top */}
            <div className="absolute top-[-10px] left-1/3 right-1/3 h-5 tape-strip-yellow flex items-center justify-center rotate-1 select-none">
              <span className="font-mono text-[8px] text-yellow-800 font-semibold tracking-wider">TAPE #09</span>
            </div>

            <h2 className="text-xl font-bold font-cursive mb-2 flex items-center border-b border-accent-coral/20 pb-1">
              ☕ CAFFEINE & WATER INTAKE
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/40 p-3 border-2 border-black rounded-xl">
                <div>
                  <div className="font-cursive text-lg font-bold flex items-center">
                    <Coffee className="h-4 w-4 mr-2" /> COFFEE POTS
                  </div>
                  {renderTicks(coffeeCount)}
                </div>
                <button
                  onClick={() => {
                    setCoffeeCount(prev => prev + 1)
                    playBeep(440, "sine", 0.05, 0.05)
                  }}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-black border-2 border-black px-3 py-1 rounded-lg flat-shadow font-bold text-xs active:translate-y-0.5 active:shadow-none"
                >
                  + DRINK
                </button>
              </div>

              <div className="flex justify-between items-center bg-white/40 p-3 border-2 border-black rounded-xl">
                <div>
                  <div className="font-cursive text-lg font-bold flex items-center">
                    <Droplet className="h-4 w-4 mr-2" /> H2O GOBLETS
                  </div>
                  {renderTicks(waterCount)}
                </div>
                <button
                  onClick={() => {
                    setWaterCount(prev => prev + 1)
                    playBeep(600, "sine", 0.05, 0.05)
                  }}
                  className="bg-accent-mint hover:bg-accent-mint/90 text-black border-2 border-black px-3 py-1 rounded-lg flat-shadow font-bold text-xs active:translate-y-0.5 active:shadow-none"
                >
                  + SLURP
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-cursive border-t border-accent-coral/20 pt-2">
              <span className="italic">"Coffee to bug translation matrix complete."</span>
              <button
                onClick={() => {
                  setCoffeeCount(0)
                  setWaterCount(0)
                  playBeep(330, "sine", 0.1, 0.02)
                }}
                className="font-mono text-[9px] hover:underline"
              >
                Reset stats
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The Playful Handcrafted Notebook (7 cols) */}
        <div className="lg:col-span-7 flex flex-col relative">
          
          {/* Notebook tabs sticking out of the top/side */}
          <div className="flex space-x-1 ml-4 relative z-10">
            <button
              onClick={() => {
                setActiveTab("bugs")
                playBeep(400, "sine", 0.03)
              }}
              className={`border-4 border-b-0 border-black px-4 py-2 font-bold font-sans rounded-t-xl transition-all ${
                activeTab === "bugs"
                  ? "bg-paper-beige text-paper-ink translate-y-[4px]"
                  : "bg-card-midnight text-gray-400 hover:text-white"
              }`}
            >
              📄 BUGS JOURNAL
            </button>
            <button
              onClick={() => {
                setActiveTab("evidence")
                playBeep(450, "sine", 0.03)
              }}
              className={`border-4 border-b-0 border-black px-4 py-2 font-bold font-sans rounded-t-xl transition-all ${
                activeTab === "evidence"
                  ? "bg-paper-beige text-paper-ink translate-y-[4px]"
                  : "bg-card-midnight text-gray-400 hover:text-white"
              }`}
            >
              🔍 EVIDENCE LOCKER
            </button>
            <button
              onClick={() => {
                setActiveTab("scratchpad")
                playBeep(500, "sine", 0.03)
              }}
              className={`border-4 border-b-0 border-black px-4 py-2 font-bold font-sans rounded-t-xl transition-all ${
                activeTab === "scratchpad"
                  ? "bg-paper-beige text-paper-ink translate-y-[4px]"
                  : "bg-card-midnight text-gray-400 hover:text-white"
              }`}
            >
              📝 SCRATCHPAD
            </button>
          </div>

          {/* Main Notebook Surface */}
          <div className="border-4 border-black bg-paper-beige text-paper-ink rounded-3xl p-8 flat-shadow-lg relative min-h-[620px] flex flex-col justify-between">
            {/* Paper Ring binder clip drawings at left margin */}
            <div className="absolute left-[-16px] top-12 bottom-12 w-6 flex flex-col justify-between items-center pointer-events-none select-none">
              <div className="w-10 h-10 rounded-full border-4 border-black bg-[#1f2937] rotate-[12deg] mb-6 shadow" />
              <div className="w-10 h-10 rounded-full border-4 border-black bg-[#1f2937] rotate-[-5deg] mb-6 shadow" />
              <div className="w-10 h-10 rounded-full border-4 border-black bg-[#1f2937] rotate-[20deg] mb-6 shadow" />
              <div className="w-10 h-10 rounded-full border-4 border-black bg-[#1f2937] rotate-[-15deg] mb-6 shadow" />
              <div className="w-10 h-10 rounded-full border-4 border-black bg-[#1f2937] rotate-[8deg] shadow" />
            </div>

            {/* Notebook Content wrapper */}
            <div className="pl-6 h-full flex flex-col justify-start">
              
              {/* TAB 1: BUGS JOURNAL */}
              {activeTab === "bugs" && (
                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center border-b-2 border-black pb-2">
                    <h3 className="text-2xl font-bold font-cursive tracking-tight text-paper-ink flex items-center">
                      ★ Active Bug Tracking Logs
                    </h3>
                    <div className="font-mono text-xs border-2 border-black px-2 py-0.5 rounded bg-white">
                      RECORDS: {bugs.filter(b => b.status !== "RESOLVED").length} CRITICALS
                    </div>
                  </div>

                  <div className="ruled-paper p-1 flex-grow space-y-4">
                    {bugs.map((bug) => (
                      <div 
                        key={bug.id} 
                        className={`p-4 border-2 border-black rounded-xl bg-white flat-shadow transition-all relative ${
                          bug.status === "RESOLVED" ? "opacity-60 bg-gray-50 scale-[0.98]" : ""
                        }`}
                      >
                        {/* Bug top details */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs bg-paper-ink/10 px-2 py-0.5 rounded text-paper-ink font-bold">
                              {bug.key}
                            </span>
                            <h4 className={`text-md font-bold font-sans text-paper-ink ${
                              bug.status === "RESOLVED" ? "line-through text-gray-500" : ""
                            }`}>
                              {bug.title}
                            </h4>
                          </div>

                          {/* Stamp badges */}
                          <div>
                            {bug.status === "RESOLVED" ? (
                              <span className="text-[10px] font-mono border border-accent-mint bg-accent-mint/10 text-emerald-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider rotate-[3deg] inline-block">
                                RESOLVED
                              </span>
                            ) : bug.status === "CRITICAL" ? (
                              <span className="text-[10px] font-mono border-2 border-accent-coral bg-accent-coral/10 text-accent-coral px-2 py-0.5 rounded uppercase font-bold tracking-wider rotate-[-2deg] inline-block animate-pulse">
                                CRITICAL
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono border border-accent-gold bg-accent-gold/10 text-yellow-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider inline-block">
                                IN PROGRESS
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-2 text-sm text-gray-700 font-cursive leading-relaxed">
                          {bug.notes}
                        </p>

                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between text-xs font-mono text-gray-500 pt-2 border-t border-dashed border-gray-200">
                          <span>DETECTED: {bug.date}</span>
                          {bug.status !== "RESOLVED" && (
                            <button
                              onClick={() => exterminateBug(bug.id)}
                              className="bg-accent-mint hover:bg-accent-mint/90 border-2 border-black text-black font-bold px-3 py-1 rounded-md flat-shadow hover:-translate-y-0.5 active:translate-y-0 text-xs transition-transform"
                            >
                              EXTERMINATE ⚡
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: EVIDENCE LOCKER */}
              {activeTab === "evidence" && (
                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center border-b-2 border-black pb-2">
                    <h3 className="text-2xl font-bold font-cursive tracking-tight text-paper-ink flex items-center">
                      🔍 Critical Core Evidence Hex-Dump
                    </h3>
                    <span className="font-mono text-xs text-accent-coral">CONFIDENTIAL</span>
                  </div>

                  <div className="space-y-4 flex-grow font-mono text-xs">
                    {/* Hex Dump Card */}
                    <div className="p-4 border-2 border-black bg-[#111] text-accent-mint rounded-2xl flat-shadow relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-[9px] text-gray-600 font-mono uppercase">
                        STK_FRAME_DUMP
                      </div>
                      <div className="font-mono space-y-1">
                        <p>0001: 5F 63 6F 7A 79 5F 73 79 6E 74 68 5F 6C 6F 6F 70  // _cozy_synth_loop</p>
                        <p>0010: 4F 58 33 46 32 44 39 39 31 0A 20 4D 45 4D 4F 52  // OX3F2D991. MEMOR</p>
                        <p>0020: 59 5F 4C 45 41 4B 5F 44 45 54 45 43 54 45 44 21  // Y_LEAK_DETECTED!</p>
                        <p className="text-accent-gold">0030: 00 00 FF FF C3 A9 C3 A8 C3 B4 20 63 6F 66 66 65  // ...... cozy coffe</p>
                      </div>
                    </div>

                    {/* Source Code Snippet */}
                    <div className="p-4 border-2 border-black bg-white rounded-2xl flat-shadow">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                        <span className="font-mono text-xs text-gray-500">lib/synthesizer.ts</span>
                        <span className="text-[10px] text-accent-coral font-bold font-mono">STACK CORRUPTED</span>
                      </div>
                      <pre className="font-mono text-[11px] leading-relaxed text-gray-800 overflow-x-auto">
{`export function initSynthAudio() {
  const audioCtx = new AudioContext(); // LEAK SOURCE: Instantiated repeatedly
  const osc = audioCtx.createOscillator();
  // BUG-404: forgot to call audioCtx.close() inside cleanups.
  // Result: Memory buffers accumulate on every play/pause sweep!
}`}
                      </pre>
                    </div>

                    {/* Sticky note with pencil clue */}
                    <div className="p-4 border-2 border-black bg-paper-pink text-paper-ink rounded-xl flat-shadow font-cursive rotate-[1.5deg]">
                      <h4 className="font-bold text-accent-coral text-md">★ DETECTIVE CLUE #12</h4>
                      <p className="mt-1 text-sm leading-relaxed">
                        "The memory leaks happen because each play click spins up a new AudioContext and sets up listeners but never terminates them on release. Hook it to useRef and cache the instance! Fixed this in mockup synth loop natively."
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SCRATCHPAD */}
              {activeTab === "scratchpad" && (
                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center border-b-2 border-black pb-2">
                    <h3 className="text-2xl font-bold font-cursive tracking-tight text-paper-ink">
                      📝 Hand-Drawn Scratchpad Doodle Area
                    </h3>
                  </div>

                  <div className="flex-grow flex flex-col space-y-4">
                    <p className="font-cursive text-sm text-gray-600">
                      Write notes, codes, doodles. This text is persisted locally in temporary workspace memory.
                    </p>
                    
                    <textarea
                      value={scratchpadText}
                      onChange={(e) => setScratchpadText(e.target.value)}
                      className="w-full flex-grow p-4 border-4 border-black bg-white text-paper-ink font-mono text-xs rounded-2xl flat-shadow focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      rows={12}
                    />

                    <div className="flex justify-between items-center">
                      <span className="font-cursive text-xs text-gray-500">
                        * Tilted slightly for realism.
                      </span>
                      <button
                        onClick={() => {
                          setScratchpadText("")
                          playBeep(220, "sawtooth", 0.08, 0.02)
                        }}
                        className="bg-accent-coral text-white border-2 border-black px-4 py-1.5 rounded-lg flat-shadow font-bold text-xs hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                      >
                        ERASE SHEET
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Notebook Margin Footer */}
            <footer className="mt-6 border-t-2 border-black pt-4 flex items-center justify-between text-xs font-mono text-gray-500 pl-6">
              <span>BUGRADAR DETECTIVE RECORD #590-212</span>
              <span>Doodles &copy; BugStudio Inc 2026</span>
            </footer>
          </div>

          {/* Doodles drawn under the notebook */}
          <div className="absolute bottom-[-30px] right-[20px] font-cursive text-xs text-gray-600 rotate-[4deg] select-none pointer-events-none">
            🤖 silicon desk-04.
          </div>
        </div>

      </div>

      {/* Workspace Footer desk details */}
      <footer className="mt-16 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between border-t-4 border-black pt-6 text-gray-500 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span>COZY COORD: TERMINAL STATIONS LOCKER</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
          <span className="hover:text-accent-gold cursor-pointer" onClick={() => triggerSuccessConfetti()}>TRIGGER CONFETTI PIECE 🎉</span>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-4">
          <span className="hover:underline cursor-pointer" onClick={() => playBeep(440, "sine", 0.2)}>SOUND CHECK 🔊</span>
          <span>SYSTEM TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  )
}
