import { useState } from 'react';
import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Unable to restore saved user session', error);
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  // 🚀 NEW: Register function added here!
  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data)); // Save token to browser
        return true; // Registration success
      } else {
        alert(data.message || 'Registration failed');
        return false; // Registration failed
      }
    } catch (error) {
      console.error("Registration error", error);
      return false;
    }
  };

  // Existing Login function
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

  // Existing Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    // 🚀 Added 'register' to the exported values here!
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
