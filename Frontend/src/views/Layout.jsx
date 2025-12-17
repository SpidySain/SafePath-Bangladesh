import "./layout.css";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ title, children }) {
  const location = useLocation();

    // ✅ read saved user (from localStorage)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    { to: "/map", label: "Map" },
    { to: "/filter-reports", label: "Filter Reports" },
    { to: "/reports", label: "Reports" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []), // ✅ only show for ADMIN
    { to: "/qr", label: "QR" }
  ];

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="topbar">
          <div className="brand">
            <span className="brand__dot" /> <Link to="/">SafePath</Link>
          </div>
          <nav className="nav">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? "nav__link nav__link--active" : "nav__link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="layout__headline">
          <h1>{title}</h1>
          <p className="layout__tagline">SafePath Bangladesh · Frontend scaffold (MVC)</p>
        </div>
      </header>
      <main className="layout__body">{children}</main>
    </div>
  );
}
