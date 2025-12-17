/**
 * Central place for configuring API access.
 * In real implementation you can swap fetch/axios without touching controllers.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} failed with ${res.status}`);
  return res.json();
}


//const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || "";

export async function apiPatch(path, body) {
  const token = localStorage.getItem("safepath-token"); // 

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`PATCH ${path} failed with ${res.status}`);
  return res.json();
}


export async function apiUpload(path, formData) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error(`UPLOAD ${path} failed with ${res.status}`);
  return res.json();
}
