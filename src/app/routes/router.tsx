import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Loader from "@/shared/components/Loader/Loader";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import AuthLayout from "@/app/layout";

import { useAppSelector } from "../store/hook";
import SuperAdminRoutes from "@/app/routes/Super_Admin_Routes/superAdminRoutes";
import TenantRoutes from "@/app/routes/tenantRoutes/tenantRoutes";

// Auth Pages
const SignIn = lazy(() => import("@/features/auth/pages/SignIn"));
const SignUp = lazy(() => import("@/features/auth/pages/SignUp"));
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const MFA = lazy(() => import("@/features/auth/pages/MFA"));
const SetupTotp = lazy(() => import("@/features/auth/pages/SetupTotp"));

// // Dashboard

const AccessDenied = lazy(() => import("@/features/AccessDenied/AccessDenied"));
const PasswordReset = lazy(() => import("@/features/auth/pages/PasswordReset"));


const AuthRedirect = () => {
  const navigate = useNavigate();
  const { activeContext, isAuthenticated } = useAppSelector((state: any) => state.auth);


  useEffect(() => {
    if (!isAuthenticated || !activeContext) return;

    if (!activeContext.tenantId) {
      navigate("/superadmin", { replace: true });
    } else {
      navigate(`/app/${activeContext.tenantId}`, { replace: true });
    }
  }, [activeContext, isAuthenticated]);

  return null;
};



const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* Public Auth Routes */}

        <Route element={<AuthLayout />}><Route path="/" element={<RouteGuard requirePublic><SignIn /></RouteGuard>} />

          <Route path="/signup" element={<RouteGuard requirePublic> <SignUp /></RouteGuard>} />

          <Route path="/forgotPassword" element={<RouteGuard requirePublic> <ForgotPassword /></RouteGuard>} /></Route>

        <Route path="/reset_Flow" element={<RouteGuard requireAuth requireResetState><PasswordReset /></RouteGuard>}
        />

        {/* MFA */}

        <Route path="/verify-email-otp" element={<RouteGuard requireMfa> <MFA /></RouteGuard>} />

        <Route path="/verify-totp" element={<RouteGuard requireMfa><MFA /> </RouteGuard>} />
        <Route path="/setup-totp" element={<RouteGuard requireAuth> <SetupTotp /></RouteGuard>} />

        {/* <Route path="/mfa" element={<RouteGuard requireMfa> <MFA /></RouteGuard>} /> */}

        {/* PROTECTED DASHBOARD AREA */}



        <Route
          path="/dashboard"
          element={
            <RouteGuard requireAuth>
              <AuthRedirect />
            </RouteGuard>
          }
        />

        <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
        <Route path="/app/:tenantId/*" element={<TenantRoutes />} />




        {/* Reset Password */}

        <Route path="/reset-password" element={<RouteGuard requireResetState> <ResetPassword /> </RouteGuard>} />


        {/* Log Out */}

        {/* <Route path="logout" element={<RouteGuard requireAuth > <Logout /> </RouteGuard>} /> */}

        <Route path="/access-denied" element={<AccessDenied />} />

      </Routes >
    </Suspense >
  );
};

export default AppRouter;
