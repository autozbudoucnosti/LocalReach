"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/discovery", label: "Discovery" },
  { href: "/templates", label: "Templates" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/settings", label: "Settings" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.16),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eef4f8_45%,_#f7f6f1_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 md:px-6 lg:px-8">
        <header className="sticky top-4 z-30 mb-8 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_16px_50px_-32px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/dashboard" className="font-serif text-2xl tracking-tight text-slate-950">
                {APP_NAME}
              </Link>
              <p className="mt-1 text-sm text-slate-500">
                Personalized local outreach for website redesign services
              </p>
            </div>
            <nav className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
              {navigation.map((item) => {
                const active =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      active
                        ? "bg-slate-950 text-white shadow-sm"
                        : "bg-slate-100/80 text-slate-600 hover:bg-slate-200",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
