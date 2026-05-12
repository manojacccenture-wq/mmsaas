import { Navigate, useLocation } from 'react-router-dom';
import { useRef, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hook';
import { useEffect } from 'react';

import { logoutAsync } from '@/features/auth/authThunk';
import { setActiveTenant, setActiveProduct } from '@/features/auth/authSlice';
// import { hasPermission } from '../../../utils/permissionUtils/permissionUtils';


interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePublic?: boolean;
  requireMfa?: boolean;
  requireResetState?: boolean;
  requiredPermission?: string;
}

const RouteGuard = ({
  children,
  requireAuth = false,
  requirePublic = false,
  requireMfa = false,
  requireResetState = false,
}: RouteGuardProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Sync URL params to Redux so apiClient can reliably read from Redux
  // useEffect(() => {
  //   const match = location.pathname.match(/^\/app\/([a-fA-F0-9]{24})(?:\/([a-zA-Z0-9_-]+))?/);
  //   if (match) {
  //     const tenantId = match[1];
  //     const productId = match[2];
      
  //     dispatch(setActiveTenant(tenantId));
      
  //     if (productId && !['dashboard', 'settings', 'policy', 'users', 'roles'].includes(productId)) {
  //       dispatch(setActiveProduct(productId));
  //     } else {
  //       dispatch(setActiveProduct(null));
  //     }
  //   }
  // }, [location.pathname, dispatch]);

  // Get auth state from Redux
  const { isAuthenticated, mfaPending, user, firstTimeLogin, otpType, activeContext } = useAppSelector((state) => state.auth);

  const role = user?.Role?.toLowerCase();


  const hasLoggedOut = useRef(false);

  // 🔐 First time login enforcement
if (requireResetState && !firstTimeLogin) {
  return <Navigate to="/dashboard" replace />;
}

  // 🚫 GLOBAL BLOCK
  if (role === "operator") {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      dispatch(logoutAsync());
    }

    return <Navigate to="/access-denied" replace />;
  }


  // 1️⃣ Public route (like login, signup)
if (requirePublic && isAuthenticated && !mfaPending && !firstTimeLogin) {
  return <Navigate to="/dashboard" replace />;
}

  // 2️⃣ Protected route
  if (requireAuth) {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    if (user?.Role?.toLowerCase() === "operator") {
      return <Navigate to="/access-denied" replace />;
    }

    // 🔥 STRICT CONTEXT vs URL MATCHING (Tenant / SuperAdmin Gate)
    const urlMatch = location.pathname.match(/^\/app\/([a-fA-F0-9]{24})/);
    
    const urlTenantId = urlMatch ? urlMatch[1] : null;

    if (urlTenantId) {
      // Trying to access a specific tenant workspace
      if (!activeContext || activeContext.tenantId !== urlTenantId) {
        return <Navigate to="/dashboard" replace />; // Fallback to auto-router
      }
    } else if (location.pathname.startsWith("/superadmin")) {
      // Trying to access global super admin workspace
      if (!activeContext || !activeContext.isSuperAdmin || activeContext.tenantId !== null) {
        return <Navigate to="/dashboard" replace />; // Fallback to auto-router
      }
    }
  }

  // 3️⃣ MFA route
if (requireMfa) {
  // ✅ Allow staying if just authenticated (for modal)
  console.log('isAuthenticated: ', isAuthenticated)
  console.log('mfaPending: ', mfaPending)
  if (!mfaPending && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 🚀 Prevent wrong route access
  if (otpType === "email" && location.pathname !== "/verify-email-otp") {
    return <Navigate to="/verify-email-otp" replace />;
  }

  if (otpType === "totp" && location.pathname !== "/verify-totp") {
    return <Navigate to="/verify-totp" replace />;
  }
}

  // Permission-based protection
  // if (requiredPermission) {
  //   if (!user || !hasPermission(user.role, requiredPermission)) {
  //     return <Navigate to="/access-denied" replace />;
  //   }
  // }

  // // 4️⃣ Role-based protection
  // if (allowedRoles.length > 0) {
  //   if (!user || !allowedRoles.includes(user.role)) {
  //     return <Navigate to="/access-denied" replace />;
  //   }
  // }

  // 5️⃣ Reset password route protection

if (requireResetState && !firstTimeLogin) {
  return <Navigate to="/dashboard" replace />;
}

  return children;
};



export default RouteGuard;


