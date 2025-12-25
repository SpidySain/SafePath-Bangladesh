import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./loginFullscreen.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp({
        name,
        email,
        password
      });

      // after register → go to login
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-bg"
      style={{
        backgroundImage: "url('/login-bg.png')" // same image as login
      }}
    >
      <div className="login-overlay" />

      <div className="login-card">
        {/*  traffic light */}
        <div className="traffic-light">
          <span className="light red" />
          <span className="light yellow" />
          <span className="light green" />
        </div>

        <h1 className="login-title">SafePath Bangladesh</h1>
        <p className="login-subtitle">
          Create an account to help improve road safety
        </p>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
