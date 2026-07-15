"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCategory } from "@/actions/category";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;

    if (!name || !type) {
      setError("Nama kategori dan tipe harus diisi");
      setLoading(false);
      return;
    }

    try {
      const res = await createCategory({
        name,
        type,
      });

      if (res.success) {
        router.push("/categories");
        router.refresh();
      } else {
        setError(res.error || "Gagal membuat kategori");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-bg p-5 flex flex-col relative pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/categories" className="p-2 bg-dark-card border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-xl font-bold text-white">Tambah Kategori</h1>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Tipe Kategori */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Tipe Kategori</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="type" value="expense" className="peer sr-only" defaultChecked />
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center peer-checked:bg-red-500/10 peer-checked:border-red-500 peer-checked:text-red-500 text-slate-400 transition-colors">
                  <p className="text-xs font-bold uppercase tracking-wider">Pengeluaran</p>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="type" value="income" className="peer sr-only" />
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center peer-checked:bg-brand-green/10 peer-checked:border-brand-green peer-checked:text-brand-green text-slate-400 transition-colors">
                  <p className="text-xs font-bold uppercase tracking-wider">Pemasukan</p>
                </div>
              </label>
            </div>
          </div>

          {/* Nama Kategori */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-bold tracking-widest text-slate-400 uppercase">Nama Kategori</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              placeholder="Contoh: Makanan, Gaji, dll" 
              required
              className="bg-transparent border-b border-white/20 pb-2 text-white font-medium focus:outline-none focus:border-brand-green transition-colors text-lg"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full bg-brand-green hover:bg-brand-green/90 text-dark-bg font-bold p-4 rounded-xl shadow-[0_0_20px_rgba(46,204,113,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-dark-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Simpan Kategori"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
