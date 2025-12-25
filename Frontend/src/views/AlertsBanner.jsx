import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActiveAlerts } from "../controllers/alertController";

export default function AlertsBanner() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchActiveAlerts()
      .then(data => mounted && setAlerts(data || []))
      .catch(() => mounted && setAlerts([]))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  if (loading) return null;
  if (!alerts.length) return null;

  const top = alerts[0];
  const tone = top.level === "RED" ? "rgba(255,80,80,0.18)" : "rgba(255,210,80,0.18)";
  const border = top.level === "RED" ? "rgba(255,80,80,0.35)" : "rgba(255,210,80,0.35)";

  return (
    <div
      style={{
        padding: "0.9rem 1rem",
        borderRadius: 16,
        marginBottom: "1rem",
        background: tone,
        border: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem"
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 900 }}>
          🚨 Safety Alert: {top.title}
          {top.district ? <span style={{ opacity: 0.8 }}> • {top.district}</span> : null}
          {top.upazila ? <span style={{ opacity: 0.8 }}> • {top.upazila}</span> : null}
        </div>
        <div style={{ opacity: 0.9 }}>{top.message}</div>
      </div>

      <Link to="/alerts">
        <button className="btn-secondary" type="button">
          View all
        </button>
      </Link>
    </div>
  );
}
