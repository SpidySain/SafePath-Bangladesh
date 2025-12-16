export function buildQrProfile(payload = {}) {
  const vehicle = payload.vehicle || {};
  const driver = payload.driver || {};
  const ratingSummary = payload.ratingSummary || {};
  const issueHistory = Array.isArray(payload.issueHistory) ? payload.issueHistory : [];
  const ratings = Array.isArray(payload.ratings) ? payload.ratings : [];

  return {
    vehicle: {
      id: vehicle._id || vehicle.id || "",
      numberPlate: vehicle.numberPlate || vehicle.registrationNumber || "Unknown",
      model: vehicle.model || "",
      type: vehicle.type || "",
      operator: vehicle.operator || "",
      routeName: vehicle.routeName || "",
      qrCode: vehicle.qrCode || ""
    },
    driver: {
      id: driver._id || driver.id || "",
      name: driver.name || "Unknown driver",
      phone: driver.phone || "",
      licenseNumber: driver.licenseNumber || "",
      company: driver.company || vehicle.operator || ""
    },
    rating: {
      averageScore: ratingSummary.averageScore,
      count: ratingSummary.count || 0
    },
    ratingHistory: ratings,
    issueHistory
  };
}
