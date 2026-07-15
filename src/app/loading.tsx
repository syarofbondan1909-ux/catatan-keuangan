export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 animate-in fade-in duration-300">
      <div className="w-10 h-10 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">Memuat data...</p>
    </div>
  );
}
