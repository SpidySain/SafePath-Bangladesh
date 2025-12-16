/**
 * Parse SafePath QR format: "City|Address|lat|lng"
 */
export function parseQrValue(qrValue) {
  if (!qrValue || typeof qrValue !== "string") throw new Error("QR value empty");
  const parts = qrValue.split("|");
  if (parts.length !== 4) throw new Error("Invalid QR format. Expected City|Address|lat|lng");
  const [city, address, latStr, lngStr] = parts;
  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lngStr);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) throw new Error("Invalid coordinates in QR");
  return { city, address, latitude, longitude };
}
