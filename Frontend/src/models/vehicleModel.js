export function createVehicle(payload = {}) {
  return {
    id: payload._id ?? payload.id ?? "",
    qrCode: payload.qrCode ?? "",
    model: payload.model ?? "",
    type: payload.type ?? "",
    category: payload.category ?? "",
    registrationNumber: payload.registrationNumber ?? "",
    numberPlate: payload.numberPlate ?? "",
    issuingAuthority: payload.issuingAuthority ?? "",
    issuanceDate: payload.issuanceDate ?? "",
    metadata: payload.metadata ?? {}
  };
}
