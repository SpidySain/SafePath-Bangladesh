export const DEFAULT_REPORT_FILTERS = {
  district: "",
  upazila: "",
  categoryId: "",
  severityLevel: "ALL",
  status: ""
};

export const SEVERITY_LEVELS = [
  {
    value: "ALL",
    label: "All severities",
    description: "Show every report regardless of severity"
  },
  {
    value: "HIGH",
    label: "High (4-5)",
    description: "Major accidents or dangerous intersections",
    range: { min: 4, max: 5 }
  },
  {
    value: "MEDIUM",
    label: "Medium (3)",
    description: "Frequent minor accidents or risky turns",
    range: { min: 3, max: 3 }
  },
  {
    value: "LOW",
    label: "Low (1-2)",
    description: "Slippery roads or broken footpaths",
    range: { min: 1, max: 2 }
  }
];

export function buildReportQuery(filters = {}) {
  const params = new URLSearchParams();
  const district = filters.district?.trim();
  const upazila = filters.upazila?.trim();
  const categoryId = filters.categoryId;
  const severityLevel = filters.severityLevel;
  const status = filters.status;

  if (district) params.set("district", district);
  if (upazila) params.set("upazila", upazila);
  if (categoryId) params.set("categoryId", categoryId);
  if (severityLevel && severityLevel !== "ALL") params.set("severityLevel", severityLevel);
  if (status) params.set("status", status);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function getSeverityMeta(value = "ALL") {
  return SEVERITY_LEVELS.find(level => level.value === value) || SEVERITY_LEVELS[0];
}
