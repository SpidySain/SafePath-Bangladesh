// src/App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./views/Layout";
import AuthLayout from "./views/AuthLayout";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import ReportsPage from "./pages/ReportsPage";
import QrPage from "./pages/QrPage";
import FilterReportsPage from "./pages/FilterReportsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import MapPage from "./pages/MapPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function HomeGate() {
  const { isLoggedIn, booting } = useAuth();
  if (booting) return null;
  return isLoggedIn ? <LandingPage /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Auth pages WITHOUT main navbar */}
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

        {/*  Everything else uses the normal Layout WITH navbar */}
        <Route
          path="/*"
          element={
            <Layout title="SafePath Frontend">
              <Routes>
                <Route path="/" element={<HomeGate />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/filter-reports" element={<FilterReportsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/admin" element={<AdminReportsPage />} />
                <Route path="/qr" element={<QrPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
