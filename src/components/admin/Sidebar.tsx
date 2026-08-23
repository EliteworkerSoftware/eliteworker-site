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

const TAB_CLASSES =
  "flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium whitespace-nowrap transition";
const DESKTOP_ITEM_CLASSES =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition";

// Logo + "Administration" caption, shrink-wrapped and centered on the
// logo's own width (not the full bar) so the caption lines up under the
// logo specifically rather than the container.
function Wordmark({ logoClassName }: { logoClassName: string }) {
  return (
    <div className="inline-block text-center">
      <Image src="/Eliteworker%20Header%20Logo%20White.svg" alt="EliteWorker" width={660} height={101} className={logoClassName} priority />
      <p className="mt-1 text-[9px] font-semibold tracking-widest text-white/50 uppercase">Administration</p>
    </div>
  );
}

export function Sidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile/tablet: a slim top bar with just the logo — the nav lives in
          a fixed bottom tab bar instead, so logo + tabs never compete for
          the same cramped strip at the top of the screen. */}
      <div className="flex justify-center border-b border-admin-nav-line bg-admin-nav px-3 py-2.5 md:hidden">
        <Wordmark logoClassName="h-5 w-auto" />
      </div>

      {/* The bottom tab bar stays black (--nav) rather than the admin blue —
          keeps it visually distinct from the rest of the admin chrome. */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-nav-line bg-nav px-1 pt-1 md:hidden"
        style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className={`grid gap-1 ${role === "owner" ? "grid-cols-5" : "grid-cols-4"}`}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${TAB_CLASSES} ${active ? "bg-white text-ink shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white/90"}`}
              >
                <Icon size={18} className={active ? item.tint : ""} />
                {item.shortLabel}
              </Link>
            );
          })}
          {role === "owner" && (
            <Link
              href="/admin/users"
              className={`${TAB_CLASSES} ${
                isActive("/admin/users") ? "bg-white text-ink shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white/90"
              }`}
            >
              <Users size={18} />
              Admins
            </Link>
          )}
        </div>
      </nav>

      {/* Desktop: the full vertical sidebar. */}
      <nav className="hidden shrink-0 border-admin-nav-line bg-admin-nav md:flex md:w-60 md:flex-col md:border-r md:px-4 md:py-6">
        <div className="px-2 pb-6">
          <Wordmark logoClassName="h-6 w-auto" />
        </div>
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${DESKTOP_ITEM_CLASSES} ${active ? "bg-white text-ink shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white/90"}`}
              >
                <Icon size={17} className={active ? item.tint : ""} />
                {item.label}
              </Link>
            );
          })}
          {role === "owner" && (
            <Link
              href="/admin/users"
              className={`${DESKTOP_ITEM_CLASSES} mt-4 border-t border-admin-nav-line pt-4 pb-2.5 ${
                isActive("/admin/users") ? "text-white" : "text-white/60 hover:text-white/90"
              }`}
            >
              <Users size={17} />
              Admin Users
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
