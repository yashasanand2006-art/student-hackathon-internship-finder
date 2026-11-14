import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexus_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('nexus_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to restore session:', err.message);
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    const handleGlobalLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth_logout', handleGlobalLogout);
    return () => window.removeEventListener('auth_logout', handleGlobalLogout);
  }, []);

  // Standard Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('nexus_token', data.token);
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  // 1-Click Demo Login
  const demoLogin = async (role = 'student') => {
    const email = role === 'admin' ? 'admin@nexus.edu' : 'student@nexus.edu';
    return await login(email, 'password123');
  };

  // Register
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('nexus_token', data.token);
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.',
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setUser(null);
    setToken(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('nexus_user', JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile.',
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    demoLogin,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
