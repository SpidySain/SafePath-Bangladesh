import { useEffect, useState, useCallback } from "react";
import { createReportSubmission } from "../controllers/reportController";
import locations from "../data/bdLocations.json";

const blankVehicle = {
  id: "",
  qrCode: "",
  model: "",
  type: "",
  category: "",
  registrationNumber: "",
  numberPlate: "",
  issuingAuthority: "",
  issuanceDate: "",
  metadataText: ""
};

const formatMetadata = metadata => {
  if (!metadata) return "";
  if (typeof metadata === "object") return JSON.stringify(metadata, null, 2);
  return String(metadata);
};

export default function ReportForm({ categories, prefill, onSubmitSuccess }) {
  const [reporterId, setReporterId] = useState("");
  const [issueCategoryId, setIssueCategoryId] = useState("");
  const [severity, setSeverity] = useState(3);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);

  const [vehicleDetails, setVehicleDetails] = useState(blankVehicle);
  const [issueHistory, setIssueHistory] = useState([]);
  const [allowVehicleEdit, setAllowVehicleEdit] = useState(false);
  const [busStopDetails, setBusStopDetails] = useState(null);

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const [geoError, setGeoError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length && !issueCategoryId) {
      setIssueCategoryId(categories[0].id);
    }
  }, [categories, issueCategoryId]);

  useEffect(() => {
    if (prefill) {
      if (prefill.latitude) setLatitude(String(prefill.latitude));
      if (prefill.longitude) setLongitude(String(prefill.longitude));
      if (prefill.city) setDistrict(prefill.city);
      if (prefill.district) setDistrict(prefill.district);
      if (prefill.upazila) setUpazila(prefill.upazila);
      if (prefill.address) setAddress(prefill.address);

      if (prefill.busStop) {
        setBusStopDetails({
          code: prefill.busStop.code || prefill.busStop.id || "",
          name: prefill.busStop.name || prefill.busStop.title || "",
          latitude: prefill.busStop.latitude,
          longitude: prefill.busStop.longitude,
          raw: prefill.busStop.raw
        });
        if (prefill.busStop.latitude) setLatitude(String(prefill.busStop.latitude));
        if (prefill.busStop.longitude) setLongitude(String(prefill.busStop.longitude));
        if (prefill.busStop.address) setAddress(prefill.busStop.address);
      }

      if (prefill.vehicle) {
        setVehicleDetails({
          ...blankVehicle,
          ...prefill.vehicle,
          id: prefill.vehicle.id || prefill.vehicle._id || "",
          metadataText: formatMetadata(prefill.vehicle.metadata)
        });
      }

      setIssueHistory(prefill.issueHistory || []);
    }
  }, [prefill]);

  const onFileChange = e => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  // ✅ Better GPS helper (used by button + auto-run)
  const requestGps = useCallback(
    ({ overwrite = false } = {}) => {
      setGeoStatus("");
      setGeoError("");

      if (!navigator.geolocation) {
        setGeoError("Geolocation is not supported in this browser.");
        return;
      }

      // if already filled and we don't want to overwrite, skip
      if (!overwrite && latitude && longitude) return;

      setGeoLoading(true);

      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude: lat, longitude: lng, accuracy } = pos.coords;
          setLatitude(String(Number(lat).toFixed(6)));
          setLongitude(String(Number(lng).toFixed(6)));
          setGeoStatus(`Location locked (±${Math.round(accuracy)} m)`);
          setGeoLoading(false);
        },
        err => {
          const msg =
            err?.code === 1
              ? "GPS permission denied. Allow location access in the browser and try again."
              : err?.code === 2
              ? "GPS position unavailable. Turn on device location and try again."
              : "GPS timeout. Try again (or move closer to a window/outside).";
          setGeoError(msg);
          setGeoLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // ✅ longer timeout
          maximumAge: 15000 // ✅ allows using recent cached location
        }
      );
    },
    [latitude, longitude]
  );

  // ✅ Auto-run GPS once when page loads (only if no QR already filled it)
  useEffect(() => {
    const hasPrefilled = Boolean(prefill?.latitude && prefill?.longitude) || Boolean(busStopDetails);
    if (!hasPrefilled && (!latitude || !longitude)) {
      requestGps({ overwrite: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setDescription("");
    setSeverity(3);
    setFile(null);
    setMessage("");
  };

  const parseMetadataInput = () => {
    if (!vehicleDetails.metadataText.trim()) return undefined;
    try {
      return JSON.parse(vehicleDetails.metadataText);
    } catch {
      throw new Error("Metadata must be valid JSON (or leave empty).");
    }
  };

  const buildVehicleUpdates = () => {
    const updates = {
      model: vehicleDetails.model,
      type: vehicleDetails.type,
      category: vehicleDetails.category,
      registrationNumber: vehicleDetails.registrationNumber,
      numberPlate: vehicleDetails.numberPlate,
      issuingAuthority: vehicleDetails.issuingAuthority,
      issuanceDate: vehicleDetails.issuanceDate
    };
    const metadata = parseMetadataInput();
    if (metadata !== undefined) updates.metadata = metadata;
    return updates;
  };

  useEffect(() => {
    // Reset upazila when district changes
    setUpazila(prev => {
      const currentDistrict = locations.find(d => d.district === district);
      if (!currentDistrict) return "";
      const exists = currentDistrict.upazilas.includes(prev);
      return exists ? prev : "";
    });
  }, [district]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      // ✅ QR is OPTIONAL now (removed blocking condition)

      if (!reporterId || !issueCategoryId || !latitude || !longitude || !district) {
        throw new Error("Please fill reporter, location (district/lat/lng), and issue type.");
      }

      const vehicleUpdates = allowVehicleEdit ? buildVehicleUpdates() : undefined;

      await createReportSubmission({
        reporterId,
        vehicleId: vehicleDetails.id || undefined, // ✅ optional
        busStopCode: busStopDetails?.code, // optional
        busStopName: busStopDetails?.name,
        busStopRaw: busStopDetails?.raw,

        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        city: district,
        district,
        upazila,
        address,

        issueCategoryId,
        severity: Number(severity),
        description,
        file,

        allowVehicleEdit,
        vehicleUpdates
      });

      setMessage("Report submitted successfully.");
      resetForm();
      onSubmitSuccess?.();
    } catch (err) {
      setError(err.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {prefill && (
        <div className="form__group">
          <div className="pill">QR prefill applied{prefill.source ? ` (${prefill.source})` : ""}</div>
        </div>
      )}

      {busStopDetails && (
        <div className="form__group">
          <div className="pill">
            Bus stop QR detected{busStopDetails.name ? `: ${busStopDetails.name}` : ""}
          </div>
          <p className="muted">
            Vehicle is optional for bus-stop hazard reports. Location has been pre-filled from the QR code.
          </p>
        </div>
      )}

      <div className="form__group">
        <label>Reporter ID / Name</label>
        <input
          value={reporterId}
          onChange={e => setReporterId(e.target.value)}
          placeholder="e.g., user123"
          required
        />
      </div>

      <div className="form__group form__group--split">
        <div>
          <label>Issue Type</label>
          <select value={issueCategoryId} onChange={e => setIssueCategoryId(e.target.value)} required>
            {categories.map(cat => (
              <option value={cat.id} key={cat.id || cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Severity (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={severity}
            onChange={e => setSeverity(e.target.value)}
          />
          <div className="muted">Selected: {severity}</div>
        </div>
      </div>

      <div className="form__group">
        <label>Vehicle (from QR) — Optional</label>
        <div className="pill" style={{ marginBottom: "0.5rem" }}>
          {vehicleDetails.qrCode ? `QR: ${vehicleDetails.qrCode}` : "No vehicle loaded (you can still submit)"}
        </div>
        <label className="muted" style={{ display: "block" }}>
          {vehicleDetails.id
            ? "Vehicle loaded. You can submit a report or enable editing to correct details."
            : "Scan a vehicle QR to auto-fill vehicle info (optional)."}
        </label>

        <div className="form__group--split">
          <div>
            <label>Model</label>
            <input
              value={vehicleDetails.model}
              onChange={e => setVehicleDetails(v => ({ ...v, model: e.target.value }))}
              disabled={!allowVehicleEdit}
              placeholder="e.g., Toyota Corolla"
            />
            <label>Type</label>
            <input
              value={vehicleDetails.type}
              onChange={e => setVehicleDetails(v => ({ ...v, type: e.target.value }))}
              disabled={!allowVehicleEdit}
              placeholder="Bus / Truck / CNG / Car"
            />
            <label>Category</label>
            <input
              value={vehicleDetails.category}
              onChange={e => setVehicleDetails(v => ({ ...v, category: e.target.value }))}
              disabled={!allowVehicleEdit}
              placeholder="Government / Private / Ride-share"
            />
          </div>

          <div>
            <label>Registration Number</label>
            <input
              value={vehicleDetails.registrationNumber}
              onChange={e => setVehicleDetails(v => ({ ...v, registrationNumber: e.target.value }))}
              disabled={!allowVehicleEdit}
              placeholder="Registration number"
            />
            <label>Number Plate</label>
            <input
              value={vehicleDetails.numberPlate}
              onChange={e => setVehicleDetails(v => ({ ...v, numberPlate: e.target.value }))}
              disabled={!allowVehicleEdit}
              placeholder="Number plate"
            />
            <label>Issuing Authority</label>
            <input
              value={vehicleDetails.issuingAuthority}
              onChange={e => setVehicleDetails(v => ({ ...v, issuingAuthority: e.target.value }))}
              disabled={!allowVehicleEdit}
              placeholder="BRTA / Company / Authority"
            />
            <label>Issuance Date</label>
            <input
              type="date"
              value={vehicleDetails.issuanceDate ? vehicleDetails.issuanceDate.slice(0, 10) : ""}
              onChange={e => setVehicleDetails(v => ({ ...v, issuanceDate: e.target.value }))}
              disabled={!allowVehicleEdit}
            />
          </div>
        </div>

        <label style={{ marginTop: "0.6rem" }}>Metadata (JSON)</label>
        <textarea
          rows="3"
          value={vehicleDetails.metadataText}
          onChange={e => setVehicleDetails(v => ({ ...v, metadataText: e.target.value }))}
          disabled={!allowVehicleEdit}
          placeholder='{ "color": "blue", "fleet": "north" }'
        />

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={allowVehicleEdit}
            onChange={e => setAllowVehicleEdit(e.target.checked)}
          />
          Allow me to update vehicle fields with this submission
        </label>
      </div>

      {issueHistory.length > 0 && (
        <div className="form__group">
          <label>Previous issues for this vehicle</label>
          <ul className="list">
            {issueHistory.slice(0, 4).map(item => (
              <li key={item.id || item.createdAt} className="list__item">
                <div>
                  <div className="muted">On {new Date(item.createdAt).toLocaleString()}</div>
                  <div>{item.description || "No description"}</div>
                </div>
                <div className="pill">Severity {item.severity}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form__group">
        <label>Description</label>
        <textarea
          rows="3"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe unsafe driving or damaged road..."
        />
      </div>

      <div className="form__group form__group--split">
        <div>
          <label>Latitude / Longitude</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => requestGps({ overwrite: true })} disabled={geoLoading}>
              {geoLoading ? "Locking GPS..." : "Use GPS"}
            </button>
            {geoStatus && <span className="pill">{geoStatus}</span>}
            {geoError && <span className="pill pill--error">{geoError}</span>}
          </div>

          <div className="form__split-row">
            <input
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              placeholder="Latitude"
              required
            />
            <input
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              placeholder="Longitude"
              required
            />
          </div>
        </div>

        <div>
          <label>District</label>
          <select value={district} onChange={e => setDistrict(e.target.value)} required>
            <option value="">Select a district</option>
            {locations.map(loc => (
              <option key={loc.district} value={loc.district}>
                {loc.district}
              </option>
            ))}
          </select>

          <label>Upazila</label>
          <select value={upazila} onChange={e => setUpazila(e.target.value)} disabled={!district}>
            <option value="">{district ? "Select upazila" : "Choose district first"}</option>
            {locations
              .find(loc => loc.district === district)
              ?.upazilas.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>

          <label>Address (optional)</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Bus stop or road name" />
        </div>
      </div>

      <div className="form__group">
        <label>Photo/Video (optional)</label>
        <input type="file" accept="image/*,video/*" onChange={onFileChange} />
        {file && <div className="muted">Selected: {file.name}</div>}
      </div>

      <div className="form__actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
        {message && <span className="pill">{message}</span>}
        {error && (
          <span
            className="pill"
            style={{ background: "rgba(255,0,0,0.2)", border: "1px solid rgba(255,0,0,0.3)" }}
          >
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
