import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

QrScanner.WORKER_PATH = new URL("qr-scanner/qr-scanner-worker.min.js", import.meta.url).toString();

export default function QrScannerPanel({ onResult }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [lastValue, setLastValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!active) return;
    const videoElem = videoRef.current;
    if (!videoElem) return;

    const scanner = new QrScanner(
      videoElem,
      result => {
        setLastValue(result?.data || result);
        setStatus("QR detected");
        setError("");
        onResult?.(result?.data || result);
        stopScanner();
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: "environment"
      }
    );

    scannerRef.current = scanner;
    setStatus("Requesting camera...");
    scanner
      .start()
      .then(() => setStatus("Scanning..."))
      .catch(err => {
        setError(err.message || "Camera access denied");
        setStatus("Idle");
        setActive(false);
      });

    return () => stopScanner();
  }, [active, onResult]);

  const stopScanner = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setActive(false);
  };

  return (
    <div className="panel">
      <div className="panel__title">Scan Vehicle QR</div>
      <p className="muted">Scan the SafePath vehicle QR to auto-load the vehicle record and issue history.</p>

      <div className="qr-actions">
        <button type="button" onClick={() => setActive(true)} disabled={active}>
          {active ? "Scanning..." : "Start Scan"}
        </button>
        {active && (
          <button type="button" onClick={stopScanner} className="secondary">
            Stop
          </button>
        )}
        <div className="pill">{status}</div>
      </div>

      {error && <div className="pill pill--error">{error}</div>}
      {lastValue && (
        <div className="muted">Last QR: <code>{lastValue}</code></div>
      )}

      <div className="qr-video">
        {active ? <video ref={videoRef} /> : <div className="muted">Camera preview will appear when scanning.</div>}
      </div>
    </div>
  );
}
