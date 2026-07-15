"use client";

import Link from "next/link";
import { useState } from "react";
import { getTransactionsForExport } from "@/actions/export";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ExportPage() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear().toString());
  const [month, setMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, '0'));
  const [isLoading, setIsLoading] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
  };

  const handleExportCSV = async () => {
    setIsLoading(true);
    const res = await getTransactionsForExport(Number(year), Number(month));
    setIsLoading(false);

    if (!res.success || !res.data) {
      alert("Gagal mengambil data");
      return;
    }

    if (res.data.length === 0) {
      alert("Tidak ada transaksi pada bulan ini");
      return;
    }

    const headers = ["Tanggal", "Tipe", "Kategori", "Nominal", "Dompet", "Ke Dompet", "Catatan"];
    const rows = res.data.map((tx: any) => [
      new Date(tx.date).toLocaleDateString('id-ID'),
      tx.type === "income" ? "Pemasukan" : tx.type === "expense" ? "Pengeluaran" : "Transfer",
      tx.category?.name || "-",
      tx.amount.toString(),
      tx.wallet?.name || "-",
      tx.toWallet?.name || "-",
      tx.note || "-"
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map((e: string[]) => e.map(cell => `"${cell}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Keuangan_${year}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    setIsLoading(true);
    const res = await getTransactionsForExport(Number(year), Number(month));
    setIsLoading(false);

    if (!res.success || !res.data) {
      alert("Gagal mengambil data");
      return;
    }

    if (res.data.length === 0) {
      alert("Tidak ada transaksi pada bulan ini");
      return;
    }

    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Laporan Keuangan - Bulan ${month} Tahun ${year}`, 14, 22);

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    const tableData = res.data.map((tx: any) => {
      if (tx.type === "income") totalPemasukan += tx.amount;
      if (tx.type === "expense") totalPengeluaran += tx.amount;

      return [
        new Date(tx.date).toLocaleDateString('id-ID'),
        tx.type === "income" ? "Pemasukan" : tx.type === "expense" ? "Pengeluaran" : "Transfer",
        tx.category?.name || "-",
        formatRupiah(tx.amount),
        tx.wallet?.name || "-",
        tx.toWallet?.name || "-",
        tx.note || "-"
      ];
    });

    (doc as any).autoTable({
      startY: 30,
      head: [["Tanggal", "Tipe", "Kategori", "Nominal", "Dompet", "Ke Dompet", "Catatan"]],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [46, 204, 113] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 30;
    doc.setFontSize(12);
    doc.text(`Total Pemasukan: ${formatRupiah(totalPemasukan)}`, 14, finalY + 10);
    doc.text(`Total Pengeluaran: ${formatRupiah(totalPengeluaran)}`, 14, finalY + 18);
    doc.text(`Selisih: ${formatRupiah(totalPemasukan - totalPengeluaran)}`, 14, finalY + 26);

    doc.save(`Laporan_Keuangan_${year}_${month}.pdf`);
  };

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative pb-24 bg-dark-bg">
      <header className="flex justify-between items-center mt-2">
        <Link href="/profile" className="p-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Ekspor Laporan</h1>
        </div>
        <div className="w-9"></div>
      </header>

      <div className="bg-dark-card rounded-3xl p-6 border border-white/5 shadow-xl text-center py-8">
        <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Unduh Data Transaksi</h2>
        <p className="text-sm text-slate-400 mb-6">Pilih bulan dan tahun untuk mengunduh laporan keuangan Anda.</p>
        
        <div className="flex gap-4 mb-8 text-left">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">BULAN</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              className="bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-green transition-colors"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={(i+1).toString().padStart(2, '0')}>
                  {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">TAHUN</label>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              className="bg-[#12131a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-green transition-colors"
            >
              {[...Array(5)].map((_, i) => {
                const y = currentDate.getFullYear() - i;
                return <option key={y} value={y.toString()}>{y}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleExportPDF}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? "Memproses..." : "Unduh PDF"}
          </button>
          
          <button 
            onClick={handleExportCSV}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-[#0f1015] font-bold p-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? "Memproses..." : "Unduh Excel (CSV)"}
          </button>
        </div>
      </div>
    </main>
  );
}
