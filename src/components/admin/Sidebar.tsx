"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, ClipboardList, CalendarCheck, Users } from "lucide-react";
import type { AdminRole } from "@/lib/currentAdmin";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, tint: "text-ink/60" },
  { href: "/admin/leads", label: "Leads", icon: Inbox, tint: "text-brand" },
  { href: "/admin/beta", label: "Beta Applications", icon: ClipboardList, tint: "text-accent" },
  { href: "/admin/bookings", label: "Demo Bookings", icon: CalendarCheck, tint: "text-teal" },
] as const;

export function Sidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 flex-col border-admin-nav-line bg-admin-nav px-3 py-3 md:w-60 md:border-r md:px-4 md:py-6">
      <div className="px-2 pb-3 md:pb-6">
        <Image
          src="/Eliteworker%20Header%20Logo.svg"
          alt="EliteWorker"
          width={660}
          height={101}
          className="h-5 w-auto md:h-6"
          priority
        />
        <p className="mt-1.5 text-[10px] font-semibold tracking-widest text-white/40 uppercase">Administration</p>
      </div>
      <div className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition md:gap-3 ${
                active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/85"
              }`}
            >
              <Icon size={17} className={active ? item.tint : ""} />
              {item.label}
            </Link>
          );
        })}
        {role === "owner" && (
          <Link
            href="/admin/users"
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition md:mt-4 md:gap-3 md:border-t md:border-white/10 md:pt-4 md:pb-2.5 ${
              pathname.startsWith("/admin/users") ? "text-white" : "text-white/55 hover:text-white/85"
            }`}
          >
            <Users size={17} />
            Admin Users
          </Link>
        )}
      </div>
    </nav>
  );
}
