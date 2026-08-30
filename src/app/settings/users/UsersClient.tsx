"use client"
import { useState } from "react"
import { useToast } from "@/components/ToastProvider"

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const { addToast } = useToast()

  const changeRole = async (userId: string, newRole: string) => {
    // optimistic update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      })
      if (!res.ok) throw new Error("Failed to update role")
      
      addToast({ title: "ROLE UPDATED", message: `User role changed to ${newRole}`, type: "info" })
    } catch (e) {
      // revert
      setUsers(initialUsers)
      addToast({ title: "UPDATE FAILED", message: "Failed to update role.", type: "critical" })
    }
  }

  return (
    <div className="holo-card rounded-2xl p-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#1E2D4A] text-[10px] uppercase font-mono text-[#4A5568] tracking-wider">
              <th className="pb-3 px-4 font-normal">User</th>
              <th className="pb-3 px-4 font-normal">Email</th>
              <th className="pb-3 px-4 font-normal">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-[#1E2D4A]/30 hover:bg-[#121A2E]/50 transition-colors">
                <td className="py-4 px-4 text-sm text-[#F8FAFC] font-semibold flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#34E1FF]/10 border border-[#34E1FF]/30 flex items-center justify-center text-[#34E1FF] font-bold text-xs uppercase">
                    {(user.name || user.githubUsername || "?")[0]}
                  </div>
                  {user.name || user.githubUsername}
                </td>
                <td className="py-4 px-4 text-xs text-[#94A3B8] font-mono">{user.email}</td>
                <td className="py-4 px-4">
                  <select 
                    value={user.role} 
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className="bg-[#050816] border border-[#1E2D4A] rounded-lg p-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#FF5A5F]/50 transition-colors cursor-pointer"
                  >
                    <option value="developer">Developer</option>
                    <option value="reporter">Reporter</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
