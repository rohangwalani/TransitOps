import { Navigate } from 'react-router-dom';

/**
 * Wraps any route that requires authentication.
 * Checks for a stored user token; if absent, redirects to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user?.token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
