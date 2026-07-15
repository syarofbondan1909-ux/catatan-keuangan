import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.catatankeuangan.app',
  appName: 'Catatan Keuangan',
  webDir: '.next',
  server: {
    url: 'http://192.168.1.6:3000',
    cleartext: true
  }
};

export default config;
