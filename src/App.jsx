// App.jsx
// Root component. Sets up routing and wraps the app in AuthProvider.
// Protected routes redirect to /login if no valid session exists.

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AcBusPage from "./pages/AcBusPage";
import DcBusPage from "./pages/DcBusPage";
import AlarmsPage from "./pages/AlarmsPage";
import BessPage from "./pages/BessPage";
import LoadsPage from "./pages/LoadsPage";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import PvPage from "./pages/PvPage";
import WecsPage from "./pages/WecsPage";
import "./styles/global.css";

// Wraps any route that requires authentication.
// If not logged in, redirects to /login.
function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        path="/ac-bus"
        element={
          <ProtectedRoute>
            <AcBusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alarms"
        element={
          <ProtectedRoute>
            <AlarmsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bess"
        element={
          <ProtectedRoute>
            <BessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dc-bus"
        element={
          <ProtectedRoute>
            <DcBusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/loads"
        element={
          <ProtectedRoute>
            <LoadsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/overview"
        element={
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pv"
        element={
          <ProtectedRoute>
            <PvPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wecs"
        element={
          <ProtectedRoute>
            <WecsPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}