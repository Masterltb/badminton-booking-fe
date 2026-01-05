import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Role } from '@/types/enums';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login, but save the location they were trying to go to
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as Role)) {
    // User is logged in but doesn't have permission (e.g. User trying to access Admin)
    return <Navigate to="/" replace />; // Or a generic "403 Forbidden" page
  }

  return <Outlet />;
};
