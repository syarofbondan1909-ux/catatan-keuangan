"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Only show BottomNav on main pages to prevent overlapping with forms/buttons on sub-pages
  const showNavOnPages = ["/", "/wallets", "/transactions", "/profile", "/categories"];
  if (!showNavOnPages.includes(pathname)) {
    return null;
  }

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      className: "mr-0"
    },
    {
      name: "Wallets",
      path: "/wallets",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-9.27 7.86c-5.41-1.04-8.18-5.63-8.18-5.63" />
          <path d="M22 11v6" />
        </svg>
      ),
      className: "mr-8"
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      className: "ml-8"
    },
    {
      name: "Profile",
      path: "/profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      className: "ml-0"
    }
  ];

  return (
    <>
      {/* Custom Floating Action Button (FAB) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <Link href="/transactions/new" className="w-14 h-14 bg-gradient-to-tr from-brand-orange to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-orange/30 border-[3px] border-dark-bg text-white hover:scale-105 active:scale-95 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </Link>
      </div>

      <nav className="fixed bottom-0 w-full max-w-md bg-dark-card border-t border-white/5 flex justify-between items-center h-16 px-6 z-40 rounded-t-3xl">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center transition-all duration-300 ${item.className} ${
                isActive 
                  ? "text-brand-yellow drop-shadow-[0_0_8px_rgba(241,196,15,0.5)] scale-110" 
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
