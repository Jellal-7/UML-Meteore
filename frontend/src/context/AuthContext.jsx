import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('meteore_token'));
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const storedToken = localStorage.getItem('meteore_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getProfile();
      setUser(data.user);
      setToken(storedToken);
    } catch {
      localStorage.removeItem('meteore_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('meteore_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('meteore_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('meteore_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
