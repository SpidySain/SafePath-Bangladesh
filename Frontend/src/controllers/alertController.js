import { apiGet, apiPost, apiPatch } from "../config/apiClient";

export function fetchActiveAlerts() {
  return apiGet("/api/alerts");
}

export function fetchAllAlerts() {
  return apiGet("/api/alerts/all");
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
