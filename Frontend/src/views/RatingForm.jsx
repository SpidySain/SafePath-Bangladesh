import { useState } from "react";
import "./ratingForm.css";

const labels = {
  1: "Very unsafe",
  2: "Unsafe",
  3: "Moderate",
  4: "Safe",
  5: "Very safe"
};

export default function RatingForm({ qrValue, onSubmit }) {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await onSubmit({ score, comment });
      setMessage("Thank you for rating. Safety matters!");
      setComment("");
    } catch (err) {
      setError(err.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <div className="rating-form__row">
        <div className="rating-form__stars">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              type="button"
              key={value}
              className={value <= score ? "star star--active" : "star"}
              onClick={() => setScore(value)}
              disabled={submitting}
              aria-label={`${value} stars`}
            >
              ★
            </button>
          ))}
        </div>
        <div className="muted">{labels[score]}</div>
      </div>

      <textarea
        rows="2"
        placeholder="Optional comment (e.g., Smooth driving, overspeeding, abrupt braking)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        disabled={submitting}
      />

      <div className="rating-form__actions">
        <button type="submit" disabled={submitting || !qrValue}>
          {submitting ? "Submitting..." : "Submit rating"}
        </button>
        {message && <span className="pill">{message}</span>}
        {error && <span className="pill pill--error">{error}</span>}
      </div>
    </form>
  );
}
