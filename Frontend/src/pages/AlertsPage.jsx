import { useEffect, useState } from "react";
import { fetchAllAlerts } from "../controllers/alertController";

const formatDateTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAlerts()
      .then((data) => setAlerts(data || []))
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
          <p className="muted">No alerts found.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {alerts.map((a) => {
              const expired = !!a.isExpired;

              const border = expired
                ? "rgba(255,255,255,0.14)"
                : a.level === "RED"
                ? "rgba(255,80,80,0.35)"
                : "rgba(255,210,80,0.35)";

              return (
                <div
                  key={a._id}
                  className="card"
                  style={{
                    padding: "1rem",
                    borderRadius: 16,
                    border: `1px solid ${border}`,
                    opacity: expired ? 0.7 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 900 }}>{a.title}</div>

                    {/*  Label */}
                    <span
                      className="pill"
                      style={{
                        background: expired ? "rgba(255,255,255,0.12)" : undefined,
                        border: expired ? "1px solid rgba(255,255,255,0.25)" : undefined,
                        color: expired ? "rgba(255,255,255,0.9)" : undefined,
                      }}
                    >
                      {expired ? "EXPIRED" : a.level}
                    </span>

                  </div>

                  <div className="muted" style={{ marginTop: 6 }}>
                    {a.district ? `${a.district}` : ""}
                    {a.upazila ? ` • ${a.upazila}` : ""}
                  </div>

                  {/*  Created + expiry time */}
                  <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                    Created: {formatDateTime(a.createdAt)}
                    {a.expiresAt ? ` • Expires: ${formatDateTime(a.expiresAt)}` : ""}
                  </div>

                  <div style={{ marginTop: 8 }}>{a.message}</div>

                  {expired && (
                    <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                      This alert is older than 24 hours.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
