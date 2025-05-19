<template>
  <div class="sidebar" :class="{ 'collapsed': collapsed }">
    <div class="sidebar-header">
      <img src="/logo.png" alt="Salle de Sport" class="logo" v-if="!collapsed" />
      <img src="/logo-small.png" alt="Salle de Sport" class="logo-small" v-else />
      <button @click="toggleCollapse" class="toggle-btn">
        <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>
    
    <div class="user-info" v-if="!collapsed">
      <div class="avatar">
        <img :src="userAvatar" alt="Avatar" />
      </div>
      <div class="user-details">
        <div class="user-name">{{ authStore.user.name }}</div>
        <div class="user-role">{{ formatRole(authStore.user.role) }}</div>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" class="nav-link">
            <i class="bi bi-speedometer2"></i>
            <span v-if="!collapsed">Tableau de bord</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/members" class="nav-link">
            <i class="bi bi-people"></i>
            <span v-if="!collapsed">Membres</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/reservations" class="nav-link">
            <i class="bi bi-calendar-check"></i>
            <span v-if="!collapsed">Réservations</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/calendar" class="nav-link">
            <i class="bi bi-calendar3"></i>
            <span v-if="!collapsed">Calendrier</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/services" class="nav-link">
            <i class="bi bi-journal-check"></i>
            <span v-if="!collapsed">Services</span>
          </router-link>
        </li>
        
        <li>
          <router-link to="/equipments" class="nav-link">
            <i class="bi bi-box-seam"></i>
            <span v-if="!collapsed">Équipements</span>
          </router-link>
        </li>
        
        <li v-if="['admin', 'manager'].includes(authStore.user.role)">
          <router-link to="/payments" class="nav-link">
            <i class="bi bi-cash-coin"></i>
            <span v-if="!collapsed">Paiements</span>
          </router-link>
        </li>
        
        <li v-if="authStore.user.role === 'admin'">
          <router-link to="/users" class="nav-link">
            <i class="bi bi-person-badge"></i>
            <span v-if="!collapsed">Utilisateurs</span>
          </router-link>
        </li>
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      <router-link to="/profile" class="nav-link">
        <i class="bi bi-person-circle"></i>
        <span v-if="!collapsed">Profil</span>
      </router-link>
      
      <a href="#" @click.prevent="logout" class="nav-link">
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="!collapsed">Déconnexion</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const collapsed = ref(false);

// Avatar de l'utilisateur (avec fallback)
const userAvatar = computed(() => {
  if (authStore.user && authStore.user.avatar) {
    return `/storage/${authStore.user.avatar}`;
  }
  return '/default-avatar.png';
});

// Formater le rôle pour l'affichage
const formatRole = (role) => {
  const roles = {
    'admin': 'Administrateur',
    'manager': 'Gérant',
    'coach': 'Coach',
  };
  
  return roles[role] || role;
};

// Toggle sidebar collapse
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

// Déconnexion
const logout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: #343a40;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  height: 40px;
}

.logo-small {
  height: 30px;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: bold;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-link i {
  margin-right: 10px;
  font-size: 18px;
}

.sidebar.collapsed .nav-link i {
  margin-right: 0;
}

.sidebar-footer {
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.active {
    transform: translateX(0);
  }
}
</style>