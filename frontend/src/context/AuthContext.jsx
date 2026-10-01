import { useState } from 'react';
import { AuthContext } from './AuthContextValue';

const USER_STORAGE_KEY = 'userInfo';

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { success: false, message: data.message || 'Something went wrong' };
  }

  return { success: true, data };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const saveUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const result = await parseResponse(response);
      if (!result.success) return result;

      saveUser(result.data);
      return { success: true, message: 'Registration successful' };
    } catch {
      return { success: false, message: 'Unable to reach the server. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await parseResponse(response);
      if (!result.success) return result;

      saveUser(result.data);
      return { success: true };
    } catch {
      return { success: false, message: 'Unable to reach the server. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
