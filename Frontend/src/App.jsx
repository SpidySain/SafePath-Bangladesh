// src/App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./views/Layout";
import AuthLayout from "./views/AuthLayout";

import LandingPage from "./pages/LandingPage";
import ReportsPage from "./pages/ReportsPage";
import QrPage from "./pages/QrPage";
import FilterReportsPage from "./pages/FilterReportsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import MapPage from "./pages/MapPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AlertsPage from "./pages/AlertsPage";
import AdminAlertsPage from "./pages/AdminAlertsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (no main navbar) */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Everything else uses Layout */}
        <Route path="/" element={<Layout title="SafePath Bangladesh" />}>
          <Route index element={<LandingPage />} />

          <Route path="map" element={<MapPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="filter-reports" element={<FilterReportsPage />} />
          <Route path="qr" element={<QrPage />} />

          {/* Citizen alerts list page */}
          <Route path="alerts" element={<AlertsPage />} />

          {/* Admin pages */}
          <Route path="admin" element={<AdminReportsPage />} />
          <Route path="admin/alerts" element={<AdminAlertsPage />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
