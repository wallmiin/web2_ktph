import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/current-user', {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUserRole(response.data.role);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
        <div className="container-overlay">
          <div style={{ textAlign: 'center', color: 'var(--secondary-color)', fontSize: '1.5rem' }}>
            Đang tải...
          </div>
        </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Redirecting to /login: Not authenticated');
    return <Navigate to="/login" />;
  }

  if (userRole === 'ADMIN') {
    return children;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`Redirecting: ${userRole} role does not match required role (${requiredRole})`);
    alert('Bạn không có quyền truy cập trang này! ☕');
    if (userRole === 'USER' && requiredRole === 'ADMIN') {
      return <Navigate to="/user" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;