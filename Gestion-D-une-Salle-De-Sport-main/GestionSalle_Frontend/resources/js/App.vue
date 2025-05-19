<template>
  <div class="app-container">
    <!-- Sidebar (uniquement pour les utilisateurs authentifiés) -->
    <AppSidebar v-if="authStore.isAuthenticated" />
    
    <!-- Contenu principal -->
    <div class="main-content" :class="{ 'with-sidebar': authStore.isAuthenticated }">
      <!-- Navbar (uniquement pour les utilisateurs authentifiés) -->
      <AppNavbar v-if="authStore.isAuthenticated" />
      
      <!-- Notifications toast -->
      <ToastContainer />
      
      <!-- Router view pour le contenu dynamique -->
      <div class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppNavbar from './components/layout/AppNavbar.vue';
import ToastContainer from './components/ui/ToastContainer.vue';

// Store
const authStore = useAuthStore();

onMounted(async () => {
  // Vérifier l'authentification au chargement de l'application
  await authStore.checkAuth();
});
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.main-content.with-sidebar {
  margin-left: 250px;
}

.content-container {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

/* Animations de transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content.with-sidebar {
    margin-left: 0;
  }
}
</style>