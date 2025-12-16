import { useCallback, useEffect, useState } from "react";
import { fetchCategories } from "../controllers/categoryController";
import { fetchReportSummaries } from "../controllers/reportController";
import { fetchVehicleFromQr } from "../controllers/vehicleController";
import ReportList from "./ReportList";
import CategoryList from "./CategoryList";
import ReportForm from "./ReportForm";
import QrScannerPanel from "./QrScannerPanel";

export default function HomeView() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefill, setPrefill] = useState(null);
  const [scanError, setScanError] = useState("");
  const [scanLoading, setScanLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reportData, categoryData] = await Promise.all([
        fetchReportSummaries(),
        fetchCategories()
      ]);
      setReports(reportData);
      setCategories(categoryData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReportSubmitted = async () => {
    await loadData();
  };

  const handleQrScan = async rawValue => {
    setScanError("");
    setScanLoading(true);
    try {
      const data = await fetchVehicleFromQr(rawValue);
      setPrefill({ ...data, source: rawValue });
    } catch (err) {
      setScanError(err.message || "Could not fetch vehicle data for this QR");
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="grid">
      <section className="panel" id="reports">
        <h2 className="panel__title">Submit a Report</h2>
        <ReportForm
          categories={categories}
          prefill={prefill}
          onSubmitSuccess={handleReportSubmitted}
        />
      </section>

      <QrScannerPanel
        onResult={handleQrScan}
      />
      {scanLoading && <div className="pill">Loading vehicle from QR...</div>}
      {scanError && <div className="pill pill--error">{scanError}</div>}

      <div className="grid grid--two">
        <section className="panel" id="reports-list">
          <h2 className="panel__title">Reports</h2>
          {loading ? <p className="muted">Loading...</p> : <ReportList reports={reports} />}
        </section>

        <section className="panel">
          <h2 className="panel__title">Categories</h2>
          {loading ? <p className="muted">Loading...</p> : <CategoryList categories={categories} />}
        </section>
      </div>
    </div>
  );
}
