import "./App.css";
import Layout from "./views/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ReportsPage from "./pages/ReportsPage";
import QrPage from "./pages/QrPage";
import FilterReportsPage from "./pages/FilterReportsPage";
import AdminReportsPage from "./pages/AdminReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Layout title="SafePath Frontend">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/filter-reports" element={<FilterReportsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin" element={<AdminReportsPage />} />
          <Route path="/qr" element={<QrPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
