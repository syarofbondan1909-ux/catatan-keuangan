"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Bondan",
    phone: "0895-0888-2222",
    email: "bondan@gmail.com",
    avatar: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="p-5 flex flex-col gap-6">
      {/* Header */}
      <header className="flex justify-between items-center mt-2">
        <Link href="/" className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Profil Pengguna</h1>
        </div>
        <Link href="/settings" className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </Link>
      </header>

      {/* User Card */}
      <div className="bg-dark-card rounded-3xl p-5 border border-white/5 shadow-lg shadow-black/20 relative">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">{profile.name}</h2>
              <p className="text-xs text-slate-400 mb-1">{profile.phone}</p>
              <p className="text-xs text-slate-400">{profile.email}</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden border-2 border-white/10">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button onClick={() => setIsEditing(true)} className="absolute -bottom-2 -right-2 w-7 h-7 bg-brand-yellow rounded-md flex items-center justify-center text-black border-2 border-dark-card shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex justify-center mb-2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-slate-700 overflow-hidden border-2 border-brand-yellow shadow-lg shadow-brand-yellow/20">
                  <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Avatar" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    <span className="text-[10px] text-white mt-1 font-semibold">Ubah</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold tracking-wider text-slate-400">NAMA LENGKAP</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold tracking-wider text-slate-400">NOMOR HP</label>
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold tracking-wider text-slate-400">EMAIL</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-yellow transition-colors" />
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 text-white hover:bg-white/10 transition-colors">Batal</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-bold text-sm bg-brand-yellow text-black shadow-[0_4px_14px_rgba(241,196,15,0.4)] hover:bg-yellow-400 transition-colors">Simpan</button>
            </div>
          </div>
        )}
      </div>

      {/* MENU LAINNYA Section */}
      <div>
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 mb-3">MENU APLIKASI</h3>
        <div className="bg-dark-card rounded-3xl p-2 border border-white/5 shadow-lg flex flex-col">
          
          <Link href="/categories" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Kelola Kategori</h4>
              <p className="text-[10px] text-slate-500">Atur kategori pemasukan & pengeluaran</p>
            </div>
            <div className="text-slate-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>

          <div className="w-full h-px bg-white/5 my-1"></div>

          <Link href="/export" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Ekspor Laporan</h4>
              <p className="text-[10px] text-slate-500">Unduh riwayat transaksi bulanan (CSV/PDF)</p>
            </div>
            <div className="text-slate-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>

          <div className="w-full h-px bg-white/5 my-1"></div>

          <Link href="/settings" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Pengaturan Utama</h4>
              <p className="text-[10px] text-slate-500">PIN, Tema Gelap/Terang, Notifikasi</p>
            </div>
            <div className="text-slate-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </Link>

          <div className="w-full h-px bg-white/5 my-1"></div>

          <Link href="/" className="flex items-center gap-4 p-4 hover:bg-red-500/10 rounded-2xl transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-500">Keluar Aplikasi</h4>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
