import prisma from "@/lib/prisma";
import Link from "next/link";

import TambahKategoriButton from "@/components/TambahKategoriButton";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { type: 'asc' }
  });

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative pb-24 bg-dark-bg">
      <header className="flex justify-between items-center mt-2">
        <Link href="/profile" className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Kelola Kategori</h1>
        </div>
        <div className="w-9"></div>
      </header>

      <div className="bg-dark-card rounded-3xl p-5 border border-white/5 shadow-xl">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-sm font-bold text-white tracking-wider">DAFTAR KATEGORI</h2>
          <TambahKategoriButton />
        </div>
        
        <div className="flex flex-col gap-3">
          {categories.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${c.type === 'expense' ? 'bg-red-500' : 'bg-brand-green'}`}></div>
                <span className="text-sm font-medium text-white">{c.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                c.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-brand-green/10 text-brand-green'
              }`}>
                {c.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
