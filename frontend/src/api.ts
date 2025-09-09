// fronted/src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000
});

// טוקן התחלתי (אם נשמר בעבר)
const t = localStorage.getItem('token');
if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;

// Interceptor לשגיאות הרשאה
api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      // אופציונלי: הפניה לכניסה
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
