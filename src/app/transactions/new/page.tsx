"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getFormData, createTransaction } from "@/actions/transaction";
import dynamic from "next/dynamic";
import Link from "next/link";

const QRScanner = dynamic(() => import("@/components/QRScanner"), { ssr: false });

export default function NewTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Data from DB
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Selections
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedToWallet, setSelectedToWallet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setIsClient(true);
    setDate(new Date().toISOString().split('T')[0]);
    getFormData().then((data) => {
      setWallets(data.wallets);
      setCategories(data.categories);
      
      if (data.wallets.length > 0) {
        setSelectedWallet(data.wallets[0].id);
        if (data.wallets.length > 1) {
          setSelectedToWallet(data.wallets[1].id);
        } else {
          setSelectedToWallet(data.wallets[0].id);
        }
      }
    });
  }, []);

  // Update default category when type changes
  useEffect(() => {
    const typeCategories = categories.filter(c => c.type === type);
    if (typeCategories.length > 0) {
      setSelectedCategory(typeCategories[0].id);
    }
  }, [type, categories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      alert("Masukkan nominal transaksi.");
      return;
    }
    if (!selectedWallet) {
      alert("Silakan buat Dompet terlebih dahulu sebelum menyimpan transaksi.");
      return;
    }
    
    setIsSaving(true);
    
    const res = await createTransaction({
      type,
      amount: Number(amount),
      walletId: selectedWallet,
      toWalletId: type === "transfer" ? selectedToWallet : undefined,
      categoryId: type !== "transfer" ? selectedCategory : undefined,
      date,
      note,
    });
    
    setIsSaving(false);
    
    if (res.success) {
      router.back();
      router.refresh();
    } else {
      alert("Gagal menyimpan transaksi");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  const formatRupiah = (value: string) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(Number(value));
  };

  const currentCategories = categories.filter(c => c.type === type);

  const handleScanSuccess = (decodedText: string) => {
    setIsScanning(false);
    
    // Append to note
    setNote((prev) => prev ? `${prev}\n[Scan]: ${decodedText}` : `[Scan]: ${decodedText}`);
    
    // Attempt to extract amount (find numbers without dots/commas)
    // We clean up typical currency formats first (e.g., Rp 50.000, 50,000)
    const cleanText = decodedText.replace(/Rp/gi, "").replace(/\./g, "").replace(/,/g, "");
    const numbers = cleanText.match(/\d+/g);
    
    if (numbers) {
      const possibleAmounts = numbers.map(Number).filter(n => n >= 1000);
      if (possibleAmounts.length > 0) {
        // Use the largest number found as the likely total amount
        const maxAmount = Math.max(...possibleAmounts);
        setAmount(maxAmount.toString());
      }
    }
  };

  return (
    <main className="px-5 pb-5 pt-20 flex flex-col min-h-screen relative bg-dark-bg">
      <header className="flex justify-between items-center mt-2 mb-6 relative z-50 pointer-events-auto">
        <Link href="/transactions" className="p-4 -ml-4 text-white/70 hover:text-white transition-colors cursor-pointer touch-manipulation pointer-events-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Tambah Transaksi</h1>
        </div>
        <div className="w-9"></div>
      </header>

      <div className="flex bg-dark-card p-1 rounded-2xl mb-8 border border-white/5 relative z-50 shadow-lg">
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setType("expense")}
          className={`flex-1 py-3 text-center text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none ${type === "expense" ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "text-slate-500 hover:text-slate-300"}`}
        >
          Pengeluaran
        </div>
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setType("income")}
          className={`flex-1 py-3 text-center text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none ${type === "income" ? "bg-green-500 text-[#0f1015] shadow-md shadow-green-500/20" : "text-slate-500 hover:text-slate-300"}`}
        >
          Pemasukan
        </div>
        <div 
          role="button"
          tabIndex={0}
          onClick={() => setType("transfer")}
          className={`flex-1 py-3 text-center text-xs font-semibold rounded-xl transition-colors cursor-pointer select-none ${type === "transfer" ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"}`}
        >
          Transfer
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 flex-1">
        
        <div className="flex flex-col items-center justify-center mb-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Nominal</p>
            {isClient && (
              <button 
                type="button" 
                onClick={() => {
                  if (window.isSecureContext || window.location.hostname === 'localhost') {
                    setIsScanning(true);
                  } else {
                    alert("Fitur scan membutuhkan koneksi HTTPS atau akses dari localhost.");
                  }
                }}
                className="bg-brand-green/10 text-green-500 hover:bg-brand-green/20 p-1.5 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                title="Scan Nota"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
              </button>
            )}
          </div>
          <div className="flex items-center text-white">
            <span className="text-2xl font-bold mr-2 text-slate-400">Rp</span>
            <input 
              type="text" 
              value={formatRupiah(amount)}
              onChange={handleAmountChange}
              placeholder="0"
              className="bg-transparent text-4xl font-bold outline-none w-[200px] text-center placeholder-slate-600" 
              autoFocus
            />
          </div>
        </div>

        <div className="bg-dark-card rounded-3xl p-5 border border-white/5 shadow-xl flex flex-col gap-5">
          
          {type !== "transfer" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold tracking-wider text-slate-400">KATEGORI</label>
              <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none focus:border-brand-green transition-colors"
                >
                  {currentCategories.length === 0 && <option value="" disabled>Belum ada kategori</option>}
                  {currentCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold tracking-wider text-slate-400">
              {type === "transfer" ? "DARI DOMPET" : "DOMPET"}
            </label>
            <div className="relative">
              <select 
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none focus:border-brand-green transition-colors"
              >
                {wallets.length === 0 && <option value="" disabled>Belum ada dompet</option>}
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {type === "transfer" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold tracking-wider text-slate-400">KE DOMPET TUJUAN</label>
              <div className="relative">
                <select 
                  value={selectedToWallet}
                  onChange={(e) => setSelectedToWallet(e.target.value)}
                  className="w-full bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none focus:border-brand-green transition-colors"
                >
                  {wallets.length === 0 && <option value="" disabled>Belum ada dompet</option>}
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold tracking-wider text-slate-400">TANGGAL</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-green transition-colors [color-scheme:dark]" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-semibold tracking-wider text-slate-400">CATATAN (OPSIONAL)</label>
            <textarea 
              rows={2} 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Keterangan tambahan..." 
              className="w-full bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-green transition-colors resize-none placeholder-slate-600"
            ></textarea>
          </div>

        </div>

        <div className="mt-auto pt-6 pb-8">
          <button 
            type="submit" 
            disabled={isSaving || !amount}
            className={`w-full font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 cursor-pointer ${
              type === 'expense' ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.4)]' :
              type === 'income' ? 'bg-green-500 text-[#0f1015] shadow-[0_4px_14px_rgba(46,204,113,0.4)]' :
              'bg-blue-500 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : "Simpan Transaksi"}
          </button>
        </div>
      </form>
      
      {isScanning && (
        <QRScanner 
          onScanSuccess={handleScanSuccess} 
          onClose={() => setIsScanning(false)} 
        />
      )}
    </main>
  );
}
