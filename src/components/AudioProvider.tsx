"use client";

import { coinSound, deleteSound, notifSound } from "@/lib/audio";

export default function AudioProvider() {
  return (
    <>
      <audio id="audio-coin" src={coinSound} preload="auto" />
      <audio id="audio-delete" src={deleteSound} preload="auto" />
      <audio id="audio-notif" src={notifSound} preload="auto" />
    </>
  );
}

export const playAudio = (id: 'audio-coin' | 'audio-delete' | 'audio-notif') => {
  if (typeof window !== "undefined") {
    const el = document.getElementById(id) as HTMLAudioElement | null;
    if (el) {
      el.currentTime = 0;
      el.play().catch(e => console.log("Audio play error:", e));
    }
  }
};
