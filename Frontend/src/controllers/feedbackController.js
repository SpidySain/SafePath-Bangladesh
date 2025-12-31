// src/controllers/feedbackController.js
import { apiGet, apiPost, apiDelete } from "../config/apiClient";

// GET /api/feedback?limit=3
export async function fetchFeedbacks({ limit } = {}) {
  const q = limit ? `?limit=${encodeURIComponent(limit)}` : "";
  return apiGet(`/api/feedback${q}`);
}

// POST /api/feedback  (login required)
export async function createFeedback({ rating, message }) {
  return apiPost(`/api/feedback`, { rating, message });
}

// DELETE /api/feedback/:id (ADMIN ONLY)
export async function deleteFeedback(id) {
  return apiDelete(`/api/feedback/${id}`);
}
