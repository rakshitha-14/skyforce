import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check if user session exists on app load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await axiosInstance.get('/auth/profile');
          setUser(res.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Session verification failed, logging out...', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const res = await axiosInstance.post('/auth/login', {
        email: trimmedEmail,
        password: trimmedPassword,
      });
      const { token, ...userData } = res.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const status = error.response?.status;
      let message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      if (status === 401) {
        message = 'Invalid email or password. If you recently registered, please wait for admin approval.';
      }
      return {
        success: false,
        message,
      };
    }
  };

  // Registration handler
  const register = async (name, email, password, role, department, designation) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        department: department.trim(),
        designation: designation.trim(),
      });
      setLoading(false);
      return { success: true, message: res.data.message || 'Registration successful. Pending approval.' };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const refreshUserStatus = async () => {
    try {
      const res = await axiosInstance.get('/auth/profile');
      setUser(res.data);
      return { success: true, user: res.data };
    } catch (error) {
      console.error('Refresh status failed', error);
      const status = error.response?.status;
      if (status === 403) {
        logout();
      }
      return { success: false, message: error.response?.data?.message || 'Failed to refresh status' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUserStatus,
        isAuthenticated: !!user,
        isApproved: user?.isApproved,
        isBlocked: user?.isBlocked,
        isManager: user?.role === 'Manager' || user?.role === 'Admin',
        isAdmin: user?.role === 'Admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
