'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen text-white text-center gap-4">
      <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
      <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 w-full text-left overflow-auto">
        <p className="text-sm font-mono text-red-400 break-words whitespace-pre-wrap">{error.message}</p>
        <p className="text-xs font-mono text-red-400/50 mt-4 break-words whitespace-pre-wrap">{error.stack}</p>
      </div>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-brand-green rounded-xl text-black font-bold"
      >
        Try again
      </button>
    </div>
  );
}
