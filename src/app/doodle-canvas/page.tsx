"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Eraser, StickyNote, Trash2 } from "lucide-react"

type StrokeWidth = "fine" | "med" | "bold"
type DrawColor = string

interface StickyNoteItem {
  id: string
  x: number
  y: number
  text: string
  color: string
}

const COLORS: DrawColor[] = ["#000000", "#EF4444", "#FBBF24", "#3B82F6", "#34D399"]
const STICKY_COLORS = ["#FEF9C3", "#FCE7E7", "#E0F2FE", "#D1FAE5"]
const STROKE_WIDTHS: Record<StrokeWidth, number> = { fine: 1.5, med: 3, bold: 6 }

export default function DoodleCanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState<DrawColor>("#000000")
  const [strokeWidth, setStrokeWidth] = useState<StrokeWidth>("med")
  const [tool, setTool] = useState<"pen" | "eraser">("pen")
  const [stickies, setStickies] = useState<StickyNoteItem[]>([
    { id: "s1", x: 265, y: 300, text: "Check database pool allocations! 🔍", color: "#FEF9C3" },
    { id: "s2", x: 500, y: 370, text: "Auto-registration added for testing! 📋", color: "#FFFFFF" }
  ])
  const [draggingSticky, setDraggingSticky] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getCtx = () => {
    const canvas = canvasRef.current
    return canvas?.getContext("2d") ?? null
  }

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e)
    lastPos.current = pos
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos.current) return
    const ctx = getCtx()
    if (!ctx) return

    const pos = getCanvasPos(e)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color
    ctx.lineWidth = tool === "eraser" ? STROKE_WIDTHS.bold * 5 : STROKE_WIDTHS[strokeWidth]
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()
    lastPos.current = pos
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    lastPos.current = null
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const addSticky = () => {
    const newSticky: StickyNoteItem = {
      id: `sticky-${Date.now()}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      text: "New note...",
      color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)]
    }
    setStickies(prev => [...prev, newSticky])
  }

  const onStickyMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const sticky = stickies.find(s => s.id === id)!
    setDraggingSticky(id)
    setDragOffset({ x: e.clientX - sticky.x, y: e.clientY - sticky.y })
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingSticky) return
    setStickies(prev =>
      prev.map(s =>
        s.id === draggingSticky
          ? { ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
          : s
      )
    )
  }, [draggingSticky, dragOffset])

  const onMouseUp = useCallback(() => setDraggingSticky(null), [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  return (
    <div className="flex flex-col space-y-4 max-w-7xl mx-auto pb-12 text-white font-sans h-[calc(100vh-140px)]">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <h1 className="text-xl font-black font-sans tracking-tight flex items-center space-x-2">
          <span>Doodle Sketch Board</span>
          <span>🎨</span>
        </h1>
        <span className="font-cursive text-sm text-[#FBBF24] font-bold italic">Collaborative Detective Canvas</span>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {/* Color picker white square */}
          <div className="h-7 w-7 bg-white border-2 border-black rounded-md cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)]" />

          {/* Eraser */}
          <button
            onClick={() => setTool(tool === "eraser" ? "pen" : "eraser")}
            className={`h-7 w-7 flex items-center justify-center rounded-md border-2 border-black cursor-pointer transition-all ${
              tool === "eraser" ? "bg-[#FBBF24] text-black" : "bg-[#1A2233] text-gray-300 hover:bg-gray-700"
            } shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
          >
            <Eraser className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>

          {/* Color dots */}
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool("pen") }}
              className={`h-5 w-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                color === c && tool === "pen" ? "border-white scale-125" : "border-black"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}

          {/* Stroke widths */}
          {(["fine", "med", "bold"] as StrokeWidth[]).map(w => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-black cursor-pointer capitalize transition-all ${
                strokeWidth === w ? "bg-white text-black" : "bg-[#1A2233] text-gray-300 hover:bg-gray-700"
              } shadow-[1px_1px_0px_rgba(0,0,0,1)]`}
            >
              {w.charAt(0).toUpperCase() + w.slice(1)}
            </button>
          ))}

          {/* Add sticky */}
          <button
            onClick={addSticky}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FBBF24] text-black text-xs font-mono font-bold border-2 border-black rounded-lg cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-[1.02] transition-transform"
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span>+ Sticky</span>
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#EF4444] text-white text-xs font-mono font-bold border-2 border-black rounded-lg cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-[1.02] transition-transform"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative flex-1 border-4 border-black rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <canvas
          ref={canvasRef}
          width={1400}
          height={900}
          className={`w-full h-full ${tool === "eraser" ? "cursor-cell" : "cursor-crosshair"}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {/* Sticky notes overlay */}
        {stickies.map(sticky => (
          <div
            key={sticky.id}
            onMouseDown={(e) => onStickyMouseDown(e, sticky.id)}
            style={{
              position: "absolute",
              left: sticky.x,
              top: sticky.y,
              backgroundColor: sticky.color,
              cursor: draggingSticky === sticky.id ? "grabbing" : "grab"
            }}
            className="w-36 min-h-[80px] border border-black/20 rounded-sm p-3 shadow-md select-none z-10"
          >
            {/* Tape strip on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-gray-400/30 border border-gray-300/40 rounded-sm" />

            {/* Close button */}
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => setStickies(prev => prev.filter(s => s.id !== sticky.id))}
              className="absolute top-1 right-1.5 text-gray-400 hover:text-red-500 font-bold text-xs cursor-pointer leading-none"
            >
              ×
            </button>

            <textarea
              className="w-full bg-transparent resize-none font-cursive text-xs font-bold text-gray-800 focus:outline-none leading-relaxed"
              defaultValue={sticky.text}
              rows={3}
              onMouseDown={e => e.stopPropagation()}
            />
          </div>
        ))}
      </div>

    </div>
  )
}
