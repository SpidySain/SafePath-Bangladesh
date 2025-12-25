import { useEffect, useState } from "react";
import { fetchActiveAlerts } from "../controllers/alertController";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAlerts()
      .then(data => setAlerts(data || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">Safety Alerts</h2>
        <p className="muted">Verified high-risk zone alerts and safety updates.</p>

        {loading ? (
          <p className="muted">Loading alerts...</p>
        ) : !alerts.length ? (
          <p className="muted">No active alerts right now.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {alerts.map(a => (
              <div
                key={a._id}
                className="card"
                style={{
                  padding: "1rem",
                  borderRadius: 16,
                  border: `1px solid ${a.level === "RED" ? "rgba(255,80,80,0.35)" : "rgba(255,210,80,0.35)"}`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 900 }}>{a.title}</div>
                  <span className="pill">{a.level}</span>
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  {a.district ? `${a.district}` : ""}{a.upazila ? ` • ${a.upazila}` : ""}
                </div>
                <div style={{ marginTop: 8 }}>{a.message}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
