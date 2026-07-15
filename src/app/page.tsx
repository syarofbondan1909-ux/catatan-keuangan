import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import { deleteTransaction } from "@/actions/transaction";

export default async function Home() {
  let wallets: any[] = [];
  let transactions: any[] = [];
  let recentTransactions: any[] = [];
  let errorDetails = "";

  try {
    // Fetch real data from DB
    wallets = await prisma.wallet.findMany();
    
    // Get current month transactions for income/expense calculation
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    transactions = await prisma.transaction.findMany({
      where: { date: { gte: startOfMonth } },
      include: { category: true, wallet: true },
      orderBy: { date: 'desc' }
    });

    // Recent transactions (last 3)
    recentTransactions = await prisma.transaction.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { category: true, wallet: true, toWallet: true }
    });
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
      <div>
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">TOTAL SALDO</p>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{formatRupiah(totalBalance)}</h2>
      </div>

      {/* Mini Dashboard */}
      <div className="flex flex-col gap-3">
        {/* Income Card */}
        <div className="bg-dark-card p-4 rounded-2xl flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">PEMASUKAN</p>
              <p className="text-xs font-medium text-brand-green">{formatRupiah(income)}</p>
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-dark-card p-4 rounded-2xl flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-brand-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">PENGELUARAN</p>
              <p className="text-xs font-medium text-brand-green">{formatRupiah(expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="mt-2 mb-20">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold text-white">Transaksi Terbaru</h3>
          <button className="text-xs text-brand-yellow font-medium">Lihat Semua</button>
        </div>
        
        <div className="flex flex-col gap-3">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">Belum ada transaksi</p>
          ) : (
            recentTransactions.map((tx) => {
              const deleteTx = deleteTransaction.bind(null, tx.id);
              return (
              <div key={tx.id} className="bg-dark-card p-4 rounded-2xl flex justify-between items-center border border-white/5 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'expense' ? 'bg-red-500/10 text-red-500' : 
                    tx.type === 'income' ? 'bg-brand-green/10 text-brand-green' : 
                    'bg-brand-blue/10 text-brand-blue'
                  }`}>
                    {tx.type === 'transfer' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
                    ) : tx.type === 'income' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{tx.category?.name || "Transfer"}</h4>
                    <p className="text-[10px] text-slate-400">
                      {tx.type === 'transfer' ? `${tx.wallet?.name} -> ${tx.toWallet?.name}` : tx.wallet?.name} • {new Date(tx.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-sm font-bold ${tx.type === 'expense' ? 'text-red-500' : tx.type === 'income' ? 'text-brand-green' : 'text-brand-blue'}`}>
                    {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                    {formatRupiah(tx.amount)}
                  </div>
                  {/* @ts-ignore */}
                  <form action={deleteTx}>
                    <button type="submit" className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Hapus transaksi">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </form>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </main>
  );
}
