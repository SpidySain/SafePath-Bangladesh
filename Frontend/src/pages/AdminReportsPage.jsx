import { useCallback, useEffect, useState } from "react";
import { fetchReportSummaries, fetchReports, updateReportStatus } from "../controllers/reportController";
import { fetchCategories } from "../controllers/categoryController";
import { DEFAULT_REPORT_FILTERS } from "../utils/reportFilters";
import AdminFilters from "../views/AdminFilters";
import AdminReportTable from "../views/AdminReportTable";
import ReportMap from "../views/ReportMap";
import { fetchMonthlyAnalytics, exportReportsCSV } from "../controllers/reportController";

export default function AdminReportsPage() {
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ ...DEFAULT_REPORT_FILTERS, status: "", sort: "createdAt" });
  const [draftFilters, setDraftFilters] = useState({ ...DEFAULT_REPORT_FILTERS, status: "", sort: "createdAt" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
  const [analyticsYear, setAnalyticsYear] = useState((new Date()).getFullYear());

  const loadCategories = useCallback(async () => {
    const data = await fetchCategories().catch(() => []);
    setCategories(data);
  }, []);

  const loadReports = useCallback(async activeFilters => {
    setLoading(true);
    setError("");
    try {
      const normalized = { ...DEFAULT_REPORT_FILTERS, status: "", sort: "createdAt", ...activeFilters };
      const data = await fetchReports(normalized);
      setReports(data);
      setFilters(normalized);
      setDraftFilters(normalized);
    } catch (err) {
      setError("Failed to load reports. Ensure backend is reachable and user is authorized.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadReports(filters);
    // fetch analytics on load
    loadMonthlyAnalytics(analyticsYear);
  }, [loadCategories, loadReports]);

  const handleApply = next => loadReports(next);
  const handleReset = () => loadReports({ ...DEFAULT_REPORT_FILTERS, status: "", sort: "createdAt" });

  const handleStatusChange = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      await loadReports(filters);
      // refresh analytics as statuses changed
      await loadMonthlyAnalytics(analyticsYear);
    } catch (err) {
      setError("Could not update status. Admin auth required.");
    }
  };

  const loadMonthlyAnalytics = async (year) => {
    try {
      const data = await fetchMonthlyAnalytics(year);
      setMonthlyAnalytics(data);
    } catch (err) {
      setMonthlyAnalytics([]);
    }
  };

  const handleExport = async () => {
    try {
      setError("");
      await exportReportsCSV({ year: analyticsYear });
    } catch (err) {
      setError("Export failed. Ensure admin access and try again.");
    }
  };

  return (
    <div className="grid">
      <section className="panel">
        <h2 className="panel__title">Admin: Report Management</h2>
        <p className="muted">Filter, review, and verify reports. Actions require admin rights on the backend.</p>
        <AdminFilters
          categories={categories}
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApply}
          onReset={handleReset}
          applying={loading}
        />
        {error && <div className="pill pill--error">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel__title" style={{ justifyContent: "space-between", display: "flex" }}>
          <span>Map overview</span>
          <span className="muted">{loading ? "Loading..." : `${reports.length} reports`}</span>
        </div>
        {loading ? <p className="muted">Loading map...</p> : <ReportMap reports={reports} />}
      </section>

      <section className="panel">
        <div className="panel__title" style={{ justifyContent: "space-between", display: "flex" }}>
          <span>Monthly analytics</span>
          <div>
            <select value={analyticsYear} onChange={e => { setAnalyticsYear(Number(e.target.value)); loadMonthlyAnalytics(Number(e.target.value)); }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const y = (new Date()).getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <button className="secondary" onClick={() => loadMonthlyAnalytics(analyticsYear)}>Refresh</button>
            <button onClick={handleExport}>Export CSV</button>
          </div>
        </div>

        {monthlyAnalytics.length === 0 ? (
          <p className="muted">No analytics available for this year.</p>
        ) : (
          <table style={{ width: "100%", marginTop: 10 }}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Verified</th>
                <th>Pending</th>
                <th>False</th>
              </tr>
            </thead>
            <tbody>
              {monthlyAnalytics.map(row => (
                <tr key={`${row.year}-${row.month}`}>
                  <td>{row.year}</td>
                  <td>{row.month}</td>
                  <td>{row.VERIFIED || 0}</td>
                  <td>{row.PENDING || 0}</td>
                  <td>{row.FALSE || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel">
        <div className="panel__title" style={{ justifyContent: "space-between", display: "flex" }}>
          <span>Report list</span>
          <span className="muted">
            Sorted by {filters.sort === "severity" ? "severity" : "newest"} · {reports.length} total
          </span>
        </div>
        {loading ? (
          <p className="muted">Loading reports...</p>
        ) : (
          <AdminReportTable
            reports={reports}
            onChangeStatus={handleStatusChange}
            sorting={filters.sort}
          />
        )}
      </section>
    </div>
  );
}
