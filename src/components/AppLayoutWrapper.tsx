"use client"
import { usePathname } from "next/navigation"

export default function AppLayoutWrapper({
  navbar,
  sidebar,
  children
}: {
  navbar: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicPage = pathname === "/" || pathname === "/auth"

  if (isPublicPage) {
    return <main className="flex-1 flex flex-col">{children}</main>
  }

  return (
    <>
      {navbar}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {sidebar}
        <main className="flex-1 overflow-y-auto cyber-grid">
          {children}
        </main>
      </div>
    </>
  )
}
