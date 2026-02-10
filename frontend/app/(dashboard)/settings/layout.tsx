"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Bell, CreditCard, Shield, Building } from "lucide-react"

const settingsNav = [
  { name: "Profile", href: "/settings", icon: User },
  { name: "Notifications", href: "/settings/notifications", icon: Bell },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Security", href: "/settings/security", icon: Shield },
  { name: "Company", href: "/settings/company", icon: Building },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex">
      {/* Settings Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-screen">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>
        <nav className="space-y-1 px-3">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-700" : "text-gray-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}
