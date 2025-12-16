import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVehicleFromQr } from "../controllers/vehicleController";
import QrScannerPanel from "../views/QrScannerPanel";
import QrProfileCard from "../views/QrProfileCard";

const parseBusStopQr = raw => {
  if (!raw) return null;
  const trimmed = String(raw).trim();

  try {
    const asJson = JSON.parse(trimmed);
    if (asJson.type?.toLowerCase?.() === "bus_stop" || asJson.kind === "BUS_STOP" || asJson.stopType === "BUS_STOP") {
      return {
        code: asJson.code || asJson.id || "",
        name: asJson.name || asJson.title || "",
        latitude: asJson.lat || asJson.latitude,
        longitude: asJson.lng || asJson.longitude,
        address: asJson.address || "",
        raw
      };
    }
  } catch {
    // Non-JSON payloads fall through
  }

  if (trimmed.startsWith("STOP|")) {
    const parts = trimmed.split("|");
    return {
      code: parts[1] || "",
      name: parts[2] || "",
      latitude: parts[3] ? Number(parts[3]) : undefined,
      longitude: parts[4] ? Number(parts[4]) : undefined,
      address: parts[5] || "",
      raw
    };
  }

  const match = trimmed.match(/^busstop:([^|]+)\|(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      code: match[1],
      latitude: Number(match[2]),
      longitude: Number(match[3]),
      raw
    };
  }

  return null;
};

export default function QrPage() {
  const [lastScan, setLastScan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = async rawValue => {
    setError("");
    setLoading(true);
    try {
      const busStop = parseBusStopQr(rawValue);
      if (busStop) {
        setLastScan({ ...busStop, raw: rawValue, scanType: "busStop" });
        navigate("/reports#report-form", {
          state: {
            prefill: {
              latitude: busStop.latitude,
              longitude: busStop.longitude,
              address: busStop.address,
              busStop,
              source: "Bus stop QR"
            }
          }
        });
        return;
      }

      const data = await fetchVehicleFromQr(rawValue);
      setLastScan({ ...data, raw: rawValue });
      navigate("/reports", { state: { prefill: { ...data, source: rawValue } } });
    } catch (err) {
      setError(err.message || "Failed to fetch vehicle data. Ensure the QR is registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">Vehicle QR Scanner</h2>
        <p className="muted">
          Scan the QR attached to a bus, truck, CNG, or car. We will pull the vehicle record and route you to the
          report form with everything pre-filled.
        </p>
        {loading && <div className="pill">Fetching vehicle data...</div>}
        {error && <div className="pill pill--error">{error}</div>}
      </section>

      <QrScannerPanel onResult={handleScan} />

      {lastScan && (
        <section className="panel">
          <h3 className="panel__title">
            {lastScan.scanType === "busStop" ? "Bus Stop QR detected" : "Driver / Vehicle Profile"}
          </h3>
          {lastScan.scanType === "busStop" ? (
            <div>
              <div className="pill">Stop code: {lastScan.code || "Unknown"}</div>
              {lastScan.name && <div className="muted">Stop name: {lastScan.name}</div>}
              {(lastScan.latitude || lastScan.longitude) && (
                <div className="muted">
                  Location: {lastScan.latitude ?? "?"}, {lastScan.longitude ?? "?"}
                </div>
              )}
              <p style={{ marginTop: "0.75rem" }}>
                Opening the report form with this location pre-filled so commuters can flag broken infrastructure or unsafe driving they witnessed at this stop.
              </p>
            </div>
          ) : (
            <QrProfileCard profile={lastScan} />
          )}
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Raw QR: <code>{lastScan.raw}</code>
          </p>
        </section>
      )}
    </div>
  );
}
