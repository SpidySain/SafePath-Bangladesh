// src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mapBg from "../assets/feature-bg/map.png";
import reportBg from "../assets/feature-bg/report.png";
import historyBg from "../assets/feature-bg/history.png";
import qrBg from "../assets/feature-bg/qr.png";
import adminBg from "../assets/feature-bg/admin.png";
import alertsBg from "../assets/feature-bg/alerts.png";
import awarenessBg from "../assets/feature-bg/awareness.png";
import createAwarenessBg from "../assets/feature-bg/createAwareness.png";
import "./landing.css";

import { useEffect, useState } from "react";
import { createFeedback, fetchFeedbacks, deleteFeedback } from "../controllers/feedbackController";

export default function LandingPage() {
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();

  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [fbOpen, setFbOpen] = useState(false);
  const [fbMessage, setFbMessage] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbError, setFbError] = useState("");
  const [fbLoading, setFbLoading] = useState(false);

  const loadLatestFeedbacks = async () => {
    try {
      const data = await fetchFeedbacks({ limit: 3 });
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    loadLatestFeedbacks();
  }, []);

  const handleSubmitFeedback = async () => {
    try {
      setFbLoading(true);
      setFbError("");

      if (!isLoggedIn) {
        setFbError("Please login to submit feedback.");
        return;
      }

      if (!fbMessage.trim()) {
        setFbError("Please write a feedback message.");
        return;
      }

      await createFeedback({ rating: fbRating, message: fbMessage });

      setFbMessage("");
      setFbRating(5);
      setFbOpen(false);

      await loadLatestFeedbacks();
    } catch (e) {
      setFbError(e.message || "Failed to submit feedback");
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* HERO */}
      <section
        className="card"
        style={{
          overflow: "hidden",
          position: "relative",
          padding: "1.4rem",
          borderRadius: 18      
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1200px 600px at 10% 20%, rgba(56, 189, 248, 0.28), transparent 55%), radial-gradient(900px 500px at 90% 10%, rgba(34, 197, 94, 0.24), transparent 55%)",
            pointerEvents: "none"
          }}
        />

        <div style={{ position: "relative", display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <span className="pill">Bangladesh Road Safety</span>
            <span className="pill">Community Reporting</span>
            <span className="pill">Map Heat Zones</span>
            <span className="pill">QR Vehicle Ratings</span>
          </div>

          <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: 900, letterSpacing: 0.2 }}>
            SafePath Bangladesh
          </h2>

          <p className="muted" style={{ margin: 0, maxWidth: 900, lineHeight: 1.6 }}>
            Report unsafe roads, view hotspots on an interactive map, and improve accountability through
            community verification and driver ratings. Built for fast reporting and real-world impact.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.25rem" }}>
            {!isLoggedIn ? (
              <Link to="/login" style={{ marginLeft: "auto" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{
                    padding: "0.6rem 1.1rem",
                    fontWeight: 700,
                    borderRadius: 999,
                  }}
                >
                  Login
                </button>
              </Link>
            ) : (
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem"
                  }}
                >
                  <div className="pill">
                    Logged in as <b style={{ marginLeft: 6 }}>{user?.name || "User"}</b>
                    {isAdmin ? <span style={{ marginLeft: 8, opacity: 0.8 }}>(ADMIN)</span> : null}
                  </div>
                  <Link to="/login" style={{ marginLeft: "auto" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                        onClick={() => {
                          signOut();
                          navigate("/login");
                        }}
                      style={{
                        padding: "0.6rem 1.1rem",
                        fontWeight: 700,
                        borderRadius: 999
                      }}
                    >
                      Logout
                    </button>
                  </Link>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.9rem" }}>
        <StatCard title="Map Zones" value="Red / Yellow / Green" desc="Visual risk overview by severity." />
        <StatCard title="Clickable Markers" value="Issue Details" desc="Type, time, and status on click." />
        <StatCard title="Smart Filters" value="City • Category" desc="Find reports fast in your area." />
        <StatCard title="Community Ratings" value="QR Profiles" desc="Local transport rating & history." />
      </section>

      {/* FEATURES */}
      <section className="features-grid">
        
        <FeatureCard
          title="Interactive Safety Map"
          desc="See unsafe areas instantly with color-coded zones and markers based on severity and verification."
          to="/map"
          cta="Explore Map"
          bg={mapBg}
        />
        <FeatureCard
          title="Report"
          desc="Submit road safety issues and let admins verify reports to keep information trustworthy."
          to="/reports"
          cta="Create Reports"
          bg={reportBg}
        />
        <FeatureCard
          title="Report History "
          desc="See other reports"
          to="/filter-reports"
          cta="Open report history"
          bg={historyBg}

        />
        <FeatureCard
          title="QR Transport Profiles"
          desc="Scan QR to view a driver's community rating, report history, and related safety incidents."
          to="/qr"
          cta="Open QR"
          bg={qrBg}
        />
        <FeatureCard
          title="Awareness Updates"
          desc="Read road safety tips and awareness updates published by admins."
          to="/awareness"
          cta="View Awareness"
          bg={awarenessBg}
        />
        {isLoggedIn && isAdmin && (
          <>
            <FeatureCard
              title="Admin Panel"
              desc="Verify reports, manage statuses, and monitor analytics."
              to="/admin"
              cta="Open Admin"
              bg={adminBg}
            />
            <FeatureCard
              title="Alerts Dashboard"
              desc="Create and manage safety alerts shown to users."
              to="/admin/alerts"
              cta="Manage Alerts"
              bg={alertsBg}
            />
           <FeatureCard
              title="Create Awareness message"
              desc="Create and manage safety awareness shown to users."
              to="admin/awareness"
              cta="Manage awareness"
              bg={createAwarenessBg}
            />
          </>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="card" style={{ padding: "1.25rem", borderRadius: 18 }}>
        <h3 style={{ marginTop: 0, marginBottom: "0.25rem" }}>How it works</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          A simple flow designed for quick reporting and meaningful community insight.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.9rem" }}>
          <Step n="1" title="Report" desc="Submit a safety issue with location and severity." />
          <Step n="2" title="Review" desc="Reports appear in lists and on the map instantly." />
          <Step n="3" title="Verify" desc="Admins verify to reduce misinformation." />
          <Step n="4" title="Act" desc="Use data to plan safer routes and raise awareness." />
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section className="card" style={{ padding: "1.25rem", borderRadius: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 6 }}>Feedback</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Share your experience about usability and road safety effectiveness.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button type="button" className="btn-secondary" onClick={() => setFbOpen(true)}>
              Feedback
            </button>

            <button type="button" className="btn-secondary" onClick={() => navigate("/feedbacks")}>
              See more feedbacks
            </button>
          </div>
        </div>

        <div className="feedbackGrid">

           
          {feedbacks.length === 0 ? (
            <p className="muted">No feedback yet.</p>
          ) : (
          feedbacks.map(f => (
            <div
              key={f._id}
              style={{
                border: "1px solid var(--stroke)",
                borderRadius: 16,
                padding: "0.9rem",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 900 }}>{f.userName || "User"}</div>
                <Stars value={f.rating} />
              </div>

              <div className="muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
                {f.message}
              </div>
            </div>
          ))

          )}
        </div>

        {/* MODAL */}
        {fbOpen && (
          <div
            onClick={() => setFbOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
              padding: 16
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="card"
              style={{
                width: "min(720px, 100%)",
                borderRadius: 18,
                padding: "1.1rem",
                background: "rgba(255,255,255,0.94)",
                color: "#0b1220",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
              }}

            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Submit Feedback</h3>
                <button type="button" className="btn-secondary" onClick={() => setFbOpen(false)}>
                  Close
                </button>
              </div>

              <div style={{ marginTop: 14 }}>
                <div className="muted" style={{ marginBottom: 8 }}>
                  Rating
                </div>
                <StarPicker value={fbRating} onChange={setFbRating} />
              </div>

              <div style={{ marginTop: 5}}>
                <div className="muted" style={{ marginBottom: 8 }}>
                  Message
                </div>
                <textarea
                  value={fbMessage}
                  onChange={e => setFbMessage(e.target.value)}
                  placeholder="Write your feedback..."
                  style={{
                    width: "95%",
                    minHeight: 110,
                    borderRadius: 13,
                    padding: 12,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#ffffffff",
                    color: "#0b1220",
                    resize: "vertical",
                    outline: "none"
                  }}
                />
              </div>

              {fbError && (
                <div className="pill pill--error" style={{ marginTop: 12 }}>
                  {fbError}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                <button type="button" onClick={handleSubmitFeedback} disabled={fbLoading}>
                  {fbLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

function StatCard({ title, value, desc }) {
  return (
    <div className="card" style={{ padding: "1rem", borderRadius: 18 }}>
      <div className="muted" style={{ fontWeight: 700, letterSpacing: 0.2 }}>
        {title}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: 900, marginTop: "0.25rem" }}>{value}</div>
      <div className="muted" style={{ marginTop: "0.35rem", lineHeight: 1.5 }}>
        {desc}
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, to, cta, bg }) {
  return (
    <div
      className="featureCard card"
      style={{
        padding: "1.13rem",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* background image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
          filter: "brightness(1) saturate(1.5) contrast(0.98)"
        }}
      />

      {/* dark overlay for readability */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.55), rgba(15,23,42,0.35))"
        }}
      />

      {/* content stays on top */}
      <div style={{ position: "relative" }}>
        <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>{title}</div>
        <div className="muted" style={{ marginTop: "0.35rem", lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span className="pill">SafePath</span>
        <Link to={to}>
          <button type="button" className="btn-secondary">
            {cta}
          </button>
        </Link>
      </div>
    </div>
  );
}


function Step({ n, title, desc }) {
  return (
    <div
      style={{
        border: "1px solid var(--stroke)",
        borderRadius: 16,
        padding: "0.9rem",
        background: "rgba(255,255,255,0.02)"
      }}
    >
      <div className="pill" style={{ width: "fit-content" }}>
        Step {n}
      </div>
      <div style={{ marginTop: "0.5rem", fontWeight: 900 }}>{title}</div>
      <div className="muted" style={{ marginTop: "0.25rem", lineHeight: 1.55 }}>
        {desc}
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            padding: 0,
            color: n <= value ? "#f5c542" : "#c9c9c9",
            textShadow: n <= value ? "0 1px 8px rgba(245,197,66,0.35)" : "none"
          }}

          aria-label={`Rate ${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function Stars({ value = 0 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
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
