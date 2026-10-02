import { useState } from 'react';
import { AuthContext, useAuth } from './AuthContextValue';

export { useAuth, AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) return null;

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed.role) {
        parsed.role = 'customer';
      }
      if (parsed.token) {
        localStorage.setItem('token', parsed.token);
      }
      return parsed;
    } catch (error) {
      console.error('Unable to restore saved user session', error);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      return null;
    }
  });

  const register = async (name, email, password, role = 'customer') => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error("Registration error", error);
      return { success: false, message: 'Server error during registration' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return true; 
      } else {
        alert(data.message || 'Login failed');
        return false; 
      }
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  const refreshProfile = async () => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.token) {
          localStorage.setItem('token', parsed.token);
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
