// src/views/Layout.jsx
import "./layout.css";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertsBanner from "../views/AlertsBanner";
import AwarenessBanner from "../views/AwarenessBanner";

export default function Layout({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();

  const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
  const isHome = path === "/";

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Navbar only when NOT on homepage */}
      {!isHome && (
        <header className="layout__header">
          <div className="topbar">
            <div className="brand">
              <span className="brand__dot" />
              <Link to="/">Homepage</Link>
            </div>

            <nav className="nav">
              <Link to="/map" className={path === "/map" ? "nav__link nav__link--active" : "nav__link"}>
                Map
              </Link>
              <Link to="/reports" className={path === "/reports" ? "nav__link nav__link--active" : "nav__link"}>
                Reports
              </Link>
              <Link
                to="/filter-reports"
                className={path === "/filter-reports" ? "nav__link nav__link--active" : "nav__link"}
              >
                History
              </Link>
              <Link to="/qr" className={path === "/qr" ? "nav__link nav__link--active" : "nav__link"}>
                QR
              </Link>

              {/* Admin links */}
              {isLoggedIn && isAdmin && (
                <>
                  <Link to="/admin" className={path === "/admin" ? "nav__link nav__link--active" : "nav__link"}>
                    Admin
                  </Link>
                  <Link
                    to="/admin/alerts"
                    className={path === "/admin/alerts" ? "nav__link nav__link--active" : "nav__link"}
                  >
                    Alerts
                  </Link>
                  <Link
                    to="/admin/awareness"
                    className={path === "/admin/awareness" ? "nav__link nav__link--active" : "nav__link"}
                  >
                    Awareness
                  </Link>
                </>
              )}

              {!isLoggedIn ? (
                <Link to="/login" className={path === "/login" ? "nav__link nav__link--active" : "nav__link"}>
                  Login
                </Link>
              ) : (
                <button
                  type="button"
                  className="nav__link"
                  onClick={handleLogout}
                  style={{ cursor: "pointer", background: "transparent" }}
                >
                  Logout ({user?.name || "User"})
                </button>
              )}
            </nav>
          </div>

          <div className="layout__headline hero-headline">
            <div className="hero-accent" />
            <h1 className="hero-title">{title || "SafePath Bangladesh"}</h1>
            <p className="hero-subtitle">Community-driven road safety platform for Bangladesh</p>
          </div>
        </header>
      )}

      <main className="layout__body">
        {/* Alerts can show everywhere if you want */}
        <AlertsBanner />

        {/*  Awareness banner everywhere EXCEPT homepage */}
        {!isHome && <AwarenessBanner />}

        <Outlet />
      </main>
    </div>
  );
}
