import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeProvider';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MachineManagementPage from './pages/machine/MachineManagementPage';
import PageNotFound from './pages/PageNotFound';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/machines/*" element={<MachineManagementPage />} />
                <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
                <Route path="/profile" element={<div>Profile Page - Coming Soon</div>} />
              </Route>
            </Route>
            
            {/* 404 Not Found */}
            <Route path="/404" element={<PageNotFound />} />
            
            {/* Redirect all other routes to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 