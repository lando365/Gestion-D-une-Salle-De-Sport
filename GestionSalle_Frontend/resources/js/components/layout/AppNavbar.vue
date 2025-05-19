<template>
  <nav class="navbar">
    <div class="navbar-left">
      <button class="mobile-toggle" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </button>
      <h1 class="page-title">{{ currentPageTitle }}</h1>
    </div>
    
    <div class="navbar-right">
      <div class="notification-dropdown">
        <button class="notification-btn" @click="toggleNotifications">
          <i class="bi bi-bell"></i>
          <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </button>
        
        <div class="dropdown-menu" v-if="showNotifications">
          <div class="dropdown-header">
            <h6>Notifications</h6>
            <button class="mark-all-read" @click="markAllAsRead" v-if="unreadCount > 0">
              Tout marquer comme lu
            </button>
          </div>
          
          <div class="dropdown-body">
            <div v-if="notifications.length === 0" class="no-notifications">
              Aucune notification
            </div>
            
            <div v-else class="notification-list">
              <div 
                v-for="notification in notifications" 
                :key="notification.id" 
                class="notification-item"
                :class="{ 'unread': !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-content">{{ notification.content }}</div>
                <div class="notification-time">{{ formatDate(notification.created_at) }}</div>
              </div>
            </div>
          </div>
          
          <div class="dropdown-footer">
            <router-link to="/notifications" @click="showNotifications = false">
              Voir toutes les notifications
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="user-dropdown">
        <button class="user-btn" @click="toggleUserMenu">
          <img :src="userAvatar" alt="Avatar" class="user-avatar" />
          <span class="user-name">{{ authStore.user.name }}</span>
          <i class="bi bi-chevron-down"></i>
        </button>
        
        <div class="dropdown-menu" v-if="showUserMenu">
          <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
            <i class="bi bi-person"></i> Profil
          </router-link>
          
          <div class="dropdown-divider"></div>
          
          <a href="#" class="dropdown-item" @click.prevent="logout">
            <i class="bi bi-box-arrow-right"></i> Déconnexion
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// États
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);

// Titre de la page actuelle
const currentPageTitle = computed(() => {
  const routeMap = {
    'dashboard': 'Tableau de bord',
    'members.index': 'Gestion des membres',
    'members.create': 'Ajouter un membre',
    'members.edit': 'Modifier un membre',
    'members.show': 'Détails du membre',
    'reservations.index': 'Gestion des réservations',
    'reservations.create': 'Ajouter une réservation',
    'reservations.edit': 'Modifier une réservation',
    'reservations.calendar': 'Calendrier des réservations',
    'services.index': 'Gestion des services',
    'services.create': 'Ajouter un service',
    'services.edit': 'Modifier un service',
    'equipments.index': 'Gestion des équipements',
    'equipments.create': 'Ajouter un équipement',
    'equipments.edit': 'Modifier un équipement',
    'payments.index': 'Gestion des paiements',
    'payments.create': 'Ajouter un paiement',
    'payments.edit': 'Modifier un paiement',
    'users.index': 'Gestion des utilisateurs',
    'users.create': 'Ajouter un utilisateur',
    'users.edit': 'Modifier un utilisateur',
    'profile': 'Mon profil',
  };
  
  return routeMap[route.name] || 'Dashboard';
});

// Avatar de l'utilisateur (avec fallback)
const userAvatar = computed(() => {
  if (authStore.user && authStore.user.avatar) {
    return `/storage/${authStore.user.avatar}`;
  }
  return '/default-avatar.png';
});

// Toggle sidebar sur mobile
const toggleSidebar = () => {
  document.querySelector('.sidebar').classList.toggle('active');
};

// Toggle notifications dropdown
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
  
  if (showNotifications.value) {
    loadNotifications();
  }
};

// Toggle user menu dropdown
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

// Charger les notifications
const loadNotifications = async () => {
  try {
    const response = await axios.get('/api/notifications', {
      params: { per_page: 5 }
    });
    
    if (response.data.success) {
      notifications.value = response.data.data.data;
      unreadCount.value = response.data.unread_count;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des notifications:', error);
  }
};

// Marquer une notification comme lue
const markAsRead = async (id) => {
  try {
    const response = await axios.put(`/api/notifications/${id}/read`);
    
    if (response.data.success) {
      // Mettre à jour localement
      const notification = notifications.value.find(n => n.id === id);
      if (notification && !notification.read) {
        notification.read = true;
        unreadCount.value--;
      }
    }
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
  }
};

// Marquer toutes les notifications comme lues
const markAllAsRead = async () => {
  try {
    const response = await axios.put('/api/notifications/read-all');
    
    if (response.data.success) {
      // Mettre à jour localement
      notifications.value.forEach(notification => {
        notification.read = true;
      });
      unreadCount.value = 0;
    }
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
  }
};

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return 'À l\'instant';
  } else if (diffMin < 60) {
    return `Il y a ${diffMin} min`;
  } else if (diffHour < 24) {
    return `Il y a ${diffHour} h`;
  } else if (diffDay < 7) {
    return `Il y a ${diffDay} j`;
  } else {
    return date.toLocaleDateString('fr-FR');
  }
};

// Déconnexion
const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

// Charger les notifications au montage
onMounted(() => {
  loadNotifications();
  
  // Fermer les dropdowns au clic à l'extérieur
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-dropdown') && !e.target.closest('.user-dropdown')) {
      showNotifications.value = false;
      showUserMenu.value = false;
    }
  });
});
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
}

.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  font-size: 24px;
  margin-right: 15px;
  cursor: pointer;
}

.page-title {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.notification-dropdown,
.user-dropdown {
  position: relative;
  margin-left: 15px;
}

.notification-btn,
.user-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.notification-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #dc3545;
  color: #fff;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
}

.user-name {
  margin-right: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 200px;
  z-index: 1000;
}

.notification-dropdown .dropdown-menu {
  width: 300px;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.dropdown-header h6 {
  margin: 0;
  font-weight: 600;
}

.mark-all-read {
  background: transparent;
  border: none;
  color: #007bff;
  font-size: 12px;
  cursor: pointer;
}

.dropdown-body {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  padding: 15px;
  text-align: center;
  color: #6c757d;
}

.notification-item {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 5px;
}

.notification-content {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 5px;
}

.notification-time {
  font-size: 11px;
  color: #adb5bd;
}

.dropdown-footer {
  padding: 10px 15px;
  text-align: center;
  border-top: 1px solid #eee;
}

.dropdown-footer a {
  color: #007bff;
  text-decoration: none;
  font-size: 13px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  color: #212529;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item i {
  margin-right: 8px;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }
  
  .user-name {
    display: none;
  }
}
</style>