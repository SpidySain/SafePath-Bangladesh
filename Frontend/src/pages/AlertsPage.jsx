import { useEffect, useState } from "react";
import axios from "axios";
import { fetchActiveAlerts } from "../controllers/alertController";

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
  const [receiveAlerts, setReceiveAlerts] = useState(true);

  // 1) Load user's alert preference
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res?.data?.user?.receiveAlerts !== undefined) {
          setReceiveAlerts(res.data.user.receiveAlerts);
        }
      })
      .catch(() => {});
  }, []);

  // 2) Load alerts ONLY when subscribed (ON)
  useEffect(() => {
    if (!receiveAlerts) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchActiveAlerts()
      .then((data) => setAlerts(data || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [receiveAlerts]);

  const saveToggle = async (value) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.patch(
        "/api/auth/alerts-toggle",
        { receiveAlerts: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">Safety Alerts</h2>
        <p className="muted">Verified high-risk zone alerts and safety updates.</p>

        {/* 🔔 Toggle (Req 5 – Feature 4) */}
        <div style={{ margin: "12px 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={receiveAlerts}
              onChange={(e) => {
                const value = e.target.checked;
                setReceiveAlerts(value);
                saveToggle(value);
              }}
            />
            🔔 Receive safety alerts
          </label>
        </div>

        {/* Alerts display */}
        {!receiveAlerts ? (
          <p className="muted">🔕 Safety alerts are turned off.</p>
        ) : loading ? (
          <p className="muted">Loading alerts...</p>
        ) : !alerts.length ? (
          <p className="muted">No active alerts right now.</p>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{a.title}</div>

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
