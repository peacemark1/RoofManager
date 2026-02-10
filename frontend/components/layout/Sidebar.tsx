"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Calculator,
  Bell,
  MessageSquare,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Estimates", href: "/estimates", icon: Calculator },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  {
    name: "Settings", href: "/settings", icon: Settings, children: [
      { name: "Notifications", href: "/settings/notifications", icon: Bell },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/settings") {
      return pathname.startsWith("/settings")
    }
    return pathname === href
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">RoofManager</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const itemActive = isActive(item.href)
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                  itemActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    itemActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )}
                />
                {item.name}
              </Link>
              {item.children && itemActive && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "group flex items-center rounded-md px-2 py-1.5 text-sm font-medium",
                          childActive
                            ? "bg-blue-900/50 text-blue-200"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        )}
                      >
                        <child.icon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white">
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
