import { apiGet, apiPost } from "../config/apiClient";

export async function submitRatingForQr(qrValue, { score, comment, tags }) {
  if (!qrValue || !score) throw new Error("QR code and score are required");
  return apiPost("/api/ratings/qr", { qrValue, score, comment, tags });
}

export async function fetchRatingSummaryForQr(qrValue) {
  return apiGet(`/api/ratings/qr/${encodeURIComponent(qrValue)}`);
}
