import axios from 'axios';

// Spring Boot analogy: RestTemplate / WebClient configuration bean
const api = axios.create({
  baseURL: '', // Vite proxy redirects /api requests to localhost:5000
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios Request Interceptor (Spring Boot analogy: ClientHttpRequestInterceptor)
// Automatically extracts the JWT token from LocalStorage and attaches it as Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    // If backend returns 401 Unauthorized, wipe local credentials
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not on the login/register page, force redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
