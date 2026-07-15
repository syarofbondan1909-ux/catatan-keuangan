import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import { deleteTransaction } from "@/actions/transaction";
import Link from "next/link";

export default async function TransactionsPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  
  const currentDate = new Date();
  const monthParam = searchParams.month ? parseInt(searchParams.month as string) : currentDate.getMonth() + 1;
  const yearParam = searchParams.year ? parseInt(searchParams.year as string) : currentDate.getFullYear();
  
  // Validasi parameter (fallback jika tidak valid)
  const safeMonth = (monthParam >= 1 && monthParam <= 12) ? monthParam : currentDate.getMonth() + 1;
  const safeYear = (yearParam > 2000 && yearParam < 2100) ? yearParam : currentDate.getFullYear();
  
  const startOfMonth = new Date(safeYear, safeMonth - 1, 1);
  const endOfMonth = new Date(safeYear, safeMonth, 1);
  
  // Hitung navigasi
  const prevMonthDate = new Date(safeYear, safeMonth - 2, 1);
  const nextMonthDate = new Date(safeYear, safeMonth, 1);
  
  const prevMonthStr = `?month=${prevMonthDate.getMonth() + 1}&year=${prevMonthDate.getFullYear()}`;
  const nextMonthStr = `?month=${nextMonthDate.getMonth() + 1}&year=${nextMonthDate.getFullYear()}`;
  
  const monthName = startOfMonth.toLocaleDateString("id-ID", { month: 'long', year: 'numeric' }).toUpperCase();

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lt: endOfMonth
      }
    },
    orderBy: { date: 'desc' },
    include: { category: true, wallet: true, toWallet: true }
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  // Group by date
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const dateStr = new Date(tx.date).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(tx);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative pb-24">
      {/* Header */}
      <Header name="Bondan" />

      {/* Month Selector */}
      <div className="flex justify-between items-center mt-2">
        <Link href={prevMonthStr} className="p-2 bg-dark-card border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="text-center">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">{monthName}</h2>
        </div>
        <Link href={nextMonthStr} className="p-2 bg-dark-card border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>

      {/* Analytics Chart Mock */}
      <div className="bg-dark-card border border-white/5 rounded-3xl p-5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs font-bold text-slate-400 tracking-wider">STATISTIK PENGELUARAN</p>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
        </div>
        <div className="flex items-end justify-between h-32 gap-2 mt-4 px-2">
          {[40, 70, 30, 85, 50, 95, 60].map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
              <div className="w-full relative flex items-end justify-center h-full bg-white/5 rounded-t-md overflow-hidden">
                <div 
                  className={`w-full rounded-t-md transition-all duration-500 ease-out shadow-[0_0_15px_rgba(46,204,113,0.5)] ${i % 2 === 0 ? 'bg-red-500/80' : 'bg-brand-green/80'}`} 
                  style={{ height: `${height}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col gap-6 mt-4">
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date}>
            <p className="text-xs font-bold text-slate-500 mb-3 tracking-wider">{date}</p>
            <div className="flex flex-col gap-3">
              {txs.map((tx) => {
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
                        {tx.type === 'transfer' ? `${tx.wallet?.name} -> ${tx.toWallet?.name}` : tx.wallet?.name}
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
              }
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p className="text-slate-400">Belum ada transaksi</p>
          </div>
        )}
      </div>
    </main>
  );
}
