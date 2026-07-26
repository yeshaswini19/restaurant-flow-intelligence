"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Boxes,
  BarChart3,
  BrainCircuit,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Boxes, label: "Inventory", href: "/inventory" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: BrainCircuit, label: "AI Insights", href: "/ai" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10 flex justify-center items-center">
        <Image
  src="/KP-logo-final.png"
  alt="KitchenPulse"
  width={280}
  height={60}
  priority
  className="w-full h-auto object-contain"
/>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
  href={item.href}
            key={item.label}
            className="group w-full flex items-center gap-4 rounded-xl px-4 py-3 text-slate-300 hover:bg-cyan-500/15 hover:text-white transition-all duration-300"
          >
            <item.icon
              size={20}
              className="group-hover:text-cyan-400 transition"
            />

            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-5 border-t border-white/10">
        <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4">
          <p className="text-xs text-slate-400">
            System Status
          </p>

          <p className="text-cyan-400 font-semibold mt-1">
            ● All Systems Operational
          </p>
        </div>
      </div>
    </aside>
  );
}