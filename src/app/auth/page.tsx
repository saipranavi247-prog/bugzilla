"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type Step = "EMAIL" | "SIGN_IN" | "SIGN_UP"

export default function AuthPage() {
  const router = useRouter()
  
  // State Machine
  const [step, setStep] = useState<Step>("EMAIL")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("REPORTER")
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Assumption Flag: Instant activation upon sign-up, redirecting straight to dashboard.
  // We do not require a separate email verification loop for this MVP.

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      
      if (data.exists) {
        setStep("SIGN_IN")
      } else {
        setStep("SIGN_UP")
      }
    } catch (err) {
      setError("Failed to check email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Wrong password. Try again or click Forgot password.")
        setLoading(false)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (!termsAccepted) {
      setError("You must accept the terms of service.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role })
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create account.")
        setLoading(false)
        return
      }

      // Auto sign in after sign up
      await signIn("credentials", { email, password, redirect: false })
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred.")
      setLoading(false)
    }
  }

  const passwordStrength = Math.min(100, (password.length / 12) * 100)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration matching landing page */}
      <div className="absolute top-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] bg-card border border-border rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="pt-8 pb-4 px-8 text-center flex flex-col items-center">
          <div className="flex justify-center items-center h-12 w-12 bg-primary/10 rounded-xl text-primary mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {step === "EMAIL" ? "Sign in" : step === "SIGN_IN" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            to continue to <span className="font-semibold text-primary">BugRadar</span>
          </p>
        </div>

        {/* Dynamic Body */}
        <div className="px-8 pb-8 relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: EMAIL */}
            {step === "EMAIL" && (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleEmailCheck} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background border-border"
                      autoFocus
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  
                  <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Next"}
                  </Button>

                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase">or</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <Button type="button" variant="outline" className="w-full h-11 border-border font-medium text-foreground">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/></svg>
                    Continue with Google
                  </Button>
                  <Button type="button" variant="outline" className="w-full h-11 border-border font-medium text-foreground">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    Continue with GitHub
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <button onClick={() => setStep("SIGN_UP")} className="text-sm font-medium text-primary hover:underline">
                    Create account
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SIGN IN */}
            {step === "SIGN_IN" && (
              <motion.div
                key="signin-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                        {email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium truncate">{email}</span>
                    </div>
                    <button type="button" onClick={() => setStep("EMAIL")} className="text-xs text-primary font-medium hover:underline shrink-0 ml-2">
                      Change
                    </button>
                  </div>

                  <div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-background border-border"
                      autoFocus
                      required
                    />
                  </div>
                  
                  {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">Show password</label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                    <Button type="submit" className="px-8 font-bold" disabled={loading}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: SIGN UP */}
            {step === "SIGN_UP" && (
              <motion.div
                key="signup-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleSignUp} className="space-y-4">
                  {email ? (
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30 mb-6">
                      <span className="text-sm font-medium truncate">{email}</span>
                      <button type="button" onClick={() => setStep("EMAIL")} className="text-xs text-primary font-medium hover:underline shrink-0 ml-2">
                        Change
                      </button>
                    </div>
                  ) : (
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 bg-background mb-4"
                      required
                    />
                  )}

                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 bg-background"
                      required
                    />
                    
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-background"
                        required
                        minLength={8}
                      />
                      {password.length > 0 && (
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${passwordStrength < 40 ? 'bg-destructive' : passwordStrength < 80 ? 'bg-amber-500' : 'bg-green-500'}`} 
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 bg-background"
                      required
                      minLength={8}
                    />

                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-11 px-3 py-2 bg-background border border-input rounded-md text-sm"
                    >
                      <option value="REPORTER">Role: Reporter (Default)</option>
                      <option value="DEVELOPER">Role: Developer</option>
                      <option value="MAINTAINER">Role: Maintainer</option>
                    </select>

                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(c) => setTermsAccepted(c as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug">
                        I agree to the BugRadar Terms of Service and Privacy Policy. I understand that bugs are serious business.
                      </label>
                    </div>
                  </div>

                  {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                  <div className="pt-4 flex items-center justify-between">
                    <button type="button" onClick={() => setStep("EMAIL")} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <Button type="submit" className="px-6 font-bold" disabled={loading}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create account"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
