"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { saveTelegramChatId, getTelegramStatus, disconnectTelegram, setupWebhook } from "@/actions/telegram";

export default function IntegrationsPage() {
  const router = useRouter();
  
  // WhatsApp State
  const [waEnabled, setWaEnabled] = useState(false);
  const [waNumber, setWaNumber] = useState("");
  const [waConnected, setWaConnected] = useState(false);

  // Telegram State
  const [tgEnabled, setTgEnabled] = useState(false);
  const [tgChatId, setTgChatId] = useState("");
  const [tgConnected, setTgConnected] = useState(false);
  const [isSavingTg, setIsSavingTg] = useState(false);
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);

  useEffect(() => {
    getTelegramStatus().then((status) => {
      setTgConnected(status.connected);
      if (status.connected) {
        setTgEnabled(true);
        setTgChatId(status.chatId);
      }
    });
  }, []);

  const handleConnectWa = (e: React.FormEvent) => {
    e.preventDefault();
    if(waNumber) {
      setWaConnected(true);
      alert("WhatsApp Berhasil Dihubungkan ke " + waNumber);
    }
  };

  const handleConnectTg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tgChatId) return;
    
    setIsSavingTg(true);
    const res = await saveTelegramChatId(tgChatId);
    setIsSavingTg(false);
    
    if (res.success) {
      setTgConnected(true);
      alert("Telegram Berhasil Dihubungkan!");
    } else {
      alert("Gagal: " + res.error);
    }
  };

  const handleDisconnectTg = async () => {
    const res = await disconnectTelegram();
    if (res.success) {
      setTgConnected(false);
      setTgChatId("");
      setTgEnabled(false);
    }
  };

  const handleSetWebhook = async () => {
    setIsSettingWebhook(true);
    const origin = window.location.origin;
    const res = await setupWebhook(origin);
    setIsSettingWebhook(false);
    
    if (res.success) {
      alert("Server Telegram Bot berhasil diaktifkan!");
    } else {
      alert("Gagal mengaktifkan server: " + res.error);
    }
  };

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative bg-transparent">
      {/* Header */}
      <header className="flex justify-between items-center mt-2">
        <button onClick={() => router.back()} className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Integrasi Chat</h1>
        </div>
        <div className="w-9"></div>
      </header>

      <div className="text-center mt-2 mb-4">
        <p className="text-sm text-slate-300">Hubungkan Catatan Keuangan dengan aplikasi chat untuk mendapatkan notifikasi saldo harian dan pengingat catat pengeluaran.</p>
      </div>

      <div className="space-y-6 pb-20">
        
        {/* WhatsApp Card */}
        <div className="bg-dark-card rounded-3xl p-5 border border-green-500/20 shadow-[0_4px_30px_rgba(37,211,102,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-[#25D366]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-white">WhatsApp Bot</h3>
                <p className="text-xs text-slate-400">{waConnected ? 'Terhubung' : 'Belum terhubung'}</p>
              </div>
            </div>
            <button 
              onClick={() => setWaEnabled(!waEnabled)}
              className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${waEnabled ? 'bg-[#25D366]' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${waEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {waEnabled && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="w-full h-px bg-white/10 my-4"></div>
              <form onSubmit={handleConnectWa} className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-400">NOMOR WHATSAPP</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 flex items-center text-slate-300">
                    +62
                  </div>
                  <input 
                    type="number" 
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    placeholder="81234567890" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
                {!waConnected ? (
                  <button type="submit" className="w-full bg-[#25D366] text-[#0f1015] font-bold py-3 rounded-xl hover:bg-green-500 transition-colors mt-2 shadow-lg shadow-green-500/20">
                    Kirim OTP / Hubungkan
                  </button>
                ) : (
                  <button type="button" onClick={() => {setWaConnected(false); setWaEnabled(false)}} className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500/20 transition-colors mt-2">
                    Putuskan Koneksi
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Telegram Card */}
        <div className="bg-dark-card rounded-3xl p-5 border border-blue-500/20 shadow-[0_4px_30px_rgba(0,136,204,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#0088cc]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-white">Telegram Bot</h3>
                <p className="text-xs text-slate-400">{tgConnected ? 'Terhubung' : 'Belum terhubung'}</p>
              </div>
            </div>
            <button 
              onClick={() => setTgEnabled(!tgEnabled)}
              className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${tgEnabled ? 'bg-[#0088cc]' : 'bg-slate-600'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${tgEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {tgEnabled && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="w-full h-px bg-white/10 my-4"></div>
              <form onSubmit={handleConnectTg} className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-400">CHAT ID TELEGRAM</label>
                <div className="flex gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 flex items-center text-slate-300">
                    ID
                  </div>
                  <input 
                    type="number" 
                    value={tgChatId}
                    onChange={(e) => setTgChatId(e.target.value)}
                    placeholder="123456789" 
                    disabled={tgConnected}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Kirim <strong>/start</strong> ke bot Telegram Anda untuk melihat Chat ID.</p>
                
                {!tgConnected ? (
                  <button type="submit" disabled={isSavingTg} className="w-full bg-[#0088cc] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors mt-2 shadow-lg shadow-blue-500/20 disabled:opacity-50">
                    {isSavingTg ? "Menghubungkan..." : "Hubungkan Chat ID"}
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full bg-brand-green/20 text-brand-green font-bold py-3 rounded-xl transition-colors mt-2">
                      {isSettingWebhook ? "Loading..." : "Aktifkan Server Bot (Set Webhook)"}
                    </button>
                    <button type="button" onClick={handleDisconnectTg} className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500/20 transition-colors mt-2">
                      Putuskan Koneksi
                    </button>
                  </>
                )}
              </form>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
