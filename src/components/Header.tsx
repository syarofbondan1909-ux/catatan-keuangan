"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { playAudio } from "@/components/AudioProvider";

export default function Header({ name = "Bondan" }: { name?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [profile, setProfile] = useState({ name: name, avatar: "" });

  useEffect(() => {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleNotifClick = () => {
    // Play sound
    playAudio('audio-notif');
    
    // Show toast
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  return (
    <>
      <header className="flex justify-between items-center relative z-50 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-blue/30 shadow-[0_0_15px_rgba(15,98,254,0.2)]">
            <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Selamat datang,</p>
            <h1 className="text-base font-bold text-white tracking-tight">{profile.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/settings/notifications" className="relative w-10 h-10 flex items-center justify-center glass-card rounded-full text-white hover:bg-white/10 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Link>
          <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 flex items-center justify-center glass-card rounded-full text-white hover:bg-white/10 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </header>

      {/* Slide-over Menu (Hamburger) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-64 h-full bg-dark-card border-l border-white/10 p-5 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h2 className="text-white font-bold">Menu Tambahan</h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <ul className="flex flex-col gap-4 text-slate-300">
              <a href="/settings" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-yellow cursor-pointer flex items-center gap-3 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Pengaturan
              </a>
              <li onClick={() => {
                  setShowNotif(true); 
                  setIsMenuOpen(false);
                  setTimeout(() => setShowNotif(false), 3000);
                }} 
                className="hover:text-brand-yellow cursor-pointer flex items-center gap-3 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Bantuan & FAQ
              </li>
              <li onClick={() => {
                  setShowNotif(true); 
                  setIsMenuOpen(false);
                  setTimeout(() => setShowNotif(false), 3000);
                }} 
                className="hover:text-brand-yellow cursor-pointer flex items-center gap-3 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                Sinkronisasi Data
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showNotif && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] bg-dark-card border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h3 className="text-white text-sm font-bold">Tidak ada notifikasi baru</h3>
            <p className="text-slate-400 text-xs">Semua saldo dan transaksi Anda aman.</p>
          </div>
        </div>
      )}
    </>
  );
}
