import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.some(role => user.roles.includes('ROLE_' + role))) {
        return <Navigate to="/" replace />; // Unauthorized
    }

    return children;
};

export default ProtectedRoute;
