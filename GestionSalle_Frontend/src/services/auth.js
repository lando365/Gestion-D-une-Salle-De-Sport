import api from '@/config/api';

export default {
  async login(credentials) {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('token');
    return api.post('/logout');
  },
  
  getUser() {
    return api.get('/me');
  }
};