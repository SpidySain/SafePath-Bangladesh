// src/views/Layout.jsx
import "./layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="topbar">
          <div className="brand">
            <span className="brand__dot" />
            <Link to="/">Homepage</Link>
          </div>

          <nav className="nav">
            {/*  Admin only */}
            {isLoggedIn && isAdmin && (
              <Link
                to="/admin"
                className={location.pathname === "/admin" ? "nav__link nav__link--active" : "nav__link"}
              >
                Admin
              </Link>
            )}

            {/*  Auth section */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className={location.pathname === "/login" ? "nav__link nav__link--active" : "nav__link"}
              >
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

          <h1 className="hero-title">
            SafePath Bangladesh
          </h1>

          <p className="hero-subtitle">
            Community-driven road safety platform for Bangladesh
          </p>
        </div>

      </header>

      <main className="layout__body">{children}</main>
    </div>
  );
}
