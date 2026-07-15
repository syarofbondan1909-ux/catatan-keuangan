"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Bondan");

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1500);
  };

  return (
    <main className="p-5 flex flex-col min-h-screen relative bg-dark-bg">
      {/* Header */}
      <header className="flex justify-between items-center mt-2 mb-8">
        <button onClick={() => router.back()} className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Edit Profil</h1>
        </div>
        <div className="w-9"></div>
      </header>

      {/* Avatar Edit */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-24 h-24 rounded-full bg-slate-700 overflow-hidden border-2 border-brand-yellow cursor-pointer" onClick={handleAvatarClick}>
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-100" />
          </div>
          <button 
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 w-8 h-8 bg-brand-yellow text-black rounded-full border-2 border-[#0f1015] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
          </button>
        </div>
        <button type="button" onClick={handleAvatarClick} className="text-xs text-brand-green font-medium hover:underline">Ubah Foto Profil</button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6 flex-1">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-slate-400 ml-1">NAMA LENGKAP</label>
          <div className="bg-dark-card border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-green transition-colors">
            <input type="text" defaultValue="Bondan" className="w-full bg-transparent text-white outline-none text-sm" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-slate-400 ml-1">NOMOR TELEPON</label>
          <div className="bg-dark-card border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-green transition-colors">
            <input type="tel" defaultValue="0895-0888-2222" className="w-full bg-transparent text-white outline-none text-sm" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-slate-400 ml-1">ALAMAT EMAIL</label>
          <div className="bg-dark-card border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-green transition-colors opacity-70">
            <input type="email" defaultValue="bondan@gmail.com" readOnly className="w-full bg-transparent text-slate-300 outline-none text-sm cursor-not-allowed" />
          </div>
          <p className="text-[10px] text-slate-500 ml-1 mt-1">Email tidak dapat diubah setelah registrasi.</p>
        </div>

        <div className="mt-auto pt-8">
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-black font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(46,204,113,0.39)] disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </main>
  );
}
