"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LocalNotifications } from '@capacitor/local-notifications';

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);
  const [time, setTime] = useState("20:00");
  const [permissionStatus, setPermissionStatus] = useState<string>("checking...");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    checkPermission();
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    const savedTime = localStorage.getItem("notif_time");
    if (savedTime) setTime(savedTime);
    
    // Check if we have scheduled notifications
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        setIsEnabled(true);
      }
    } catch (e) {
      console.error("LocalNotifications not available (likely web browser without support):", e);
    }
  };

  const checkPermission = async () => {
    try {
      const status = await LocalNotifications.checkPermissions();
      setPermissionStatus(status.display);
    } catch (e) {
      setPermissionStatus("unsupported (web)");
    }
  };

  const requestPermission = async () => {
    try {
      const status = await LocalNotifications.requestPermissions();
      setPermissionStatus(status.display);
      if (status.display === 'granted') {
        alert("Izin notifikasi diberikan!");
      } else {
        alert("Izin notifikasi ditolak. Anda mungkin perlu mengizinkannya secara manual di pengaturan HP.");
      }
    } catch (e) {
      alert("Tidak dapat meminta izin notifikasi di perangkat ini.");
    }
  };

  const scheduleNotification = async (notifTime: string) => {
    try {
      // Clear existing first
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }

      if (!isEnabled) return;

      const [hour, minute] = notifTime.split(':').map(Number);
      
      const now = new Date();
      const scheduleDate = new Date();
      scheduleDate.setHours(hour, minute, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduleDate <= now) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Pengingat Catat Keuangan",
            body: "Jangan lupa untuk mencatat pengeluaran dan pemasukan Anda hari ini!",
            id: 1,
            schedule: { 
              at: scheduleDate,
              every: 'day' // Repeats daily
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null
          }
        ]
      });

      console.log("Notification scheduled for:", scheduleDate);
    } catch (e) {
      console.error("Failed to schedule notification:", e);
    }
  };

  const handleToggle = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (newState) {
      if (permissionStatus !== 'granted') {
        alert("Silakan berikan izin notifikasi terlebih dahulu.");
        setIsEnabled(false);
        return;
      }
      await scheduleNotification(time);
    } else {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }
      } catch (e) {}
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    localStorage.setItem("notif_time", newTime);
    
    if (isEnabled) {
      scheduleNotification(newTime);
    }
  };

  if (!isClient) return null;

  return (
    <main className="p-5 flex flex-col gap-6 min-h-screen relative">
      <header className="flex justify-between items-center mt-2">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">Notifikasi</h1>
        </div>
        <div className="w-9"></div>
      </header>

      <div className="mt-4 space-y-6">
        <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Pengingat Harian</h2>
              <p className="text-xs text-slate-400">Ingatkan saya mencatat keuangan</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
            <span className="text-sm text-slate-200 font-medium">Status Izin: 
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${permissionStatus === 'granted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {permissionStatus}
              </span>
            </span>
            {permissionStatus !== 'granted' && permissionStatus !== 'unsupported (web)' && (
              <button 
                onClick={requestPermission}
                className="text-xs bg-brand-blue/20 text-brand-blue px-3 py-1.5 rounded-full font-bold hover:bg-brand-blue/30 transition-colors"
              >
                Izinkan
              </button>
            )}
          </div>
        </div>

        <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-lg flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Aktifkan Pengingat</h3>
              <p className="text-[10px] text-slate-400 mt-1">Jadwalkan notifikasi lokal otomatis</p>
            </div>
            <button 
              onClick={handleToggle}
              className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${isEnabled ? 'bg-brand-green' : 'bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className={`flex items-center justify-between border-t border-white/5 pt-5 transition-opacity ${isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-sm font-bold text-slate-300">Jam Pengingat</h3>
            <input 
              type="time" 
              value={time}
              onChange={handleTimeChange}
              disabled={!isEnabled}
              className="bg-[#12131a] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-green transition-colors font-bold text-lg [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p className="text-xs text-blue-300/80 leading-relaxed">
            Jika notifikasi tidak muncul saat waktunya tiba, pastikan aplikasi ini diizinkan berjalan di latar belakang (Background Activity) pada pengaturan baterai HP Anda.
          </p>
        </div>
      </div>
    </main>
  );
}
