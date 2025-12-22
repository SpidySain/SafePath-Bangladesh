import React, { useState } from "react";
import axios from "axios";

function ReportForm() {
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const detectLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        alert("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  };

  const sendReport = async () => {
    try {
      const body = {
        reporterId: "12345", // (later connected to auth)
        vehicleId: null,
        latitude: location.lat,
        longitude: location.lng,
        city: "Dhaka",
        issueCategoryId: "693b40aa6c9c9d104ca9fb85",
        severity: "High",
        description: "Unsafe driving detected.",
        attachmentIds: [],
        allowVehicleEdit: false,
      };

      const res = await axios.post("http://localhost:5000/api/reports", body);
      setMessage("Report submitted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit report.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submit Report</h2>

      <button onClick={detectLocation}>
        {loading ? "Detecting..." : "Auto Detect Location"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Latitude:</strong> {location.lat}</p>
        <p><strong>Longitude:</strong> {location.lng}</p>
      </div>

      <button onClick={sendReport} style={{ marginTop: "20px" }}>
        Submit Report
      </button>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default ReportForm;

