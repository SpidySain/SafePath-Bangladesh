// src/pages/FeedbackPage.jsx
import { useEffect, useState } from "react";
import { fetchFeedbacks, deleteFeedback } from "../controllers/feedbackController";
import { useAuth } from "../context/AuthContext";

function Stars({ value = 0 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          style={{
            fontSize: 22,
            color: n <= value ? "#f5c542" : "#c9c9c9",
            textShadow: n <= value ? "0 1px 6px rgba(245,197,66,0.25)" : "none"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FeedbacksPage() {
  const { isLoggedIn, isAdmin } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await fetchFeedbacks(); // all
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load feedbacks");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async id => {
    if (!isLoggedIn || !isAdmin) return;

    const ok = window.confirm("Delete this feedback? This cannot be undone.");
    if (!ok) return;

    try {
      setDeletingId(id);
      setError("");
      await deleteFeedback(id); //  calls DELETE /api/feedback/:id
      await load(); // refresh list
    } catch (e) {
      setError(e.message || "Failed to delete feedback");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">All Feedback</h2>
        <p className="muted">What users think about SafePath Bangladesh.</p>

        {error && <div className="pill pill--error">{error}</div>}

        <div style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}>
          {items.length === 0 ? (
            <p className="muted">No feedback yet.</p>
          ) : (
            items.map(f => (
              <div
                key={f._id}
                className="card"
                style={{
                    padding: "1rem",
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20
                }}
                >
                {/* LEFT SIDE */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>
                    {f.userName || "User"}
                    </div>

                    <div
                    className="muted"
                    style={{
                        marginTop: 6,
                        lineHeight: 1.6,
                        maxWidth: "100%"
                    }}
                    >
                    {f.message}
                    </div>

                    <div
                    className="muted"
                    style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}
                    >
                    {new Date(f.createdAt).toLocaleString()}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexShrink: 0
                    }}
                >
                    <Stars value={f.rating} />

                    {isLoggedIn && isAdmin && (
                    <button
                        type="button"
                        onClick={() => handleDelete(f._id)}
                        disabled={deletingId === f._id}
                        title="Delete feedback"
                        style={{
                        width: 50,
                        height: 40,
                        borderRadius: 10,
                        border: "2px solid rgba(255,255,255,0.15)",
                        background: "rgba(180, 40, 40, 0.25)",
                        color: "#f30000ff",
                        cursor: "pointer",
                        fontSize: 15,
                        display: "grid",
                        
                        }}
                    >
                        {deletingId === f._id ? "…" : "❌"}
                    </button>
                    )}
                </div>
                </div>

            ))
          )}
        </div>
      </section>
    </div>
  );
}
