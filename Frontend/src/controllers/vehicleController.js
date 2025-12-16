import { apiGet, apiPatch } from "../config/apiClient";
import { createVehicle } from "../models/vehicleModel";
import { createReport } from "../models/reportModel";
import { buildQrProfile } from "../models/qrProfileModel";

export async function fetchVehicleFromQr(qrValue) {
  const data = await apiGet(`/api/vehicles/qr/${encodeURIComponent(qrValue)}`);
  const profile = buildQrProfile({
    vehicle: createVehicle(data.vehicle),
    driver: data.driver,
    ratingSummary: data.ratingSummary,
    ratings: data.ratings,
    issueHistory: (data.issueHistory || []).map(createReport)
  });
  return profile;
}

export async function updateVehicle(vehicleId, updates) {
  const { vehicle } = await apiPatch(`/api/vehicles/${vehicleId}`, updates);
  return createVehicle(vehicle);
}
