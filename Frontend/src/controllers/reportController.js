import { apiGet, apiPost, apiUpload } from "../config/apiClient";
import { createReport, summarizeReport } from "../models/reportModel";
import { buildReportQuery } from "../utils/reportFilters";
import { apiPatch } from "../config/apiClient";

/**
 * All report-related data access lives here.
 * Replace stubs with real fetch calls when backend is ready.
 */
export async function fetchReports(filters = {}) {
  const query = buildReportQuery(filters);
  const data = await apiGet(`/api/reports${query}`).catch(() => []);
  return data.map(createReport);
}

export async function fetchReportSummaries(filters = {}) {
  const reports = await fetchReports(filters);
  return reports.map(summarizeReport);
}

export async function updateReportStatus(reportId, status) {
  if (!reportId || !status) throw new Error("Report id and status are required");
  return apiPatch(`/api/reports/${reportId}/status`, { status });
}

export async function uploadMedia(file) {
  const formData = new FormData();
  const mediaType = file.type?.startsWith("video") ? "VIDEO" : "PHOTO";
  formData.append("file", file);
  formData.append("mediaType", mediaType);
  const { media } = await apiUpload("/api/upload/media", formData);
  return media;
}

export async function createReportSubmission(payload) {
  const {
    reporterId,
    vehicleId,
    busStopCode,
    busStopName,
    busStopRaw,
    latitude,
    longitude,
    city,
    district,
    upazila,
    address,
    issueCategoryId,
    severity,
    description,
    file,
    allowVehicleEdit,
    vehicleUpdates
  } = payload;

  const attachmentIds = [];
  if (file) {
    const media = await uploadMedia(file);
    if (media?._id) attachmentIds.push(media._id);
  }

  return apiPost("/api/reports", {
    reporterId,
    vehicleId,
    busStopCode,
    busStopName,
    busStopRaw,
    latitude,
    longitude,
    city,
    district,
    upazila,
    address,
    issueCategoryId,
    severity: severity ?? 3,
    description,
    attachmentIds,
    allowVehicleEdit: Boolean(allowVehicleEdit),
    vehicleUpdates
  });
}
