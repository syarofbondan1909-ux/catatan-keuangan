import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import { deleteTransaction } from "@/actions/transaction";
import DeleteForm from "@/components/DeleteForm";

export default async function Home() {
  let wallets: any[] = [];
  let transactions: any[] = [];
  let recentTransactions: any[] = [];
  let errorDetails = "";

  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Fetch real data from DB concurrently using Promise.all
    const [fetchedWallets, fetchedTransactions, fetchedRecent] = await Promise.all([
      prisma.wallet.findMany(),
      prisma.transaction.findMany({
        where: { date: { gte: startOfMonth } },
        include: { category: true, wallet: true },
        orderBy: { date: 'desc' }
      }),
      prisma.transaction.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { category: true, wallet: true, toWallet: true }
      })
    ]);

    wallets = fetchedWallets;
    transactions = fetchedTransactions;
    recentTransactions = fetchedRecent;
  } catch (e: any) {
    errorDetails = e.message || e.toString();
    console.error("PRISMA ERROR:", e);
  }

  if (errorDetails) {
    return (
      <main className="p-5 flex flex-col gap-6">
        <div className="bg-red-500/20 p-5 rounded-xl border border-red-500">
          <h2 className="text-xl font-bold text-red-500 mb-2">Database Error!</h2>
          <pre className="text-xs text-red-300 whitespace-pre-wrap">{errorDetails}</pre>
        </div>
      </main>
    );
  }

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <main className="p-5 flex flex-col gap-6">
      {/* Header */}
      <Header name="Bondan" />


      {/* Saldo Ringkasan */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-blue/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <p className="text-[11px] font-bold tracking-widest text-white/70 uppercase mb-2">Total Saldo</p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">{formatRupiah(totalBalance)}</h2>
        </div>
      </div>

      {/* Mini Dashboard Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Income Card */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-3 shadow-md hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green shadow-[0_0_10px_rgba(46,204,113,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pemasukan</p>
            <p className="text-sm font-bold text-white">{formatRupiah(income)}</p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="glass-card p-4 rounded-2xl flex flex-col gap-3 shadow-md hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pengeluaran</p>
            <p className="text-sm font-bold text-white">{formatRupiah(expense)}</p>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="mt-2 mb-20">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold text-white">Transaksi Terbaru</h3>
          <button className="text-xs text-brand-cyan font-medium hover:text-white transition-colors">Lihat Semua</button>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentTransactions.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <svg className="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <p className="text-sm font-bold text-white mb-1">Belum ada transaksi</p>
              <p className="text-xs text-slate-400">Transaksi bulan ini akan muncul di sini.</p>
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const deleteTx = deleteTransaction.bind(null, tx.id);
              return (
              <div key={tx.id} className="glass-card p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'expense' ? 'bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 
                    tx.type === 'income' ? 'bg-brand-green/20 text-brand-green shadow-[0_0_10px_rgba(46,204,113,0.2)]' : 
                    'bg-brand-blue/20 text-brand-blue shadow-[0_0_10px_rgba(15,98,254,0.2)]'
                  }`}>
                    {tx.type === 'transfer' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                    ) : tx.type === 'income' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">{tx.category?.name || "Transfer"}</h4>
                    <p className="text-[11px] text-slate-400">
                      {tx.type === 'transfer' ? `${tx.wallet?.name} ➔ ${tx.toWallet?.name}` : tx.wallet?.name} • {new Date(tx.date).toLocaleString("id-ID", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-sm font-bold tracking-tight ${tx.type === 'expense' ? 'text-white' : tx.type === 'income' ? 'text-brand-green' : 'text-brand-cyan'}`}>
                    {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                    {formatRupiah(tx.amount)}
                  </div>
                  <DeleteForm 
                    action={deleteTx}
                    confirmMessage="Yakin ingin menghapus transaksi ini?"
                    title="Hapus transaksi"
                  />
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </main>
  );
}
