import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // URL de votre backend Laravel
  withCredentials: true, // Important pour CSRF/Session
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter automatiquement le token auth
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;