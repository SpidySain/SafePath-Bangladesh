import { apiGet, apiPost, apiPatch, apiDelete } from "../config/apiClient";

/**
 * Fetch active awareness messages (for all users)
 */
export async function fetchActiveAwareness() {
  return apiGet("/api/awareness");
}

/**
 * Fetch all awareness messages (admin only)
 */
export function adminFetchAwareness() {
  return apiGet("/api/awareness/admin/all");
}

/**
 * Create awareness message (admin only)
 */
export function adminCreateAwareness(payload) {
  return apiPost("/api/awareness/admin/create", payload);
}

/**
 * Update awareness message (admin only)
 */
export function adminUpdateAwareness(id, payload) {
  return apiPatch(`/api/awareness/admin/${id}`, payload);
}

/**
 * Delete awareness message (admin only)
 */
export function adminDeleteAwareness(id) {
  return apiDelete(`/api/awareness/admin/${id}`);
}

/**
 * Toggle awareness message active status (admin only)
 */
export function adminToggleAwareness(id) {
  return apiPatch(`/api/awareness/admin/${id}/toggle`, {});
}
