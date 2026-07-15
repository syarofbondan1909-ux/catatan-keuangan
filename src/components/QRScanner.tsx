"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Create the scanner instance
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // Stop scanning after a successful scan
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
        }
        onScanSuccess(decodedText);
      },
      (error) => {
        // Ignore scan failures (happens continuously when no QR is found)
      }
    );

    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center p-5">
      <div className="bg-dark-card w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
        <div className="p-4 flex justify-between items-center border-b border-white/5 bg-[#1a1b23]">
          <h3 className="text-white font-bold text-sm">Scan QR / Barcode</h3>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        {/* The div where html5-qrcode will render the video stream */}
        <div id="qr-reader" className="w-full bg-black"></div>
        
        <div className="p-4 bg-[#1a1b23] text-center">
          <p className="text-xs text-slate-400">Arahkan kamera ke QR Code atau Barcode pada nota.</p>
        </div>
      </div>
    </div>
  );
}
