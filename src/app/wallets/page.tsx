import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { deleteWallet } from "@/actions/wallet";
import DeleteForm from "@/components/DeleteForm";

export default async function WalletsPage() {
  const wallets = await prisma.wallet.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative pb-24">
      {/* Header */}
      <Header name="Bondan" />

      <div className="flex justify-between items-end mt-2">
        <div>
          <h2 className="text-xl font-bold text-white">Dompet Saya</h2>
          <p className="text-xs text-slate-400">Kelola semua rekening & e-wallet</p>
        </div>
        <Link href="/wallets/new" className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center hover:bg-brand-green/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="bg-dark-card p-4 rounded-2xl flex justify-between items-center border border-white/5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                wallet.type === 'debit' ? 'bg-brand-blue/10 text-brand-blue' : 
                wallet.type === 'ewallet' ? 'bg-brand-green/10 text-brand-green' : 
                'bg-brand-yellow/10 text-brand-yellow'
              }`}>
                {wallet.type === 'debit' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                ) : wallet.type === 'ewallet' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h12"/><path d="M12 16v-4"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{wallet.name}</h3>
                <p className="text-[10px] uppercase tracking-wider font-medium text-slate-400 mt-1">
                  {wallet.type}
                </p>
              </div>
            </div>
            <div className="text-right flex items-center justify-end gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Saldo</p>
                <h2 className="text-lg font-bold text-white">{formatRupiah(wallet.balance)}</h2>
              </div>
              <DeleteForm 
                action={deleteWallet.bind(null, wallet.id)}
                confirmMessage="Yakin ingin menghapus dompet ini beserta seluruh transaksinya?"
                title="Hapus dompet"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
