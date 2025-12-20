// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user, isLoggedIn, isAdmin } = useAuth();

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
              "radial-gradient(1200px 600px at 10% 20%, rgba(0, 255, 255, 0.20), transparent 55%), radial-gradient(900px 500px at 90% 10%, rgba(150, 100, 255, 0.18), transparent 55%)",
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
            <Link to="/map">
              <button type="button">Open Safety Map</button>
            </Link>

            <Link to="/reports">
              <button type="button" className="btn-secondary">
                View Reports
              </button>
            </Link>

            <Link to="/filter-reports">
              <button type="button" className="btn-secondary">
                Filter Reports
              </button>
            </Link>

            <Link to="/qr">
              <button type="button" className="btn-secondary">
                QR & Ratings
              </button>
            </Link>

            {!isLoggedIn ? (
              <Link to="/login" style={{ marginLeft: "auto" }}>
                <button type="button" className="btn-secondary">
                  Login to Continue
                </button>
              </Link>
            ) : (
              <div className="pill" style={{ marginLeft: "auto" }}>
                Logged in as <b style={{ marginLeft: 6 }}>{user?.name || "User"}</b>
                {isAdmin ? <span style={{ marginLeft: 8, opacity: 0.8 }}>(ADMIN)</span> : null}
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
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.9rem" }}>
        <FeatureCard
          title="Interactive Safety Map"
          desc="See unsafe areas instantly with color-coded zones and markers based on severity and verification."
          to="/map"
          cta="Explore Map"
        />
        <FeatureCard
          title="Report & Verify"
          desc="Submit road safety issues and let admins verify reports to keep information trustworthy."
          to="/reports"
          cta="Browse Reports"
        />
        <FeatureCard
          title="QR Transport Profiles"
          desc="Scan QR to view a driver's community rating, report history, and related safety incidents."
          to="/qr"
          cta="Open QR"
        />
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

      {/* QUICK LINKS */}
      <section className="card" style={{ padding: "1.25rem", borderRadius: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ marginTop: 0, marginBottom: "0.25rem" }}>Quick actions</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              Jump directly into the most used parts of the platform.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link to="/map">
              <button type="button">Map</button>
            </Link>
            <Link to="/filter-reports">
              <button type="button" className="btn-secondary">
                Filters
              </button>
            </Link>
            <Link to="/reports">
              <button type="button" className="btn-secondary">
                Reports
              </button>
            </Link>
            <Link to="/qr">
              <button type="button" className="btn-secondary">
                QR
              </button>
            </Link>
            {isAdmin ? (
              <Link to="/admin">
                <button type="button" className="btn-secondary">
                  Admin
                </button>
              </Link>
            ) : null}
          </div>
        </div>
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

function FeatureCard({ title, desc, to, cta }) {
  return (
    <div className="card" style={{ padding: "1.1rem", borderRadius: 18, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: "1.05rem" }}>{title}</div>
        <div className="muted" style={{ marginTop: "0.35rem", lineHeight: 1.6 }}>
          {desc}
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
    <div style={{ border: "1px solid var(--stroke)", borderRadius: 16, padding: "0.9rem", background: "rgba(255,255,255,0.02)" }}>
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
