import "./qrProfileCard.css";
import RatingForm from "./RatingForm";
import { submitRatingForQr, fetchRatingSummaryForQr } from "../controllers/ratingController";
import { useState } from "react";

export default function QrProfileCard({ profile }) {
  if (!profile) return null;

  const { vehicle, driver, rating, issueHistory, ratingHistory } = profile;
  const [localRating, setLocalRating] = useState(rating || {});
  const [history, setHistory] = useState(ratingHistory || []);

  const handleRatingSubmit = async ({ score, comment }) => {
    await submitRatingForQr(vehicle.qrCode, { score, comment });
    const refreshed = await fetchRatingSummaryForQr(vehicle.qrCode);
    setLocalRating(refreshed.ratingSummary);
    setHistory(refreshed.ratings || []);
  };

  return (
    <div className="qr-profile">
      <div className="qr-profile__header">
        <div>
          <div className="qr-profile__title">{driver?.name || "Unknown driver"}</div>
          <div className="muted">
            {vehicle?.numberPlate || "Vehicle unknown"} · {vehicle?.model || "Model n/a"}
          </div>
          {(vehicle?.operator || driver?.company) && (
            <div className="muted">{vehicle.operator || driver.company}</div>
          )}
          {vehicle?.routeName && <div className="pill">Route: {vehicle.routeName}</div>}
        </div>
        <div className="qr-profile__rating">
          <div className="qr-profile__score">
            {localRating?.averageScore ? localRating.averageScore.toFixed(1) : "–"}
          </div>
          <div className="muted">Avg rating ({localRating?.count || 0})</div>
        </div>
      </div>

      <div className="qr-profile__meta">
        {driver?.licenseNumber && <span className="pill">License: {driver.licenseNumber}</span>}
        {driver?.phone && <span className="pill">Phone: {driver.phone}</span>}
        {vehicle?.qrCode && <span className="pill">QR: {vehicle.qrCode}</span>}
      </div>

      <div className="qr-profile__history">
        <div className="qr-profile__history-title">Rate driving safety</div>
        <RatingForm qrValue={vehicle?.qrCode} onSubmit={handleRatingSubmit} />
      </div>

      <div className="qr-profile__history">
        <div className="qr-profile__history-title">Recent safety reports</div>
        {issueHistory && issueHistory.length > 0 ? (
          <ul className="qr-profile__history-list">
            {issueHistory.slice(0, 5).map(item => (
              <li key={item.id || item._id || item.createdAt} className="qr-profile__history-item">
                <div className="qr-profile__history-head">
                  <span className="pill">Severity {item.severity ?? "?"}</span>
                  <span className="muted">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <div className="qr-profile__history-body">
                  <div>{item.description || "No description"}</div>
                  {item.issueCategory?.name && (
                    <div className="muted">Category: {item.issueCategory.name}</div>
                  )}
                  {item.location?.district && (
                    <div className="muted">
                      {item.location.upazila ? `${item.location.upazila}, ` : ""}
                      {item.location.district}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No previous safety reports for this vehicle.</p>
        )}
      </div>

      <div className="qr-profile__history">
        <div className="qr-profile__history-title">Latest ratings</div>
        {history && history.length ? (
          <ul className="qr-profile__history-list">
            {history.slice(0, 5).map(r => (
              <li key={r._id || r.id} className="qr-profile__history-item">
                <div className="qr-profile__history-head">
                  <span className="pill">Score: {r.score}</span>
                  <span className="muted">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                {r.comment && <div>{r.comment}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Be the first to rate this driver.</p>
        )}
      </div>
    </div>
  );
}
