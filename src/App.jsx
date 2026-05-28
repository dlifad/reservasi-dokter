import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/pasien/Dashboard";
import BookingPage from "./pages/pasien/Booking";
import PatientBookings from "./pages/pasien/MyBookings";
import DoctorDashboard from "./pages/dokter/Dashboard";
import DoctorSchedule from "./pages/dokter/Schedule";
import DoctorDaftarPasien from "./pages/dokter/DaftarPasien";
import DashboardAdmin from "./pages/admin/DashboardAdmin";

export default function App() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const noLayoutPages = ["/", "/login", "/register"];
  const hideNavbar = noLayoutPages.includes(location.pathname);

  const getHomePath = () => {
    if (user?.role === "admin")  return "/admin";
    if (user?.role === "dokter") return "/doctor";
    return "/patient";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {!hideNavbar && <Navbar user={user} onLogout={logout} />}

      <main className={hideNavbar ? "" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to={getHomePath()} replace /> : <LandingPage />}
          />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/patient" element={<ProtectedRoute role="pasien"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/bookings" element={<ProtectedRoute role="pasien"><PatientBookings /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute role="pasien"><BookingPage /></ProtectedRoute>} />

          <Route path="/doctor" element={<ProtectedRoute role="dokter"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute role="dokter"><DoctorSchedule /></ProtectedRoute>} />
          <Route path="/doctor/pasien" element={<ProtectedRoute role="dokter"><DoctorDaftarPasien /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardAdmin /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}