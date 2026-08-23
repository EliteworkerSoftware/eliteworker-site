"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, ClipboardList, CalendarCheck, Users } from "lucide-react";
import type { AdminRole } from "@/lib/currentAdmin";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", shortLabel: "Overview", icon: LayoutDashboard, tint: "text-ink/60" },
  { href: "/admin/leads", label: "Leads", shortLabel: "Leads", icon: Inbox, tint: "text-brand" },
  { href: "/admin/beta", label: "Beta Applications", shortLabel: "Beta", icon: ClipboardList, tint: "text-accent" },
  { href: "/admin/bookings", label: "Demo Bookings", shortLabel: "Bookings", icon: CalendarCheck, tint: "text-teal" },
] as const;

// Below md, each item shows as an icon-over-short-label tab in an evenly
// divided grid — no label ever overflows or forces a scrollbar, unlike a
// horizontally-scrolling row of full-width, full-label items. At md+ this
// reverts to the normal icon + full-label sidebar list.
const ITEM_CLASSES =
  "flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-[10px] font-medium whitespace-nowrap transition md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2.5 md:text-left md:text-sm";

export function Sidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 flex-col border-admin-nav-line bg-admin-nav px-3 py-3 md:w-60 md:border-r md:px-4 md:py-6">
      <div className="px-2 pb-3 md:pb-6">
        {/* inline-block shrink-wraps to the logo's own width (its widest
            child), so text-center lines the caption up with the logo
            specifically — centering on the full sidebar width instead would
            just re-left-align the logo, which isn't what's wanted here. */}
        <div className="inline-block text-center">
          <Image
            src="/Eliteworker%20Footer%20Logo.svg"
            alt="EliteWorker"
            width={660}
            height={101}
            className="h-5 w-auto md:h-6"
            priority
          />
          <p className="mt-1.5 text-[10px] font-semibold tracking-widest text-ink/45 uppercase">Administration</p>
        </div>
      </div>
      <div className={`grid gap-1 md:flex md:flex-col ${role === "owner" ? "grid-cols-5" : "grid-cols-4"}`}>
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${ITEM_CLASSES} ${active ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:bg-white/60 hover:text-ink/85"}`}
            >
              <Icon size={18} className={active ? item.tint : ""} />
              <span className="md:hidden">{item.shortLabel}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
        {role === "owner" && (
          <Link
            href="/admin/users"
            className={`${ITEM_CLASSES} md:mt-4 md:border-t md:border-admin-nav-line md:pt-4 md:pb-2.5 ${
              pathname.startsWith("/admin/users") ? "bg-white text-ink shadow-sm md:bg-transparent md:text-ink md:shadow-none" : "text-ink/55 hover:bg-white/60 hover:text-ink/85 md:hover:bg-transparent"
            }`}
          >
            <Users size={18} />
            <span className="md:hidden">Admins</span>
            <span className="hidden md:inline">Admin Users</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
