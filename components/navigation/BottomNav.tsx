"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Compass, Book, User } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on the initial loading screen
  if (pathname === "/") return null;

  const links = [
    { href: "/journey", label: "Journey", icon: Map },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/passport", label: "Passport", icon: Book },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 pb-safe z-50">
        <ul className="flex justify-between items-center max-w-md mx-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "flex flex-col items-center p-2 rounded-xl transition-colors min-w-[44px] min-h-[44px]",
                    isActive ? "text-quest" : "text-slate-400 hover:text-slate-600"
                  )}
                  aria-label={link.label}
                >
                  <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium tracking-wide">
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-24 bg-white border-r border-slate-200 py-8 z-50 items-center justify-between">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex items-center justify-center mb-4">
            <Logo className="w-10 h-10 rounded-xl" variant="icon" />
          </div>
          <ul className="flex flex-col gap-6 w-full px-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    className={clsx(
                      "flex flex-col items-center justify-center py-4 rounded-2xl transition-colors w-full min-h-[44px]",
                      isActive ? "bg-indigo-50 text-quest" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    )}
                    aria-label={link.label}
                  >
                    <Icon className="w-6 h-6 mb-1.5" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-xs font-medium">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
