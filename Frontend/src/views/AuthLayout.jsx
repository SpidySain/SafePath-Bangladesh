// src/views/AuthLayout.jsx
import "./layout.css"; // reuse your existing layout styling

export default function AuthLayout({ title = "SafePath", children }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="topbar">
          <div className="brand">
            <span className="brand__dot" /> <span>{title}</span>
          </div>
        </div>

        <div className="layout__headline">
          <h1>SafePath</h1>
          <p className="layout__tagline">Please sign in to continue</p>
        </div>
      </header>

      <main className="layout__body">{children}</main>
    </div>
  );
}
