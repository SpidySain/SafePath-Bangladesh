import { useEffect, useState } from "react";
import { fetchActiveAwareness } from "../controllers/awarenessController";

export default function AwarenessPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchActiveAwareness();

      // supports backend returning [] OR {items:[]}
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(list);
    } catch (e) {
      setItems([]);
      setError(e?.message || "Failed to load awareness messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">Awareness</h2>
        <p className="muted">Road safety campaigns, tips, and awareness updates.</p>

        {error && <div className="pill pill--error">{error}</div>}

        {loading ? (
          <p className="muted">Loading...</p>
        ) : items.length === 0 ? (
          <div className="card" style={{ padding: "1rem", borderRadius: 16 }}>
            <div className="muted">No active awareness messages right now.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
            {items.map((a) => (
              <div key={a._id} className="card" style={{ padding: "1rem", borderRadius: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>
                    {a.title || "Awareness Update"}
                  </div>
                  {typeof a.isActive === "boolean" && (
                    <span className="pill">{a.isActive ? "ACTIVE" : "INACTIVE"}</span>
                  )}
                </div>

                <div className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
                  {a.message || a.content || a.description || "—"}
                </div>

                {a.createdAt && (
                  <div className="muted" style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
