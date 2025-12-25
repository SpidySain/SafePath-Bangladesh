// src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/login-hero.png";
import "./loginFullscreen.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //  If already logged in → go to HOME
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ email, password });
      //  Redirect to HOME after login
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-overlay" />

      <div className="login-card">
        {/* 🚦 Traffic light accent */}
        <div className="traffic-light" aria-hidden="true">
          <span className="light red" />
          <span className="light yellow" />
          <span className="light green" />
        </div>

        <h1 className="login-title">SafePath Bangladesh</h1>
        <p className="login-subtitle">
          Community-driven road safety platform
        </p>

        <form onSubmit={onSubmit} className="login-form">
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
