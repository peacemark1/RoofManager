
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Package,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Estimates", href: "/estimates", icon: Calculator },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Materials", href: "/materials", icon: Package },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { name: "Notifications", href: "/settings/notifications", icon: Bell },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/settings") {
      return pathname.startsWith("/settings");
    }
    return pathname === href;
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-950 text-white border-r border-slate-800/50">
      <div className="flex h-16 items-center justify-center border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-lg">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          RoofManager
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const itemActive = isActive(item.href);
          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  itemActive
                    ? "bg-slate-800/80 text-white border-l-4 border-cyan-500 shadow-md shadow-cyan-900/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    itemActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400"
                  )}
                />
                {item.name}
              </Link>
              {item.children && itemActive && (
                <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-2">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all",
                          childActive
                            ? "text-cyan-400 bg-slate-800/30"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                        )}
                      >
                        <child.icon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4 bg-slate-950/50 backdrop-blur-lg">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
