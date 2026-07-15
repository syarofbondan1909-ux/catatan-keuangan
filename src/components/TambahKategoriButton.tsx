"use client";
import { useRouter } from "next/navigation";

export default function TambahKategoriButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push("/categories/new")}
      className="text-xs text-[#0f1015] font-bold px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all shadow-[0_0_15px_rgba(46,204,113,0.3)] inline-flex items-center justify-center cursor-pointer relative z-20"
    >
      + Tambah Kategori
    </button>
  );
}
