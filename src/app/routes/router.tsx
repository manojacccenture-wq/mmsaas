import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/shared/components/Loader/Loader";
import RouteGuard from "@/shared/components/RouteGuard/RouteGuard";
import AuthLayout from "@/app/layout";

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
const Dashboard = lazy(() => import("@/features/Dashboard/pages/Dashboard"));



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

        <Route path="/verify-email-otp" element={ <RouteGuard requireMfa> <MFA /></RouteGuard>}/>

        <Route path="/verify-totp" element={ <RouteGuard requireMfa><MFA /> </RouteGuard>}/>
        <Route path="/setup-totp" element={ <RouteGuard requireAuth> <SetupTotp /></RouteGuard>}/>

        {/* <Route path="/mfa" element={<RouteGuard requireMfa> <MFA /></RouteGuard>} /> */}

        {/* PROTECTED DASHBOARD AREA */}

        <Route path="/dashboard" element={<RouteGuard requireAuth> <Dashboard /> </RouteGuard>}>
{/* 

          <Route path="registerUser" element={<RouteGuard > <RegisterUser /></RouteGuard>} />
          <Route index element={<RouteGuard requireAuth requiredPermission={PERMISSIONS.VIEW_DASHBOARD}><Overview /></RouteGuard>} />

          <Route path="surveyList" element={<RouteGuard requireAuth requiredPermission={PERMISSIONS.VIEW_TOILETS} ><SurveyList /></RouteGuard>} /> */}


        </Route>



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
