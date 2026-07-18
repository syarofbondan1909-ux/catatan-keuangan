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
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <Link href="/transactions/new" className="w-16 h-16 bg-gradient-to-tr from-brand-blue to-brand-cyan rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(15,98,254,0.4)] border-4 border-[#0f1015] text-white hover:scale-110 active:scale-95 transition-all duration-300 group">
          <svg className="group-hover:rotate-90 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </Link>
      </div>

      <nav className="fixed bottom-0 w-full max-w-md glass-card border-t border-white/5 flex justify-between items-center h-[72px] px-6 z-40 rounded-t-3xl pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${item.className} ${
                isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <div className={isActive ? "animate-in zoom-in duration-300" : ""}>
                {item.icon}
              </div>
              {isActive && <span className="absolute bottom-1 w-1 h-1 bg-brand-cyan rounded-full shadow-[0_0_8px_rgba(0,210,255,0.8)]"></span>}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
