import { useEffect, useState } from "react";
import { adminCreateAlert, adminFetchAlerts, adminUpdateAlert } from "../controllers/alertController";

export default function AdminAlertsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    district: "",
    upazila: "",
    level: "RED",
    isActive: true
  });

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await adminFetchAlerts();
      setItems(data || []);
    } catch (e) {
      setErr("Failed to load alerts (admin only).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async e => {
    e.preventDefault();
    setErr("");
    try {
      await adminCreateAlert(form);
      setForm({ title: "", message: "", district: "", upazila: "", level: "RED", isActive: true });
      await load();
    } catch (e2) {
      setErr(e2?.message || "Create failed");
    }
  };

  const toggleActive = async (id, next) => {
    try {
      await adminUpdateAlert(id, { isActive: next });
      await load();
    } catch {
      setErr("Update failed");
    }
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">Admin: Alerts Dashboard</h2>
        <p className="muted">Create and manage safety alerts shown to citizens.</p>

        <form onSubmit={submit} className="form" style={{ marginTop: 10 }}>
          <div className="form__group">
            <label>Title</label>
            <input value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} required />
          </div>

          <div className="form__group">
            <label>Message</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={e => setForm(s => ({ ...s, message: e.target.value }))}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <div className="form__group">
              <label>District</label>
              <input value={form.district} onChange={e => setForm(s => ({ ...s, district: e.target.value }))} />
            </div>
            <div className="form__group">
              <label>Area</label>
              <input value={form.upazila} onChange={e => setForm(s => ({ ...s, upazila: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <div className="form__group">
              <label>Level</label>
              <select value={form.level} onChange={e => setForm(s => ({ ...s, level: e.target.value }))}>
                <option value="RED">RED (High risk)</option>
                <option value="YELLOW">YELLOW (Moderate)</option>
              </select>
            </div>
            <div className="form__group">
              <label>Active</label>
              <select
                value={String(form.isActive)}
                onChange={e => setForm(s => ({ ...s, isActive: e.target.value === "true" }))}
              >
                <option value="true">Yes (show to citizens)</option>
                <option value="false">No (hidden)</option>
              </select>
            </div>
          </div>

          <div className="form__actions">
            <button type="submit">Create Alert</button>
            {err && <span className="pill pill--error">{err}</span>}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel__title" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>All Alerts</span>
          <button className="btn-secondary" type="button" onClick={load}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading...</p>
        ) : !items.length ? (
          <p className="muted">No alerts created yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map(a => (
              <div key={a._id} className="card" style={{ padding: "1rem", borderRadius: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 900 }}>{a.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="pill">{a.level}</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => toggleActive(a._id, !a.isActive)}
                    >
                      {a.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
                <div className="muted" style={{ marginTop: 6 }}>
                  {a.district || "-"} {a.upazila ? `• ${a.upazila}` : ""}
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
