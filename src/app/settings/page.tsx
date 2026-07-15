"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    const isLight = document.documentElement.classList.contains('light-theme');
    setIsDarkMode(!isLight);
  }, []);

  // Modals state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currency, setCurrency] = useState("IDR (Rp)");

  const handleToggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (!newDarkMode) {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative">
      {/* Header */}
      <header className="flex justify-between items-center mt-2">
        <button onClick={() => router.back()} className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Pengaturan</h1>
        </div>
        <div className="w-9"></div>
      </header>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden border-2 border-brand-yellow">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bondan" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Bondan</h2>
          <p className="text-xs text-slate-400">Akun Premium</p>
        </div>
        <Link href="/settings/profile" className="ml-auto text-xs bg-white/10 px-3 py-1.5 rounded-full text-brand-yellow font-medium">Edit</Link>
      </div>

      <div className="mt-2 space-y-6">
        {/* Akun */}
        <section>
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 mb-3 ml-2">AKUN</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
            <Link href="/settings/profile" className="flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span className="text-sm text-slate-200">Informasi Pribadi</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
            <Link href="/settings/pin" className="flex items-center justify-between p-4 active:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <span className="text-sm text-slate-200">Keamanan (PIN)</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        </section>

        {/* Preferensi */}
        <section>
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 mb-3 ml-2">PREFERENSI</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer" onClick={handleToggleTheme}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </div>
                <span className="text-sm text-slate-200">Mode Gelap (Dark Mode)</span>
              </div>
              
              <button className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${isDarkMode ? 'bg-brand-green' : 'bg-slate-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div onClick={() => setShowCurrencyModal(true)} className="flex items-center justify-between p-4 active:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span className="text-sm text-slate-200">Mata Uang</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{currency}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </div>
        </section>

      {/* Integrasi */}
        <section>
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 mb-3 ml-2">INTEGRASI APLIKASI</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
            <Link href="/settings/integrations" className="flex items-center justify-between p-4 active:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
                </div>
                <span className="text-sm text-slate-200">WhatsApp & Telegram</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
        </section>

        {/* Lainnya */}
        <section className="mb-24">
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
            <div onClick={() => setShowLogoutModal(true)} className="flex items-center justify-between p-4 active:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </div>
                <span className="text-sm text-red-500 font-medium">Keluar Aplikasi</span>
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-6">Versi 1.0.0 (Build 23)</p>
        </section>
      </div>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCurrencyModal(false)}></div>
          <div className="relative w-full max-w-md bg-dark-bg border-t sm:border border-white/10 p-6 rounded-t-3xl sm:rounded-3xl animate-in slide-in-from-bottom-8">
            <h3 className="text-lg font-bold text-white mb-4">Pilih Mata Uang</h3>
            <div className="flex flex-col gap-2">
              {['IDR (Rp)', 'USD ($)', 'EUR (€)', 'SGD (S$)'].map((c) => (
                <button 
                  key={c}
                  onClick={() => { setCurrency(c); setShowCurrencyModal(false); }}
                  className={`p-4 rounded-xl text-left border ${currency === c ? 'border-brand-green bg-brand-green/10 text-brand-green font-bold' : 'border-white/5 bg-dark-card text-white hover:bg-white/5'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative w-[85%] max-w-sm bg-dark-card border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 11H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-7V6a4 4 0 0 0-8 0v5"/><circle cx="12" cy="16" r="1"/></svg>
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Keluar Aplikasi?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">Sesi Anda akan diakhiri. Karena aplikasi ini tidak memerlukan login, data Anda tetap tersimpan di lokal.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors">Batal</button>
              <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors">Keluar</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
