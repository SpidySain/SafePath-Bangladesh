// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // For your requirement: allow making ADMIN from UI (optional).
  // If you don't want that, force role = "USER" below.
  //const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp({ name, email, password, role });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Register</h2>
      <p className="muted" style={{ marginTop: "-0.25rem" }}>
        Create an account to submit reports and access features.
      </p>

      <form className="form" onSubmit={onSubmit}>
        <div className="form__group">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>

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
            {loading ? "Creating..." : "Register"}
          </button>
          {error && (
            <span className="pill" style={{ background: "rgba(255,0,0,0.2)", border: "1px solid rgba(255,0,0,0.3)" }}>
              {error}
            </span>
          )}
        </div>
      </form>

      <div className="muted" style={{ marginTop: "0.75rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
