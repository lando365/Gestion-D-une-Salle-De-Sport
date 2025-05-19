import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './routes';
import { useAuthStore } from './stores/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/app.css';

// Créer le router
const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guards
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    // Vérifier si la route nécessite une authentification
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Rediriger vers la page de connexion
        next({ name: 'login' });
    } 
    // Vérifier si la route est réservée aux rôles spécifiques
    else if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
        // Rediriger vers le dashboard par défaut
        next({ name: 'dashboard' });
    } 
    else {
        // Continuer la navigation
        next();
    }
});

// Créer l'application
const app = createApp(App);

// Utiliser Pinia pour la gestion d'état
app.use(createPinia());
app.use(router);

app.mount('#app');