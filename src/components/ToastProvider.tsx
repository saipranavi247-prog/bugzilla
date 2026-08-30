"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { AlertTriangle, Info, ShieldAlert, X } from "lucide-react"

type ToastType = "info" | "critical" | "warning"

interface Toast {
  id: string
  title: string
  message: string
  type: ToastType
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { ...toast, id }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }



  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-slide-in ${
              toast.type === "critical" ? "bg-[#1a0d0e]/90 border-[#FF5A5F]/50 shadow-[0_0_20px_rgba(255,90,95,0.2)]" :
              toast.type === "warning" ? "bg-[#1a1508]/90 border-[#FFA726]/50 shadow-[0_0_20px_rgba(255,167,38,0.2)]" :
              "bg-[#0D1324]/90 border-[#34E1FF]/30 shadow-[0_0_20px_rgba(52,225,255,0.1)]"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "critical" && <ShieldAlert className="h-5 w-5 text-[#FF5A5F]" />}
              {toast.type === "warning" && <AlertTriangle className="h-5 w-5 text-[#FFA726]" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-[#34E1FF]" />}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-mono text-[10px] font-bold tracking-widest mb-1 ${
                toast.type === "critical" ? "text-[#FF5A5F]" :
                toast.type === "warning" ? "text-[#FFA726]" :
                "text-[#34E1FF]"
              }`}>
                {toast.title}
              </h4>
              <p className="font-sans text-xs text-[#F8FAFC]">{toast.message}</p>
            </div>

            <button onClick={() => removeToast(toast.id)} className="text-[#94A3B8] hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}
