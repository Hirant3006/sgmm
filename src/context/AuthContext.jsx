import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await AuthService.checkAuthStatus();
        
        if (result.success) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await AuthService.login(username, password);
      
      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.message || 'Đăng nhập thất bại');
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
      return { success: false, message: 'Lỗi kết nối đến server' };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      const result = await AuthService.logout();
      
      if (result.success) {
        setUser(null);
        return { success: true };
      } else {
        console.error('Logout failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, message: 'Lỗi kết nối đến server' };
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 