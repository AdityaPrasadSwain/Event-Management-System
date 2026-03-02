import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const normalizedUserRole = user.role.replace('ROLE_', '').toUpperCase();
        const normalizedAllowedRoles = allowedRoles.map(r => r.replace('ROLE_', '').toUpperCase());

        if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
            console.log(`🚫 Access denied: User role ${normalizedUserRole} not in ${normalizedAllowedRoles}`);
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Check for pending organizer status
    if (user.role === 'ORGANIZER' &&
        user.organizerStatus === 'PENDING' &&
        window.location.pathname.startsWith('/organizer') &&
        window.location.pathname !== '/organizer/pending') {
        return <Navigate to="/organizer/pending" replace />;
    }

    return children;
};

export default ProtectedRoute;
