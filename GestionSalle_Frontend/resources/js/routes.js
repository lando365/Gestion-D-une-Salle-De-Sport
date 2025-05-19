import Login from './views/auth/Login.vue';
import Dashboard from './views/dashboard/Dashboard.vue';
import MembersList from './views/members/MembersList.vue';
import MemberForm from './views/members/MemberForm.vue';
import MemberView from './views/members/MemberView.vue';
import ReservationsList from './views/reservations/ReservationsList.vue';
import ReservationForm from './views/reservations/ReservationForm.vue';
import ReservationCalendar from './views/reservations/ReservationCalendar.vue';
import ServicesList from './views/services/ServicesList.vue';
import ServiceForm from './views/services/ServiceForm.vue';
import EquipmentsList from './views/equipments/EquipmentsList.vue';
import EquipmentForm from './views/equipments/EquipmentForm.vue';
import PaymentsList from './views/payments/PaymentsList.vue';
import PaymentForm from './views/payments/PaymentForm.vue';
import UsersList from './views/users/UsersList.vue';
import UserForm from './views/users/UserForm.vue';
import Profile from './views/auth/Profile.vue';

const routes = [
    // Routes publiques
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    
    // Routes protégées
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    
    // Membres
    {
        path: '/members',
        name: 'members.index',
        component: MembersList,
        meta: { requiresAuth: true }
    },
    {
        path: '/members/create',
        name: 'members.create',
        component: MemberForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/members/:id',
        name: 'members.show',
        component: MemberView,
        meta: { requiresAuth: true }
    },
    {
        path: '/members/:id/edit',
        name: 'members.edit',
        component: MemberForm,
        meta: { requiresAuth: true }
    },
    
    // Réservations
    {
        path: '/reservations',
        name: 'reservations.index',
        component: ReservationsList,
        meta: { requiresAuth: true }
    },
    {
        path: '/reservations/create',
        name: 'reservations.create',
        component: ReservationForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/reservations/:id/edit',
        name: 'reservations.edit',
        component: ReservationForm,
        meta: { requiresAuth: true }
    },
    {
        path: '/calendar',
        name: 'reservations.calendar',
        component: ReservationCalendar,
        meta: { requiresAuth: true }
    },
    
    // Services
    {
        path: '/services',
        name: 'services.index',
        component: ServicesList,
        meta: { requiresAuth: true }
    },
    {
        path: '/services/create',
        name: 'services.create',
        component: ServiceForm,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    {
        path: '/services/:id/edit',
        name: 'services.edit',
        component: ServiceForm,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    
    // Équipements
    {
        path: '/equipments',
        name: 'equipments.index',
        component: EquipmentsList,
        meta: { requiresAuth: true }
    },
    {
        path: '/equipments/create',
        name: 'equipments.create',
        component: EquipmentForm,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    {
        path: '/equipments/:id/edit',
        name: 'equipments.edit',
        component: EquipmentForm,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    
    // Paiements
    {
        path: '/payments',
        name: 'payments.index',
        component: PaymentsList,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    {
        path: '/payments/create',
        name: 'payments.create',
        component: PaymentForm,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    {
        path: '/payments/:id/edit',
        name: 'payments.edit',
        component: PaymentForm,
        meta: { requiresAuth: true, roles: ['admin', 'manager'] }
    },
    
    // Utilisateurs (admin uniquement)
    {
        path: '/users',
        name: 'users.index',
        component: UsersList,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/users/create',
        name: 'users.create',
        component: UserForm,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/users/:id/edit',
        name: 'users.edit',
        component: UserForm,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    
    // Profil
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
];

export default routes;