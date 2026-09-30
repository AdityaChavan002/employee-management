import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import DoctorLayout from "./layouts/DoctorLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import {
  AboutPage,
  DoctorProfilePage,
  HomePage,
  NotFoundPage,
  PoliciesPage,
  SearchPage,
} from "./pages/public/PublicPages";
import {
  LoginPage,
  ResetPasswordPage,
  SignupPage,
  VerifyOtpPage,
} from "./pages/auth/AuthPages";
import {
  AppointmentsPage,
  BookingPage,
  ConfirmationPage,
  PaymentPage,
} from "./pages/patient/PatientPages";
import {
  AvailabilityPage,
  DoctorDashboardPage,
  DoctorOnboardingPage,
  DoctorProfileEditPage,
  JoiningFeePage,
  VerificationPage,
} from "./pages/doctor/DoctorPages";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="doctors/:doctorId" element={<DoctorProfilePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route
            path="booking/:doctorId"
            element={
              <ProtectedRoute role="patient">
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment"
            element={
              <ProtectedRoute role="patient">
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="booking/confirmation"
            element={
              <ProtectedRoute role="patient">
                <ConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <ProtectedRoute role="patient">
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/onboarding"
            element={
              <ProtectedRoute role="doctor">
                <DoctorOnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/verification"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLayout>
                  <VerificationPage />
                </DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/joining-fee"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLayout>
                  <JoiningFeePage />
                </DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLayout>
                  <DoctorDashboardPage />
                </DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/availability"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLayout>
                  <AvailabilityPage />
                </DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="doctor/profile/edit"
            element={
              <ProtectedRoute role="doctor">
                <DoctorLayout>
                  <DoctorProfileEditPage />
                </DoctorLayout>
              </ProtectedRoute>
            }
          />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
