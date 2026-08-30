"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Fingerprint, GitFork, Zap, Loader2 } from "lucide-react"
import { getFirebaseAuth, createGithubProvider, GithubAuthProvider } from "@/lib/firebase-client"
import { signInWithPopup } from "firebase/auth"

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // Auto-register if needed
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) setError("Authentication failed. Check credentials.")
      else router.push("/dashboard")
    } catch {
      setError("Internal error. Retry.")
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setError("")
    setGithubLoading(true)
    try {
      const result = await signInWithPopup(getFirebaseAuth(), createGithubProvider())
      const credential = GithubAuthProvider.credentialFromResult(result)
      if (!credential?.accessToken) {
        setError("GitHub did not return an access token. Please try again.")
        return
      }
      const idToken = await result.user.getIdToken()

      const res = await signIn("firebase-github", {
        idToken,
        githubAccessToken: credential.accessToken,
        redirect: false,
      })

      if (res?.error) {
        setError("GitHub sign-in failed. Please try again.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("GitHub sign-in failed. Please try again.")
    } finally {
      setGithubLoading(false)
    }
  }



  return (
    <div className="min-h-screen cyber-grid flex relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-[#34E1FF]/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-[#8B5CF6]/4 rounded-full blur-[120px]" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center space-x-2 bg-[#121A2E] border border-[#1E2D4A] hover:border-[#34E1FF]/30 text-[#94A3B8] hover:text-[#34E1FF] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <span>← Back</span>
        </Link>
      </div>

      {/* Left panel: branding + particles */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative border-r border-[#1E2D4A]">

        {/* Radar rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[300, 220, 140, 80].map((size, i) => (
            <div key={i} className="absolute rounded-full border border-[#34E1FF]/8"
              style={{ width: size, height: size }} />
          ))}
          <div className="absolute h-80 w-80 rounded-full animate-[spin_8s_linear_infinite]">
            <div className="absolute top-0 left-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t from-[#34E1FF]/30 to-transparent" />
          </div>
        </div>

        {/* Center logo orb */}
        <div className="relative h-32 w-32 flex items-center justify-center mb-10 z-10">
          <div className="absolute inset-0 rounded-full border border-[#FFD54A]/20 animate-[spin_5s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-[#34E1FF]/15 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FFD54A] to-[#F59E0B] flex items-center justify-center shadow-[0_0_50px_rgba(255,213,74,0.5)] animate-float">
            <span className="font-mono font-black text-2xl text-[#050816]">BR</span>
          </div>
        </div>

        <h2 className="font-sans font-black text-3xl text-[#F8FAFC] text-center z-10 mb-3">
          BugRadar
        </h2>
        <p className="font-mono text-sm text-[#34E1FF] text-center z-10 mb-2">
          Cyber Detective HQ
        </p>
        <p className="font-sans text-[#4A5568] text-center text-sm z-10 max-w-xs">
          Every bug leaves a trace. Your investigation workspace awaits.
        </p>

        {/* Floating evidence cards */}
        <div className="absolute top-24 right-8 holo-card-red rounded-xl p-3 w-40 animate-float">
          <div className="font-mono text-[8px] text-[#FF5A5F] mb-1">DT-1024 · CRITICAL</div>
          <div className="font-sans text-[9px] text-[#94A3B8]">V8 heap use-after-free</div>
        </div>
        <div className="absolute bottom-24 left-8 holo-card-cyan rounded-xl p-3 w-40 animate-[float-up_4s_ease-in-out_1s_infinite]">
          <div className="font-mono text-[8px] text-[#34E1FF] mb-1">AI DETECTIVE</div>
          <div className="font-sans text-[9px] text-[#94A3B8]">5 patterns detected</div>
        </div>

        {/* Bottom system status */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="font-mono text-[9px] text-[#1E2D4A] uppercase tracking-widest">
            SYSTEM LOCK · DESK COORDINATE
          </span>
        </div>
      </div>

      {/* Right panel: Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-sm space-y-6">

          {/* Header */}
          <div>
            <div className="font-mono text-[9px] text-[#34E1FF] uppercase tracking-widest mb-3">
              SECURE GATE · BS-T-02
            </div>
            <h1 className="font-sans font-black text-2xl text-[#F8FAFC] leading-tight">
              Welcome back to<br />your desk.
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 rounded-xl px-4 py-3">
                <span className="text-[#FF5A5F] text-xs font-mono">⚠ {error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">Detective Email</label>
              <div className="flex items-center bg-[#0D1324] border border-[#1E2D4A] focus-within:border-[#34E1FF]/40 rounded-xl px-4 py-3 transition-all">
                <span className="text-[#4A5568] mr-3 text-sm">✉</span>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="detective@bugradar.dev"
                  className="flex-1 bg-transparent text-xs text-[#F8FAFC] placeholder-[#1E2D4A] outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] text-[#4A5568] uppercase tracking-wider">Passcode</label>
              <div className="flex items-center bg-[#0D1324] border border-[#1E2D4A] focus-within:border-[#34E1FF]/40 rounded-xl px-4 py-3 transition-all">
                <span className="text-[#4A5568] mr-3 text-sm">🔒</span>
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••••"
                  className="flex-1 bg-transparent text-xs text-[#F8FAFC] placeholder-[#1E2D4A] outline-none font-mono"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#4A5568] hover:text-[#94A3B8] transition-colors ml-2">
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="h-3.5 w-3.5 rounded border border-[#34E1FF]/40 bg-[#34E1FF]/10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-sm bg-[#34E1FF]" />
                </div>
                <span className="font-mono text-[9px] text-[#94A3B8]">Remember this desk.</span>
              </label>
              <button type="button" className="font-mono text-[9px] text-[#34E1FF] hover:text-[#34E1FF]/80">Lost my keys?</button>
            </div>



            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-[#FFD54A] hover:bg-[#FFE07A] text-[#050816] font-black text-sm py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,213,74,0.3)] disabled:opacity-50">
              <Zap className="h-4 w-4 fill-current stroke-0" />
              <span>{loading ? "Authenticating…" : "Let's Debug →"}</span>
            </button>
          </form>

          {/* Social auth */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1E2D4A]" />
              <span className="font-mono text-[9px] text-[#4A5568] uppercase">Continue via</span>
              <div className="flex-1 h-px bg-[#1E2D4A]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 bg-[#0D1324] border border-[#1E2D4A] hover:border-[#94A3B8]/30 rounded-xl py-2.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] font-semibold transition-all"
              >
                <span className="font-bold" style={{ color: "#EA4335" }}>G</span>
                <span>Google</span>
              </button>
              <button
                type="button"
                disabled={githubLoading}
                onClick={handleGithubSignIn}
                className="flex items-center justify-center space-x-2 bg-[#0D1324] border border-[#1E2D4A] hover:border-[#34E1FF]/40 rounded-xl py-2.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] font-semibold transition-all disabled:opacity-50"
              >
                {githubLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "#94A3B8" }} />
                ) : (
                  <GitFork className="h-3.5 w-3.5" style={{ color: "#94A3B8" }} />
                )}
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center">
            <a href="/" className="font-mono text-[9px] text-[#4A5568] hover:text-[#94A3B8] transition-colors">
              ← Back to Main notebook overview
            </a>
          </div>

        </div>
      </div>

    </div>
  )
}
