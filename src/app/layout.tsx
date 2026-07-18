import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AudioProvider from "@/components/AudioProvider";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catatan Keuangan",
  description: "Aplikasi catatan keuangan pribadi",
  appleWebApp: {
    title: "Keuangan",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f1015",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.add('light-theme');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        {/* Mobile Container */}
        <div className="w-full max-w-md mx-auto bg-transparent min-h-[100dvh] relative pb-32 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {children}
          
          <AudioProvider />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
