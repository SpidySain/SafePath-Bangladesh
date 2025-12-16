export function severityColor(severity = 3, status = "PENDING") {
  if (status === "VERIFIED" && severity >= 4) return "#e63946"; // red
  if (severity >= 4) return "#f4a261"; // orange-ish for high but unverified
  if (severity >= 2) return "#f1c40f"; // yellow
  return "#2a9d8f"; // green
}

export function severityRadiusMeters(severity = 3) {
  if (severity >= 4) return 300;
  if (severity >= 3) return 200;
  if (severity >= 2) return 120;
  return 80;
}
