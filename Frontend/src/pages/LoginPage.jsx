// src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isLoggedIn } = useAuth(); //  include isLoggedIn

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p className="muted" style={{ marginTop: "-0.25rem" }}>
        Sign in with your email and password.
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>

        <div className="form__group">
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>

        <div className="form__actions">
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          {error && (
            <span className="pill" style={{ background: "rgba(255,0,0,0.2)", border: "1px solid rgba(255,0,0,0.3)" }}>
              {error}
            </span>
          )}
        </div>
      </form>

      <div className="muted" style={{ marginTop: "0.75rem" }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
