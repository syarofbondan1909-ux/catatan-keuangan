"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PinSettingsPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [step, setStep] = useState(1); // 1: Enter new, 2: Confirm
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 6) {
        if (step === 1) {
          setTimeout(() => {
            setStep(2);
            setPin("");
          }, 300);
        } else {
          // Finish setup
          setIsSuccess(true);
          setTimeout(() => {
            router.back();
          }, 1500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <main className="p-5 flex flex-col min-h-screen relative bg-dark-bg">
      <header className="flex justify-between items-center mt-2 mb-12">
        <button onClick={() => router.back()} className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Keamanan PIN</h1>
        </div>
        <div className="w-9"></div>
      </header>

      {isSuccess ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">PIN Berhasil Diatur</h2>
          <p className="text-slate-400">PIN baru Anda telah disimpan.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-xl font-bold text-white mb-2">
              {step === 1 ? "Buat PIN Baru" : "Konfirmasi PIN"}
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              {step === 1 ? "Masukkan 6 digit PIN untuk keamanan" : "Masukkan kembali PIN Anda"}
            </p>
            
            <div className="flex gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-colors ${i < pin.length ? 'bg-brand-green shadow-[0_0_8px_rgba(46,204,113,0.8)]' : 'bg-slate-700'}`}></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-y-8 gap-x-6 max-w-[280px] mx-auto mt-auto mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num.toString())}
                className="w-16 h-16 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-2xl font-medium text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm"
              >
                {num}
              </button>
            ))}
            <div className="col-start-2">
              <button 
                onClick={() => handleKeyPress("0")}
                className="w-16 h-16 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-2xl font-medium text-white hover:bg-white/10 active:scale-95 transition-all shadow-sm mx-auto"
              >
                0
              </button>
            </div>
            <div className="col-start-3 flex items-center justify-center">
              <button 
                onClick={handleDelete}
                className="p-4 text-slate-400 hover:text-white active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><line x1="18" x2="12" y1="9" y2="15"/><line x1="12" x2="18" y1="9" y2="15"/></svg>
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
