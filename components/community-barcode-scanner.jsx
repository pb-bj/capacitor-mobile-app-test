'use client';

import { useEffect, useState } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export default function BarcodeScannerCommunity({ onClose, onResult }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    return () => {
      BarcodeScanner.stopScan();
      BarcodeScanner.showBackground();
      document.body.classList.remove('scanner-active');
    };
  }, []);

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    return status.granted;
  };

  const startScan = async () => {
    try {
      const granted = await checkPermission();
      if (!granted) {
        alert('Camera permission is required');
        return;
      }

      setScanning(true);
      setResult(null);

      // Hide WebView background
      BarcodeScanner.hideBackground();
      document.body.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();

      if (result?.hasContent) {
        setResult(result.content);
        onResult?.(result.content);
      }
    } catch (err) {
      console.error('Scan error', err);
      alert('Scan failed');
    } finally {
      setScanning(false);
      BarcodeScanner.showBackground();
      document.body.classList.remove('scanner-active');
    }
  };

  const reset = () => setResult(null);

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {/* Close */}
        <button onClick={onClose} style={closeBtnStyle}>✕</button>

        {!supported ? (
          <p style={{ color: 'red' }}>Scanning not supported</p>
        ) : !result ? (
          <>
            {/* Frame */}
            <div style={frameStyle(scanning)}>
              {scanning ? (
                <p style={{ fontSize: 14, fontWeight: 600 }}>
                  Opening Camera…
                </p>
              ) : (
                <span style={{ fontSize: 42 }}>▢</span>
              )}
            </div>

            <p style={{ fontSize: 13, color: '#777', marginBottom: 20 }}>
              Point your camera at a QR code
            </p>

            <button
              onClick={startScan}
              disabled={scanning}
              style={primaryBtn(scanning)}
            >
              {scanning ? 'Scanning…' : 'Start Scan'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Scanned!</h2>

            <div style={resultBox}>
              {result}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={outlineBtn} onClick={reset}>
                Scan Again
              </button>
              <button
                style={primaryBtn(false)}
                onClick={() => navigator.clipboard.writeText(result)}
              >
                Copy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}