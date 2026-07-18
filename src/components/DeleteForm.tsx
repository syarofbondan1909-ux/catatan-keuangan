"use client";

import { useTransition, useRef } from "react";
import { deleteSound } from "@/lib/audio";

export default function DeleteForm({ 
  action, 
  confirmMessage, 
  title 
}: { 
  action: () => Promise<any>;
  confirmMessage: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm(confirmMessage)) {
      if (!audioRef.current) {
        audioRef.current = new Audio(deleteSound);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      
      startTransition(() => {
        action();
      });
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button 
        type="submit" 
        disabled={isPending}
        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50 shrink-0" 
        title={title}
      >
        {isPending ? (
           <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        )}
      </button>
    </form>
  );
}
