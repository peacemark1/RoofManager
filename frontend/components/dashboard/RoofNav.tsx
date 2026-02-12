"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Calculator,
  MessageSquare,
  Package,
  Bell,
  Home,
} from "lucide-react";

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

interface RoofNavProps {
  className?: string;
}

export function RoofNav({ className }: RoofNavProps) {
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

  // Ghana flag colors for active states
  const ghanaColors = ["#EF2B2D", "#FFD700", "#009E49"];
  const activeGradient = `linear-gradient(135deg, ${ghanaColors.join(", ")})`;

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-slate-950 text-white border-r border-slate-800/50",
        className
      )}
    >
      {/* Logo Section */}
      <div className="relative flex h-20 items-center justify-center border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        {/* Roof pattern accent */}
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 L50 0 L100 100 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M25 100 L50 50 L75 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            {/* Roof icon with Ghana colors */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ghana-green to-cyan-600 flex items-center justify-center shadow-lg shadow-ghana-green/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            {/* Roof peak accent */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-ghana-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              RoofManager
            </h1>
            <p className="text-xs text-ghana-gold">Ghana&apos;s #1 Roofing CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {navigation.map((item) => {
          const itemActive = isActive(item.href);

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  itemActive
                    ? "bg-gradient-to-r from-ghana-green/20 to-cyan-500/10 text-white border-l-2 border-ghana-green"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "relative flex items-center justify-center w-9 h-9 rounded-lg mr-3 transition-all",
                    itemActive
                      ? "bg-ghana-green/20"
                      : "bg-slate-800/50 group-hover:bg-slate-800"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      itemActive
                        ? "text-ghana-green"
                        : "text-slate-500 group-hover:text-cyan-400"
                    )}
                  />

                  {/* Active indicator dot */}
                  {itemActive && (
                    <span className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-ghana-gold animate-pulse" />
                  )}
                </span>

                <span className="flex-1">{item.name}</span>

                {/* Active Ghana flag accent */}
                {itemActive && (
                  <div className="flex gap-0.5">
                    <span className="w-1 h-3 rounded-sm bg-ghana-red" />
                    <span className="w-1 h-3 rounded-sm bg-ghana-gold" />
                    <span className="w-1 h-3 rounded-sm bg-ghana-green" />
                  </div>
                )}
              </Link>

              {item.children && itemActive && (
                <div className="ml-12 mt-1 space-y-1 border-l border-slate-700/50 pl-3">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm transition-all",
                          childActive
                            ? "text-ghana-gold bg-ghana-gold/10"
                            : "text-slate-500 hover:text-white hover:bg-slate-800/30"
                        )}
                      >
                        <child.icon className="w-4 h-4 mr-2" />
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

      {/* Footer with Ghana accent */}
      <div className="relative border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        {/* Ghana flag strip */}
        <div className="h-0.5 flex">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold" />
          <div className="flex-1 bg-ghana-green" />
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-ghana-red transition-colors"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/50 mr-3 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
