import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },
  
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/login', credentials);
        
        if (response.data.success) {
          this.setUser(response.data.user);
          this.setToken(response.data.token);
          this.setupAxiosInterceptors();
          return true;
        }
        
        return false;
      } catch (error) {
        this.clearAuth();
        throw error;
      }
    },
    
    async logout() {
      try {
        if (this.token) {
          await axios.post('/api/logout');
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        this.clearAuth();
      }
    },
    
    async checkAuth() {
      if (!this.token) {
        return false;
      }
      
      try {
        this.setupAxiosInterceptors();
        const response = await axios.get('/api/me');
        
        if (response.data.success) {
          this.setUser(response.data.user);
          return true;
        }
        
        return false;
      } catch (error) {
        this.clearAuth();
        return false;
      }
    },
    
    setUser(user) {
      this.user = user;
    },
    
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    clearAuth() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    
    setupAxiosInterceptors() {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      
      // Intercepteur pour gérer les erreurs d'authentification
      axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response && [401, 403].includes(error.response.status)) {
            // Si l'erreur est d'authentification, déconnecter l'utilisateur
            this.clearAuth();
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      );
    }
  }
});