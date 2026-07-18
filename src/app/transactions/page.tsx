import Header from "@/components/Header";
import prisma from "@/lib/prisma";
import { deleteTransaction } from "@/actions/transaction";
import Link from "next/link";
import DeleteForm from "@/components/DeleteForm";

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

  const weeklyStats = Array(7).fill(0).map(() => ({ income: 0, expense: 0 }));
  
  transactions.forEach(tx => {
    const dayOfWeek = new Date(tx.date).getDay(); // 0 (Sun) - 6 (Sat)
    const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 (Mon) - 6 (Sun)
    
    if (tx.type === 'income') {
      weeklyStats[index].income += tx.amount;
    } else if (tx.type === 'expense') {
      weeklyStats[index].expense += tx.amount;
    }
  });

  let maxAmount = 0;
  weeklyStats.forEach(stat => {
    if (stat.income > maxAmount) maxAmount = stat.income;
    if (stat.expense > maxAmount) maxAmount = stat.expense;
  });
  if (maxAmount === 0) maxAmount = 1;

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

      {/* Analytics Chart */}
      <div className="bg-dark-card border border-white/5 rounded-3xl p-5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider">STATISTIK (PER HARI)</p>
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_5px_rgba(46,204,113,0.5)]"></span>
            <span className="text-[9px] text-slate-400 mr-1 uppercase">Pemasukan</span>
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
            <span className="text-[9px] text-slate-400 uppercase">Pengeluaran</span>
          </div>
        </div>
        <div className="flex items-end justify-between h-32 gap-2 mt-4 px-1">
          {weeklyStats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer h-full justify-end">
              <div className="w-full relative flex items-end justify-center h-full bg-white/5 rounded-t-md overflow-hidden gap-[2px] p-[2px]">
                {/* Income Bar */}
                <div 
                  className="w-1/2 rounded-t-sm transition-all duration-500 ease-out bg-brand-green/80 hover:bg-brand-green shadow-[0_0_10px_rgba(46,204,113,0.3)]" 
                  style={{ height: `${(stat.income / maxAmount) * 100}%` }}
                  title={`Pemasukan: Rp ${stat.income.toLocaleString('id-ID')}`}
                ></div>
                {/* Expense Bar */}
                <div 
                  className="w-1/2 rounded-t-sm transition-all duration-500 ease-out bg-red-500/80 hover:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                  style={{ height: `${(stat.expense / maxAmount) * 100}%` }}
                  title={`Pengeluaran: Rp ${stat.expense.toLocaleString('id-ID')}`}
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
                        {tx.type === 'transfer' ? `${tx.wallet?.name} -> ${tx.toWallet?.name}` : tx.wallet?.name} • {new Date(tx.date).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-sm font-bold ${tx.type === 'expense' ? 'text-red-500' : tx.type === 'income' ? 'text-brand-green' : 'text-brand-blue'}`}>
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
