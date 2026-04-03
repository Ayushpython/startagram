import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, usersAPI } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await usersAPI.getProfile();
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const register = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
