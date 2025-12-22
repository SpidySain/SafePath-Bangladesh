import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportHistory() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports");
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Your Report History</h2>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report._id} style={{ marginBottom: "15px" }}>
              <strong>{report.description || "No description"}</strong>
              <br />

              <small>
                <strong>Lat:</strong> {report.location?.latitude}{" "}
                <strong>Lng:</strong> {report.location?.longitude}
              </small>
              <br />

              <small>
                <strong>Date:</strong>{" "}
                {new Date(report.createdAt).toLocaleString()}
              </small>
              <br />

              <small>
                <strong>Category:</strong> {report.issueCategory?.name}
              </small>
              <br />

              <small>
                <strong>Status:</strong> {report.status}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReportHistory;


