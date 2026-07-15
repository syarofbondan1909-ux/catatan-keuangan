import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.catatankeuangan.app',
  appName: 'Catatan Keuangan',
  webDir: 'public',
  server: {
    url: 'https://catatan-keuangan-tqk1-eight.vercel.app',
    cleartext: true
  }
};

export default config;
