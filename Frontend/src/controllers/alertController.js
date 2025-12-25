import { apiGet, apiPost, apiPatch } from "../config/apiClient";

export function fetchActiveAlerts() {
  return apiGet("/api/alerts");
}

// admin
export function adminFetchAlerts() {
  return apiGet("/api/admin/alerts");
}

export function adminCreateAlert(payload) {
  return apiPost("/api/admin/alerts", payload);
}

export function adminUpdateAlert(id, payload) {
  return apiPatch(`/api/admin/alerts/${id}`, payload);
}
