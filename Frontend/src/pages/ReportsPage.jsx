import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategories } from "../controllers/categoryController";
import { fetchReportSummaries } from "../controllers/reportController";
import { DEFAULT_REPORT_FILTERS } from "../utils/reportFilters";
import ReportList from "../views/ReportList";
import CategoryList from "../views/CategoryList";
import ReportForm from "../views/ReportForm";
import ReportFilters from "../views/ReportFilters";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [prefill, setPrefill] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_REPORT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_REPORT_FILTERS);
  const location = useLocation();
  const navigate = useNavigate();

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const loadReports = useCallback(async activeFilters => {
    setLoadingReports(true);
    try {
      const normalizedFilters = { ...DEFAULT_REPORT_FILTERS, ...activeFilters };
      const reportData = await fetchReportSummaries(normalizedFilters);
      setReports(reportData);
      setFilters(normalizedFilters);
      setDraftFilters(normalizedFilters);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    loadReports(filters);
  }, [loadCategories, loadReports]);

  useEffect(() => {
    if (location.state?.prefill) {
      setPrefill(location.state.prefill);
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (location.hash === "#filters" || location.hash === "#report-form") {
      const el = document.getElementById("filters");
      const formEl = document.getElementById("report-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (formEl && location.hash === "#report-form") {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location, navigate]);

  const handleReportSubmitted = async () => {
    await loadReports(filters);
  };

  const handleApplyFilters = nextFilters => {
    const normalized = { ...DEFAULT_REPORT_FILTERS, ...nextFilters };
    loadReports(normalized);
  };

  const handleResetFilters = () => {
    handleApplyFilters(DEFAULT_REPORT_FILTERS);
  };

  return (
    <div className="grid">
      <section className="panel" id="report-form">
        <h2 className="panel__title">Submit a Report</h2>
        <ReportForm
          categories={categories}
          prefill={prefill}
          onSubmitSuccess={handleReportSubmitted}
        />
      </section>

      <div className="grid grid--two">
        <section className="panel">
          <h2 className="panel__title">Reports</h2>
          {loadingReports ? <p className="muted">Loading...</p> : <ReportList reports={reports} />}
        </section>

        <section className="panel">
          <h2 className="panel__title">Categories</h2>
          {loadingCategories ? <p className="muted">Loading...</p> : <CategoryList categories={categories} />}
        </section>
      </div>
    </div>
  );
}
