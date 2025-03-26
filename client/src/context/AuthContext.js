import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { register as apiRegister, login as apiLogin, logout as apiLogout, getProfile, updateProfile as apiUpdateProfile, initializeAuth } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in via token in localStorage
  useEffect(() => {
    const checkLoggedIn = async () => {
      // Initialize axios auth headers from token if exists
      initializeAuth();
      
      let token = localStorage.getItem('token');
      
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token is expired
            apiLogout();
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Fetch current user data
            const userData = await getProfile();
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (err) {
          // Invalid token or server error
          apiLogout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const data = await apiRegister(userData);
      setUser(data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const data = await apiLogin(email, password);
      setUser(data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const updatedUser = await apiUpdateProfile(userData);
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
