"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Boxes,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  BrainCircuit,
  Wrench,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: ClipboardList,
    label: "Orders",
    href: "/orders",
  },
  {
    icon: Boxes,
    label: "Inventory",
    href: "/inventory",
  },
  {
    icon: UtensilsCrossed,
    label: "Menu",
    href: "/menu",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: BrainCircuit,
    label: "AI Insights",
    href: "/ai",
  },
  {
    icon: Wrench,
    label: "Restaurant Setup",
    href: "/setup",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center justify-center border-b border-white/10 px-4 py-5">
        <Image
          src="/KP-logo-final.png"
          alt="KitchenPulse"
          width={280}
          height={60}
          priority
          className="h-auto w-full object-contain"
        />
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-slate-300 transition-all duration-300 hover:bg-cyan-500/15 hover:text-white"
          >
            <item.icon
              size={20}
              className="transition group-hover:text-cyan-400"
            />

            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-5">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="text-xs text-slate-400">
            System Status
          </p>

          <p className="mt-1 font-semibold text-cyan-400">
            ● All Systems Operational
          </p>
        </div>
      </div>
    </aside>
  );
}