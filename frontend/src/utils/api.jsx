import axios from 'axios';

const api = axios.create({
  baseURL: '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios Request Interceptor
// Automatically extracts the JWT token from LocalStorage (token or userInfo) and attaches it as Bearer token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    
    if (!token) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo);
          token = parsed.token;
        } catch (error) {
          console.error('Error parsing userInfo for token:', error);
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to globally handle expired tokens / auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('user');
      
      // If we are not on login or register page, force redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
